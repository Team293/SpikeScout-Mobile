import React from 'react';

import { UseFormReturn } from 'react-hook-form';
import { Text } from 'react-native';

import { FieldDefinition } from '../types';

/**
 * Type for a field renderer function
 */
export type FieldRenderer = (
  field: FieldDefinition,
  index: number,
  control: UseFormReturn<any>['control'],
  errors: Record<string, any>,
) => React.ReactNode;

/**
 * Type for a field mapper function
 */
export type FieldMapper<T = any> = (field: FieldDefinition, value: any) => T;

/**
 * Type for field validation function
 */
export type FieldValidator = (
  field: FieldDefinition,
  value: any,
) => {
  isValid: boolean;
  errorMessage?: string;
  errorType?: string;
} | null;

/**
 * Interface for field renderers registry
 */
export interface FieldRenderers {
  [key: string]: FieldRenderer;
}

/**
 * Creates a field renderer with the provided schema, rendering function, mapping function, and validation
 * @param fieldSchema The field schema definition
 * @param renderFn Function that renders the field based on form data and field schema
 * @param mapperFn Function that maps the field data based on schema and value
 * @param validatorFn Function that validates the field value and returns error information
 * @param cannotBeRequired Whether this field type can ignore 'required' validation (e.g., boolean fields)
 * @returns A field renderer function, a field mapper function, and a field validator function
 */
export function createFieldRenderer<T extends FieldDefinition, U = any>(
  fieldSchema: Partial<T>,
  renderFn: (params: {
    field: T;
    fieldName: string;
    index: number;
    displayName: React.ReactNode;
    control: UseFormReturn<any>['control'];
    errors: Record<string, any>;
  }) => React.ReactNode,
  mapperFn: (field: T, value: any) => U,
  validatorFn?: (
    field: T,
    value: any,
  ) => {
    isValid: boolean;
    errorMessage?: string;
    errorType?: string;
  } | null,
  cannotBeRequired: boolean = false,
): {
  renderer: FieldRenderer;
  mapper: FieldMapper<U>;
  validator: FieldValidator;
  cannotBeRequired: boolean;
} {
  const renderer: FieldRenderer = (field, index, control, errors) => {
    const fieldName = `field_${index}`;

    // Only show the required asterisk if the field is required AND can be required
    const displayName =
      field.required && !cannotBeRequired ? (
        <>
          {field.label} <Text style={{ color: 'red' }}>*</Text>
        </>
      ) : (
        field.label
      );

    const combinedField = { ...fieldSchema, ...field } as T;

    return renderFn({
      field: combinedField,
      fieldName,
      index,
      displayName,
      control,
      errors,
    });
  };

  const mapper: FieldMapper<U> = (field, value) => {
    const combinedField = { ...fieldSchema, ...field } as T;
    return mapperFn(combinedField, value);
  };

  const validator: FieldValidator = (field, value) => {
    if (!validatorFn) {
      return null;
    }

    const combinedField = { ...fieldSchema, ...field } as T;
    return validatorFn(combinedField, value);
  };

  return { renderer, mapper, validator, cannotBeRequired };
}

/**
 * Registry for all field renderers
 */
export const fieldRenderers: FieldRenderers = {};

/**
 * Registry for all field mappers
 */
export const fieldMappers: Record<string, FieldMapper> = {};

/**
 * Registry for all field validators
 */
export const fieldValidators: Record<string, FieldValidator> = {};

/**
 * Registry for fields that cannot be required
 */
export const cannotBeRequiredFields: Record<string, boolean> = {};

/**
 * Registers a field renderer, mapper, and validator for a specific field type
 * @param type The field type
 * @param renderer The renderer function
 * @param mapper The mapper function
 * @param validator The validator function
 * @param cannotBeRequired Whether this field type can ignore 'required' validation
 */
export function registerField(
  type: string,
  renderer: FieldRenderer,
  mapper: FieldMapper,
  validator?: FieldValidator,
  cannotBeRequired: boolean = false,
): void {
  fieldRenderers[type] = renderer;
  fieldMappers[type] = mapper;
  if (validator) {
    fieldValidators[type] = validator;
  }
  cannotBeRequiredFields[type] = cannotBeRequired;
}

/**
 * Renders a field using the registered renderer for its type
 * @param field The field definition
 * @param index Field index
 * @param control Form control from react-hook-form
 * @param errors Form errors
 * @returns Rendered field component
 */
export function renderField(
  field: FieldDefinition,
  index: number,
  control: UseFormReturn<any>['control'],
  errors: Record<string, any>,
): React.ReactNode {
  const renderer = fieldRenderers[field.type];

  if (!renderer) {
    console.warn(`No renderer found for field type: ${field.type}`);
    return null;
  }

  return renderer(field, index, control, errors);
}

/**
 * Maps all fields in a form to a structured object
 * @param fields Array of field schemas
 * @param values Object containing field values keyed by field name
 * @returns Structured data object
 */
export function mapFormData(
  fields: FieldDefinition[],
  values: Record<string, any>,
): Record<string, any> {
  const result: Record<string, any> = {};

  fields.forEach((field, index) => {
    // Skip header fields - they're just visual elements
    if (field.type === 'header') return;

    const fieldName = `field_${index}`;

    // Handle matrix fields specially
    if (field.type === 'matrix') {
      // For matrices, we pass the full values object to the mapper
      // because matrix fields' values are stored with field_index_rowId pattern
      const mappedValue = mapField(field, values);
      if (mappedValue !== undefined) {
        result[field.label] = mappedValue;
      }
      return;
    }

    // For regular fields, extract and map their value
    const fieldValue = values[fieldName];

    // Skip if field is not required and has no value
    if (fieldValue === undefined && !field.required) {
      return;
    }

    const mappedValue = mapField(field, fieldValue);
    // Only add the field to the result if it has a defined value
    if (mappedValue !== undefined) {
      result[field.label] = mappedValue;
    }
  });

  return result;
}

/**
 * Maps a single field value based on its type
 * @param field Field definition
 * @param value Field value
 * @returns Mapped value
 */
export function mapField<T = any>(field: FieldDefinition, value: any): T {
  const mapper = fieldMappers[field.type];
  if (!mapper) {
    console.warn(`No mapper found for field type ${field.type}`);
    return value as T;
  }

  try {
    return mapper(field, value) as T;
  } catch (err) {
    console.error(
      `Error mapping field ${field.label} of type ${field.type}:`,
      err,
    );
    return value as T;
  }
}

/**
 * Validates a field value using the registered validator for its type
 * @param field The field definition
 * @param value The field value
 * @returns Validation result or null if valid
 */
export function validateField(
  field: FieldDefinition,
  value: any,
): { isValid: boolean; errorMessage?: string; errorType?: string } | null {
  const validator = fieldValidators[field.type];

  if (!validator) {
    return null;
  }

  return validator(field, value);
}

/**
 * Validates all fields in a form
 * @param fields Array of field schemas
 * @param values Object containing field values keyed by field name
 * @returns Object with validation errors keyed by field name
 */
export function validateFormData(
  fields: FieldDefinition[],
  values: Record<string, any>,
): Record<string, { message: string; type: string }> {
  const errors: Record<string, { message: string; type: string }> = {};

  fields.forEach((field, index) => {
    const fieldName = `field_${index}`;
    const fieldValue = values[fieldName];

    const isRequirementCheckNeeded = !cannotBeRequiredFields[field.type];

    if (
      isRequirementCheckNeeded &&
      field.required &&
      (fieldValue === undefined || fieldValue === null || fieldValue === '')
    ) {
      errors[fieldName] = {
        message: `${field.label} is required`,
        type: 'required',
      };
      return;
    }

    if (fieldValue === undefined && !field.required) {
      return;
    }

    const validationResult = validateField(field, fieldValue);
    if (validationResult && !validationResult.isValid) {
      errors[fieldName] = {
        message:
          validationResult.errorMessage || `Invalid value for ${field.label}`,
        type: validationResult.errorType || 'validation',
      };
    }
  });

  return errors;
}
