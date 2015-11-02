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

	var _TeamSelect = __webpack_require__(25);

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

	var _extends = __webpack_require__(7)["default"];

	var _interopRequireDefault = __webpack_require__(1)["default"];

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _d3 = __webpack_require__(5);

	var _d32 = _interopRequireDefault(_d3);

	var _USMap = __webpack_require__(21);

	var _USMap2 = _interopRequireDefault(_USMap);

	var _TeamMap = __webpack_require__(23);

	var _TeamMap2 = _interopRequireDefault(_TeamMap);

	var _StateChart = __webpack_require__(24);

	var _StateChart2 = _interopRequireDefault(_StateChart);

	exports["default"] = _react2["default"].createClass({
	  displayName: "Team",

	  shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
	    return nextProps.team.name !== this.props.name;
	  },
	  getDefaultProps: function getDefaultProps() {
	    return {
	      team: {
	        name: "",
	        city: "",
	        state: "",
	        mean: 0,
	        median: 0,
	        roster: []
	      },
	      width: 1000,
	      height: 800,
	      margin: 0,
	      // default projection does nothing?
	      projection: function projection() {}
	    };
	  },
	  _stateCounts: function _stateCounts() {
	    var roster = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

	    var counts = {};
	    roster.forEach(function (player) {
	      var state = player.state;
	      if (counts[state]) {
	        counts[state]++;
	      } else {
	        counts[state] = 1;
	      }
	    });
	    var countArray = [];
	    for (var key in counts) {
	      countArray.push({
	        name: key,
	        count: counts[key]
	      });
	    }
	    return {
	      counts: counts,
	      states: countArray
	    };
	  },
	  render: function render() {
	    var _props = this.props;
	    var team = _props.team;
	    var width = _props.width;
	    var height = _props.height;
	    var margin = _props.margin;
	    var projection = _props.projection;
	    var name = team.name;
	    var city = team.city;
	    var state = team.state;
	    var mean = team.mean;
	    var median = team.median;
	    var roster = team.roster;
	    var color = team.color;

	    var stateData = this._stateCounts(roster);
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
	      _react2["default"].createElement(TeamInfo, _extends({ counts: stateData.counts
	      }, team)),
	      _react2["default"].createElement(
	        "svg",
	        { xmlns: "http://www.w3.org/2000/svg",
	          width: width + margin * 2,
	          height: height + margin * 2 },
	        _react2["default"].createElement(
	          "g",
	          { translate: "transform(" + margin + "," + margin + ")" },
	          _react2["default"].createElement(_USMap2["default"], { projection: projection, active: team.state }),
	          _react2["default"].createElement(_TeamMap2["default"], team)
	        )
	      ),
	      _react2["default"].createElement(_StateChart2["default"], { name: name,
	        states: stateData.states,
	        color: color,
	        width: 500,
	        height: 200 })
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
	  render: function render() {
	    var fPercent = _d32["default"].format(".2%");
	    var prettyNumber = _d32["default"].format(",.0f");

	    var _props2 = this.props;
	    var mean = _props2.mean;
	    var median = _props2.median;
	    var roster = _props2.roster;
	    var state = _props2.state;
	    var counts = _props2.counts;

	    var playerCount = roster.length;
	    // on the off chance there are no in-state players, make sure a value is set
	    if (counts[state] == undefined) {
	      counts[state] = 0;
	    }
	    var inStatePercent = fPercent(counts[state] / playerCount);

	    var prettyMean = prettyNumber(mean);
	    var prettyMedian = prettyNumber(median);
	    var medianString = mean > median ? _react2["default"].createElement(
	      "p",
	      null,
	      "However, 50% of players come from within ",
	      _react2["default"].createElement(
	        "span",
	        { className: "number" },
	        prettyMedian
	      ),
	      " miles of campus."
	    ) : _react2["default"].createElement(
	      "p",
	      null,
	      "50% of players come from over ",
	      _react2["default"].createElement(
	        "span",
	        { className: "number" },
	        prettyMedian
	      ),
	      " miles of campus."
	    );

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
	        "On average, a player's hometown is ",
	        _react2["default"].createElement(
	          "span",
	          { className: "number" },
	          prettyMean
	        ),
	        " miles away from campus."
	      ),
	      medianString
	    );
	  }
	});
	module.exports = exports["default"];

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _Object$assign = __webpack_require__(8)["default"];

	exports["default"] = _Object$assign || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];

	    for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }

	  return target;
	};

	exports.__esModule = true;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(9), __esModule: true };

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(10);
	module.exports = __webpack_require__(13).Object.assign;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $def = __webpack_require__(11);

	$def($def.S + $def.F, 'Object', {assign: __webpack_require__(14)});

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(12)
	  , core      = __webpack_require__(13)
	  , PROTOTYPE = 'prototype';
	var ctx = function(fn, that){
	  return function(){
	    return fn.apply(that, arguments);
	  };
	};
	var $def = function(type, name, source){
	  var key, own, out, exp
	    , isGlobal = type & $def.G
	    , isProto  = type & $def.P
	    , target   = isGlobal ? global : type & $def.S
	        ? global[name] : (global[name] || {})[PROTOTYPE]
	    , exports  = isGlobal ? core : core[name] || (core[name] = {});
	  if(isGlobal)source = name;
	  for(key in source){
	    // contains in native
	    own = !(type & $def.F) && target && key in target;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    if(isGlobal && typeof target[key] != 'function')exp = source[key];
	    // bind timers to global for call from export context
	    else if(type & $def.B && own)exp = ctx(out, global);
	    // wrap global constructors for prevent change them in library
	    else if(type & $def.W && target[key] == out)!function(C){
	      exp = function(param){
	        return this instanceof C ? new C(param) : C(param);
	      };
	      exp[PROTOTYPE] = C[PROTOTYPE];
	    }(out);
	    else exp = isProto && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export
	    exports[key] = exp;
	    if(isProto)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
	  }
	};
	// type bitmap
	$def.F = 1;  // forced
	$def.G = 2;  // global
	$def.S = 4;  // static
	$def.P = 8;  // proto
	$def.B = 16; // bind
	$def.W = 32; // wrap
	module.exports = $def;

/***/ },
/* 12 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 13 */
/***/ function(module, exports) {

	var core = module.exports = {version: '1.2.3'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.1 Object.assign(target, source, ...)
	var $        = __webpack_require__(15)
	  , toObject = __webpack_require__(16)
	  , IObject  = __webpack_require__(18);

	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = __webpack_require__(20)(function(){
	  var a = Object.assign
	    , A = {}
	    , B = {}
	    , S = Symbol()
	    , K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function(k){ B[k] = k; });
	  return a({}, A)[S] != 7 || Object.keys(a({}, B)).join('') != K;
	}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
	  var T     = toObject(target)
	    , $$    = arguments
	    , $$len = $$.length
	    , index = 1
	    , getKeys    = $.getKeys
	    , getSymbols = $.getSymbols
	    , isEnum     = $.isEnum;
	  while($$len > index){
	    var S      = IObject($$[index++])
	      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
	      , length = keys.length
	      , j      = 0
	      , key;
	    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
	  }
	  return T;
	} : Object.assign;

/***/ },
/* 15 */
/***/ function(module, exports) {

	var $Object = Object;
	module.exports = {
	  create:     $Object.create,
	  getProto:   $Object.getPrototypeOf,
	  isEnum:     {}.propertyIsEnumerable,
	  getDesc:    $Object.getOwnPropertyDescriptor,
	  setDesc:    $Object.defineProperty,
	  setDescs:   $Object.defineProperties,
	  getKeys:    $Object.keys,
	  getNames:   $Object.getOwnPropertyNames,
	  getSymbols: $Object.getOwnPropertySymbols,
	  each:       [].forEach
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(17);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 17 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(19);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 19 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 21 */
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

	var _topojson = __webpack_require__(22);

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
/* 22 */
/***/ function(module, exports) {

	module.exports = topojson;

/***/ },
/* 23 */
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
	  displayName: "TeamMap",

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
	    var prettyNumber = (0, _d3.format)(",.0f");
	    var _props = this.props;
	    var name = _props.name;
	    var schoolPoint = _props.schoolPoint;
	    var roster = _props.roster;
	    var color = _props.color;
	    var mean = _props.mean;
	    var median = _props.median;
	    var meanRadius = _props.meanRadius;
	    var medianRadius = _props.medianRadius;

	    var prettyMean = prettyNumber(mean);
	    var prettyMedian = prettyNumber(median);
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
/* 24 */
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
	  displayName: "StateChart",

	  getDefaultProps: function getDefaultProps() {
	    return {
	      name: "",
	      states: [],
	      color: "#222",
	      width: 700,
	      height: 200,
	      margin: 30
	    };
	  },
	  render: function render() {
	    var _props = this.props;
	    var width = _props.width;
	    var height = _props.height;
	    var margin = _props.margin;
	    var name = _props.name;
	    var states = _props.states;
	    var color = _props.color;

	    // only draw states with > 1 person
	    var filteredStates = states.filter(function (s) {
	      return s.count > 1;
	    }).sort(function (a, b) {
	      return b.count - a.count;
	    });
	    var otherCount = 0;
	    states.forEach(function (s) {
	      if (s.count === 1) {
	        otherCount++;
	      }
	    });
	    filteredStates.push({
	      name: "Other",
	      count: otherCount
	    });

	    var maxCount = _d32["default"].max(states, function (ele) {
	      return ele.count;
	    }) || 0;
	    var yScale = _d32["default"].scale.linear().domain([0, maxCount]).range([height, 0]);
	    var xScale = _d32["default"].scale.ordinal().domain(filteredStates.map(function (s) {
	      return s.name;
	    })).rangeBands([0, width], 0.1);

	    return _react2["default"].createElement(
	      "svg",
	      { className: "state-bar-chart",
	        width: width + margin * 2,
	        height: height + margin * 2 },
	      _react2["default"].createElement(
	        "g",
	        { ref: "barChart",
	          transform: "translate(" + margin + "," + margin + ")" },
	        _react2["default"].createElement(AxisTicks, { ticks: filteredStates,
	          scale: xScale,
	          height: height }),
	        _react2["default"].createElement(Bars, { states: filteredStates,
	          xScale: xScale,
	          yScale: yScale,
	          height: height,
	          color: color }),
	        _react2["default"].createElement(BarTexts, { states: filteredStates,
	          xScale: xScale,
	          yScale: yScale })
	      )
	    );
	  },
	  drawChart: function drawChart(props) {

	    // draw the bars
	    var bars = svg.selectAll("rect.bar").data(filteredStates, function (bar) {
	      return bar.name;
	    });
	    bars.enter().append("rect").classed("bar", true);

	    bars.attr("x", function (d) {
	      return xScale(d.name);
	    }).attr("y", function (d) {
	      return yScale(d.count);
	    }).attr("height", function (d) {
	      return height - yScale(d.count);
	    }).attr("width", xScale.rangeBand()).style("fill", color);

	    bars.exit().remove();

	    var texts = svg.selectAll("text.count").data(filteredStates, function (bar) {
	      return bar.name;
	    });
	    texts.enter().append("text").classed("count", true);
	    texts.attr("x", function (d) {
	      return xScale(d.name) + xScale.rangeBand() / 2;
	    }).attr("y", function (d) {
	      return yScale(d.count) - 2;
	    }).text(function (d) {
	      return d.count;
	    });
	    texts.exit().remove();
	  }
	});

	var Bars = _react2["default"].createClass({
	  displayName: "Bars",

	  render: function render() {
	    var _props2 = this.props;
	    var states = _props2.states;
	    var xScale = _props2.xScale;
	    var yScale = _props2.yScale;
	    var height = _props2.height;
	    var color = _props2.color;

	    var bars = states.map(function (state, index) {
	      var x = xScale(state.name);
	      var y = yScale(state.count);
	      return _react2["default"].createElement("rect", { key: index,
	        x: x,
	        y: y,
	        height: height - y,
	        width: xScale.rangeBand() });
	    });
	    return _react2["default"].createElement(
	      "g",
	      { className: "bars",
	        fill: color },
	      bars
	    );
	  }
	});

	var BarTexts = _react2["default"].createClass({
	  displayName: "BarTexts",

	  render: function render() {
	    var _props3 = this.props;
	    var states = _props3.states;
	    var xScale = _props3.xScale;
	    var yScale = _props3.yScale;

	    var texts = states.map(function (state, index) {
	      return _react2["default"].createElement(
	        "text",
	        { key: index,
	          className: "count",
	          x: xScale(state.name) + xScale.rangeBand() / 2,
	          y: yScale(state.count) - 2,
	          text: state.count },
	        state.count
	      );
	    });
	    return _react2["default"].createElement(
	      "g",
	      { className: "texts" },
	      texts
	    );
	  }
	});

	// specific case: draws an x axis on the bottom of the chart
	// only renders ticks and text labels
	var AxisTicks = _react2["default"].createClass({
	  displayName: "AxisTicks",

	  render: function render() {
	    var _props4 = this.props;
	    var ticks = _props4.ticks;
	    var scale = _props4.scale;
	    var height = _props4.height;

	    var marks = ticks.map(function (tick, index) {
	      var xOffset = scale(tick.name) + scale.rangeBand() / 2;
	      return _react2["default"].createElement(
	        "g",
	        { key: index,
	          className: "tick",
	          transform: "translate(" + xOffset + ", 0)" },
	        _react2["default"].createElement("line", { y2: "6", x2: "0" }),
	        _react2["default"].createElement(
	          "text",
	          { dy: "0.715em", y: "9", x: "0" },
	          tick.name
	        )
	      );
	    });
	    return _react2["default"].createElement(
	      "g",
	      { className: "axis",
	        transform: "translate(0, " + height + ")" },
	      marks
	    );
	  }
	});
	module.exports = exports["default"];

/***/ },
/* 25 */
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