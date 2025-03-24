import { v4 as uuidv4 } from 'uuid';





/**
 * Type for stored images
 */
export interface StoredImage {
  uuid: string;
  base64: string;
}

/**
 * Result interface for database operations
 */
export interface ImageOperationResult {
  success: boolean;
  error?: any;
}

/**
 * ImageStorage class for managing images in memory
 */
export class ImageStorage {
  private static instance: ImageStorage;
  private images: StoredImage[] = [];

  /**
   * Private constructor to enforce singleton pattern
   */
  private constructor() {}

  /**
   * Get the singleton instance
   * @returns The ImageStorage instance
   */
  public static getInstance(): ImageStorage {
    if (!ImageStorage.instance) {
      ImageStorage.instance = new ImageStorage();
    }
    return ImageStorage.instance;
  }

  /**
   * Store an image in memory
   * @param base64 Base64 encoded image data
   * @param uuid Optional UUID to use instead of generating a new one
   * @returns UUID of the stored image
   */
  public storeImage(base64: string, uuid?: string): string {
    const imageUuid = uuid || uuidv4();
    this.images.push({ uuid: imageUuid, base64 });
    return imageUuid;
  }

  /**
   * Get an image by its UUID
   * @param uuid UUID of the image to retrieve
   * @returns The image data or null if not found
   */
  public getImageByUUID(uuid: string): StoredImage | null {
    const image = this.images.find((img) => img.uuid === uuid);
    return image || null;
  }

  /**
   * Get all stored images
   * @returns Array of all stored images
   */
  public getAllImages(): StoredImage[] {
    return [...this.images];
  }

  /**
   * Get multiple images by their UUIDs
   * @param uuids Array of UUIDs to retrieve
   * @returns Array of found images
   */
  public getImagesByUUIDs(uuids: string[]): StoredImage[] {
    return this.images.filter((img) => uuids.includes(img.uuid));
  }

  /**
   * Remove images from storage
   * @param uuids UUIDs of images to remove
   */
  public clearImages(uuids: string[]): void {
    this.images = this.images.filter((img) => !uuids.includes(img.uuid));
  }

  /**
   * Clear all stored images
   */
  public clearAllImages(): void {
    this.images = [];
  }
}

/**
 * Save images to the image_ids table
 * @param supabase The Supabase client
 * @param teamId Team ID to associate the images with
 * @param uuids UUIDs of the images to save
 * @returns Promise resolving to the result of the operation
 */
export async function storeImagesInDatabase(
  supabase: any,
  teamId: string,
  uuids: string[],
): Promise<ImageOperationResult> {
  try {
    const storage = ImageStorage.getInstance();
    const imagesToStore = storage.getImagesByUUIDs(uuids);

    if (imagesToStore.length === 0) {
      return { success: true };
    }

    try {
      const failedImages: string[] = [];

      for (const image of imagesToStore) {
        try {
          await supabase.from('image_ids').insert({
            id: image.uuid,
            team: teamId,
            base64: image.base64,
          });
        } catch (e) {
          failedImages.push(image.uuid);
          console.error(
            `🔄 [storeImagesInDatabase] Error storing image ${image.uuid}:`,
            e,
          );
        }
      }

      const successfulIds = uuids.filter(
        (uuid) => !failedImages.includes(uuid),
      );
      if (successfulIds.length > 0) {
        storage.clearImages(successfulIds);
      }

      return { success: false, error: 'Failed to store any images' };
    } catch (error) {
      return { success: false, error };
    }
  } catch (e) {
    return { success: false, error: e };
  }
}

/**
 * Update images with a scouting response ID
 * @param supabase The Supabase client
 * @param uuids UUIDs of the images to update
 * @param responseId The scouting response ID to assign
 * @returns Promise resolving to the result of the operation
 */
export async function updateImagesWithResponseId(
  supabase: any,
  uuids: string[],
  responseId: number,
): Promise<ImageOperationResult> {
  try {
    if (uuids.length === 0) {
      return { success: true };
    }

    for (const uuid of uuids) {
      const { error } = await supabase
        .from('image_ids')
        .update({ scouting_response: responseId })
        .match({ id: uuid });

      if (error) {
        await supabase
          .from('image_ids')
          .update({ scouting_response: responseId })
          .eq('id', uuid);
      }
    }

    return { success: false, error: 'Failed to update any images' };
  } catch (error) {
    return { success: false, error };
  }
}

// Export the singleton instance
export const imageStorage = ImageStorage.getInstance();
