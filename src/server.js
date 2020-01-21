import express from 'express';
import bodyParser from 'body-parser';
import admin from 'firebase-admin';

import serviceAccount from './serviceAccount.json';

const app = express();
const port = process.env.PORT || 3000;
const topic = 'partner-engagements';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

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
