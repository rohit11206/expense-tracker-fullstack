import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/context/ToastContext";
import { ToastContainer } from "@/components/common/Toast";
import { AppRouter } from "@/routes/AppRouter";

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppRouter />
        <ToastContainer />
      </ToastProvider>
    </ThemeProvider>
  );
}
