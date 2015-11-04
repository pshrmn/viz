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

	  var width = 400;
	  var height = 300;
	  var margin = 15;
	  var scale = 550;
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

	var _extends = __webpack_require__(7)["default"];

	var _interopRequireDefault = __webpack_require__(1)["default"];

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(21);

	var _react2 = _interopRequireDefault(_react);

	var _d3 = __webpack_require__(3);

	var _d32 = _interopRequireDefault(_d3);

	var _Selector = __webpack_require__(22);

	var _Selector2 = _interopRequireDefault(_Selector);

	var _Conference = __webpack_require__(23);

	var _Conference2 = _interopRequireDefault(_Conference);

	exports["default"] = _react2["default"].createClass({
	  displayName: "App",

	  getInitialState: function getInitialState() {
	    return {
	      index: 0
	    };
	  },
	  setConference: function setConference(index) {
	    // verify that index is valid, otherwise set it to 0
	    index = this.props.conferences[index] !== undefined ? index : 0;
	    this.setState({
	      index: index
	    });
	  },
	  render: function render() {
	    var _props = this.props;
	    var conferences = _props.conferences;
	    var map = _props.map;

	    var conference = this.props.conferences[this.state.index];
	    return _react2["default"].createElement(
	      "div",
	      { className: "app" },
	      _react2["default"].createElement(_Selector2["default"], { vals: conferences,
	        index: this.state.index,
	        setIndex: this.setConference }),
	      _react2["default"].createElement(_Conference2["default"], _extends({ map: map
	      }, conference))
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
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequireDefault = __webpack_require__(1)["default"];

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(21);

	var _react2 = _interopRequireDefault(_react);

	exports["default"] = _react2["default"].createClass({
	  displayName: "Selector",

	  updateIndex: function updateIndex(event) {
	    this.props.setIndex(event.target.value);
	  },
	  render: function render() {
	    var _props = this.props;
	    var vals = _props.vals;
	    var index = _props.index;

	    var options = vals.map(function (val, index) {
	      return _react2["default"].createElement(
	        "option",
	        { key: index, value: index },
	        val.name
	      );
	    });
	    return _react2["default"].createElement(
	      "select",
	      { onChange: this.updateIndex, value: index },
	      options
	    );
	  }
	});
	module.exports = exports["default"];

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _slicedToArray = __webpack_require__(24)["default"];

	var _interopRequireDefault = __webpack_require__(1)["default"];

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(21);

	var _react2 = _interopRequireDefault(_react);

	var _d3 = __webpack_require__(3);

	var _d32 = _interopRequireDefault(_d3);

	var _StateChart = __webpack_require__(56);

	var _StateChart2 = _interopRequireDefault(_StateChart);

	var _Selector = __webpack_require__(22);

	var _Selector2 = _interopRequireDefault(_Selector);

	var _Team = __webpack_require__(57);

	var _Team2 = _interopRequireDefault(_Team);

	exports["default"] = _react2["default"].createClass({
	  displayName: "Conference",

	  getInitialState: function getInitialState() {
	    return {
	      index: 0
	    };
	  },
	  shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
	    return nextState.index !== this.state.index || nextProps.name !== this.props.name;
	  },
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	    // reset the index when the conference is switched
	    this.setState({
	      index: 0
	    });
	  },
	  setTeam: function setTeam(index) {
	    index = index < this.props.teams.length ? index : 0;
	    this.setState({
	      index: index
	    });
	  },
	  render: function render() {
	    var _props = this.props;
	    var name = _props.name;
	    var teams = _props.teams;
	    var map = _props.map;

	    var team = teams[this.state.index];
	    return _react2["default"].createElement(
	      "div",
	      { className: "conference" },
	      _react2["default"].createElement(
	        "h2",
	        null,
	        name
	      ),
	      _react2["default"].createElement(ConferenceStats, { name: name,
	        teams: teams }),
	      _react2["default"].createElement(
	        "div",
	        null,
	        _react2["default"].createElement(
	          "h3",
	          null,
	          "Teams"
	        ),
	        _react2["default"].createElement(_Selector2["default"], { vals: teams,
	          index: this.state.index,
	          setIndex: this.setTeam })
	      ),
	      _react2["default"].createElement(_Team2["default"], { team: team,
	        map: map })
	    );
	  }
	});

	var ConferenceStats = _react2["default"].createClass({
	  displayName: "ConferenceStats",

	  render: function render() {
	    var prettyNumber = _d32["default"].format(",.1f");

	    var _props2 = this.props;
	    var name = _props2.name;
	    var teams = _props2.teams;

	    var counts = stateCount(teams);
	    var playerCount = teams.reduce(function (prev, curr) {
	      return prev + curr.roster.length;
	    }, 0);

	    var _d3$extent = _d32["default"].extent(teams, function (team) {
	      return team.roster.length;
	    });

	    var _d3$extent2 = _slicedToArray(_d3$extent, 2);

	    var minPlayers = _d3$extent2[0];
	    var maxPlayers = _d3$extent2[1];

	    var averagePlayerCount = prettyNumber(playerCount / teams.length);
	    return _react2["default"].createElement(
	      "div",
	      { className: "basics" },
	      _react2["default"].createElement(
	        "div",
	        null,
	        "There are ",
	        _react2["default"].createElement(
	          "span",
	          { className: "number" },
	          teams.length
	        ),
	        " teams in the ",
	        name,
	        " conference."
	      ),
	      _react2["default"].createElement(
	        "div",
	        null,
	        "On average, each team has ",
	        _react2["default"].createElement(
	          "span",
	          { className: "number" },
	          averagePlayerCount
	        ),
	        " players, with a maximum of ",
	        _react2["default"].createElement(
	          "span",
	          { className: "number" },
	          maxPlayers
	        ),
	        " and a minimum of ",
	        _react2["default"].createElement(
	          "span",
	          { className: "number" },
	          minPlayers
	        ),
	        "."
	      ),
	      _react2["default"].createElement(
	        "div",
	        null,
	        name,
	        " football players come from ",
	        _react2["default"].createElement(
	          "span",
	          { className: "number" },
	          counts.length
	        ),
	        " different states."
	      ),
	      _react2["default"].createElement(_StateChart2["default"], { name: name,
	        states: counts,
	        color: "#2059C5",
	        width: 700,
	        height: 100,
	        min: 10 })
	    );
	  }
	});

	function stateCount(teams) {
	  var counts = {};
	  teams.forEach(function (team) {
	    team.roster.forEach(function (player) {
	      var state = player.state;
	      if (counts[state]) {
	        counts[state]++;
	      } else {
	        counts[state] = 1;
	      }
	    });
	  });
	  var statesArray = [];
	  for (var key in counts) {
	    statesArray.push({
	      name: key,
	      count: counts[key]
	    });
	  }
	  return statesArray;
	}
	module.exports = exports["default"];

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _getIterator = __webpack_require__(25)["default"];

	var _isIterable = __webpack_require__(53)["default"];

	exports["default"] = (function () {
	  function sliceIterator(arr, i) {
	    var _arr = [];
	    var _n = true;
	    var _d = false;
	    var _e = undefined;

	    try {
	      for (var _i = _getIterator(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
	        _arr.push(_s.value);

	        if (i && _arr.length === i) break;
	      }
	    } catch (err) {
	      _d = true;
	      _e = err;
	    } finally {
	      try {
	        if (!_n && _i["return"]) _i["return"]();
	      } finally {
	        if (_d) throw _e;
	      }
	    }

	    return _arr;
	  }

	  return function (arr, i) {
	    if (Array.isArray(arr)) {
	      return arr;
	    } else if (_isIterable(Object(arr))) {
	      return sliceIterator(arr, i);
	    } else {
	      throw new TypeError("Invalid attempt to destructure non-iterable instance");
	    }
	  };
	})();

	exports.__esModule = true;

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(26), __esModule: true };

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(27);
	__webpack_require__(45);
	module.exports = __webpack_require__(48);

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(28);
	var Iterators = __webpack_require__(31);
	Iterators.NodeList = Iterators.HTMLCollection = Iterators.Array;

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var setUnscope = __webpack_require__(29)
	  , step       = __webpack_require__(30)
	  , Iterators  = __webpack_require__(31)
	  , toIObject  = __webpack_require__(32);

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	__webpack_require__(33)(Array, 'Array', function(iterated, kind){
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , kind  = this._k
	    , index = this._i++;
	  if(!O || index >= O.length){
	    this._t = undefined;
	    return step(1);
	  }
	  if(kind == 'keys'  )return step(0, index);
	  if(kind == 'values')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;

	setUnscope('keys');
	setUnscope('values');
	setUnscope('entries');

/***/ },
/* 29 */
/***/ function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ },
/* 30 */
/***/ function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ },
/* 31 */
/***/ function(module, exports) {

	module.exports = {};

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(18)
	  , defined = __webpack_require__(17);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY         = __webpack_require__(34)
	  , $def            = __webpack_require__(11)
	  , $redef          = __webpack_require__(35)
	  , hide            = __webpack_require__(36)
	  , has             = __webpack_require__(39)
	  , SYMBOL_ITERATOR = __webpack_require__(40)('iterator')
	  , Iterators       = __webpack_require__(31)
	  , BUGGY           = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
	  , FF_ITERATOR     = '@@iterator'
	  , KEYS            = 'keys'
	  , VALUES          = 'values';
	var returnThis = function(){ return this; };
	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCE){
	  __webpack_require__(43)(Constructor, NAME, next);
	  var createMethod = function(kind){
	    switch(kind){
	      case KEYS: return function keys(){ return new Constructor(this, kind); };
	      case VALUES: return function values(){ return new Constructor(this, kind); };
	    } return function entries(){ return new Constructor(this, kind); };
	  };
	  var TAG      = NAME + ' Iterator'
	    , proto    = Base.prototype
	    , _native  = proto[SYMBOL_ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , _default = _native || createMethod(DEFAULT)
	    , methods, key;
	  // Fix native
	  if(_native){
	    var IteratorPrototype = __webpack_require__(15).getProto(_default.call(new Base));
	    // Set @@toStringTag to native iterators
	    __webpack_require__(44)(IteratorPrototype, TAG, true);
	    // FF fix
	    if(!LIBRARY && has(proto, FF_ITERATOR))hide(IteratorPrototype, SYMBOL_ITERATOR, returnThis);
	  }
	  // Define iterator
	  if(!LIBRARY || FORCE)hide(proto, SYMBOL_ITERATOR, _default);
	  // Plug for library
	  Iterators[NAME] = _default;
	  Iterators[TAG]  = returnThis;
	  if(DEFAULT){
	    methods = {
	      values:  DEFAULT == VALUES ? _default : createMethod(VALUES),
	      keys:    IS_SET            ? _default : createMethod(KEYS),
	      entries: DEFAULT != VALUES ? _default : createMethod('entries')
	    };
	    if(FORCE)for(key in methods){
	      if(!(key in proto))$redef(proto, key, methods[key]);
	    } else $def($def.P + $def.F * BUGGY, NAME, methods);
	  }
	};

/***/ },
/* 34 */
/***/ function(module, exports) {

	module.exports = true;

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(36);

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var $          = __webpack_require__(15)
	  , createDesc = __webpack_require__(37);
	module.exports = __webpack_require__(38) ? function(object, key, value){
	  return $.setDesc(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 37 */
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(20)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 39 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var store  = __webpack_require__(41)('wks')
	  , Symbol = __webpack_require__(12).Symbol;
	module.exports = function(name){
	  return store[name] || (store[name] =
	    Symbol && Symbol[name] || (Symbol || __webpack_require__(42))('Symbol.' + name));
	};

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(12)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 42 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $ = __webpack_require__(15)
	  , IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(36)(IteratorPrototype, __webpack_require__(40)('iterator'), function(){ return this; });

	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = $.create(IteratorPrototype, {next: __webpack_require__(37)(1,next)});
	  __webpack_require__(44)(Constructor, NAME + ' Iterator');
	};

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	var def = __webpack_require__(15).setDesc
	  , has = __webpack_require__(39)
	  , TAG = __webpack_require__(40)('toStringTag');

	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(46)(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(33)(String, 'String', function(iterated){
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , index = this._i
	    , point;
	  if(index >= O.length)return {value: undefined, done: true};
	  point = $at(O, index);
	  this._i += point.length;
	  return {value: point, done: false};
	});

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	// true  -> String#at
	// false -> String#codePointAt
	var toInteger = __webpack_require__(47)
	  , defined   = __webpack_require__(17);
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String(defined(that))
	      , i = toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l
	      || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	        ? TO_STRING ? s.charAt(i) : a
	        : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 47 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	var anObject = __webpack_require__(49)
	  , get      = __webpack_require__(51);
	module.exports = __webpack_require__(13).getIterator = function(it){
	  var iterFn = get(it);
	  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
	  return anObject(iterFn.call(it));
	};

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(50);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 50 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	var classof   = __webpack_require__(52)
	  , ITERATOR  = __webpack_require__(40)('iterator')
	  , Iterators = __webpack_require__(31);
	module.exports = __webpack_require__(13).getIteratorMethod = function(it){
	  if(it != undefined)return it[ITERATOR]
	    || it['@@iterator']
	    || Iterators[classof(it)];
	};

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(19)
	  , TAG = __webpack_require__(40)('toStringTag')
	  // ES3 wrong here
	  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

	module.exports = function(it){
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T
	    // builtinTag case
	    : ARG ? cof(O)
	    // ES3 arguments fallback
	    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(54), __esModule: true };

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(27);
	__webpack_require__(45);
	module.exports = __webpack_require__(55);

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	var classof   = __webpack_require__(52)
	  , ITERATOR  = __webpack_require__(40)('iterator')
	  , Iterators = __webpack_require__(31);
	module.exports = __webpack_require__(13).isIterable = function(it){
	  var O = Object(it);
	  return ITERATOR in O
	    || '@@iterator' in O
	    || Iterators.hasOwnProperty(classof(O));
	};

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequireDefault = __webpack_require__(1)["default"];

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(21);

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
	      marginTop: 30,
	      marginRight: 5,
	      marginBottom: 30,
	      marginLeft: 5,
	      min: 1
	    };
	  },
	  render: function render() {
	    var _props = this.props;
	    var width = _props.width;
	    var height = _props.height;
	    var marginTop = _props.marginTop;
	    var marginRight = _props.marginRight;
	    var marginBottom = _props.marginBottom;
	    var marginLeft = _props.marginLeft;
	    var name = _props.name;
	    var states = _props.states;
	    var color = _props.color;
	    var min = _props.min;

	    var horizontalMargin = marginLeft + marginRight;
	    var verticalMargin = marginTop + marginBottom;

	    // only draw states with > 1 person
	    var filteredStates = states.filter(function (s) {
	      return s.count >= min;
	    }).sort(function (a, b) {
	      return b.count - a.count;
	    });
	    var otherCount = 0;
	    states.forEach(function (s) {
	      if (s.count < min) {
	        otherCount += s.count;
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
	        width: marginLeft + width + marginRight,
	        height: marginTop + height + marginBottom },
	      _react2["default"].createElement(
	        "g",
	        { ref: "barChart",
	          transform: "translate(" + marginLeft + "," + marginTop + ")" },
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
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _extends = __webpack_require__(7)["default"];

	var _interopRequireDefault = __webpack_require__(1)["default"];

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(21);

	var _react2 = _interopRequireDefault(_react);

	var _d3 = __webpack_require__(3);

	var _d32 = _interopRequireDefault(_d3);

	var _USMap = __webpack_require__(58);

	var _USMap2 = _interopRequireDefault(_USMap);

	var _TeamMap = __webpack_require__(59);

	var _TeamMap2 = _interopRequireDefault(_TeamMap);

	var _StateChart = __webpack_require__(56);

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
	      ),
	      _react2["default"].createElement(
	        "div",
	        { className: "state-counts" },
	        _react2["default"].createElement(_StateChart2["default"], { name: name,
	          states: states,
	          color: colors ? colors[0] : "#000",
	          width: 500,
	          height: 100,
	          min: 2 }),
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
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequireDefault = __webpack_require__(1)["default"];

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(21);

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
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequireDefault = __webpack_require__(1)["default"];

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(21);

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

/***/ }
/******/ ]);