/**
 * A simple event system for form-related events
 */

type EventCallback = () => void;

class FormEventManager {
  private static instance: FormEventManager;
  private listeners: Record<string, EventCallback[]> = {};

  /**
   * Private constructor to enforce singleton
   */
  private constructor() {
    this.listeners = {
      'form:submitted': [],
      'form:reset': [],
    };
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): FormEventManager {
    if (!FormEventManager.instance) {
      FormEventManager.instance = new FormEventManager();
    }
    return FormEventManager.instance;
  }

  /**
   * Subscribe to an event
   * @param event The event to subscribe to
   * @param callback The callback to execute
   */
  public subscribe(event: string, callback: EventCallback): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    this.listeners[event].push(callback);

    return () => {
      this.listeners[event] = this.listeners[event].filter(
        (cb) => cb !== callback,
      );
    };
  }

  /**
   * Emit an event
   * @param event The event to emit
   */
  public emit(event: string): void {
    const listeners = this.listeners[event] || [];

    listeners.forEach((callback) => {
      try {
        callback();
      } catch (error) {
        console.error(`🔔 EVENT: Error in "${event}" callback:`, error);
      }
    });
  }
}

export const formEvents = FormEventManager.getInstance();
