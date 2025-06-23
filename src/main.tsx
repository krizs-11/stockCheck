import { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Buffer } from 'buffer';
import CommonLazyLoader from './components/commonLazyLoader.tsx'
// import { messaging } from './firebase-config.ts'
import ErrorBoundary from './components/errorboundary.tsx'
window.Buffer = Buffer


if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/firebase-messaging-sw.js') // Ensure this path is correct relative to your public folder
    .then((registration) => {
      console.log('Service Worker registered:', registration);
      // You can pass the registration object to your app here if needed,
      // but getToken often finds it automatically if registered correctly.
    })
    .catch((err) => console.error('Service Worker registration error:', err));
}

createRoot(document.getElementById('root')!).render(

  // <StrictMode>

  <Suspense fallback={
    <CommonLazyLoader />}>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </Suspense>

  // </StrictMode>,
)
