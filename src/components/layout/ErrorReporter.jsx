'use client';
import { useEffect } from 'react';
import { reportClientError } from '@/lib/reportError';

// Reports uncaught errors and rejected promises from visitors' browsers (see src/lib/reportError.js).
export default function ErrorReporter() {
  useEffect(() => {
    const onError = (event) => reportClientError('error', event.error ?? event.message, { source: `${event.filename}:${event.lineno}:${event.colno}` });
    const onRejection = (event) => reportClientError('unhandledrejection', event.reason);
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, []);
  return null;
}
