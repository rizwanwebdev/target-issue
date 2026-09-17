import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
// --------------------------------------------------
// Types
// --------------------------------------------------

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastProps {
  id: string;
  type?: ToastType;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void;
}

// --------------------------------------------------
// Toast Styles
// --------------------------------------------------

const toastStyles: Record<
  ToastType,
  { bg: string; border: string; icon: ReactNode }
> = {
  success: {
    bg: "bg-emerald-50 text-emerald-800",
    border: "border-emerald-300",
    icon: (
      <svg
        className="size-5 text-emerald-600 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },

  error: {
    bg: "bg-red-50 text-red-800",
    border: "border-red-300",
    icon: (
      <svg
        className="size-5 text-red-600 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },

  warning: {
    bg: "bg-amber-50 text-amber-800",
    border: "border-amber-300",
    icon: (
      <svg
        className="size-5 text-amber-600 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
  },

  info: {
    bg: "bg-blue-50 text-blue-800",
    border: "border-blue-300",
    icon: (
      <svg
        className="size-5 text-blue-600 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
};

// --------------------------------------------------
// Toast Component
// --------------------------------------------------

export const Toast = ({
  id,
  type = "info",
  message,
  duration = 5000,
  onClose,
}: ToastProps) => {
  const [isLeaving, setIsLeaving] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleDismiss = () => {
    if (isLeaving) return;

    setIsLeaving(true);

    setTimeout(() => {
      onClose(id);
    }, 350);
  };

  useEffect(() => {
    const enterTimer = requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => cancelAnimationFrame(enterTimer);
  }, []);

  useEffect(() => {
    if (duration <= 0) return;

    const timer = setTimeout(() => {
      handleDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const style = toastStyles[type];

  return (
    <div
      role="alert"
      className={`
        flex items-center gap-3
        w-80 max-w-[calc(100vw-2rem)]
        p-4
        rounded-lg
        border
        shadow-lg

        ${style.bg}
        ${style.border}

        transform-gpu
        transition-all
        duration-350
        ease-[cubic-bezier(0.22,1,0.36,1)]

        ${
          isLeaving
            ? "opacity-0 translate-x-8 scale-95"
            : isVisible
              ? "opacity-100 translate-x-0 scale-100"
              : "opacity-0 translate-x-8 scale-95"
        }
      `}
    >
      {style.icon}

      <p className="text-sm font-medium flex-1 wrap-break-word">{message}</p>

      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Close notification"
        className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-black/5 transition-colors cursor-pointer focus:outline-none"
      >
        <svg
          className="size-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

// --------------------------------------------------
// Context
// --------------------------------------------------

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// --------------------------------------------------
// Provider
// --------------------------------------------------

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string, type: ToastType = "info") => {
    const id = crypto.randomUUID();

    setToasts((prev) => [
      ...prev,
      {
        id,
        message,
        type,
      },
    ]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      <div className="fixed top-4 right-4 z-50 flex flex-col-reverse gap-3 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="
              pointer-events-auto
              transition-all
              duration-350
              ease-[cubic-bezier(0.22,1,0.36,1)]
            "
          >
            <Toast
              id={toast.id}
              type={toast.type}
              message={toast.message}
              onClose={removeToast}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// --------------------------------------------------
// Hook
// --------------------------------------------------

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
};
