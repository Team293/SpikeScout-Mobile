declare module '../../utils/image-storage' {
  export interface StoredImage {
    uuid: string;
    base64: string;
  }

  export interface ImageOperationResult {
    success: boolean;
    error?: any;
    partialSuccess?: boolean;
  }

  export class ImageStorage {
    static getInstance(): ImageStorage;
    storeImage(base64: string, uuid?: string): string;
    getImageByUUID(uuid: string): StoredImage | null;
    getAllImages(): StoredImage[];
    getImagesByUUIDs(uuids: string[]): StoredImage[];
    clearImages(uuids: string[]): void;
    clearAllImages(): void;
    debugImages(): void;
  }

  export function handleLargeBase64Image(base64: string): Promise<string>;

  export function storeImagesInDatabase(
    supabase: any,
    teamId: string,
    uuids: string[]
  ): Promise<ImageOperationResult>;

  export function updateImagesWithResponseId(
    supabase: any,
    uuids: string[],
    responseId: number
  ): Promise<ImageOperationResult>;

  export const imageStorage: ImageStorage;
} 