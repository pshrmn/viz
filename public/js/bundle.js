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

	var _Teams = __webpack_require__(8);

	var _Teams2 = _interopRequireDefault(_Teams);

	var _TeamMenu = __webpack_require__(13);

	var _TeamMenu2 = _interopRequireDefault(_TeamMenu);

	var _Controls = __webpack_require__(14);

	var _Controls2 = _interopRequireDefault(_Controls);

	exports["default"] = _react2["default"].createClass({
	  displayName: "App",

	  getInitialState: function getInitialState() {
	    return {
	      activeTeams: [],
	      teams: [],
	      radius: 3,
	      opacity: 0.25,
	      showMeans: false,
	      showMedians: true,
	      showSchools: true
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
	  setPlayers: function setPlayers(activeTeams) {
	    this.setState({
	      activeTeams: activeTeams
	    });
	  },
	  toggleSchools: function toggleSchools() {
	    this.setState({
	      showSchools: !this.state.showSchools
	    });
	  },
	  toggleMedians: function toggleMedians() {
	    this.setState({
	      showMedians: !this.state.showMedians
	    });
	  },
	  toggleMeans: function toggleMeans() {
	    this.setState({
	      showMeans: !this.state.showMeans
	    });
	  },
	  setRadius: function setRadius(val) {
	    this.setState({
	      radius: val
	    });
	  },
	  setOpacity: function setOpacity(val) {
	    this.setState({
	      opacity: val
	    });
	  },
	  render: function render() {
	    var _props2 = this.props;
	    var width = _props2.width;
	    var height = _props2.height;
	    var margin = _props2.margin;
	    var scale = _props2.scale;

	    return _react2["default"].createElement(
	      "div",
	      { className: "app" },
	      _react2["default"].createElement(
	        "svg",
	        { width: width + margin * 2, height: height + margin * 2 },
	        _react2["default"].createElement(
	          "g",
	          { translate: "transform(" + margin + "," + margin + ")" },
	          _react2["default"].createElement(_USMap2["default"], { projection: this.state.projection }),
	          _react2["default"].createElement(_Teams2["default"], { teams: this.state.activeTeams,
	            radius: this.state.radius,
	            opacity: this.state.opacity,
	            showMeans: this.state.showMeans,
	            showMedians: this.state.showMedians,
	            showSchools: this.state.showSchools })
	        )
	      ),
	      _react2["default"].createElement(_TeamMenu2["default"], { teams: this.state.teams,
	        setTeams: this.setPlayers }),
	      _react2["default"].createElement(_Controls2["default"], { schools: this.state.showSchools,
	        toggleSchools: this.toggleSchools,
	        medians: this.state.showMedians,
	        toggleMedians: this.toggleMedians,
	        means: this.state.showMeans,
	        toggleMeans: this.toggleMeans,
	        radius: this.state.radius,
	        setRadius: this.setRadius,
	        opacity: this.state.opacity,
	        setOpacity: this.setOpacity })
	    );
	  },
	  componentDidMount: function componentDidMount() {
	    var _this = this;

	    var projection = this.state.projection;

	    _d32["default"].json("./data/fullteams.json", function (error, teams) {
	      if (error !== null) {
	        console.error(error);
	        return;
	      }
	      teams.forEach(function (team) {
	        // convert coordinates to points in the projection
	        team.points = projectedCoordinates(team.hometowns, projection);
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

	var _d3 = __webpack_require__(5);

	var _d32 = _interopRequireDefault(_d3);

	var _Schools = __webpack_require__(9);

	var _Schools2 = _interopRequireDefault(_Schools);

	var _Hometowns = __webpack_require__(10);

	var _Hometowns2 = _interopRequireDefault(_Hometowns);

	var _Medians = __webpack_require__(11);

	var _Medians2 = _interopRequireDefault(_Medians);

	var _Means = __webpack_require__(12);

	var _Means2 = _interopRequireDefault(_Means);

	exports["default"] = _react2["default"].createClass({
	  displayName: "Teams",

	  render: function render() {
	    var _props = this.props;
	    var teams = _props.teams;
	    var opacity = _props.opacity;
	    var radius = _props.radius;
	    var showMeans = _props.showMeans;
	    var showMedians = _props.showMedians;
	    var showSchools = _props.showSchools;

	    return _react2["default"].createElement(
	      "g",
	      null,
	      _react2["default"].createElement(_Means2["default"], { teams: teams,
	        hidden: !showMeans }),
	      _react2["default"].createElement(_Medians2["default"], { teams: teams,
	        hidden: !showMedians }),
	      _react2["default"].createElement(_Hometowns2["default"], { teams: teams,
	        radius: radius,
	        opacity: opacity }),
	      _react2["default"].createElement(_Schools2["default"], { teams: teams,
	        hidden: !showSchools })
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

	exports["default"] = _react2["default"].createClass({
	  displayName: "Schools",

	  render: function render() {
	    var _props = this.props;
	    var teams = _props.teams;
	    var hidden = _props.hidden;

	    var opacity = 0.1;
	    var schools = teams.map(function (team, index) {
	      var className = team.selected ? "school" : "school hidden";
	      return _react2["default"].createElement(
	        "circle",
	        { key: index,
	          className: className,
	          r: "5",
	          fill: team.color,
	          cx: team.schoolPoint[0],
	          cy: team.schoolPoint[1] },
	        _react2["default"].createElement(
	          "title",
	          null,
	          team.name
	        )
	      );
	    });
	    var classNames = ["schools"];
	    if (hidden) {
	      classNames.push("hidden");
	    }
	    return _react2["default"].createElement(
	      "g",
	      { className: classNames.join(" ") },
	      schools
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

	var _d3 = __webpack_require__(5);

	var _d32 = _interopRequireDefault(_d3);

	exports["default"] = _react2["default"].createClass({
	  displayName: "Hometowns",

	  shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
	    // d3 handle the rendering, so never update
	    return false;
	  },
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	    this._d3Select(nextProps.teams);
	  },
	  render: function render() {
	    // we want want for the component is the holder (with a ref to it for easy access)
	    // d3 will handle all of the rendering
	    return _react2["default"].createElement("g", { className: "hometowns", ref: "hometowns" });
	  },
	  componentDidMount: function componentDidMount() {
	    // draw all of the teams the first time the component is rendered
	    var teamsSelection = _d32["default"].select(this.refs.hometowns).selectAll("g.team");
	    this.setState({
	      teamsSelection: teamsSelection
	    });
	  },
	  _d3Select: function _d3Select(teams) {
	    var _props = this.props;
	    var radius = _props.radius;
	    var opacity = _props.opacity;

	    var teamsSelection = this.state.teamsSelection.data(teams, function (d) {
	      return d.name;
	    });
	    teamsSelection.enter().append("g").classed({
	      "team": true,
	      "hidden": function hidden(d) {
	        return !d.selected;
	      }
	    }).style("fill", function (d) {
	      return d.color;
	    });

	    teamsSelection.classed({
	      "hidden": function hidden(d) {
	        return !d.selected;
	      }
	    });

	    var cities = teamsSelection.selectAll("circle.city").data(function (d) {
	      return d.points;
	    });
	    cities.enter().append("circle").classed("city", true).attr("cx", function (d) {
	      return d[0];
	    }).attr("cy", function (d) {
	      return d[1];
	    });

	    cities.attr("r", radius).style("opacity", this.props.opacity);

	    this.setState({
	      teamsSelection: teamsSelection
	    });
	  }
	});
	module.exports = exports["default"];

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequireDefault = __webpack_require__(1)["default"];

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	exports["default"] = _react2["default"].createClass({
	  displayName: "Medians",

	  render: function render() {
	    var _props = this.props;
	    var teams = _props.teams;
	    var hidden = _props.hidden;

	    var opacity = 0.1;
	    var medians = teams.map(function (team, index) {
	      var className = team.selected ? "median" : "median hidden";
	      return _react2["default"].createElement(
	        "circle",
	        { key: index,
	          className: className,
	          r: team.medianRadius,
	          cx: team.schoolPoint[0],
	          cy: team.schoolPoint[1] },
	        _react2["default"].createElement(
	          "title",
	          null,
	          team.name + " median: " + team.median + " miles"
	        )
	      );
	    });
	    var classNames = ["medians"];
	    if (hidden) {
	      classNames.push("hidden");
	    }
	    return _react2["default"].createElement(
	      "g",
	      { className: classNames.join(" ") },
	      medians
	    );
	  }
	});
	module.exports = exports["default"];

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequireDefault = __webpack_require__(1)["default"];

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	exports["default"] = _react2["default"].createClass({
	  displayName: "Means",

	  render: function render() {
	    var _props = this.props;
	    var teams = _props.teams;
	    var hidden = _props.hidden;

	    var opacity = 0.1;
	    var means = teams.map(function (team, index) {
	      var className = team.selected ? "mean" : "mean hidden";
	      return _react2["default"].createElement(
	        "circle",
	        { key: index,
	          className: className,
	          r: team.meanRadius,
	          cx: team.schoolPoint[0],
	          cy: team.schoolPoint[1] },
	        _react2["default"].createElement(
	          "title",
	          null,
	          team.name + " mean: " + team.mean + " miles"
	        )
	      );
	    });
	    var classNames = ["means"];
	    if (hidden) {
	      classNames.push("hidden");
	    }
	    return _react2["default"].createElement(
	      "g",
	      { className: classNames.join(" ") },
	      means
	    );
	  }
	});
	module.exports = exports["default"];

/***/ },
/* 13 */
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

	exports["default"] = _react2["default"].createClass({
	  displayName: "TeamMenu",

	  getInitialState: function getInitialState() {
	    return {
	      teams: []
	    };
	  },
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	    this.setState({
	      teams: nextProps.teams
	    });
	  },
	  updateTeam: function updateTeam(index) {
	    var teams = this.state.teams;
	    teams[index].selected = !teams[index].selected;
	    this.sendUpdate(teams);
	    this.setState({
	      teams: teams
	    });
	  },
	  selectAll: function selectAll() {
	    var teams = this.state.teams;
	    teams.forEach(function (t) {
	      t.selected = true;
	    });
	    this.sendUpdate(teams);
	    this.setState({
	      teams: teams
	    });
	  },
	  deselectAll: function deselectAll() {
	    var teams = this.state.teams;
	    teams.forEach(function (t) {
	      t.selected = false;
	    });
	    this.sendUpdate(teams);
	    this.setState({
	      teams: teams
	    });
	  },
	  sendUpdate: function sendUpdate(teams) {
	    this.props.setTeams(teams);
	  },
	  render: function render() {
	    var _this = this;

	    var teams = this.props.teams.map(function (team, index) {
	      return _react2["default"].createElement(Team, { key: index,
	        index: index,
	        name: team.name,
	        selected: team.selected,
	        update: _this.updateTeam });
	    });
	    return _react2["default"].createElement(
	      "div",
	      { className: "team-menu" },
	      _react2["default"].createElement(
	        "div",
	        { className: "controls" },
	        _react2["default"].createElement(
	          "button",
	          { onClick: this.selectAll },
	          "Select All"
	        ),
	        _react2["default"].createElement(
	          "button",
	          { onClick: this.deselectAll },
	          "Deselect All"
	        )
	      ),
	      teams
	    );
	  }
	});

	var Team = _react2["default"].createClass({
	  displayName: "Team",

	  getDefaultProps: function getDefaultProps() {
	    return {
	      name: ""
	    };
	  },
	  checkHandler: function checkHandler(event) {
	    this.props.update(this.props.index);
	  },
	  render: function render() {
	    return _react2["default"].createElement(
	      "div",
	      { className: "team" },
	      _react2["default"].createElement(
	        "label",
	        null,
	        this.props.name,
	        _react2["default"].createElement("input", { type: "checkbox",
	          checked: this.props.selected,
	          onChange: this.checkHandler })
	      )
	    );
	  }
	});
	module.exports = exports["default"];

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequireDefault = __webpack_require__(1)["default"];

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	exports["default"] = _react2["default"].createClass({
	  displayName: "Controls",

	  setRadius: function setRadius(event) {
	    this.props.setRadius(event.target.value);
	  },
	  setOpacity: function setOpacity(event) {
	    this.props.setOpacity(event.target.value);
	  },
	  toggleSchools: function toggleSchools() {
	    this.props.toggleSchools(event.target.checked);
	  },
	  toggleMedians: function toggleMedians() {
	    this.props.toggleMedians(event.target.checked);
	  },
	  toggleMeans: function toggleMeans() {
	    this.props.toggleMeans(event.target.checked);
	  },
	  render: function render() {
	    var _props = this.props;
	    var schools = _props.schools;
	    var medians = _props.medians;
	    var means = _props.means;
	    var opacity = _props.opacity;
	    var radius = _props.radius;

	    return _react2["default"].createElement(
	      "div",
	      null,
	      _react2["default"].createElement(
	        "h2",
	        null,
	        "Controls"
	      ),
	      _react2["default"].createElement(
	        "label",
	        null,
	        "Radius ",
	        radius,
	        _react2["default"].createElement("input", { type: "range",
	          value: radius,
	          step: "1",
	          min: "1",
	          max: "15",
	          onChange: this.setRadius })
	      ),
	      _react2["default"].createElement(
	        "label",
	        null,
	        "Opacity ",
	        opacity,
	        _react2["default"].createElement("input", { type: "range",
	          value: opacity,
	          step: "0.05",
	          min: "0",
	          max: "1",
	          onChange: this.setOpacity })
	      ),
	      _react2["default"].createElement(
	        "label",
	        null,
	        "Show Schools",
	        _react2["default"].createElement("input", { type: "checkbox",
	          checked: schools,
	          onChange: this.toggleSchools })
	      ),
	      _react2["default"].createElement(
	        "label",
	        null,
	        "Show Medians",
	        _react2["default"].createElement("input", { type: "checkbox",
	          checked: medians,
	          onChange: this.toggleMedians })
	      ),
	      _react2["default"].createElement(
	        "label",
	        null,
	        "Show Means",
	        _react2["default"].createElement("input", { type: "checkbox",
	          checked: means,
	          onChange: this.toggleMeans })
	      )
	    );
	  }
	});
	module.exports = exports["default"];

/***/ }
/******/ ]);