const webPush = require("web-push");

const vapidKeys = {
  publicKey:
    "BEGWb5rmY7JtsXbfd2s1TJlU7WU5yE0qJtiWyvHq3R5wYlX-9LGOLSygZjvoeuxt6YYXg7M38Xu0O8m4U6FLwVw",
  privateKey: "F57kuVYIKcvKMiHk2vbKf6KWuK-TueBu0qXDS4wDgo0",
};

webPush.setVapidDetails(
  "mailto:aditumanggor@gmail.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const pushSubcription = {
  endpoint:
    "1hkrLoigN_wxobYWPtOuQq1e2HkBg548KcbquoqotlK2Klql9LXsW1IzFrOqq7yIRpntervwK0NO4mcBV7mXAYW517sbR0JiUhEzMDrmB",
  keys: {
    p256dh:
      "BIDGdq7np/JUwbthGtz2ivu0ok6r8R/Iqyq3/qcO78fsyTHU1gIHyZ9shZ1Bhwp1NeskPrXtVJJCXWYD1pru5NU=",
    auth: "yOnRR4MVxNhDWbK0Ec6g0A==",
  },
};

const payload = "you have to be a fool before you can be a master";

const options = {
  gcmAPIKey: "181294462959",
  TTL: 60,
};

webPush.sendNotification(pushSubcription, payload, options);
