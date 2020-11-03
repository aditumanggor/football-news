if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").then(
    () => {
      console.log("service worker is already installed");
    },
    (err) => {
      console.error(`service worker gagal: ${err}`);
    }
  );
  navigator.serviceWorker.ready.then(() => {
    console.log("service worker is ready to use");
  });
  requestPer();
} else {
  console.log("your browser doesn't support serviceworker");
}

function requestPer() {
  if ("Notification" in window) {
    Notification.requestPermission().then((result) => {
      if (result === "denied") {
        console.log("fitur notifikasi tidak diijinkan");
        return;
      } else if (result === "default") {
        console.error("pengguna menutuo kotak dialig permintaan ijin");
        return;
      }
      console.log("notifikasi di ijinkan");

      if ("PushManager" in window) {
        navigator.serviceWorker.getRegistration().then((regis) => {
          regis.pushManager
            .subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUnit8Array(
                "BEGWb5rmY7JtsXbfd2s1TJlU7WU5yE0qJtiWyvHq3R5wYlX-9LGOLSygZjvoeuxt6YYXg7M38Xu0O8m4U6FLwVw"
              ),
            })
            .then((subscribe) => {
              console.log(
                "berhasil melakukan subscribe dengan endpoint",
                subscribe.endpoint
              );
              console.log(
                "berhasil melakukan subscribe dengan p256dh key",
                btoa(
                  String.fromCharCode.apply(
                    null,
                    new Uint8Array(subscribe.getKey("p256dh"))
                  )
                )
              );
              console.log(
                "berhasil melakukan subscribe degnan auth key: ",
                btoa(
                  String.fromCharCode.apply(
                    null,
                    new Uint8Array(subscribe.getKey("auth"))
                  )
                )
              );
            })
            .catch((e) => {
              console.error("tidak dapat melakukan subscribe ", e.message);
            });
        });
      }
    });
  }
}

function urlBase64ToUnit8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
