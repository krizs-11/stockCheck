// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported, onMessage } from 'firebase/messaging';



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDBYsVkw_DIWcs82BJ2CC1V6e9JSXoexNw",
    authDomain: "stockinventory-b18b2.firebaseapp.com",
    projectId: "stockinventory-b18b2",
    storageBucket: "stockinventory-b18b2.firebasestorage.app",
    messagingSenderId: "764831527985",
    appId: "1:764831527985:web:25d80ebd4642924fdb1110"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);

// const messaging = getMessaging(app);

// export { messaging };


// export const requestForToken = async () => {
//     try {
//         // Make sure the service worker is registered
//         const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

//         const currentToken = await getToken(messaging, {
//             vapidKey: import.meta.env.VAPID_KEY,
//             // vapidKey: 'BIwfiSyU5NdlKFlEI6UKjwV9y16DmyMUelrVP9TWe75l9zVM4z8WhTrTw5IJHawGq2orRzaydAIerpsHBwnIFUQ', // Replace with your actual VAPID key
//             serviceWorkerRegistration: registration // Pass the service worker registration
//         });

//         if (currentToken) {
//             console.log('FCM registration token:', currentToken);
//             // Send this token to your server to send notifications to this device
//             return currentToken;
//         } else {
//             console.log('No registration token available. Request permission to generate one.');
//             // Handle the case where the user hasn't granted permission
//             alert('Please enable notifications to receive push messages.');
//         }
//     } catch (err: any) {
//         console.error('An error occurred while retrieving token:', err);
//         // Handle error.
//         if (err.code === 'messaging/permission-blocked') {
//             alert('Notification permission blocked. Please enable it in your browser settings.');
//         }
//     }
// };

// // Handle foreground messages
// export const onMessageListener = () =>
//     new Promise((resolve) => {
//         onMessage(messaging, (payload) => {
//             console.log("messaging-->", payload);
//             resolve(payload);
//         });
//     });




// this below code for hosting


const app = initializeApp(firebaseConfig);

// Initialize Firebase Messaging only in supported environments
let messaging: any;

const initializeMessaging = async () => {
    try {
        const isSupportedBrowser = await isSupported();
        if (isSupportedBrowser) {
            messaging = getMessaging(app);
        }
    } catch (error) {
        console.error('Firebase Messaging initialization error:', error);
    }
};

// Call initialization
initializeMessaging();
export const requestForToken = async (): Promise<string | null> => {
    try {
        // Check current permission state without prompting
        const permission = Notification.permission;

        if (permission === 'denied') {
            console.warn('Notifications are permanently blocked');
            const newPermission = await Notification.requestPermission();
            if (newPermission !== 'granted') {
                console.log('User declined notification permission');
                return null;
            }

            return null;
        }

        // Only request permission if not already determined
        if (permission === 'default') {
            const newPermission = await Notification.requestPermission();
            if (newPermission !== 'granted') {
                console.log('User declined notification permission');
                return null;
            }
        }

        // Rest of your token generation code
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

        const currentToken = await getToken(messaging, {
            vapidKey: import.meta.env.VAPID_KEY,
            // vapidKey: 'BK0GIPg4DUW75nwX80b6tcvzPRJ5gr2w2RiR-H6Pfa6XCJeMbRCi7CGR05L65muIkrrmvuhv7IpoNVJIqVTIJ1U',
            serviceWorkerRegistration: registration
        });
        if (currentToken) {
            console.log('FCM registration token:', currentToken);
            // Send this token to your server to send notifications to this device
            return currentToken;
        } else {
            console.log('No registration token available. Request permission to generate one.');
            // Handle the case where the user hasn't granted permission
            alert('Please enable notifications to receive push messages.');
            return currentToken || null;
        }

    } catch (err) {
        console.error('Error while retrieving token:', err);
        return null;
    }
};

export const onMessageListener = () => {
    if (!messaging) {
        console.warn('Firebase Messaging not initialized - cannot listen for messages');
        return new Promise((resolve) => resolve(null));
    }

    return new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            console.log("Message received:", payload);
            resolve(payload);
        });
    });
};

export { messaging };

