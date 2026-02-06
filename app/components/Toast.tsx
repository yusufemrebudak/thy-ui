import { useEffect } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type, duration = 4000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    success: "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800",
    error: "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800",
    info: "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800",
    warning: "bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800",
  };

  const textColor = {
    success: "text-emerald-800 dark:text-emerald-200",
    error: "text-red-800 dark:text-red-200",
    info: "text-blue-800 dark:text-blue-200",
    warning: "text-amber-800 dark:text-amber-200",
  };

  const iconColor = {
    success: "text-emerald-600 dark:text-emerald-400",
    error: "text-red-600 dark:text-red-400",
    info: "text-blue-600 dark:text-blue-400",
    warning: "text-amber-600 dark:text-amber-400",
  };

  const icons = {
    success: "check_circle",
    error: "cancel",
    info: "info",
    warning: "warning",
  };

  return (
    <div
      className={`fixed top-6 right-6 max-w-sm rounded-xl border ${bgColor[type]} shadow-lg animate-in fade-in slide-in-from-top-2 duration-300 z-50`}
    >
      <div className="flex items-start gap-3 p-4">
        <span className={`material-symbols-outlined flex-shrink-0 ${iconColor[type]}`}>
          {icons[type]}
        </span>
        <div className="flex-1">
          <p className={`text-sm font-semibold ${textColor[type]}`}>{message}</p>
        </div>
        <button
          onClick={onClose}
          className={`flex-shrink-0 p-0.5 rounded hover:bg-white/50 dark:hover:bg-white/10 transition-colors ${textColor[type]}`}
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
    </div>
  );
}

