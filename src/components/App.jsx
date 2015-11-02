import React from "react";
import d3 from "d3";
import Team from "./Team";
import TeamSelect from "./TeamSelect";

export default React.createClass({
  getInitialState: function() {
    return {
      conferences: [],
      team: {},
      cIndex: 0,
      tIndex: 0
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
  setConference: function(index) {
    let conference = this.state.conferences[index];
    this.setState({
      cIndex: index,
      tIndex: 0,
      team: conference.teams[0]
    });
  },
  setTeam: function(index) {
    this.setState({
      tIndex: index,
      team: this.state.conferences[this.state.cIndex].teams[index]
    });
  },
  render: function() {
    let { width, height, margin, scale } = this.props;
    let { conferences, index, team, projection } = this.state;
    let teamElement = team !== undefined ? (
      <Team team={team}
            width={width}
            height={height}
            margin={margin}
            projection={projection} />
    ) : null;
    return (
      <div className="app">
        <TeamSelect conferences={conferences}
                    conferenceIndex={this.state.cIndex}
                    teamIndex={this.state.tIndex}
                    setConference={this.setConference}
                    setTeam={this.setTeam} />
        {teamElement}
      </div>
    );
  },
  componentDidMount: function() {
    let { projection, cIndex, tIndex } = this.state;
    d3.json("./data/bigten.json", (error, conferences) => {
      if ( error !== null ) {
        console.error(error);
        return;
      }
      conferences.forEach((conference, index) => {
        conference.teams = setupTeams(conference.teams, projection);
      });


      this.setState({
        conferences: conferences,
        team: conferences[cIndex].teams[tIndex]
      });
    });
  }
});

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
