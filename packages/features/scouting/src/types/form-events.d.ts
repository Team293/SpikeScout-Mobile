declare module '../../utils/form-events' {
  type EventCallback = () => void;

  class FormEventManager {
    static getInstance(): FormEventManager;
    subscribe(event: string, callback: EventCallback): () => void;
    emit(event: string): void;
  }

  export const formEvents: FormEventManager;
} 