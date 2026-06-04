import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <p className="font-display text-8xl font-bold text-primary/20">404</p>
      <h1 className="font-display text-2xl font-bold mt-4">Page Not Found</h1>
      <p className="text-muted-foreground mt-2 max-w-xs">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button asChild className="mt-6">
        <Link to="/">
          <Home className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>
    </div>
  );
}
