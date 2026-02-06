import type { ReactNode } from "react";

interface ModalProps {
  isOpen?: boolean; // Optional, usually controlled by parent rendering
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({ onClose, title, description, children, footer }: ModalProps) {
  return (
    <>
      {/* Modal Overlay */}
      <div
        aria-hidden="true"
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      ></div>
      {/* Modal Container */}
      <div
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        role="dialog"
      >
        <div className="w-full max-w-[560px] bg-white dark:bg-[#2d1b1e] rounded-xl shadow-2xl transform transition-all flex flex-col max-h-[90vh]">
          {/* Modal Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 dark:border-gray-700/50">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                {title}
              </h2>
              {description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {description}
                </p>
              )}
            </div>
            <button
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
              type="button"
              onClick={onClose}
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>
          {/* Modal Body (Scrollable if needed) */}
          <div className="p-8 overflow-y-auto custom-scrollbar">
            {children}
          </div>
          {/* Modal Footer */}
          {footer && (
            <div className="px-8 py-6 bg-gray-50 dark:bg-[#251618] rounded-b-xl border-t border-gray-100 dark:border-gray-700/50 flex flex-col sm:flex-row items-center justify-end gap-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
