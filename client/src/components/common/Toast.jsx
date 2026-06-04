import { useToast } from "@/context/ToastContext";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex items-start gap-3 rounded-xl border p-4 shadow-lg transition-all duration-300 animate-fade-in",
            toast.variant === "destructive"
              ? "bg-destructive text-destructive-foreground border-destructive/20"
              : "bg-card text-card-foreground border-border"
          )}
        >
          <div className="shrink-0 mt-0.5">
            {toast.variant === "destructive" ? (
              <AlertCircle className="h-4 w-4" />
            ) : toast.variant === "success" ? (
              <CheckCircle className="h-4 w-4 text-emerald-500" />
            ) : (
              <Info className="h-4 w-4 text-primary" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            {toast.title && (
              <p className="text-sm font-semibold">{toast.title}</p>
            )}
            {toast.description && (
              <p className="text-xs opacity-80 mt-0.5">{toast.description}</p>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
