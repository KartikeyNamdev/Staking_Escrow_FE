"use client";

export type ToastType = "success" | "error" | "info" | "loading";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  signature?: string;
  duration?: number;
}

interface ToastStore {
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, "id">) => void;
  removeToast: (id: string) => void;
}

// In-memory store if zustand isn't installed, or use simple state
// Since I don't see zustand in package.json, I'll use a custom event-based store or simple context.
// Actually, let's use a custom observable store.

type Listener = (toasts: ToastMessage[]) => void;
let toasts: ToastMessage[] = [];
const listeners = new Set<Listener>();

export const toastStore = {
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  add(toast: Omit<ToastMessage, "id">) {
    const id = Math.random().toString(36).substring(2, 9);
    toasts = [...toasts, { ...toast, id }];
    listeners.forEach((l) => l(toasts));
    
    if (toast.type !== "loading") {
      setTimeout(() => {
        this.remove(id);
      }, toast.duration || 5000);
    }
  },
  remove(id: string) {
    toasts = toasts.filter((t) => t.id !== id);
    listeners.forEach((l) => l(toasts));
  },
};

export const toast = {
  success: (title: string, description?: string, signature?: string) =>
    toastStore.add({ type: "success", title, description, signature }),
  error: (title: string, description?: string) =>
    toastStore.add({ type: "error", title, description }),
  info: (title: string, description?: string) =>
    toastStore.add({ type: "info", title, description }),
  loading: (title: string, description?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    toastStore.add({ id, type: "loading", title, description } as any);
    return id;
  },
  dismiss: (id: string) => toastStore.remove(id),
};
