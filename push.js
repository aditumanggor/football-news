var webPush = require("web-push");

const vapidKeys = {
  publicKey:
    "BGX1o6qFqgdEgdBiD1j2Qh4o75BNlgW0Pi3GzJSvwylfMPD90HrHmT8Q_jPkaRrj5LRewEJp-gE1EaQjM0YdQDs",
  privateKey: "HBJ-5aTpnT-W7Slcb86jwCzsP3ceHJRbjqL9yopPbfQ",
};

webPush.setVapidDetails(
  "mailto:aditumanggor13@gmail.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

var pushSubciption = {
  endpoint:
    "https://fcm.googleapis.com/fcm/send/eMg4kIvDYgA:APA91bF3JMGqVlfYZfmw_DA8LhL737V3ZaBVfz5-kVy6iQ0YVYHt7D96DCvdjjiSnEWtwRRNh6MIR62TbWJ0WihWF84STOFYW1B_OWMhFUCO8cJsP4QaL_KdnJcE1kTH94a8woSx4lmd",
  keys: {
    p256dh:
      "BByDONZegI8HLBaE8FXqkAn517pXlWmANI1ULjC+f9JIDjJBqPaTw29D7EPIPA2LMe7olC4n9fW/+9wrduuGgDc=",
    auth: "ytRNTroSEjH/rWWjzulDbQ==",
  },
};

var payload = "selamat! aplikasi anda sudah dapat menerima push notifikasi";

var options = {
  gcmAPIKey: "429145559996",
  TTL: 60,
};

webPush.sendNotification(pushSubciption, payload, options);
