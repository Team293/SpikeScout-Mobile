import React, { useEffect } from 'react';

import { UseFormReturn } from 'react-hook-form';
import { View } from 'react-native';

import { Button, Text } from '@kit/ui';

import { FieldDefinition } from '../types';
import { renderField, validateFormData } from '../utils/field-render';
import { initializeFieldRenderers } from '../utils/field-renderers';

// This component displays when no form fields are found
function FormNotFound() {
  return (
    <View
      style={{ padding: 20, alignItems: 'center', justifyContent: 'center' }}
    >
      <Text className="mb-2 text-lg font-bold">Form Not Found</Text>
      <Text>No form fields were provided.</Text>
    </View>
  );
}

interface DynamicFormRendererProps {
  fields: FieldDefinition[];
  form: UseFormReturn<any>;
  handleCustomSubmit: (data: any) => void;
}

export function RenderForm({
  fields,
  form,
  handleCustomSubmit,
}: DynamicFormRendererProps) {
  const {
    control,
    formState: { errors },
    setError,
    clearErrors,
    reset,
  } = form;

  useEffect(() => {
    initializeFieldRenderers();
  }, []);

  const onSubmit = (data: any) => {
    clearErrors();

    const validationErrors = validateFormData(fields, data);

    if (Object.keys(validationErrors).length > 0) {
      Object.entries(validationErrors).forEach(([fieldName, error]) => {
        setError(fieldName as any, {
          type: error.type,
          message: error.message,
        });
      });
      return;
    }

    handleCustomSubmit(data);
    reset();
  };

  if (!fields || fields.length === 0) {
    return <FormNotFound />;
  }

  return (
    <View>
      {fields.map((field, index) => (
        <React.Fragment key={`${field.label}_${index}`}>
          {renderField(field, index, control, errors)}
        </React.Fragment>
      ))}
      <Button onPress={() => onSubmit(form.getValues())} className="mt-4">
        <Text>Submit</Text>
      </Button>
    </View>
  );
}
