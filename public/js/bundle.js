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

	var _reactDom = __webpack_require__(2);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _d3 = __webpack_require__(3);

	var _d32 = _interopRequireDefault(_d3);

	var _queueAsync = __webpack_require__(4);

	var _queueAsync2 = _interopRequireDefault(_queueAsync);

	var _topojson = __webpack_require__(5);

	var _topojson2 = _interopRequireDefault(_topojson);

	var _componentsApp = __webpack_require__(6);

	var _componentsApp2 = _interopRequireDefault(_componentsApp);

	(0, _queueAsync2["default"])().defer(_d32["default"].json, "./data/us.json").defer(_d32["default"].json, "./data/conferences.json").await(function (error, usmap, conferences) {
	  if (error !== null) {
	    console.error(error);
	    return;
	  }

	  var width = 600;
	  var height = 400;
	  var margin = 15;
	  var scale = 800;
	  var map = {
	    features: _topojson2["default"].feature(usmap, usmap.objects.states).features,
	    projection: _d32["default"].geo.albersUsa().scale(scale).translate([width / 2, height / 2]),
	    height: height,
	    width: width,
	    margin: margin,
	    scale: scale
	  };

	  conferences.forEach(function (conference, index) {
	    conference.teams = setupTeams(conference.teams, map.projection);
	  });

	  _reactDom2["default"].render(React.createElement(_componentsApp2["default"], {
	    map: map,
	    conferences: conferences }), document.getElementById("content"));
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

	module.exports = ReactDOM;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = d3;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;(function() {
	  var slice = [].slice;

	  function queue(parallelism) {
	    var q,
	        tasks = [],
	        started = 0, // number of tasks that have been started (and perhaps finished)
	        active = 0, // number of tasks currently being executed (started but not finished)
	        remaining = 0, // number of tasks not yet finished
	        popping, // inside a synchronous task callback?
	        error = null,
	        await = noop,
	        all;

	    if (!parallelism) parallelism = Infinity;

	    function pop() {
	      while (popping = started < tasks.length && active < parallelism) {
	        var i = started++,
	            t = tasks[i],
	            a = slice.call(t, 1);
	        a.push(callback(i));
	        ++active;
	        t[0].apply(null, a);
	      }
	    }

	    function callback(i) {
	      return function(e, r) {
	        --active;
	        if (error != null) return;
	        if (e != null) {
	          error = e; // ignore new tasks and squelch active callbacks
	          started = remaining = NaN; // stop queued tasks from starting
	          notify();
	        } else {
	          tasks[i] = r;
	          if (--remaining) popping || pop();
	          else notify();
	        }
	      };
	    }

	    function notify() {
	      if (error != null) await(error);
	      else if (all) await(error, tasks);
	      else await.apply(null, [error].concat(tasks));
	    }

	    return q = {
	      defer: function() {
	        if (!error) {
	          tasks.push(arguments);
	          ++remaining;
	          pop();
	        }
	        return q;
	      },
	      await: function(f) {
	        await = f;
	        all = false;
	        if (!remaining) notify();
	        return q;
	      },
	      awaitAll: function(f) {
	        await = f;
	        all = true;
	        if (!remaining) notify();
	        return q;
	      }
	    };
	  }

	  function noop() {}

	  queue.version = "1.0.7";
	  if (true) !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return queue; }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  else if (typeof module === "object" && module.exports) module.exports = queue;
	  else this.queue = queue;
	})();


/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = topojson;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequireDefault = __webpack_require__(1)["default"];

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(7);

	var _react2 = _interopRequireDefault(_react);

	var _d3 = __webpack_require__(3);

	var _d32 = _interopRequireDefault(_d3);

	var _Team = __webpack_require__(8);

	var _Team2 = _interopRequireDefault(_Team);

	var _TeamSelect = __webpack_require__(26);

	var _TeamSelect2 = _interopRequireDefault(_TeamSelect);

	exports["default"] = _react2["default"].createClass({
	  displayName: "App",

	  getInitialState: function getInitialState() {
	    return {
	      cIndex: 0,
	      tIndex: 0
	    };
	  },
	  setConference: function setConference(index) {
	    // verify that index is valid, otherwise set it to 0
	    var cIndex = this.props.conferences[index] !== undefined ? index : 0;
	    this.setState({
	      cIndex: cIndex,
	      tIndex: 0
	    });
	  },
	  setTeam: function setTeam(index) {
	    // verify that index if valid, otherwise set it to 0
	    var tIndex = this.props.conferences[this.state.cIndex].teams[index] !== undefined ? index : 0;
	    this.setState({
	      tIndex: tIndex
	    });
	  },
	  render: function render() {
	    var _props = this.props;
	    var conferences = _props.conferences;
	    var map = _props.map;
	    var _state = this.state;
	    var cIndex = _state.cIndex;
	    var tIndex = _state.tIndex;

	    var team = this.props.conferences[cIndex].teams[tIndex];
	    return _react2["default"].createElement(
	      "div",
	      { className: "app" },
	      _react2["default"].createElement(_TeamSelect2["default"], { conferences: conferences,
	        conferenceIndex: cIndex,
	        teamIndex: tIndex,
	        setConference: this.setConference,
	        setTeam: this.setTeam }),
	      _react2["default"].createElement(_Team2["default"], { team: team,
	        map: map })
	    );
	  }
	});
	module.exports = exports["default"];

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _extends = __webpack_require__(9)["default"];

	var _interopRequireDefault = __webpack_require__(1)["default"];

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(7);

	var _react2 = _interopRequireDefault(_react);

	var _d3 = __webpack_require__(3);

	var _d32 = _interopRequireDefault(_d3);

	var _USMap = __webpack_require__(23);

	var _USMap2 = _interopRequireDefault(_USMap);

	var _TeamMap = __webpack_require__(24);

	var _TeamMap2 = _interopRequireDefault(_TeamMap);

	var _StateChart = __webpack_require__(25);

	var _StateChart2 = _interopRequireDefault(_StateChart);

	exports["default"] = _react2["default"].createClass({
	  displayName: "Team",

	  shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
	    return nextProps.team.name !== this.props.name;
	  },
	  getDefaultProps: function getDefaultProps() {
	    return {
	      team: {},
	      map: {}
	    };
	  },
	  render: function render() {
	    var _props = this.props;
	    var team = _props.team;
	    var map = _props.map;
	    var name = team.name;
	    var city = team.city;
	    var state = team.state;

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
	      _react2["default"].createElement(TeamStats, { map: map,
	        team: team })
	    );
	  }
	});

	var TeamStats = _react2["default"].createClass({
	  displayName: "TeamStats",

	  getDefaultProps: function getDefaultProps() {
	    return {
	      map: {},
	      team: {}
	    };
	  },
	  shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
	    return nextProps.team !== undefined && nextProps.team.name !== this.props.team.name;
	  },
	  _stateCounts: function _stateCounts() {
	    var roster = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

	    // figure out how many players there are per state
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
	    var prettyNumber = _d32["default"].format(",.0f");
	    var fPercent = _d32["default"].format(".2%");

	    var _props2 = this.props;
	    var team = _props2.team;
	    var map = _props2.map;
	    var width = map.width;
	    var height = map.height;
	    var margin = map.margin;
	    var projection = map.projection;
	    var mean = team.mean;
	    var median = team.median;
	    var roster = team.roster;
	    var state = team.state;
	    var colors = team.colors;

	    roster = roster || [];

	    var _stateCounts2 = this._stateCounts(roster);

	    var counts = _stateCounts2.counts;
	    var states = _stateCounts2.states;

	    var inState = counts[state] ? counts[state] : 0;
	    return _react2["default"].createElement(
	      "div",
	      { className: "team-info" },
	      _react2["default"].createElement(
	        "div",
	        { className: "state-counts" },
	        _react2["default"].createElement(_StateChart2["default"], { name: name,
	          states: states,
	          color: colors ? colors[0] : "#000",
	          width: 500,
	          height: 100 }),
	        _react2["default"].createElement(
	          "div",
	          null,
	          "Of the ",
	          _react2["default"].createElement(
	            "span",
	            { className: "number" },
	            roster.length
	          ),
	          " players on the team,",
	          " ",
	          _react2["default"].createElement(
	            "span",
	            { className: "number" },
	            fPercent(inState / roster.length)
	          ),
	          " play in their home state."
	        )
	      ),
	      _react2["default"].createElement(
	        "div",
	        { className: "city-distances" },
	        _react2["default"].createElement(
	          "div",
	          null,
	          "On average, a player's hometown is ",
	          _react2["default"].createElement(
	            "span",
	            { className: "number" },
	            prettyNumber(mean)
	          ),
	          " miles away from campus."
	        ),
	        _react2["default"].createElement(
	          "div",
	          null,
	          "50% of players come from within ",
	          _react2["default"].createElement(
	            "span",
	            { className: "number" },
	            prettyNumber(median)
	          ),
	          " miles of campus."
	        ),
	        _react2["default"].createElement(RosterSVG, _extends({ team: team
	        }, map))
	      )
	    );
	  }
	});

	var RosterSVG = _react2["default"].createClass({
	  displayName: "RosterSVG",

	  getDefaultProps: function getDefaultProps() {
	    return {
	      width: 600,
	      height: 400,
	      margin: 15,
	      team: {}
	    };
	  },
	  render: function render() {
	    var _props3 = this.props;
	    var width = _props3.width;
	    var height = _props3.height;
	    var margin = _props3.margin;
	    var projection = _props3.projection;
	    var features = _props3.features;
	    var team = _props3.team;

	    return _react2["default"].createElement(
	      "svg",
	      { xmlns: "http://www.w3.org/2000/svg",
	        width: width + margin * 2,
	        height: height + margin * 2 },
	      _react2["default"].createElement(
	        "g",
	        { translate: "transform(" + margin + "," + margin + ")" },
	        _react2["default"].createElement(_USMap2["default"], { projection: projection,
	          features: features,
	          active: team.state }),
	        _react2["default"].createElement(_TeamMap2["default"], team)
	      )
	    );
	  }
	});
	module.exports = exports["default"];

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _Object$assign = __webpack_require__(10)["default"];

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
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(11), __esModule: true };

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(12);
	module.exports = __webpack_require__(15).Object.assign;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $def = __webpack_require__(13);

	$def($def.S + $def.F, 'Object', {assign: __webpack_require__(16)});

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(14)
	  , core      = __webpack_require__(15)
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
/* 14 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 15 */
/***/ function(module, exports) {

	var core = module.exports = {version: '1.2.3'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.1 Object.assign(target, source, ...)
	var $        = __webpack_require__(17)
	  , toObject = __webpack_require__(18)
	  , IObject  = __webpack_require__(20);

	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = __webpack_require__(22)(function(){
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
/* 17 */
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
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(19);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 19 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(21);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 21 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequireDefault = __webpack_require__(1)["default"];

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(7);

	var _react2 = _interopRequireDefault(_react);

	var _d3 = __webpack_require__(3);

	var _d32 = _interopRequireDefault(_d3);

	exports["default"] = _react2["default"].createClass({
	  displayName: "USMap",

	  componentWillMount: function componentWillMount() {
	    this.setState({
	      path: _d32["default"].geo.path().projection(this.props.projection)
	    });
	  },
	  render: function render() {
	    var _this = this;

	    var _props = this.props;
	    var features = _props.features;
	    var active = _props.active;

	    var states = features.map(function (s, index) {
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
	    var _props2 = this.props;
	    var path = _props2.path;
	    var feature = _props2.feature;

	    return _react2["default"].createElement("path", { d: path(feature) });
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

	var _react = __webpack_require__(7);

	var _react2 = _interopRequireDefault(_react);

	var _d3 = __webpack_require__(3);

	exports["default"] = _react2["default"].createClass({
	  displayName: "TeamMap",

	  shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
	    return nextProps.name !== this.props.name;
	  },
	  getDefaultProps: function getDefaultProps() {
	    return {
	      name: "",
	      roster: [],
	      colors: ["#000"]
	    };
	  },
	  render: function render() {
	    var prettyNumber = (0, _d3.format)(",.0f");
	    var _props = this.props;
	    var name = _props.name;
	    var schoolPoint = _props.schoolPoint;
	    var roster = _props.roster;
	    var colors = _props.colors;
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
	        fill: colors.length >= 2 ? colors[1] : "#FFF",
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
	        fill: colors[0] },
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
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequireDefault = __webpack_require__(1)["default"];

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(7);

	var _react2 = _interopRequireDefault(_react);

	var _d3 = __webpack_require__(3);

	var _d32 = _interopRequireDefault(_d3);

	exports["default"] = _react2["default"].createClass({
	  displayName: "StateChart",

	  getDefaultProps: function getDefaultProps() {
	    return {
	      name: "",
	      states: [],
	      color: "#222",
	      width: 700,
	      height: 100,
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
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequireDefault = __webpack_require__(1)["default"];

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(7);

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