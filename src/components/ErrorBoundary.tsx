import { Component, type ReactNode } from "react";
import { Button } from "./ui/button";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<{
  children: ReactNode;
}> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error("Unhandled React error:", error);
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 py-16">
          <div className="max-w-xl rounded-3xl border border-border bg-card p-8 text-center shadow-elegant">
            <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
            <p className="mb-6 text-muted-foreground">
              We hit an unexpected problem while loading this page. Please try again or return to the homepage.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button variant="hero" onClick={this.reset}>
                Reload
              </Button>
              <Button asChild variant="outline">
                <a href="/">Home</a>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
