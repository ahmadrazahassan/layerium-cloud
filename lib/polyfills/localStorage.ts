/**
 * localStorage polyfill for server-side rendering
 * This prevents errors when Supabase SSR tries to access localStorage during SSR
 */

class LocalStoragePolyfill {
  private store: Map<string, string> = new Map();

  getItem(key: string): string | null {
    return this.store.get(key) || null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  key(index: number): string | null {
    const keys = Array.from(this.store.keys());
    return keys[index] || null;
  }

  get length(): number {
    return this.store.size;
  }
}

// Only polyfill on server-side
if (typeof window === 'undefined' && typeof global !== 'undefined') {
  (global as any).localStorage = new LocalStoragePolyfill();
  (global as any).sessionStorage = new LocalStoragePolyfill();
}
