/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequireDefault = __webpack_require__(1)["default"];

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(3);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _componentsApp = __webpack_require__(4);

	var _componentsApp2 = _interopRequireDefault(_componentsApp);

	_reactDom2["default"].render(_react2["default"].createElement(_componentsApp2["default"], { width: 600,
	     height: 400,
	     margin: 15,
	     scale: 800 }), document.getElementById("content"));

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	exports["default"] = function (obj) {
	  return obj && obj.__esModule ? obj : {
	    "default": obj
	  };
	};

	exports.__esModule = true;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = ReactDOM;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequireDefault = __webpack_require__(1)["default"];

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _d3 = __webpack_require__(5);

	var _d32 = _interopRequireDefault(_d3);

	var _Team = __webpack_require__(6);

	var _Team2 = _interopRequireDefault(_Team);

	var _TeamSelect = __webpack_require__(10);

	var _TeamSelect2 = _interopRequireDefault(_TeamSelect);

	exports["default"] = _react2["default"].createClass({
	  displayName: "App",

	  getInitialState: function getInitialState() {
	    return {
	      conferences: [],
	      team: {},
	      cIndex: 0,
	      tIndex: 0
	    };
	  },
	  componentWillMount: function componentWillMount() {
	    var _props = this.props;
	    var scale = _props.scale;
	    var width = _props.width;
	    var height = _props.height;

	    var projection = _d32["default"].geo.albersUsa().scale(scale).translate([width / 2, height / 2]);
	    this.setState({
	      projection: projection
	    });
	  },
	  setConference: function setConference(index) {
	    var conference = this.state.conferences[index];
	    this.setState({
	      cIndex: index,
	      tIndex: 0,
	      team: conference.teams[0]
	    });
	  },
	  setTeam: function setTeam(index) {
	    this.setState({
	      tIndex: index,
	      team: this.state.conferences[this.state.cIndex].teams[index]
	    });
	  },
	  render: function render() {
	    var _props2 = this.props;
	    var width = _props2.width;
	    var height = _props2.height;
	    var margin = _props2.margin;
	    var scale = _props2.scale;
	    var _state = this.state;
	    var conferences = _state.conferences;
	    var index = _state.index;
	    var team = _state.team;
	    var projection = _state.projection;

	    var teamElement = team !== undefined ? _react2["default"].createElement(_Team2["default"], { team: team,
	      width: width,
	      height: height,
	      margin: margin,
	      projection: projection }) : null;
	    return _react2["default"].createElement(
	      "div",
	      { className: "app" },
	      _react2["default"].createElement(_TeamSelect2["default"], { conferences: conferences,
	        conferenceIndex: this.state.cIndex,
	        teamIndex: this.state.tIndex,
	        setConference: this.setConference,
	        setTeam: this.setTeam }),
	      teamElement
	    );
	  },
	  componentDidMount: function componentDidMount() {
	    var _this = this;

	    var _state2 = this.state;
	    var projection = _state2.projection;
	    var cIndex = _state2.cIndex;
	    var tIndex = _state2.tIndex;

	    _d32["default"].json("./data/bigten.json", function (error, conferences) {
	      if (error !== null) {
	        console.error(error);
	        return;
	      }
	      conferences.forEach(function (conference, index) {
	        conference.teams = setupTeams(conference.teams, projection);
	      });

	      _this.setState({
	        conferences: conferences,
	        team: conferences[cIndex].teams[tIndex]
	      });
	    });
	  }
	});

	function setupTeams(teams, projection) {
	  var prettyNumber = _d32["default"].format(",.0f");
	  teams.forEach(function (team) {
	    // convert coordinates to points in the projection
	    team.roster.forEach(function (city) {
	      city.point = projection([city.longitude, city.latitude]);
	    });
	    team.schoolPoint = projection([team.longitude, team.latitude]);

	    // find a point the mean/median distance away in the projection, invert it
	    // to get coordinates, then use haversine to determine the real world distance
	    var milesPerDegreeLatitude = 68.6863716;
	    // this is a far southern/central point whose projection should never return null
	    // knock on wood
	    var lowPoint = [-97.584980, 26.281485];
	    var projectedLow = projection(lowPoint);

	    var pMean = projection([lowPoint[0], lowPoint[1] + team.mean / milesPerDegreeLatitude]);
	    team.meanRadius = Math.abs(pMean[1] - projectedLow[1]);

	    var pMedian = projection([lowPoint[0], lowPoint[1] + team.median / milesPerDegreeLatitude]);
	    team.medianRadius = Math.abs(pMedian[1] - projectedLow[1]);

	    team.prettyMean = prettyNumber(team.mean);
	    team.prettyMedian = prettyNumber(team.median);
	  });
	  // default ordering alphabetical
	  teams.sort(function (a, b) {
	    if (a.name < b.name) {
	      return -1;
	    } else if (a.name > b.name) {
	      return 1;
	    } else {
	      return 0;
	    }
	  });
	  return teams;
	}
	module.exports = exports["default"];

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = d3;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequireDefault = __webpack_require__(1)["default"];

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _d3 = __webpack_require__(5);

	var _USMap = __webpack_require__(7);

	var _USMap2 = _interopRequireDefault(_USMap);

	var _TeamSVG = __webpack_require__(9);

	var _TeamSVG2 = _interopRequireDefault(_TeamSVG);

	exports["default"] = _react2["default"].createClass({
	  displayName: "Team",

	  getDefaultProps: function getDefaultProps() {
	    return {
	      team: {},
	      width: 1000,
	      height: 800,
	      margin: 0,
	      // default projection does nothing?
	      projection: function projection() {}
	    };
	  },
	  render: function render() {
	    //let { name, city, state, roster, prettyMean, prettyMedian,
	    var _props = this.props;
	    var team = _props.team;
	    var width = _props.width;
	    var height = _props.height;
	    var margin = _props.margin;
	    var projection = _props.projection;
	    var name = team.name;
	    var city = team.city;
	    var state = team.state;
	    var prettyMean = team.prettyMean;
	    var prettyMedian = team.prettyMedian;
	    var roster = team.roster;

	    return _react2["default"].createElement(
	      "div",
	      { className: "team" },
	      _react2["default"].createElement(
	        "h2",
	        null,
	        name
	      ),
	      _react2["default"].createElement(
	        "h3",
	        null,
	        city,
	        ", ",
	        state
	      ),
	      _react2["default"].createElement(
	        "svg",
	        { width: width + margin * 2, height: height + margin * 2 },
	        _react2["default"].createElement(
	          "g",
	          { translate: "transform(" + margin + "," + margin + ")" },
	          _react2["default"].createElement(_USMap2["default"], { projection: projection, active: team.state }),
	          _react2["default"].createElement(_TeamSVG2["default"], team)
	        )
	      ),
	      _react2["default"].createElement(TeamInfo, { name: name,
	        mean: prettyMean,
	        median: prettyMedian,
	        roster: roster,
	        state: state })
	    );
	  }
	});

	var TeamInfo = _react2["default"].createClass({
	  displayName: "TeamInfo",

	  getDefaultProps: function getDefaultProps() {
	    return {
	      name: "",
	      mean: 0,
	      median: 0,
	      roster: [],
	      state: ""
	    };
	  },
	  shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
	    return nextProps.name !== this.props.name;
	  },
	  _stateCounts: function _stateCounts(roster) {
	    var counts = {};
	    roster.forEach(function (player) {
	      var state = player.state;
	      if (counts[state]) {
	        counts[state]++;
	      } else {
	        counts[state] = 1;
	      }
	    });
	    return counts;
	  },
	  render: function render() {
	    var _props2 = this.props;
	    var mean = _props2.mean;
	    var median = _props2.median;
	    var roster = _props2.roster;
	    var state = _props2.state;

	    var stateCounts = this._stateCounts(roster);
	    var playerCount = roster.length;
	    var fPercent = (0, _d3.format)(".2%");
	    // on the off chance there are no in-state players, make sure a value is set
	    if (stateCounts[state] == undefined) {
	      stateCounts[state] = 0;
	    }
	    var inStatePercent = fPercent(stateCounts[state] / playerCount);
	    return _react2["default"].createElement(
	      "div",
	      { className: "team-info" },
	      _react2["default"].createElement(
	        "p",
	        null,
	        _react2["default"].createElement(
	          "span",
	          { className: "number" },
	          inStatePercent
	        ),
	        " of players come from in-state"
	      ),
	      _react2["default"].createElement(
	        "p",
	        null,
	        "Mean Distance: ",
	        _react2["default"].createElement(
	          "span",
	          { className: "number" },
	          mean
	        ),
	        " miles"
	      ),
	      _react2["default"].createElement(
	        "p",
	        null,
	        "Median Distance: ",
	        _react2["default"].createElement(
	          "span",
	          { className: "number" },
	          median
	        ),
	        " miles"
	      )
	    );
	  }
	});
	module.exports = exports["default"];

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequireDefault = __webpack_require__(1)["default"];

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _d3 = __webpack_require__(5);

	var _d32 = _interopRequireDefault(_d3);

	var _topojson = __webpack_require__(8);

	var _topojson2 = _interopRequireDefault(_topojson);

	exports["default"] = _react2["default"].createClass({
	  displayName: "USMap",

	  getInitialState: function getInitialState() {
	    return {
	      states: []
	    };
	  },
	  componentWillMount: function componentWillMount() {
	    this.setState({
	      path: _d32["default"].geo.path().projection(this.props.projection)
	    });
	  },
	  render: function render() {
	    var _this = this;

	    var active = this.props.active;

	    var states = this.state.states.map(function (s, index) {
	      return _react2["default"].createElement(State, { key: index,
	        active: s.properties.abbr === active,
	        path: _this.state.path,
	        feature: s });
	    });
	    return _react2["default"].createElement(
	      "g",
	      { className: "map", ref: "usmap" },
	      states
	    );
	  },
	  componentDidMount: function componentDidMount() {
	    var _this2 = this;

	    _d32["default"].json("./data/us.json", function (error, states) {
	      if (error !== null) {
	        console.error(error);
	        return;
	      }
	      var stateData = _topojson2["default"].feature(states, states.objects.states).features;
	      _this2.setState({
	        states: stateData
	      });
	    });
	  }
	});

	var State = _react2["default"].createClass({
	  displayName: "State",

	  render: function render() {
	    var classes = ["state"];
	    if (this.props.active) {
	      classes.push("active");
	    }
	    return _react2["default"].createElement(
	      "g",
	      { className: classes.join(" ") },
	      _react2["default"].createElement(StatePath, { path: this.props.path,
	        feature: this.props.feature })
	    );
	  }
	});

	var StatePath = _react2["default"].createClass({
	  displayName: "StatePath",

	  shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
	    // the path doesn't need to be updated after its initial drawing
	    return false;
	  },
	  render: function render() {
	    var _props = this.props;
	    var path = _props.path;
	    var feature = _props.feature;

	    return _react2["default"].createElement("path", { d: path(feature) });
	  }
	});
	module.exports = exports["default"];

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = topojson;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequireDefault = __webpack_require__(1)["default"];

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	exports["default"] = _react2["default"].createClass({
	  displayName: "TeamSVG",

	  shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
	    return nextProps.name !== this.props.name;
	  },
	  getDefaultProps: function getDefaultProps() {
	    return {
	      name: "",
	      roster: []
	    };
	  },
	  render: function render() {
	    var _props = this.props;
	    var name = _props.name;
	    var schoolPoint = _props.schoolPoint;
	    var roster = _props.roster;
	    var color = _props.color;
	    var prettyMean = _props.prettyMean;
	    var prettyMedian = _props.prettyMedian;
	    var meanRadius = _props.meanRadius;
	    var medianRadius = _props.medianRadius;

	    var hometowns = roster.map(function (city, index) {
	      return _react2["default"].createElement("circle", { key: index,
	        r: "2",
	        cx: city.point[0],
	        cy: city.point[1] });
	    });
	    var school = schoolPoint !== undefined ? _react2["default"].createElement(
	      "circle",
	      { className: "school",
	        r: "5",
	        cx: schoolPoint[0],
	        cy: schoolPoint[1] },
	      _react2["default"].createElement(
	        "title",
	        null,
	        this.props.name
	      )
	    ) : null;
	    var meanCircle = schoolPoint !== undefined && meanRadius !== undefined ? _react2["default"].createElement(
	      "circle",
	      { className: "mean",
	        r: meanRadius,
	        cx: schoolPoint[0],
	        cy: schoolPoint[1] },
	      _react2["default"].createElement(
	        "title",
	        null,
	        "Mean Distance: " + prettyMean + " miles"
	      )
	    ) : null;
	    var medianCircle = schoolPoint !== undefined && meanRadius !== undefined ? _react2["default"].createElement(
	      "circle",
	      { className: "median",
	        r: medianRadius,
	        cx: schoolPoint[0],
	        cy: schoolPoint[1] },
	      _react2["default"].createElement(
	        "title",
	        null,
	        "Median Distance: " + prettyMedian + " miles"
	      )
	    ) : null;

	    return _react2["default"].createElement(
	      "g",
	      { className: "team",
	        fill: color },
	      meanCircle,
	      medianCircle,
	      _react2["default"].createElement(
	        "g",
	        { className: "hometowns" },
	        hometowns
	      ),
	      school
	    );
	  }
	});
	module.exports = exports["default"];

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequireDefault = __webpack_require__(1)["default"];

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	exports["default"] = _react2["default"].createClass({
	  displayName: "TeamSelect",

	  updateConference: function updateConference(event) {
	    this.props.setConference(event.target.value);
	  },
	  updateTeam: function updateTeam(event) {
	    this.props.setTeam(event.target.value);
	  },
	  render: function render() {
	    var _props = this.props;
	    var conferences = _props.conferences;
	    var conferenceIndex = _props.conferenceIndex;
	    var teamIndex = _props.teamIndex;

	    var conferenceOptions = conferences.length ? conferences.map(function (conf, index) {
	      return _react2["default"].createElement(
	        "option",
	        { key: index, value: index },
	        conf.name
	      );
	    }) : null;
	    var teamOptions = conferences.length && conferences[conferenceIndex] ? conferences[conferenceIndex].teams.map(function (team, index) {
	      return _react2["default"].createElement(
	        "option",
	        { key: index, value: index },
	        team.name
	      );
	    }) : null;
	    return _react2["default"].createElement(
	      "div",
	      { className: "team-menu" },
	      _react2["default"].createElement(
	        "div",
	        { className: "selector" },
	        "Conference:",
	        _react2["default"].createElement(
	          "select",
	          { onChange: this.updateConference, value: conferenceIndex },
	          conferenceOptions
	        )
	      ),
	      _react2["default"].createElement(
	        "div",
	        { className: "selector" },
	        "School:",
	        _react2["default"].createElement(
	          "select",
	          { onChange: this.updateTeam, value: teamIndex },
	          teamOptions
	        )
	      )
	    );
	  }
	});
	module.exports = exports["default"];

/***/ }
/******/ ]);