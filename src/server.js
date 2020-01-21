import bodyParser from 'body-parser';
import express from 'express';
import admin from 'firebase-admin';

import peManager from './pe-manager';
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

(async () => {
  try {
    let oldEngagements = await peManager.getEngagements();
    
    setInterval(async () => {
      let latestEngagements = await peManager.getEngagements();
      let newEngagements = peManager.compareEngagements(
        oldEngagements,
        latestEngagements.slice(0, 4)
      );
      oldEngagements = latestEngagements;

      console.log(newEngagements);
    }, 10000);
    
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
