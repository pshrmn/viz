import React from "react";
import d3 from "d3";
import USMap from "./USMap";
import TeamSVG from "./TeamSVG";
import Team from "./Team";
import TeamSelect from "./TeamSelect";

export default React.createClass({
  getInitialState: function() {
    return {
      team: {},
      teams: [],
      index: 0
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
  setTeam: function(index) {
    this.setState({
      index: index,
      team: this.state.teams[index]
    });
  },
  render: function() {
    let { width, height, margin, scale } = this.props;
    let { teams, index } = this.state
    return (
      <div className="app">
        <TeamSelect teams={this.state.teams}
                    selected={this.state.index}
                    setTeam={this.setTeam} />
        <svg width={width + margin*2} height={height + margin*2} >
          <g translate={`transform(${margin},${margin})`} >
            <USMap projection={this.state.projection} />
            <TeamSVG {...this.state.team} />
          </g>
        </svg>
        <Team {...this.state.team} />
      </div>
    );
  },
  componentDidMount: function() {
    let { projection } = this.state;
    d3.json("./data/bigtenarray.json", (error, teams) => {
      if ( error !== null ) {
        console.error(error);
        return;
      }
      teams.forEach((team) => {
        // convert coordinates to points in the projection
        team.points = projectedCoordinates(team.roster, projection);
        team.schoolPoint = projection([team.longitude, team.latitude]);

        // find a point the mean/median distance away in the projection, invert it
        // to get coordinates, then use haversine to determine the real world distance
        let milesPerDegreeLatitude = 68.6863716;

        // this is a far southern/central point whose projection should never return null
        // knock on wood
        let lowPoint = [-97.584980, 26.281485];
        let projectedLow = projection(lowPoint);

        let pMean = projection([lowPoint[0], lowPoint[1] + (team.mean / milesPerDegreeLatitude)]);
        team.mean = Math.abs(pMean[1] - projectedLow[1]);

        let pMedian = projection([lowPoint[0], lowPoint[1] + (team.median / milesPerDegreeLatitude)]);
        team.median = Math.abs(pMedian[1] - projectedLow[1]);
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
        team: teams[this.state.index]
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