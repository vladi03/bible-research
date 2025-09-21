const { onRequest } = require('firebase-functions/v2/https');

exports.userNotices = onRequest((req, res) => {
  res.json({ notices: ['No new notices'] });
});