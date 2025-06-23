
importScripts('https://www.gstatic.com/firebasejs/11.9.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.9.1/firebase-messaging-compat.js');


firebase.initializeApp({
    apiKey: "AIzaSyDBYsVkw_DIWcs82BJ2CC1V6e9JSXoexNw",
    authDomain: "stockinventory-b18b2.firebaseapp.com",
    projectId: "stockinventory-b18b2",
    storageBucket: "stockinventory-b18b2.firebasestorage.app",
    messagingSenderId: "764831527985",
    appId: "1:764831527985:web:25d80ebd4642924fdb1110"
});


const messaging = firebase?.messaging();

// Handle background messages
messaging?.onBackgroundMessage((payload) => {
    // console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // // Customize notification here
    // const notificationTitle = payload.notification.title || 'Background Message Title';
    // const notificationOptions = {
    //     body: payload.notification.body || 'Background Message body.',
    //     icon: payload.notification.icon || '/logo.png', // Or any other icon
    //     data: payload.data // You can pass custom data
    // };

    // self.registration.showNotification(notificationTitle, notificationOptions);
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    // Access data from payload.data
    const notificationTitle = payload.data.title || 'Background Message Title';
    const notificationBody = payload.data.body || 'Background Message body.';
    // Use the icon from data, or fall back to your default '/logo.png'
    const notificationIcon = '/ni.png';

    const notificationOptions = {
        body: notificationBody,
        icon: notificationIcon,
        data: payload.data // Pass all data for handling on click
    };

    self.registration.showNotification(notificationTitle, notificationOptions);

});
