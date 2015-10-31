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

	_reactDom2["default"].render(_react2["default"].createElement(_componentsApp2["default"], { width: 800,
	     height: 500,
	     margin: 15,
	     scale: 1000 }), document.getElementById("content"));

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

	var _USMap = __webpack_require__(6);

	var _USMap2 = _interopRequireDefault(_USMap);

	var _TeamSVG = __webpack_require__(8);

	var _TeamSVG2 = _interopRequireDefault(_TeamSVG);

	var _Team = __webpack_require__(9);

	var _Team2 = _interopRequireDefault(_Team);

	var _TeamSelect = __webpack_require__(10);

	var _TeamSelect2 = _interopRequireDefault(_TeamSelect);

	exports["default"] = _react2["default"].createClass({
	  displayName: "App",

	  getInitialState: function getInitialState() {
	    return {
	      team: {},
	      teams: [],
	      index: 0
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
	  setTeam: function setTeam(index) {
	    this.setState({
	      index: index,
	      team: this.state.teams[index]
	    });
	  },
	  render: function render() {
	    var _props2 = this.props;
	    var width = _props2.width;
	    var height = _props2.height;
	    var margin = _props2.margin;
	    var scale = _props2.scale;
	    var _state = this.state;
	    var teams = _state.teams;
	    var index = _state.index;

	    return _react2["default"].createElement(
	      "div",
	      { className: "app" },
	      _react2["default"].createElement(_TeamSelect2["default"], { teams: this.state.teams,
	        selected: this.state.index,
	        setTeam: this.setTeam }),
	      _react2["default"].createElement(
	        "svg",
	        { width: width + margin * 2, height: height + margin * 2 },
	        _react2["default"].createElement(
	          "g",
	          { translate: "transform(" + margin + "," + margin + ")" },
	          _react2["default"].createElement(_USMap2["default"], { projection: this.state.projection }),
	          _react2["default"].createElement(_TeamSVG2["default"], this.state.team)
	        )
	      ),
	      _react2["default"].createElement(_Team2["default"], this.state.team)
	    );
	  },
	  componentDidMount: function componentDidMount() {
	    var _this = this;

	    var projection = this.state.projection;

	    _d32["default"].json("./data/bigtenarray.json", function (error, teams) {
	      if (error !== null) {
	        console.error(error);
	        return;
	      }
	      teams.forEach(function (team) {
	        // convert coordinates to points in the projection
	        team.points = projectedCoordinates(team.roster, projection);
	        team.schoolPoint = projection([team.longitude, team.latitude]);

	        // find a point the mean/median distance away in the projection, invert it
	        // to get coordinates, then use haversine to determine the real world distance
	        var milesPerDegreeLatitude = 68.6863716;

	        // this is a far southern/central point whose projection should never return null
	        // knock on wood
	        var lowPoint = [-97.584980, 26.281485];
	        var projectedLow = projection(lowPoint);

	        var pMean = projection([lowPoint[0], lowPoint[1] + team.mean / milesPerDegreeLatitude]);
	        team.mean = Math.abs(pMean[1] - projectedLow[1]);

	        var pMedian = projection([lowPoint[0], lowPoint[1] + team.median / milesPerDegreeLatitude]);
	        team.median = Math.abs(pMedian[1] - projectedLow[1]);
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
	      _this.setState({
	        teams: teams,
	        team: teams[_this.state.index]
	      });
	    });
	  }
	});

	/*
	 * return an array containing all of the coordinates projected to their position
	 * in the svg/map
	 */
	function projectedCoordinates(coords, projection) {
	  return coords.map(function (spot) {
	    return projection(spot);
	  });
	}

	/*
	 * return an array of distances from hometowns to the school
	 * using the projected points in the svg/map
	 */
	function teamDistances(coords, home) {
	  return coords.map(function (spot) {
	    return distance(spot, home);
	  });
	}

	function realDistance(homeCoords, mapPoint, projection) {
	  var mapCoords = projection.invert(mapPoint);
	  return haversine(homeCoords, mapCoords);
	}

	function haversine(start, end) {
	  // equatorial radius
	  var R = 3963.1906;
	  var start_lat = toRads(start[1]);
	  var start_cos = Math.cos(start_lat);

	  var end_lat = toRads(end[1]);
	  var end_cos = Math.cos(end_lat);

	  var lat_delta = toRads(end[1] - start[1]);
	  var lat_delta_sin = Math.pow(Math.sin(lat_delta / 2), 2);

	  var long_delta = toRads(end[0] - start[0]);
	  var long_delta_sin = Math.pow(Math.sin(long_delta / 2), 2);

	  var a = lat_delta_sin + start_cos * end_cos * long_delta_sin;
	  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	  return Math.round(R * c, 10);
	}

	function toRads(num) {
	  return num * Math.PI / 180;
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

	var _d32 = _interopRequireDefault(_d3);

	var _topojson = __webpack_require__(7);

	var _topojson2 = _interopRequireDefault(_topojson);

	exports["default"] = _react2["default"].createClass({
	  displayName: "USMap",

	  shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
	    // don't redraw
	    return false;
	  },
	  render: function render() {
	    return _react2["default"].createElement("g", { className: "map", ref: "usmap" });
	  },
	  componentDidMount: function componentDidMount() {
	    var _this = this;

	    _d32["default"].json("./data/us.json", function (error, states) {
	      if (error !== null) {
	        console.error(error);
	        return;
	      }
	      var path = _d32["default"].geo.path().projection(_this.props.projection);
	      var stateData = _topojson2["default"].feature(states, states.objects.states).features;
	      _d32["default"].select(_this.refs.usmap).selectAll("g.state").data(stateData).enter().append("g").classed("state", true).append("path").classed("outline", true).attr("d", path);
	    });
	  }
	});
	module.exports = exports["default"];

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = topojson;

/***/ },
/* 8 */
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

	  getDefaultProps: function getDefaultProps() {
	    return {
	      name: "",
	      schoolPoint: [0, 0],
	      roster: []
	    };
	  },
	  render: function render() {
	    var _props = this.props;
	    var name = _props.name;
	    var schoolPoint = _props.schoolPoint;
	    var roster = _props.roster;
	    var color = _props.color;

	    return _react2["default"].createElement(
	      "g",
	      { className: "team",
	        fill: color },
	      _react2["default"].createElement(
	        "circle",
	        { className: "school",
	          r: "5",
	          cx: this.props.schoolPoint[0],
	          cy: this.props.schoolPoint[1] },
	        _react2["default"].createElement(
	          "title",
	          null,
	          this.props.name
	        )
	      )
	    );
	  }
	});
	module.exports = exports["default"];

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

	var _d3 = __webpack_require__(5);

	exports["default"] = _react2["default"].createClass({
	  displayName: "Team",

	  getDefaultProps: function getDefaultProps() {
	    return {
	      name: "",
	      city: "",
	      state: "",
	      roster: [],
	      latitude: -1,
	      longitude: -1,
	      mean: 0,
	      median: 0
	    };
	  },
	  propTypes: {
	    name: _react2["default"].PropTypes.string.isRequired,
	    city: _react2["default"].PropTypes.string.isRequired,
	    state: _react2["default"].PropTypes.string.isRequired,
	    roster: _react2["default"].PropTypes.array.isRequired,
	    latitude: _react2["default"].PropTypes.number.isRequired,
	    longitude: _react2["default"].PropTypes.number.isRequired,
	    mean: _react2["default"].PropTypes.number.isRequired,
	    median: _react2["default"].PropTypes.number.isRequired
	  },
	  prettyNumbers: d3.format(",.0f"),
	  render: function render() {
	    var _props = this.props;
	    var name = _props.name;
	    var city = _props.city;
	    var state = _props.state;
	    var roster = _props.roster;
	    var mean = _props.mean;
	    var median = _props.median;

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
	        "p",
	        null,
	        "Mean Distance: ",
	        this.prettyNumbers(mean),
	        " miles"
	      ),
	      _react2["default"].createElement(
	        "p",
	        null,
	        "Median Distance: ",
	        this.prettyNumbers(median),
	        " miles"
	      )
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

	  updateTeam: function updateTeam(event) {
	    this.props.setTeam(event.target.value);
	  },
	  sendUpdate: function sendUpdate(index) {
	    this.props.setTeam(index);
	  },
	  render: function render() {
	    var teams = this.props.teams.map(function (team, index) {
	      return _react2["default"].createElement(
	        "option",
	        { key: index, value: index },
	        team.name
	      );
	    });
	    return _react2["default"].createElement(
	      "div",
	      { className: "team-menu" },
	      _react2["default"].createElement(
	        "select",
	        { onChange: this.updateTeam, value: this.props.index },
	        teams
	      )
	    );
	  }
	});
	module.exports = exports["default"];

/***/ }
/******/ ]);