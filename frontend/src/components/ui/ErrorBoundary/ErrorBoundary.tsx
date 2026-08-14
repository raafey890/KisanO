import React, { Component, ErrorInfo, ReactNode } from 'react';
import { GlobalErrorFallback } from './GlobalErrorFallback';
import { logger } from '../../../lib/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log catastrophic rendering errors to our centralized logger
    logger.fatal('Uncaught rendering error in ErrorBoundary', error, { 
      componentStack: errorInfo.componentStack 
    });
  }

  private resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return <GlobalErrorFallback error={this.state.error} resetErrorBoundary={this.resetErrorBoundary} />;
    }

    return this.props.children;
  }
}
