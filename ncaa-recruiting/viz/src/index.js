import ReactDOM from "react-dom";
import d3 from "d3";
import queue from "queue-async";
import topojson from "topojson";

import App from "./components/App";

queue()
  .defer(d3.json, "./data/us.json")
  .defer(d3.json, "./data/conferences.json")
  .await((error, usmap, conferences) => {
    if ( error !== null ) {
      console.error(error);
      return;
    }

    let width = 400;
    let height = 300;
    let margin = 0;
    let scale = 550;
    let map = {
      features: topojson.feature(usmap, usmap.objects.states).features, 
      projection: d3.geo.albersUsa()
        .scale(scale)
        .translate([width/2, height/2]),
      height: height,
      width: width,
      margin: margin,
      scale: scale
    };

    conferences.forEach((conference, index) => {
      conference.teams = setupTeams(conference.teams, map.projection);
    });

    ReactDOM.render(
      <App
        map={map}
        conferences={conferences} />,
      document.getElementById("content")
    );
  })

function setupTeams(teams, projection) {
  teams.forEach((team) => {
    // convert coordinates to points in the projection
    team.roster.forEach((city) => {
      city.point = projection([city.longitude, city.latitude])
    });
    team.schoolPoint = projection([team.longitude, team.latitude]);

    // find a point the mean/median distance away in the projection, invert it
    // to get coordinates, then use haversine to determine the real world distance
    let milesPerDegreeLatitude = 68.6863716;
    // this is a far southern/central point whose projection should never return null
    // knock on wood
    let lowPoint = [-97.584980, 26.281485];
    let projectedLow = projection(lowPoint);

    let pMean = projection([lowPoint[0], lowPoint[1] + (team.mean / milesPerDegreeLatitude)]);
    team.meanRadius = Math.abs(pMean[1] - projectedLow[1]);

    let pMedian = projection([lowPoint[0], lowPoint[1] + (team.median / milesPerDegreeLatitude)]);
    team.medianRadius = Math.abs(pMedian[1] - projectedLow[1]);
  });
  // default ordering alphabetical
  teams.sort(function(a, b) {
    if ( a.name < b.name ) {
      return -1;
    } else if ( a.name > b.name ) {
      return 1;
    } else {
      return 0;
    }
  });
  return teams;  
}
