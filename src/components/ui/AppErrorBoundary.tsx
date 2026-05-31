import React, { type PropsWithChildren, type ReactNode } from "react";

type AppErrorBoundaryProps = PropsWithChildren<{
  fallback?: ReactNode;
}>;

type AppErrorBoundaryState = {
  error: Error | null;
};

export class AppErrorBoundary extends React.Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = {
    error: null,
  };

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return {
      error,
    };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("App render error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({
      error: null,
    });
  };

  override render() {
    if (this.state.error) {
      return (
        this.props.fallback ?? (
          <div className="app-system-screen">
            <div className="app-system-card">
              <span className="app-page-badge">Unexpected application error</span>
              <h1 className="app-page-title">Something went wrong while rendering the app.</h1>
              <p className="app-page-copy">
                We logged the error in the console for now. Try again to recover the
                interface without reloading the whole browser tab.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={this.handleReset}
                  className="app-button-primary"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
