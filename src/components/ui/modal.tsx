"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
}

const Modal = ({ isOpen, onClose, children, title, className }: ModalProps) => {
  const [isClosing, setIsClosing] = React.useState(false);

  const handleClose = React.useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 150); // Match the animation duration
  }, [onClose]);

  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleClose]);

  if (!isOpen && !isClosing) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-45 flex items-center justify-center",
        isClosing
          ? "animate-out fade-out duration-200"
          : "animate-in fade-in duration-200"
      )}
    >
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-black/30 backdrop-blur-sm",
          isClosing
            ? "animate-out fade-out duration-200"
            : "animate-in fade-in duration-200"
        )}
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div
        className={cn(
          "relative z-10 w-full max-w-2xl max-h-[70vh] overflow-y-auto bg-white rounded-lg shadow-xl",
          isClosing
            ? "animate-out fade-out zoom-out-95 duration-200"
            : "animate-in fade-in zoom-in-95 duration-200",
          className
        )}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200">
            <h2 className="text-lg md:text-xl font-semibold">{title}</h2>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Content */}
        <div className={cn("p-6", title)}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
