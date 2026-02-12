/**
 * Next.js Instrumentation Hook
 * This file is loaded before any other code in both Node.js and Edge runtime
 * Perfect place for polyfills that need to be available everywhere
 */

export async function register() {
  // Polyfill localStorage for server-side rendering
  if (typeof window === 'undefined') {
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

    // Inject into global scope
    (global as any).localStorage = new LocalStoragePolyfill();
    (global as any).sessionStorage = new LocalStoragePolyfill();
    
    console.log('[Instrumentation] localStorage polyfill injected for SSR');
  }
}
