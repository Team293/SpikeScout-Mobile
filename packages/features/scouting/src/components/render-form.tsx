import React from 'react';

import { Controller, UseFormReturn } from 'react-hook-form';
import { View } from 'react-native';

import {
  Button,
  Card,
  CardDescription,
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

interface FieldDefinition {
  type: 'text' | 'number' | 'date' | 'select' | 'boolean';
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  min?: number;
  max?: number;
}

interface DynamicFormRendererProps {
  fields: FieldDefinition[];
  form: UseFormReturn<any, any, any>;
  handleCustomSubmit: (data: any) => void;
}

export function RenderForm({
  fields,
  form,
  handleCustomSubmit,
}: DynamicFormRendererProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    reset,
  } = form;

  const onSubmit = (data: any) => {
    let isValid = true;

    fields.forEach((field, index) => {
      const fieldName = `field_${index}`;
      if (field.required && !data[fieldName]) {
        setError(fieldName, {
          type: 'required',
          message: `${field.label} is required`,
        });

        isValid = false;
      } else if (
        field.type === 'number' &&
        (data[fieldName]! instanceof Number ||
          isNaN(data[fieldName]) ||
          (field.required &&
            ((field.min !== undefined && data[fieldName] < field.min) ||
              (field.max !== undefined && data[fieldName] > field.max))))
      ) {
        setError(fieldName, {
          type: 'range',
          message: `${field.label} must be between ${field.min} and ${field.max}`,
        });

        isValid = false;
      } else {
        clearErrors(fieldName);
      }
    });

    if (isValid) {
      handleCustomSubmit(data);
      reset();
    }
  };

  if (!fields) {
    return <FormNotFound />;
  }

  return (
    <View style={{ paddingHorizontal: 20 }}>
      {fields.map((field, index) => {
        const fieldName = `field_${index}`;
        const displayName = field.required ? (
          <>
            {field.label} <Text style={{ color: 'red' }}>*</Text>
          </>
        ) : (
          field.label
        );

        switch (field.type) {
          case 'boolean':
            return (
              <Controller
                key={index}
                control={control}
                name={fieldName}
                render={({ field: formField }) => (
                  <View
                    style={{
                      marginTop: 20,
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

          case 'select':
            return (
              <Controller
                key={index}
                control={control}
                name={fieldName}
                render={({ field: formField }) => (
                  <View
                    style={{
                      marginTop: 20,
                    }}
                  >
                    <Text style={{ marginBottom: 8 }}>{displayName}</Text>
                    <Select
                      onValueChange={(option) =>
                        formField.onChange(option?.value)
                      }
                      value={{ value: formField.value, label: formField.value }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((option, optionIndex) => (
                          <SelectItem
                            key={optionIndex}
                            label={option}
                            value={option}
                          />
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

          case 'text':
            return (
              <Controller
                key={index}
                control={control}
                name={fieldName}
                render={({ field }) => (
                  <View style={{ marginTop: 20 }}>
                    <Text style={{ marginBottom: 8 }}>{displayName}</Text>
                    <Input
                      inputMode="text"
                      onBlur={field.onBlur}
                      onChangeText={field.onChange}
                      value={field.value}
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

          case 'number':
            return (
              <Controller
                key={index}
                control={control}
                name={fieldName}
                render={({ field }) => (
                  <View style={{ marginTop: 20 }}>
                    <Text style={{ marginBottom: 8 }}>{displayName}</Text>
                    <Input
                      inputMode="numeric"
                      onBlur={field.onBlur}
                      onChangeText={field.onChange}
                      value={field.value}
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

          default:
            return null;
        }
      })}
      <Button onPress={handleSubmit(onSubmit)} className={'mt-4'}>
        <Text>Submit</Text>
      </Button>
    </View>
  );
}

function FormNotFound() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Form not found</CardTitle>
        <CardDescription>
          The form with the requested id is not found. Please report this error
          asap!
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
