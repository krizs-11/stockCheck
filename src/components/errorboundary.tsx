// src/components/ErrorBoundary.tsx
import Lottie from 'lottie-react';
import React, { ReactNode } from 'react';
import errorLottie from '../../errorlottie.json'

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // You can log the error to an error reporting service
        console.error('Error caught in ErrorBoundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className='bg-gray-300 flex flex-col justify-center items-center h-screen font-bold  text-2xl'>
                    <Lottie animationData={errorLottie} loop />
                    {/* <pre>{this.state.error?.message}</pre> */}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
