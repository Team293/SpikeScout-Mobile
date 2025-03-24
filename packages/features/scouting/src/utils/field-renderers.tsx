import React from 'react';

import { Controller } from 'react-hook-form';
import { Image, Modal, TouchableOpacity, View } from 'react-native';

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
import { imageStorage } from './image-storage';
import { formEvents } from './form-events';

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

/* Image Field */
const {
  renderer: imageFieldRenderer,
  mapper: imageFieldMapper,
  validator: imageFieldValidator,
} = createFieldRenderer<FieldDefinition>(
  { type: 'image' },
  ({ field, fieldName, displayName, control, errors }) => {
    return (
      <Controller
        control={control}
        name={fieldName}
        render={({ field: formField }) => {
          const [images, setImages] = React.useState<string[]>(
            formField.value || [],
          );
          const [tempImageIds, setTempImageIds] = React.useState<string[]>([]);
          const [activeImageIndex, setActiveImageIndex] = React.useState<
            number | null
          >(null);
          const [isImageViewerVisible, setIsImageViewerVisible] =
            React.useState(false);

          React.useEffect(() => {
            console.log(`🔄 IMAGE FIELD: Setting up form event listener for ${fieldName}`);
            
            const resetImageState = () => {
              console.log(`🔄 IMAGE FIELD: Clearing images for ${fieldName}`);
              setImages([]);
              setTempImageIds([]);
              setActiveImageIndex(null);
              setIsImageViewerVisible(false);
              formField.onChange([]);
            };
            
            const unsubscribe = formEvents.subscribe('form:submitted', resetImageState);
            
            return () => {
              unsubscribe();
            };
          }, [fieldName, formField]);

          const generateUUID = () => {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
              /[xy]/g,
              (c) => {
                const r = (Math.random() * 16) | 0,
                  v = c === 'x' ? r : (r & 0x3) | 0x8;
                return v.toString(16);
              },
            );
          };

          const pickImage = async () => {
            try {
              const { launchImageLibraryAsync, MediaTypeOptions } =
                await import('expo-image-picker');

              let result = await launchImageLibraryAsync({
                mediaTypes: MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.5, // Lower quality (0.5) to reduce file size
                base64: true,
              });

              if (
                !result.canceled &&
                result.assets &&
                result.assets[0] &&
                result.assets[0].base64
              ) {
                const newUUID = generateUUID();
                const base64Data = result.assets[0].base64;

                setImages([...images, base64Data]);

                imageStorage.storeImage(base64Data, newUUID);

                const newTempIds = [...tempImageIds, newUUID];
                setTempImageIds(newTempIds);

                formField.onChange(newTempIds);
              }
            } catch (error) {
              console.error('Error picking image:', error);
            }
          };

          const takePhoto = async () => {
            try {
              const {
                launchCameraAsync,
                MediaTypeOptions,
                requestCameraPermissionsAsync,
              } = await import('expo-image-picker');

              const { status } = await requestCameraPermissionsAsync();
              if (status !== 'granted') {
                alert('Sorry, we need camera permissions to make this work!');
                return;
              }

              let result = await launchCameraAsync({
                mediaTypes: MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.5, // Lower quality (0.5) to reduce file size
                base64: true,
              });

              if (
                !result.canceled &&
                result.assets &&
                result.assets[0] &&
                result.assets[0].base64
              ) {
                const newUUID = generateUUID();
                const base64Data = result.assets[0].base64;

                setImages([...images, base64Data]);

                imageStorage.storeImage(base64Data, newUUID);

                const newTempIds = [...tempImageIds, newUUID];
                setTempImageIds(newTempIds);

                formField.onChange(newTempIds);
              }
            } catch (error) {
              console.error('Error taking photo:', error);
            }
          };

          const removeImage = (index: number) => {
            const newImages = [...images];
            newImages.splice(index, 1);
            setImages(newImages);

            const newTempIds = [...tempImageIds];
            newTempIds.splice(index, 1);
            setTempImageIds(newTempIds);

            formField.onChange(newTempIds);
          };

          const openImageViewer = (index: number) => {
            setActiveImageIndex(index);
            setIsImageViewerVisible(true);
          };

          const closeImageViewer = () => {
            setIsImageViewerVisible(false);
            setActiveImageIndex(null);
          };

          const viewPreviousImage = () => {
            if (activeImageIndex !== null && activeImageIndex > 0) {
              setActiveImageIndex(activeImageIndex - 1);
            }
          };

          const viewNextImage = () => {
            if (
              activeImageIndex !== null &&
              activeImageIndex < images.length - 1
            ) {
              setActiveImageIndex(activeImageIndex + 1);
            }
          };

          return (
            <View style={{ marginBottom: 20 }}>
              <Text style={{ marginBottom: 8 }}>{displayName}</Text>

              {/* Image previews */}
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginBottom: 10,
                }}
              >
                {images.map((base64, index) => (
                  <View key={index} style={{ margin: 5, position: 'relative' }}>
                    <View
                      style={{
                        width: 100,
                        height: 100,
                        borderRadius: 8,
                        overflow: 'hidden',
                      }}
                    >
                      <Button
                        variant="ghost"
                        onPress={() => openImageViewer(index)}
                        style={{ padding: 0, margin: 0 }}
                      >
                        <Image
                          source={{ uri: `data:image/jpeg;base64,${base64}` }}
                          style={{ width: 100, height: 100 }}
                        />
                      </Button>
                    </View>
                    <Button
                      variant="destructive"
                      onPress={() => removeImage(index)}
                      style={{
                        position: 'absolute',
                        top: -10,
                        right: -10,
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        padding: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ fontSize: 16, color: 'white' }}>×</Text>
                    </Button>
                  </View>
                ))}
              </View>

              {/* Image action buttons */}
              <View style={{ flexDirection: 'row', gap: 10 }}>
                {/* Upload from gallery button */}
                <Button
                  onPress={pickImage}
                  style={{
                    backgroundColor: '#4f46e5',
                    padding: 10,
                    borderRadius: 4,
                    flex: 1,
                  }}
                >
                  <Text style={{ color: 'white' }}>Upload Image</Text>
                </Button>

                {/* Take photo button */}
                <Button
                  onPress={takePhoto}
                  style={{
                    backgroundColor: '#10b981',
                    padding: 10,
                    borderRadius: 4,
                    flex: 1,
                  }}
                >
                  <Text style={{ color: 'white' }}>Take Photo</Text>
                </Button>
              </View>

              {/* Image count */}
              <Text style={{ marginTop: 5, fontSize: 12, color: '#666' }}>
                Images: {images.length}
                {field.maxImages ? ` / ${field.maxImages}` : ''}
              </Text>

              {errors[fieldName] &&
                typeof errors[fieldName].message === 'string' && (
                  <Text style={{ color: 'red', marginTop: 5 }}>
                    {errors[fieldName].message}
                  </Text>
                )}

              {/* Image viewer modal */}
              {isImageViewerVisible && activeImageIndex !== null && (
                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={isImageViewerVisible}
                  onRequestClose={closeImageViewer}
                >
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: 'rgba(0,0,0,0.9)',
                    }}
                  >
                    <View
                      style={{
                        width: '80%',
                        height: '80%',
                        position: 'relative',
                      }}
                    >
                      <Image
                        source={{
                          uri: `data:image/jpeg;base64,${images[activeImageIndex]}`,
                        }}
                        style={{
                          width: '100%',
                          height: '100%',
                          resizeMode: 'contain',
                        }}
                      />

                      {/* Close button */}
                      <TouchableOpacity
                        style={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          width: 40,
                          height: 40,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        onPress={closeImageViewer}
                      >
                        <Text style={{ fontSize: 20, color: 'white' }}>×</Text>
                      </TouchableOpacity>

                      {/* Navigation buttons */}
                      <View
                        style={{
                          position: 'absolute',
                          bottom: 20,
                          left: 0,
                          right: 0,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          paddingHorizontal: 20,
                        }}
                      >
                        {/* Previous button */}
                        <TouchableOpacity
                          style={{
                            opacity: activeImageIndex === 0 ? 0.5 : 1,
                            backgroundColor: 'rgba(255,255,255,0.3)',
                            borderRadius: 20,
                            width: 50,
                            height: 50,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          onPress={viewPreviousImage}
                          disabled={activeImageIndex === 0}
                        >
                          <Text style={{ color: 'white', fontSize: 20 }}>
                            ←
                          </Text>
                        </TouchableOpacity>

                        {/* Image counter */}
                        <Text
                          style={{
                            color: 'white',
                            fontSize: 16,
                            alignSelf: 'center',
                          }}
                        >
                          {activeImageIndex + 1} / {images.length}
                        </Text>

                        {/* Next button */}
                        <TouchableOpacity
                          style={{
                            opacity:
                              activeImageIndex === images.length - 1 ? 0.5 : 1,
                            backgroundColor: 'rgba(255,255,255,0.3)',
                            borderRadius: 20,
                            width: 50,
                            height: 50,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          onPress={viewNextImage}
                          disabled={activeImageIndex === images.length - 1}
                        >
                          <Text style={{ color: 'white', fontSize: 20 }}>
                            →
                          </Text>
                        </TouchableOpacity>

                        {/* Delete button */}
                        <TouchableOpacity
                          style={{
                            backgroundColor: '#ef4444',
                            borderRadius: 20,
                            width: 50,
                            height: 50,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          onPress={() => {
                            removeImage(activeImageIndex);
                            closeImageViewer();
                          }}
                        >
                          <Text style={{ color: 'white', fontSize: 20 }}>
                            🗑️
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Modal>
              )}
            </View>
          );
        }}
      />
    );
  },
  (field, value) => {
    return Array.isArray(value) ? value : [];
  },
  (field, value) => {
    if (
      field.required &&
      (!value || (Array.isArray(value) && value.length === 0))
    ) {
      return {
        isValid: false,
        errorMessage: `${field.label} is required`,
        errorType: 'required',
      };
    }

    if (
      field.maxImages &&
      Array.isArray(value) &&
      value.length > field.maxImages
    ) {
      return {
        isValid: false,
        errorMessage: `Maximum ${field.maxImages} images allowed`,
        errorType: 'maxImages',
      };
    }

    return null;
  },
  false,
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
  registerField(
    'image',
    imageFieldRenderer,
    imageFieldMapper,
    imageFieldValidator,
    false,
  );
}
