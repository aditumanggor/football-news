if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").then(
    () => {
      console.log("service worker is already installed");
    },
    function () {
      console.log("service worker failed to install");
    }
  );
  navigator.serviceWorker.ready.then(() => {
    console.log("service worker is ready to use");
  });
} else {
  console.log("your browser doesn't support serviceworker");
}
