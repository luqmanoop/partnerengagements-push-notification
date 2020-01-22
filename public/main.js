let firebaseConfig = {
  apiKey: 'AIzaSyAAv2gk0s_PhEdnxAk2GD00iGPEtDZwvv0',
  authDomain: 'partner-engagements.firebaseapp.com',
  databaseURL: 'https://partner-engagements.firebaseio.com',
  projectId: 'partner-engagements',
  storageBucket: 'partner-engagements.appspot.com',
  messagingSenderId: '603090375654',
  appId: '1:603090375654:web:bcba122f386708adb0bc27',
  measurementId: 'G-NHQ0BXQXJ2'
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

const messaging = firebase.messaging();
const engagementsUrl = 'https://boards.greenhouse.io/partnerengagementstaffing';

function updateUIForPermission(granted) {
  if (granted) {
    let html =
      "You are on a roll!  Push notifications for new partner engagements will be sent to you. <br><strong>P.S. You don't have to visit this page to receive notifications 🙂</strong>";
    document.body.innerHTML = html;
  } else {
    document.body.textContent = "Ok! I won't send you push notifications";
  }
}

function showNotificationGranted() {
  let key = 'granted';
  if (!localStorage.getItem(key)) {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(() => {
        navigator.serviceWorker.ready.then(reg => {
          reg.showNotification('Partner Engagements Staffing', {
            icon: '/andela-logo.png',
            body: 'Notifications are enabled!'
          });
        });

        localStorage.setItem(key, true);
      });
    }
  }
}

function sendTokenToServer(token) {
  fetch('/api/token/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ token })
  });
}

messaging
  .requestPermission()
  .then(() => {
    updateUIForPermission(true);
    showNotificationGranted();
    return messaging.getToken();
  })
  .then(currentToken => {
    if (currentToken) {
      sendTokenToServer(currentToken);
    } else {
      // TODO: Show permission request
      console.log('Show permission request');
    }
  })
  .catch(e => {
    updateUIForPermission(false);
    console.log('error', e);
  });

messaging.onTokenRefresh(() => {
  messaging
    .getToken()
    .then(refreshedToken => {
      sendTokenToServer(refreshedToken);
    })
    .catch(err => {
      console.log('Unable to retrieve refreshed token ', err);
    });
});

// called when there's incoming notification and app is in the foreground
messaging.onMessage(payload => {
  const {
    data: { message }
  } = payload;

  document.body.innerHTML = `${message} <a href='${engagementsUrl}'>${engagementsUrl}</a>`;
});
