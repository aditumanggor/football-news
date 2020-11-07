if (!("serviceWorker" in navigator)) {
  console.log("this is the worst tutorial");
} else {
  registerServiceWorker();
  requestPermission();
}

//  service worker
function registerServiceWorker() {
  return navigator.serviceWorker
    .register("sw.js")
    .then(function (reg) {
      console.log("you did it");
      return reg;
    })
    .catch(function (err) {
      console.error(`you failed looser, ${err}`);
    });
}
function requestPermission() {
  if ("Notification" in window) {
    Notification.requestPermission().then(function (result) {
      if (result === "denied") {
        console.log("you cant send notification midget");
        return;
      } else if (result === "default") {
        console.error("whatever");
        return;
      }

      if ("PushManager" in window) {
        navigator.serviceWorker.getRegistration().then(function (registration) {
          registration.pushManager
            .subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(
                "BGX1o6qFqgdEgdBiD1j2Qh4o75BNlgW0Pi3GzJSvwylfMPD90HrHmT8Q_jPkaRrj5LRewEJp-gE1EaQjM0YdQDs"
              ),
            })
            .then(function (subscribe) {
              console.log(
                "berhasil melakukan subscibe dengan endpoint",
                subscribe.endpoint
              );
              console.log(
                "berhasil melakukan subscibe dengan p256dh key:",
                btoa(
                  String.fromCharCode.apply(
                    null,
                    new Uint8Array(subscribe.getKey("p256dh"))
                  )
                )
              );
              console.log(
                "berhasil melakukan subcibe dengan auth key:",
                btoa(
                  String.fromCharCode.apply(
                    null,
                    new Uint8Array(subscribe.getKey("auth"))
                  )
                )
              );
            })
            .catch(function (e) {
              console.error("You suck boom roasted", e.message);
            });
        });
      }
    });
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4); // if it works it works
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
