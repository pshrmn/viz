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

	var _d = __webpack_require__(1);

	var _d2 = _interopRequireDefault(_d);

	var _planetData = __webpack_require__(2);

	var _helpers = __webpack_require__(3);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function bestRadius() {
	  return Math.min(window.innerHeight - 50, window.innerWidth - labelWidth, 800) / 2;
	}

	function distancePerPixel(planets, radius) {
	  return radius / planets.reduce(function (max, curr) {
	    return max > curr.distance ? max : curr.distance;
	  }, -Infinity);
	}

	var labelWidth = 200;
	var radius = bestRadius();
	var height = radius * 2;
	var width = radius * 2 + labelWidth;

	var pixelLength = distancePerPixel(_planetData.planets, radius - 25);
	_planetData.planets.forEach(function (p, i) {
	  // normalize the distance to the size of the svg
	  p.normDistance = p.distance * pixelLength;
	  p.orbits = 0;
	});

	// functions used to draw the radius of the planets orbit
	var offset = (radius - 25) / _planetData.planets.length;
	var planetOffsets = [{
	  label: "By Distance",
	  fn: function fn(d, i) {
	    return d.normDistance;
	  }
	}, {
	  label: "By Position",
	  fn: function fn(d, i) {
	    return 25 + i * offset;
	  }
	}];
	var activeOffset = 0;
	var offsetFunction = planetOffsets[activeOffset].fn;

	var solarSystem = _d2.default.select("#solar-system");

	var controls = solarSystem.append("div").classed({ "controls": true });

	var offsetControl = controls.append("div").selectAll("label").data(planetOffsets).enter().append("label").text(function (d) {
	  return d.label;
	}).append("input").attr("type", "radio").attr("name", "offset").property("checked", function (d, i) {
	  return i === activeOffset;
	}).on("change", function (d, i) {
	  activeOffset = i;
	  offsetFunction = d.fn;
	  redraw(radius);
	});

	// create the SVG
	var svg = solarSystem.append("svg").attr("width", width).attr("height", height);
	var holder = svg.append("g").attr("transform", "translate(" + radius + "," + radius + ")");

	// create the arcs which depict the orbital path of the planets
	var arcs = holder.append("g").classed({ "arcs": true }).selectAll("circle.arc").data(_planetData.planets).enter().append("circle").classed({ "arc": true }).attr("r", offsetFunction);

	// create the labels
	var labelSize = radius / _planetData.planets.length;
	var labels = holder.append("g").classed({ "labels": true }).selectAll("g.label").data(_planetData.planets).enter().append("g").classed({ "label": true }).attr("transform", function (d, i) {
	  var y = i * labelSize;
	  return "translate(" + radius + ", " + -1 * y + ")";
	});

	var labelMarkers = labels.append("path").attr("d", function (d, i) {
	  var y = i * labelSize;
	  var diff = y - offsetFunction(d, i);
	  return "M 0,0 L -20," + diff + " L " + -radius + "," + diff;
	});

	var descriptions = labels.append("text").attr("dy", 5).text(function (d) {
	  return d.name + " " + d.orbits;
	});

	// the starting line
	holder.append("line").classed({ "meridian": true }).attr("x1", 0).attr("x2", 0).attr("y1", 0).attr("y2", -radius);

	var sun = holder.append("circle").classed({ "sun": true }).attr("r", 4);

	// create the planets
	var planetCircles = holder.append("g").classed({ "planets": true }).selectAll("circle.planet").data(_planetData.planets).enter().append("circle").classed({ "planet": true }).attr("r", 3).attr("transform", function (d, i) {
	  return "translate(0, " + -1 * offsetFunction(d, i) + ")";
	});

	// the animation callback
	var start = null;
	var period = 3650;
	function step(timestamp) {
	  if (start === null) {
	    start = timestamp;
	  }
	  var diff = timestamp - start;

	  planetCircles.attr("transform", function (d, i) {
	    var rotate = 360 * (diff / (period * d.period)) % 360;
	    return "rotate(" + -rotate + ")translate(0, " + -1 * offsetFunction(d, i) + ")";
	  }).each(function (d, i) {
	    d.orbits = Math.floor(diff / (period * d.period));
	  });

	  descriptions.text(function (d) {
	    return d.name + " " + d.orbits;
	  });

	  window.requestAnimationFrame(step);
	}

	var redraw = function redraw(radius) {
	  height = radius * 2;
	  width = radius * 2 + labelWidth;
	  offset = (radius - 25) / _planetData.planets.length;
	  labelSize = radius / _planetData.planets.length;

	  // resize the SVG
	  svg.attr("width", width).attr("height", height);
	  holder.attr("transform", "translate(" + radius + "," + radius + ")");

	  // recalculate the normalized distance for each planet (translation will
	  // be handled in the step function)
	  var pixelLength = distancePerPixel(_planetData.planets, radius - 25);
	  _planetData.planets.forEach(function (p, i) {
	    // normalize the distance to the size of the svg
	    p.normDistance = p.distance * pixelLength;
	  });

	  // change radius of planets based on radius of svg
	  var planetRadius = radius > 500 ? 3 : 2;
	  planetCircles.attr("r", planetRadius);
	  sun.attr("r", radius > 500 ? 4 : 2);

	  // resize the arcs
	  arcs.attr("r", offsetFunction);

	  // translate the labels
	  labels.attr("transform", function (d, i) {
	    var y = i * labelSize;
	    return "translate(" + radius + ", " + -1 * y + ")";
	  });
	  labelMarkers.attr("d", function (d, i) {
	    var y = i * labelSize;
	    var diff = y - offsetFunction(d, i);
	    return "M 0,0 L -20," + diff + " L " + -radius + "," + diff;
	  });
	};

	// calculate the new dimensions of the SVG then redraw
	var resize = (0, _helpers.debounce)(function () {
	  radius = bestRadius();
	  if (radius < 0) {
	    return;
	  }
	  redraw(radius);
	}, 250);

	window.requestAnimationFrame(step);
	window.onresize = resize;

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = d3;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var planets = exports.planets = [{
	  name: "Mercury",
	  radius: 2440,
	  period: 0.240846,
	  distance: 57
	}, {
	  name: "Venus",
	  radius: 6052,
	  period: 0.615,
	  distance: 108
	}, {
	  name: "Earth",
	  radius: 6378,
	  period: 1,
	  distance: 150
	}, {
	  name: "Mars",
	  radius: 3397,
	  period: 1.881,
	  distance: 228
	}, {
	  name: "Jupiter",
	  radius: 71492,
	  period: 11.86,
	  distance: 779
	}, {
	  name: "Saturn",
	  radius: 60268,
	  period: 29.46,
	  distance: 1430
	}, {
	  name: "Uranus",
	  radius: 25559,
	  period: 84.01,
	  distance: 2880
	}, {
	  name: "Neptune",
	  radius: 24766,
	  period: 164.8,
	  distance: 4500
	}];

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.debounce = debounce;
	function debounce(func, wait, immediate) {
	  var timeout = undefined;
	  return function () {
	    var _this = this,
	        _arguments = arguments;

	    var later = function later() {
	      timeout = null;
	      if (!immediate) {
	        func.apply(_this, _arguments);
	      }
	    };
	    var callNow = immediate && !timeout;
	    clearTimeout(timeout);
	    timeout = setTimeout(later, wait);
	    if (callNow) {
	      func.apply(this, arguments);
	    }
	  };
	};

/***/ }
/******/ ]);