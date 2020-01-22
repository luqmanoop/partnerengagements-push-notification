import bodyParser from 'body-parser';
import express from 'express';
import admin from 'firebase-admin';

import peManager from './pe-manager';
import serviceAccount from './serviceAccount.json';

const app = express();
const port = process.env.PORT || 3000;
const topic = 'test-topic';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

function sendPushNotificationsToClients(newEngagements) {
  let newEngagementsCount = newEngagements.length || 0;

  if (!newEngagementsCount) return;

  let message = {
    data: {
      message: `${newEngagementsCount} new engagement${
        newEngagementsCount > 1 ? 's' : ''
      }`
    },
    topic
  };

  admin
    .messaging()
    .send(message)
    .then(() => console.log('sent to devices'))
    .catch(err => console.log('failed', err));
}

(() => {
  try {
    peManager.monitor(sendPushNotificationsToClients);
  } catch (error) {
    console.log('error', error);
  }
})();

/**
 * Gets client (browser) token after they grant notification permission
 * and subscribes them to a topic for future engagements
 */
app.post('/api/token/subscribe', (req, res) => {
  const { token } = req.body;

  if (token) {
    admin
      .messaging()
      .subscribeToTopic(token, topic)
      .then(() => {
        res.send({ subscribed: true, topic });
      })
      .catch(() => res.status(500).send({ subscribed: false, topic }));
  }
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
