import React from 'react';

import { Controller, UseFormReturn } from 'react-hook-form';
import { View } from 'react-native';

import {
  Button,
  Card,
  CardContent,
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
  type: 'text' | 'number' | 'date' | 'select' | 'boolean' | 'matrix';
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  min?: number;
  max?: number;
  matrixRows?: MatrixRow[];
}

interface MatrixRow {
  id: string;
  label: string;
  value: number;
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

  const onSubmit = (data: any) => {
    let isValid = true;

    fields.forEach((field, index) => {
      const fieldName = `field_${index}`;
      if (field.type !== 'boolean' && field.type !== 'matrix') {
        if (field.required && !data[fieldName]) {
          setError(fieldName, {
            type: 'required',
            message: `${field.label} is required`,
          });
          isValid = false;
        } else if (field.type === 'number') {
          const value = data[fieldName];
          if (value !== undefined && value !== '' && value !== null) {
            const num = Number(value);
            if (isNaN(num)) {
              setError(fieldName, {
                type: 'type',
                message: `${field.label} must be a valid number`,
              });
              isValid = false;
            } else if (
              (field.min !== undefined && num < field.min) ||
              (field.max !== undefined && num > field.max)
            ) {
              setError(fieldName, {
                type: 'range',
                message: `${field.label} must be between ${field.min} and ${field.max}`,
              });
              isValid = false;
            } else {
              clearErrors(fieldName);
            }
          }
        }
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
    <View>
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

          case 'select':
            return (
              <Controller
                key={index}
                control={control}
                name={fieldName}
                render={({ field: formField }) => (
                  <View style={{ marginBottom: 20 }}>
                    <Text style={{ marginBottom: 8 }}>{displayName}</Text>
                    <Select
                      onValueChange={(option) =>
                        formField.onChange(option?.value)
                      }
                      value={{ value: formField.value, label: formField.value }}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Select an option"
                          className={'text-foreground'}
                        />
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
                  <View style={{ marginBottom: 20 }}>
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
                  <View style={{ marginBottom: 20 }}>
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

          case 'matrix':
            return (
              <Card key={index} style={{ marginBottom: 20 }}>
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
                                formField.onChange(
                                  Number(formField.value || 0) + 1,
                                )
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

          default:
            return null;
        }
      })}
      <Button onPress={() => onSubmit(form.getValues())} className="mt-4">
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
