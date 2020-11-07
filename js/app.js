let matchData;
let teamData;

const loadTable = () => {
  showLoader();
  let standings = getStandings();
  standings.then((data) => {
    const str = JSON.stringify(data).replace(/http:/g, "https:");
    data = JSON.parse(str);

    let html = "";
    data.standings.forEach((standing) => {
      let detail = "";
      standing.table.forEach((result) => {
        detail += `
                <tr>
                    <td>${result.position}</td>
                    <td><img class="responsive-img left-align" width="24" height="20" src="${result.team.crestUrl}"><span class="center-align"> ${result.team.name}</span></td>
                    <td>${result.playedGames}</td>
                    <td>${result.won}</td>
                    <td>${result.draw}</td>
                    <td>${result.lost}</td>
                    <td>${result.goalsFor}</td>
                    <td>${result.goalsAgainst}</td>
                    <td>${result.goalDifference}</td>
                    <td>${result.points}</td>
                </tr>
                `;
      });
      html +=
        `
            
            <div class="card premier-league">
            <div class="card-content s12 m12 l12">
            <h5 class="header">Premier League </h5>
            <table class="stripped responsive-table highlight">
            <thead>
                <tr>
                    <th>Position</th>
                    <th>Team</th>
                    <th>Played</th>
                    <th>Won</th>
                    <th>Draw</th>
                    <th>Lost</th>
                    <th>GF</th>
                    <th>GA</th>
                    <th>GD</th>
                    <th>Points</th>
                </tr>
            </thead>
            <tbody>` +
        detail +
        `</tbody>
            </table>
            </div>
            </div>
            
            `;
    });
    document.getElementById("header-title").innerHTML = "standings";
    document.getElementById("main-content").innerHTML = html;
    hidePreloader();
  });
};

const loadFixtures = () => {
  showLoader();
  const matches = getMatches();
  matches.then((data) => {
    matchData = data;
    const matchDays = groupBy(data.matches, "matchday");
    let fixtureHTML = "";
    for (const key in matchDays) {
      if (key !== "null") {
        fixtureHTML += `
            <h5>Matchweek ${key} of 38</h5>
            `;
        matchDays[key].forEach((match) => {
          fixtureHTML += `
                <div class='col s12 m6 l12'>
                    <div class="card center-align">
                        <div class="card-content card-match">
                      <table>
                      <tbody class="center-align">
                        <tr>
                        <td class="center-align">${match.homeTeam.name}</td>
                        <td class="center-align">${match.score.fullTime.homeTeam}</td>
                        <td>vs</td>
                        <td class="center-align">${match.score.fullTime.awayTeam}</td>
                        <td class="center-align">${match.awayTeam.name}</td>
                        </tr>
                      </tbody>
                      </table>
                       <a class="waves-effect btn-floating halfway-fab indigo" onclick="insertFixtureListener(${match.id})"><i class="material-icons left">add</i></a>
                        </div>
                    </div>
                </div>
                `;
        });
      }
    }
    document.getElementById("header-title").innerHTML = "Matches";
    document.getElementById("main-content").innerHTML = fixtureHTML;
    hidePreloader();
  });
};

const loadFavFixtures = () => {
  let favFixture = getFavFixtures();
  showLoader();
  favFixture.then((data) => {
    let favfix = "";
    favfix += '<div class="row">';
    data.forEach((fixture) => {
      favfix += `
      <div class="col s12 l12 m6">
        <div class="card">
          <div class="card-content card-match">
            <div class="center-align"><h6>${dateToDMY(
              new Date(fixture.utcDate)
            )}</h6></div>
              <table>
                      <tbody class="center-align">
                        <tr>
                        <td class="center-align">${fixture.homeTeam.name}</td>
                        <td class="center-align">${
                          fixture.score.fullTime.homeTeam
                        }</td>
                        <td class="center-align">vs</td>
                        <td class="center-align">${
                          fixture.score.fullTime.awayTeam
                        }</td>
                        <td class="center-align">${fixture.awayTeam.name}</td>
                        </tr>
                      </tbody>
                      </table>
          </div>
          <div class="card-action right-align">
              <a class="waves-effect waves-light btn-floating halfway-fab red" onclick="deleteFixtureListener(${
                fixture.id
              })"><i class="material-icons left">delete</i></a>
          </div>
        </div>
      </div>

      `;
    });
    if (data.length === 0)
      favfix += '<h6 class="center-align">No favorite match founded!</h6>';
    favfix += "</div>";
    document.getElementById("header-title").innerHTML = "Favorite Match";
    document.getElementById("main-content").innerHTML = favfix;
    hidePreloader();
  });
};

// if it works it works
const groupBy = (xs, key) => {
  return xs.reduce((rv, x) => {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

const dateToDMY = (date) => {
  return `${date.getDate()} - ${date.getMonth() + 1} - ${date.getFullYear()}`;
};

// database indexDB
const dbx = idb.open("epl", 1, (upgradeDB) => {
  switch (upgradeDB.oldVersion) {
    case 0:
      upgradeDB.createObjectStore("fixtures", { keyPath: "id" });
      upgradeDB.createObjectStore("teams", { keyPayth: "id" });
  }
});

const insertFixture = (fixture) => {
  dbx
    .then((db) => {
      const trans = db.transaction("fixtures", "readwrite");
      const store = trans.objectStore("fixtures");
      fixture.creatAt = new Date().getTime();
      store.put(fixture);
      return trans.complete;
    })
    .then(() => {
      M.toast({
        html: `match between ${fixture.homeTeam.name} v ${fixture.awayTeam.name}\n is added to your favorite`,
      });
    })
    .catch((err) => {
      console.error(`error: ${err}`);
    });
};

const deleteFixture = (fixtureID) => {
  dbx
    .then((db) => {
      const trans = db.transaction("fixtures", "readwrite");
      const store = trans.objectStore("fixtures");
      store.delete(fixtureID);
      return trans.complete;
    })
    .then(() => {
      M.toast({ html: "Fixture removed from your favorite" });
      loadFavFixtures();
    })
    .catch((err) => {
      console.error(`error : ${err}`);
    });
};
const getFavFixtures = () => {
  return dbx.then((db) => {
    const tx = db.transaction("fixtures", "readonly");
    const store = tx.objectStore("fixtures");
    return store.getAll();
  });
};

const insertFixtureListener = (fixtureID) => {
  const fixture = matchData.matches.filter(
    (element) => element.id === fixtureID
  )[0];
  insertFixture(fixture);
};

const deleteFixtureListener = (fixtureID) => {
  const con = confirm("Are you sure to remove this fixture from favorite");
  if (con === true) {
    deleteFixture(fixtureID);
  }
};

const showLoader = () => {
  const loader = `<div class="progress valign-wrapper">
                      <div class="indeterminate"></div>
                  </div>
  `;
  document.getElementById("loader").innerHTML = loader;
};

const hidePreloader = () => {
  document.getElementById("loader").innerHTML = "";
};
