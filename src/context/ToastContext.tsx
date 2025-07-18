import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import { X, CheckCircle, AlertCircle } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, options?: { type?: ToastType }) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const removeToast = useCallback(
    (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id)),
    []
  );
  const showToast = useCallback(
    (message: string, options?: { type?: ToastType }) => {
      const type = options?.type ?? "info";
      const id = crypto.randomUUID();

      const toast: Toast = { id, message, type };

      setToasts((prev) => [...prev, toast]);

      // Auto-remove after duration
      setTimeout(() => {
        removeToast(id);
      }, 3000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, removeToast, toasts }}>
      {children}
    </ToastContext.Provider>
  );
}

interface ToastProps extends Toast {
  onClose: () => void;
}

function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast ${type}`} role="alert" aria-live="polite">
      <div className="toast-content">
        {type === "success" ? (
          <CheckCircle className="toast-icon" aria-hidden="true" />
        ) : (
          <AlertCircle className="toast-icon" aria-hidden="true" />
        )}
        <p className="toast-message">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="toast-close"
        aria-label="Close notification"
      >
        <X size={18} />
      </button>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
