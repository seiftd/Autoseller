import React from 'react';

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error?: any;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { hasError: false };

    constructor(props: ErrorBoundaryProps) {
        super(props);
    }

    static getDerivedStateFromError(error: any) {
        return { hasError: true, error };
    }

    componentDidCatch(error: any, errorInfo: any) {
        console.error("Critical Runtime Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-center">
                    <div className="max-w-md space-y-6">
                        <h1 className="text-4xl font-bold text-white tracking-tight">System Restart Required</h1>
                        <p className="text-slate-400 leading-relaxed">
                            We've encountered a critical initialization error. This usually happens due to a browser security setting or a network timeout.
                        </p>
                        {import.meta.env.MODE === 'development' && (
                            <div className="p-4 bg-red-900/20 border border-red-500/20 rounded-lg text-red-400 text-xs text-left overflow-auto max-h-40">
                                {this.state.error?.toString()}
                            </div>
                        )}
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20"
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
