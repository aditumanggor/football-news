let matchData;
let teamData;

const loadTable = () => {
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
                    <td><img class="responsive-img" width="24" height="20" src="${result.team.crestUrl}"> ${result.team.name}</td>
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
            
            <div class="card">
            <div class="card-content s12 m6">
            <h5 class="header">Primier League </h5>
            <table class="stripped">
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
  });
};

// const loadTeams = () => {
//     const teams = getTeams()
//     teams.then(data => {
//         const str = JSON.stringify(data).replace(/http:/g, 'https:');
//         data = JSON.parse(str);

//         teamData = team
//         let htmlTeam = ''
//         htmlTeam +='<div class="row">'
//         data.teams.forEach(team => {
//              htmlTeam += `
//         <div class="col s12 m6">
//         <div class="card">
//         <div class="card-content">
//             <div class="center"><img width="64" height="64" src="${team.crestUrl}"></div>
//             <div class="center flow-text">${team.name}</div>
//             <div class="center">${team.area.name}</div>
//             <div class="center"><a href="${team.website}" target="_blank">${team.website}</a></div>
//         </div>
//         <div class="card-action right-align">
//             <a class="waves-effect waves-light btn-small pink-darken -3" onclick="insertTeamListener(${team.id})"><i class="material-icons left">star</i>Add to Favorite</a>
//         </div>
//         </div>
//         </div>
//         `;
//         })
//     })
//     htmlTeam+='</div>'
//     document.getElementById('header-title').innerHTML = "Teams";
//     document.getElementById('main-content').innerHTML = htmlTeam;
// }
const loadFixtures = () => {
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
                <div class='col s12'>
                    <div class="card">
                        <div class="card-content card-match">
                      <table>
                      <tbody class="center-align">
                        <tr>
                        <td>${match.homeTeam.name}</td>
                        <td>${match.score.fullTime.homeTeam}</td>
                        <td>vs</td>
                        <td>${match.score.fullTime.awayTeam}</td>
                        <td>${match.awayTeam.name}</td>
                        </tr>
                      </tbody>
                      </table>
                       <a class="waves-effect waves-light btn-small" onclick="insertFixtureListener(${match.id})"><i class="material-icons left">add</i></a>
                        </div>
                    </div>
                </div>
                `;
        });
      }
    }
    document.getElementById("header-title").innerHTML = "Matches";
    document.getElementById("main-content").innerHTML = fixtureHTML;
  });
};

const loadFavFixtures = () => {
  let favFixture = getFavFixtures();
  favFixture.then((data) => {
    let favfix = "";
    favfix += '<div class="row">';
    data.forEach((fixture) => {
      favfix += `
      <div class="col s12">
        <div class="card">
          <div class="card-content card-match">
            <div style="text-align: center"><h6>${dateToDMY(
              new Date(fixture.utcDate)
            )}</h6></div>
              <table>
                      <tbody class="center-align">
                        <tr>
                        <td>${fixture.homeTeam.name}</td>
                        <td>${fixture.score.fullTime.homeTeam}</td>
                        <td>vs</td>
                        <td>${fixture.score.fullTime.awayTeam}</td>
                        <td>${fixture.awayTeam.name}</td>
                        </tr>
                      </tbody>
                      </table>
          </div>
          <div class="card-action right-align">
              <a class="waves-effect waves-light btn-small red" onclick="deleteFixtureListener(${
                fixture.id
              })"><i class="material-icons left">delete</i>Delete</a>
          </div>
        </div>
      </div>

      `;
    });
    if (data.length === 0)
      favfix += '<h6 class="center-align">No favorite match founde!</h6>';
    favfix += "</div>";
    document.getElementById("header-title").innerHTML = "Favorite Match";
    document.getElementById("main-content").innerHTML = favfix;
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
