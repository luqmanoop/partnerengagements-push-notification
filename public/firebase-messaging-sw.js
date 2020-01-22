importScripts('https://www.gstatic.com/firebasejs/7.7.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.7.0/firebase-messaging.js');

firebase.initializeApp({
  apiKey: 'AIzaSyAAv2gk0s_PhEdnxAk2GD00iGPEtDZwvv0',
  authDomain: 'partner-engagements.firebaseapp.com',
  databaseURL: 'https://partner-engagements.firebaseio.com',
  projectId: 'partner-engagements',
  storageBucket: 'partner-engagements.appspot.com',
  messagingSenderId: '603090375654',
  appId: '1:603090375654:web:bcba122f386708adb0bc27',
  measurementId: 'G-NHQ0BXQXJ2'
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  const notificationTitle = 'Partner Engagements Staffing';
  const notificationOptions = {
    body: payload.data.message,
    icon: '/andela-logo.png',
    requireInteraction: true
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  clients.openWindow('https://boards.greenhouse.io/partnerengagementstaffing');
});
