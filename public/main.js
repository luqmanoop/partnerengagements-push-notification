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

function updateUIForPermission(granted) {
  if (granted) {
    let html =
      "You are on a roll!  Push notifications for new partner engagements will be sent to you. <br><strong>You don't have to visit this page to receive notifications 🙂</strong>";
    document.querySelector('body').innerHTML = html;
  } else {
    document.querySelector('body').textContent =
      "Ok! I won't send you push notifications";
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
