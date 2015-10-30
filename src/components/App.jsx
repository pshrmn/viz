import React from "react";
import d3 from "d3";
import USMap from "./USMap";
import Hometowns from "./Hometowns";
import TeamMenu from "./TeamMenu"

export default React.createClass({
  getInitialState: function() {
    return {
      activeTeams: [],
      teams: [],
      radius: 3,
      opacity: 0.25
    };
  },
  componentWillMount: function() {
    let { scale, width, height } = this.props;
    let projection = d3.geo.albersUsa()
      .scale(scale)
      .translate([width/2, height/2]);
    this.setState({
      projection: projection
    });
  },
  setPlayers: function(activeTeams) {
    this.setState({
      activeTeams: activeTeams
    });
  },
  render: function() {
    let { width, height, margin, scale } = this.props;
    return (
      <div className="app">
        <svg width={width + margin*2} height={height + margin*2} >
          <g translate={`transform(${margin},${margin})`} >
            <USMap projection={this.state.projection} />
            <Hometowns teams={this.state.activeTeams}
                       radius={this.state.radius}
                       opacity={this.state.opacity} />
          </g>
        </svg>
        <TeamMenu teams={this.state.teams}
                  setTeams={this.setPlayers} />
      </div>
    );
  },
  componentDidMount: function() {
    let { projection } = this.state;
    d3.json("./data/fullteams.json", (error, teams) => {
      if ( error !== null ) {
        console.error(error);
        return;
      }
      teams.forEach((team) => {
        // convert coordinates to points in the projection
        team.points = projectedCoordinates(team.hometowns, projection);
        team.schoolPoint = projection([team.longitude, team.latitude]);

        // find a point the mean/median distance away in the projection, invert it
        // to get coordinates, then use haversine to determine the real world distance
        let milesPerDegreeLatitude = 68.6863716;

        // this is a far southern/central point whose projection should never return null
        // knock on wood
        let lowPoint = [-97.584980, 26.281485];
        let pMean = projection([lowPoint[0], lowPoint[1] + (team.mean / milesPerDegreeLatitude)]);
        team.meanRadius = Math.abs(pMean[1] - team.schoolPoint[1]);
        let pMedian = projection([lowPoint[0], lowPoint[1] + (team.median / milesPerDegreeLatitude)]);
        team.medianRadius = Math.abs(pMedian[1] - team.schoolPoint[1]);
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
      this.setState({
        teams: teams,
        activeTeams: teams
      });
    });
  }
});

/*
 * return an array containing all of the coordinates projected to their position
 * in the svg/map
 */
function projectedCoordinates(coords, projection) {
  return coords.map(function(spot) {
    return projection(spot);
  });
}

/*
 * return an array of distances from hometowns to the school
 * using the projected points in the svg/map
 */
function teamDistances(coords, home) {
  return coords.map(function(spot) {
    return distance(spot, home);
  });
}

function realDistance(homeCoords, mapPoint, projection) {
  var mapCoords = projection.invert(mapPoint);
  return haversine(homeCoords, mapCoords);
}

function haversine(start, end){
  // equatorial radius
  var R = 3963.1906;
  var start_lat = toRads(start[1]);
  var start_cos = Math.cos(start_lat);

  var end_lat = toRads(end[1]);
  var end_cos = Math.cos(end_lat)

  var lat_delta = toRads(end[1] - start[1]);
  var lat_delta_sin = Math.pow(Math.sin(lat_delta/2), 2)

  var long_delta = toRads(end[0] - start[0]);
  var long_delta_sin = Math.pow(Math.sin(long_delta/2), 2);

  var a = lat_delta_sin + (start_cos * end_cos * long_delta_sin)
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return Math.round(R*c, 10);
}

function toRads(num){
  return num * Math.PI / 180;
}