/**
 * Small typed observable store. Replaces the pattern used by
 * Assets/Scripts/Static/UserDataCache.cs and Assets/Scripts/Static/ClubDataEvent.cs
 * (static classes holding the last-received DTO plus a static C# event that UI
 * controllers subscribed to directly - effectively a global mutable singleton).
 *
 * This keeps the same memory-only lifetime (nothing here is more persistent
 * than the Unity version was - there's no product requirement to persist
 * coins/gems/club data locally), but is an injectable instance rather than a
 * static class, so screens can be tested against a fake store instead of a
 * live socket.
 */
export class Store<T> {
    private _value: T | null = null;
    private listeners = new Set<(value: T) => void>();

    get value(): T | null {
        return this._value;
    }

    set(value: T): void {
        this._value = value;
        for (const listener of this.listeners) {
            listener(value);
        }
    }

    subscribe(listener: (value: T) => void): () => void {
        this.listeners.add(listener);
        if (this._value !== null) {
            listener(this._value);
        }
        return () => this.listeners.delete(listener);
    }
}
