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
    let { teams, index, team } = this.state;
    let activeState = "";
    if ( team ) {
      activeState = team.state;
    }
    console.log("active state:", activeState);
    return (
      <div className="app">
        <TeamSelect teams={this.state.teams}
                    selected={this.state.index}
                    setTeam={this.setTeam} />
        <svg width={width + margin*2} height={height + margin*2} >
          <g translate={`transform(${margin},${margin})`} >
            <USMap projection={this.state.projection} active={activeState} />
            <TeamSVG {...this.state.team} />
          </g>
        </svg>
        <Team {...this.state.team} />
      </div>
    );
  },
  componentDidMount: function() {
    let { projection } = this.state;
    d3.json("./data/bigten.json", (error, teams) => {
      if ( error !== null ) {
        console.error(error);
        return;
      }

      let prettyNumber = d3.format(",.0f");

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

        team.prettyMean = prettyNumber(team.mean);
        team.prettyMedian = prettyNumber(team.median);
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
