import React from 'react';

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    errorMessage?: string;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { hasError: false };

    static getDerivedStateFromError(error: any): ErrorBoundaryState {
        return {
            hasError: true,
            errorMessage: error?.message || 'Unknown error',
        };
    }

    componentDidCatch(error: any, errorInfo: any) {
        // This surfaces in production logs on Netlify
        console.error("[ErrorBoundary] Caught runtime error:", error);
        console.error("[ErrorBoundary] Component stack:", errorInfo?.componentStack);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh',
                    backgroundColor: '#020617',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '24px',
                    textAlign: 'center',
                    fontFamily: 'Inter, sans-serif',
                }}>
                    <div style={{ maxWidth: '480px' }}>
                        <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: 700, marginBottom: '12px' }}>
                            Something went wrong
                        </h1>
                        <p style={{ color: '#94a3b8', lineHeight: 1.6, marginBottom: '8px' }}>
                            The application encountered an unexpected error.
                        </p>
                        {/* Show a short hint in all environments to aid debugging */}
                        <p style={{
                            color: '#ef4444',
                            fontSize: '0.75rem',
                            backgroundColor: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.2)',
                            borderRadius: '8px',
                            padding: '10px 14px',
                            marginBottom: '24px',
                            wordBreak: 'break-word',
                        }}>
                            {this.state.errorMessage}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                background: '#2563eb',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '14px 28px',
                                fontWeight: 700,
                                fontSize: '1rem',
                                cursor: 'pointer',
                                width: '100%',
                            }}
                        >
                            Reload Application
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
