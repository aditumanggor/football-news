document.addEventListener("DOMContentLoaded", function () {
  let elements = document.querySelectorAll(".sidenav");
  M.Sidenav.init(elements);
  loadNav();

  function loadNav() {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status !== 200) return;
        document.querySelectorAll(".topnav, .sidenav").forEach(function (elm) {
          elm.innerHTML = xhr.responseText;
        });
        document
          .querySelectorAll(".sidenav a, .topnav a")
          .forEach(function (element) {
            element.addEventListener("click", function (event) {
              let sidenav = document.querySelector(".sidenav");
              M.Sidenav.getInstance(sidenav).close();

              page = event.target.getAttribute("href").substr(1);
              loadPage(page);
            });
          });
      }
    };
    xhr.open("GET", "nav.html", true);
    xhr.send();
  }
});

// load page content
let page = window.location.hash.substr(1);
if (page === "") page = "home";
loadPage();

function loadPage(page) {
  if (page === "home") loadTable();
  if (page === "fixtures") loadFixtures();
  if (page === "favmatch") loadFavFixtures();
}
