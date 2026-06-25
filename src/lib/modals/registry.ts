import type { ComponentType } from "react";

/**
 * Modal registry service that maps modal type strings to React components
 */
class ModalRegistry {
  private registry = new Map<string, ComponentType<any>>();

  /**
   * Register a modal component for a specific type
   */
  register<T extends Record<string, any>>(
    type: string,
    component: ComponentType<T>,
  ): void {
    if (this.registry.has(type)) {
      return;
    }
    this.registry.set(type, component);
  }

  /**
   * Get the component for a modal type
   */
  getComponent(type: string): ComponentType<any> | undefined {
    return this.registry.get(type);
  }

  /**
   * Check if a modal type is registered
   */
  has(type: string): boolean {
    return this.registry.has(type);
  }

  /**
   * Clear all registrations (useful for testing)
   */
  clear(): void {
    this.registry.clear();
  }

  /**
   * Get all registered modal types
   */
  getRegisteredTypes(): string[] {
    return Array.from(this.registry.keys());
  }
}

// Singleton instance
export const modalRegistry = new ModalRegistry();
