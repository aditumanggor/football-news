const API_KEY = "55005c2be6e34899a442ebb748027f93";
const LEAGUE_ID = 2021;
const api_url = "https://api.football-data.org/v2/";
const table = `${api_url}competitions/${LEAGUE_ID}/standings?standingType=TOTAL`;
const matches = `${api_url}competitions/${LEAGUE_ID}/matches`;
const teams = `${api_url}competitions/${LEAGUE_ID}/teams`;

const fetchAPI = (url) => {
  return fetch(url, {
    headers: {
      "X-Auth-Token": API_KEY,
    },
  });
};

const status = (response) => {
  if (response.status !== 200) {
    console.log(`Error: ${response.status}`);

    return Promise.reject(new Error(response.statusText));
  } else {
    return Promise.resolve(response);
  }
};

const json = (response) => {
  return response.json();
};

const error = (err) => {
  console.log(`Error ${err}`);
};

const getStandings = () => {
  return fetchAPI(table).then(status).then(json);
};

const getMatches = () => {
  return fetchAPI(matches).then(status).then(json);
};

const getTeams = () => {
  return fetchAPI(teams).then(status).then(json);
};
