import React from 'react';

import { Controller } from 'react-hook-form';
import { View } from 'react-native';

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Text,
} from '@kit/ui';

import { FieldDefinition, MatrixRow } from '../types';
import { createFieldRenderer, registerField } from './field-render';

/* Text Field */
const {
  renderer: textFieldRenderer,
  mapper: textFieldMapper,
  validator: textFieldValidator,
} = createFieldRenderer<FieldDefinition>(
  { type: 'text' },
  ({ field, fieldName, displayName, control, errors }) => {
    return (
      <Controller
        control={control}
        name={fieldName}
        render={({ field: formField }) => (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ marginBottom: 8 }}>{displayName}</Text>
            <Input
              inputMode="text"
              onBlur={formField.onBlur}
              onChangeText={formField.onChange}
              value={formField.value}
              placeholder={field.placeholder}
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 4,
                padding: 10,
              }}
            />
            {errors[fieldName] &&
              typeof errors[fieldName].message === 'string' && (
                <Text style={{ color: 'red' }}>
                  {errors[fieldName].message}
                </Text>
              )}
          </View>
        )}
      />
    );
  },
  (value) => {
    return value;
  },
  () => {
    return null;
  },
  false,
);

/* Number Field */
const {
  renderer: numberFieldRenderer,
  mapper: numberFieldMapper,
  validator: numberFieldValidator,
} = createFieldRenderer<FieldDefinition>(
  { type: 'number' },
  ({ field, fieldName, displayName, control, errors }) => {
    return (
      <Controller
        control={control}
        name={fieldName}
        render={({ field: formField }) => (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ marginBottom: 8 }}>{displayName}</Text>
            <Input
              inputMode="numeric"
              onBlur={formField.onBlur}
              onChangeText={formField.onChange}
              value={formField.value}
              placeholder={field.placeholder}
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 4,
                padding: 10,
              }}
            />
            {errors[fieldName] &&
              typeof errors[fieldName].message === 'string' && (
                <Text style={{ color: 'red' }}>
                  {errors[fieldName].message}
                </Text>
              )}
          </View>
        )}
      />
    );
  },
  (value) => {
    return isNaN(Number(value)) ? 0 : Number(value);
  },
  (field, value) => {
    const num = Number(value);
    if (isNaN(num)) {
      return {
        isValid: false,
        errorMessage: `${field.label} must be a valid number`,
        errorType: 'type',
      };
    }

    if (field.min !== undefined && num < field.min) {
      return {
        isValid: false,
        errorMessage: `${field.label} must be at least ${field.min}`,
        errorType: 'min',
      };
    }

    if (field.max !== undefined && num > field.max) {
      return {
        isValid: false,
        errorMessage: `${field.label} must be at most ${field.max}`,
        errorType: 'max',
      };
    }

    return null;
  },
  false,
);

/* Boolean Field */
const {
  renderer: booleanFieldRenderer,
  mapper: booleanFieldMapper,
  validator: booleanFieldValidator,
  cannotBeRequired: booleanCannotBeRequired,
} = createFieldRenderer<FieldDefinition>(
  { type: 'boolean' },
  ({ fieldName, displayName, control }) => {
    return (
      <Controller
        control={control}
        name={fieldName}
        render={({ field: formField }) => (
          <View
            style={{
              marginBottom: 20,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text style={{ marginRight: 8 }}>{displayName}</Text>
            <Checkbox
              checked={formField.value}
              onCheckedChange={formField.onChange}
            />
          </View>
        )}
      />
    );
  },
  (value) => {
    return Boolean(value);
  },
  () => {
    return null;
  },
  true,
);

/* Select Field */
const {
  renderer: selectFieldRenderer,
  mapper: selectFieldMapper,
  validator: selectFieldValidator,
} = createFieldRenderer<FieldDefinition>(
  { type: 'select' },
  ({ field, fieldName, displayName, control, errors }) => {
    return (
      <Controller
        control={control}
        name={fieldName}
        render={({ field: formField }) => (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ marginBottom: 8 }}>{displayName}</Text>
            <Select
              onValueChange={(option) => formField.onChange(option?.value)}
              value={{ value: formField.value, label: formField.value }}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={field.placeholder || 'Select an option'}
                  className={'text-foreground'}
                />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option, optionIndex) => (
                  <SelectItem key={optionIndex} label={option} value={option} />
                ))}
              </SelectContent>
            </Select>
            {errors[fieldName] &&
              typeof errors[fieldName].message === 'string' && (
                <Text style={{ color: 'red' }}>
                  {errors[fieldName].message}
                </Text>
              )}
          </View>
        )}
      />
    );
  },
  (field, value) => {
    return value;
  },
  () => {
    return null;
  },
  false,
);

/* Matrix Field */
const {
  renderer: matrixFieldRenderer,
  mapper: matrixFieldMapper,
  validator: matrixFieldValidator,
  cannotBeRequired: matrixCannotBeRequired,
} = createFieldRenderer<FieldDefinition>(
  { type: 'matrix' },
  ({ field, fieldName, displayName, control }) => {
    return (
      <Card style={{ marginBottom: 20 }}>
        <CardHeader>
          <CardTitle>{displayName}</CardTitle>
        </CardHeader>
        <CardContent>
          {field.matrixRows?.map((row) => {
            const subFieldName = `${fieldName}_${row.id}`;
            return (
              <Controller
                key={subFieldName}
                control={control}
                name={subFieldName}
                defaultValue={row.value}
                render={({ field: formField }) => (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginVertical: 5,
                    }}
                  >
                    <Text style={{ width: 120 }}>{row.label}</Text>
                    <Button
                      onPress={() =>
                        formField.onChange(
                          Math.max(Number(formField.value || 0) - 1, 0),
                        )
                      }
                    >
                      <Text>-</Text>
                    </Button>
                    <Text style={{ marginHorizontal: 10 }}>
                      {formField.value}
                    </Text>
                    <Button
                      onPress={() =>
                        formField.onChange(Number(formField.value || 0) + 1)
                      }
                    >
                      <Text>+</Text>
                    </Button>
                  </View>
                )}
              />
            );
          })}
        </CardContent>
      </Card>
    );
  },
  (field, values) => {
    if (!field.matrixRows) return [];

    const mappedRows = field.matrixRows.map((row: MatrixRow) => {
      const rowId = row.id;
      const fieldKey = Object.keys(values).find(
        (key) => key.includes('_') && key.endsWith(`_${rowId}`),
      );
      const rowValue =
        fieldKey && values[fieldKey] !== undefined
          ? values[fieldKey]
          : row.value;

      return {
        id: rowId,
        label: row.label,
        value: Number(rowValue),
      };
    });

    return mappedRows;
  },
  () => {
    return null;
  },
  true,
);

/* Header Field */
const {
  renderer: headerFieldRenderer,
  mapper: headerFieldMapper,
  validator: headerFieldValidator,
} = createFieldRenderer<FieldDefinition>(
  { type: 'header' },
  ({ field }) => {
    return (
      <View className={'mb-3'}>
        <Text className={'text-2xl font-bold'}>{field.label}</Text>
      </View>
    );
  },
  () => undefined,
  () => null,
  true,
);

export function initializeFieldRenderers() {
  registerField(
    'text',
    textFieldRenderer,
    textFieldMapper,
    textFieldValidator,
    false,
  );
  registerField(
    'number',
    numberFieldRenderer,
    numberFieldMapper,
    numberFieldValidator,
    false,
  );
  registerField(
    'boolean',
    booleanFieldRenderer,
    booleanFieldMapper,
    booleanFieldValidator,
    booleanCannotBeRequired,
  );
  registerField(
    'select',
    selectFieldRenderer,
    selectFieldMapper,
    selectFieldValidator,
    false,
  );
  registerField(
    'matrix',
    matrixFieldRenderer,
    matrixFieldMapper,
    matrixFieldValidator,
    matrixCannotBeRequired,
  );
  registerField(
    'header',
    headerFieldRenderer,
    headerFieldMapper,
    headerFieldValidator,
    true,
  );
}
