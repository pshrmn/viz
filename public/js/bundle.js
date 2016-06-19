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

	'use strict';

	var _d = __webpack_require__(1);

	var _d2 = _interopRequireDefault(_d);

	var _date = __webpack_require__(2);

	var _cast = __webpack_require__(3);

	var _roles = __webpack_require__(4);

	var _gender = __webpack_require__(5);

	var _gender2 = _interopRequireDefault(_gender);

	var _seasonCastMemberGraphics = __webpack_require__(8);

	var _seasonCastMemberGraphics2 = _interopRequireDefault(_seasonCastMemberGraphics);

	var _startingAgeGraphics = __webpack_require__(18);

	var _startingAgeGraphics2 = _interopRequireDefault(_startingAgeGraphics);

	var _endingAgeGraphics = __webpack_require__(24);

	var _endingAgeGraphics2 = _interopRequireDefault(_endingAgeGraphics);

	var _startingAndEndingAges = __webpack_require__(29);

	var _startingAndEndingAges2 = _interopRequireDefault(_startingAndEndingAges);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_d2.default.json('/stats.json', function (error, data) {
	  if (error) {
	    console.error(error);
	    return;
	  }

	  /*
	   * castMembers:
	   * name - cast member's name
	   * credits - number of episodes credited in
	   * first_episode - the date of the cast member's first credited appearance
	   * last_episode - the date of the cast member's last credited appearance
	   * start_age - the number of days old the cast member was on their first credited appearance
	   * end_age - the number of days old the cast member was on their last credited appearance
	   * repertory - the seasons during which the cast member was a repertory player
	   * featured - the seasons during which the cast member was a featured player
	   *
	   * seasons:
	   * season - which season
	   * episodes - the number of episodes that season
	   * total_cast - the total number of cast members that season
	   * male - the total number of male cast members that season
	   * female - the total number of female cast members that season
	   * repertory - an object with the counts of male/female actors who were repertory cast members
	   * featured - an object with the counts of male/female actors who were featured players
	   */
	  var castMembers = data.cast_members;
	  var seasons = data.seasons;
	  // process data

	  castMembers.forEach(function (cm) {
	    cm.total_seasons = cm.repertory.length + cm.featured.length;
	    if (cm.first_episode) {
	      cm.first_episode = (0, _date.parseDate)(cm.first_episode);
	    }
	    if (cm.last_episode) {
	      cm.last_episode = (0, _date.parseDate)(cm.last_episode);
	    }
	    cm.firstSeason = cm.featured.length ? cm.featured[0] : cm.repertory[0];
	    cm.lastSeason = cm.repertory.length ? cm.repertory[cm.repertory.length - 1] : cm.featured[cm.featured.length - 1];
	  });

	  var genders = (0, _gender2.default)(castMembers);
	  /*
	  const roles = roleCounts(castMembers);
	  console.log('Role Counts:', roles);
	    console.log(newCastPerSeason(castMembers, seasons.length));
	  console.log(lastSeasonForCastMembers(castMembers, seasons.length));
	  console.log(seasonsByRole(castMembers));
	  */

	  (0, _seasonCastMemberGraphics2.default)(seasons);
	  (0, _startingAgeGraphics2.default)(genders);
	  (0, _endingAgeGraphics2.default)(genders);

	  (0, _startingAndEndingAges2.default)(genders, '#start-and-end');
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = d3;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	exports.parseDate = parseDate;
	exports.daysToYears = daysToYears;
	/*
	 * take a string of form YYYY-MM-DD and return a new Date object
	 * months are 0 based, so subtract 1 from it to get the correct month
	 */
	function parseDate(dateString) {
	  var _dateString$split$map = dateString.split('-').map(function (e) {
	    return parseInt(e, 10);
	  });

	  var _dateString$split$map2 = _slicedToArray(_dateString$split$map, 3);

	  var year = _dateString$split$map2[0];
	  var month = _dateString$split$map2[1];
	  var day = _dateString$split$map2[2];

	  return new Date(year, month - 1, day);
	}

	/*
	 * given a number of days, convert to Gregorian years
	 */
	function daysToYears(days) {
	  return days / 365.2425;
	}

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.newCastPerSeason = newCastPerSeason;
	exports.lastSeasonForCastMembers = lastSeasonForCastMembers;
	exports.startingAges = startingAges;
	exports.endingAges = endingAges;
	function newCastPerSeason(castMembers, seasonCount) {
	  var seasonCounts = Array.from(new Array(seasonCount)).fill(0);
	  castMembers.forEach(function (cm) {
	    var firstSeason = cm.firstSeason;

	    if (firstSeason !== null) {
	      seasonCounts[firstSeason - 1]++;
	    }
	  });
	  return seasonCounts;
	}

	function lastSeasonForCastMembers(castMembers, seasonCount) {
	  // don't include the most recent season
	  var seasonCounts = Array.from(new Array(seasonCount - 1)).fill(0);
	  castMembers.forEach(function (cm) {
	    var lastSeason = cm.lastSeason;

	    if (lastSeason !== null && lastSeason !== seasonCount) {
	      seasonCounts[lastSeason - 1]++;
	    }
	  });
	  return seasonCounts;
	}

	function startingAges(castMembers) {
	  return castMembers.filter(function (cm) {
	    return cm.start_age !== undefined;
	  }).map(function (cm) {
	    return {
	      name: cm.name,
	      age: cm.start_age
	    };
	  });
	}

	function endingAges(castMembers) {
	  return castMembers.filter(function (cm) {
	    return cm.end_age !== undefined;
	  }).map(function (cm) {
	    return {
	      name: cm.name,
	      age: cm.end_age
	    };
	  });
	}

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.roleCounts = roleCounts;
	exports.seasonsByRole = seasonsByRole;
	function roleCounts(castMembers) {
	  return castMembers.reduce(function (acc, cm) {
	    var repertory = cm.repertory;
	    var featured = cm.featured;

	    if (repertory.length && featured.length) {
	      acc.both++;
	    } else if (repertory.length) {
	      acc.repertory++;
	    } else if (featured.length) {
	      acc.featured++;
	    }
	    return acc;
	  }, { both: 0, repertory: 0, featured: 0 });
	}

	function seasonsByRole(castMembers) {
	  return castMembers.map(function (cm) {
	    return {
	      name: cm.name,
	      repertory: cm.repertory.length,
	      featured: cm.featured.length,
	      firstSeason: cm.featured.length ? cm.featured[0] : cm.repertory[0]
	    };
	  }).sort(function (a, b) {
	    return a.firstSeason - b.firstSeason;
	  });
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = genderStats;

	var _filters = __webpack_require__(6);

	var _average = __webpack_require__(7);

	var _date = __webpack_require__(2);

	function genderStats(castMembers) {
	  var maleCastMembers = (0, _filters.male)(castMembers);
	  var femaleCastMembers = (0, _filters.female)(castMembers);
	  return {
	    male: groupStats(maleCastMembers),
	    female: groupStats(femaleCastMembers),
	    all: groupStats(castMembers)
	  };
	}

	function groupStats(castMembers) {
	  var youngest_start = null;
	  var oldest_start = null;
	  var youngest_end = null;
	  var oldest_end = null;
	  castMembers.forEach(function (cm) {
	    if (cm.start_age) {
	      if (youngest_start === null || cm.start_age < youngest_start.start_age) {
	        youngest_start = cm;
	      }
	      if (oldest_start === null || cm.start_age > oldest_start.start_age) {
	        oldest_start = cm;
	      }
	    }
	    if (cm.end_age) {
	      if (youngest_end === null || cm.end_age < youngest_end.end_age) {
	        youngest_end = cm;
	      }
	      if (oldest_end === null || cm.end_age > oldest_end.end_age) {
	        oldest_end = cm;
	      }
	    }
	  });

	  var meanStart = (0, _average.meanProperty)(castMembers, 'start_age');
	  var meanEnd = (0, _average.meanProperty)(castMembers, 'end_age');
	  var meanSeasons = (0, _average.meanProperty)(castMembers, 'total_seasons');

	  return {
	    start: {
	      median: (0, _date.daysToYears)((0, _average.medianProperty)(castMembers, 'start_age')),
	      mean: (0, _date.daysToYears)(meanStart),
	      standardDev: (0, _date.daysToYears)((0, _average.standardDeviation)(castMembers, 'start_age', meanStart)),
	      youngest: youngest_start,
	      oldest: oldest_start,
	      ages: groupedAges(castMembers.filter(function (cm) {
	        return cm.start_age !== undefined;
	      }).map(function (cm) {
	        return (0, _date.daysToYears)(cm.start_age);
	      }))
	    },
	    end: {
	      median: (0, _date.daysToYears)((0, _average.medianProperty)(castMembers, 'end_age')),
	      mean: (0, _date.daysToYears)(meanEnd),
	      standardDev: (0, _date.daysToYears)((0, _average.standardDeviation)(castMembers, 'start_age', meanEnd)),
	      youngest: youngest_end,
	      oldest: oldest_end,
	      ages: groupedAges(castMembers.filter(function (cm) {
	        return cm.end_age !== undefined;
	      }).map(function (cm) {
	        return (0, _date.daysToYears)(cm.end_age);
	      }))
	    },
	    medianSeasons: (0, _average.medianProperty)(castMembers, 'total_seasons'),
	    meanSeasons: meanSeasons,
	    standardDevSeasons: (0, _average.standardDeviation)(castMembers, 'total_seasons', meanSeasons),
	    count: castMembers.length
	  };
	}

	function groupedAges(ages) {
	  var wholeAges = {};
	  ages.forEach(function (age) {
	    var whole = Math.floor(age);
	    if (wholeAges[whole] === undefined) {
	      wholeAges[whole] = 1;
	    } else {
	      wholeAges[whole]++;
	    }
	  });
	  var years = Object.keys(wholeAges).map(function (a) {
	    return parseInt(a, 10);
	  });
	  var min = Math.min.apply(null, years);
	  var max = Math.max.apply(null, years);
	  var length = max - min + 1;
	  var agesArray = Array.from(new Array(length)).map(function (u, index) {
	    var trueYear = index + min;
	    return wholeAges[trueYear] === undefined ? 0 : wholeAges[trueYear];
	  });
	  return {
	    offset: min,
	    ages: agesArray
	  };
	}

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.onlyRepertory = onlyRepertory;
	exports.onlyFeatured = onlyFeatured;
	exports.bothRoles = bothRoles;
	exports.male = male;
	exports.female = female;
	function onlyRepertory(castMembers) {
	  return castMembers.filter(function (cm) {
	    return cm.repertory.length && !cm.featured.length;
	  });
	}

	function onlyFeatured(castMembers) {
	  return castMembers.filter(function (cm) {
	    return !cm.repertory.length && cm.featured.length;
	  });
	}

	function bothRoles(castMembers) {
	  return castMembers.filter(function (cm) {
	    return cm.repertory.length && cm.featured.length;
	  });
	}

	function male(castMembers) {
	  return castMembers.filter(function (cm) {
	    return cm.gender === 'male';
	  });
	}

	function female(castMembers) {
	  return castMembers.filter(function (cm) {
	    return cm.gender === 'female';
	  });
	}

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.meanProperty = meanProperty;
	exports.medianProperty = medianProperty;
	exports.standardDeviation = standardDeviation;
	/* 
	 * return the mean value of a property across the data. Ignores
	 * datum that do not have the property.
	 */
	function meanProperty(data, property) {
	  var total = data.reduce(function (acc, d) {
	    if (d[property] === undefined) {
	      return acc;
	    }
	    acc.total += d[property];
	    acc.count++;
	    return acc;
	  }, { total: 0, count: 0 });
	  return total.total / total.count;
	}

	/*
	 * return the median value of a property across the data. Ignores
	 * datum that do not have the property. Can provide a sorting function
	 * if the default one (a simple subtraction on the targeted property)
	 * will not suffice.
	 */
	function medianProperty(data, property, cmp) {
	  if (cmp == undefined) {
	    cmp = function cmp(a, b) {
	      return b[property] - a[property];
	    };
	  }
	  var sortedData = data.filter(function (datum) {
	    return datum[property] !== undefined;
	  }).sort(cmp);
	  var half = sortedData.length / 2;
	  if (sortedData.length % 2 === 0) {
	    // average the two points
	    return (sortedData[half - 1][property] + sortedData[half][property]) / 2;
	  } else {
	    // take the mid point
	    return sortedData[Math.floor(half)][property];
	  }
	}

	function standardDeviation(data, property, mean) {
	  var total = data.reduce(function (acc, d) {
	    if (d[property] === undefined) {
	      return acc;
	    }
	    acc.total += Math.pow(d[property] - mean, 2);
	    acc.count++;
	    return acc;
	  }, { total: 0, count: 0 });
	  return Math.sqrt(total.total / total.count, 2);
	}

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = render;

	var _seasonCastMembers = __webpack_require__(9);

	var _seasonCastMembers2 = _interopRequireDefault(_seasonCastMembers);

	var _groupedSeasonGenders = __webpack_require__(15);

	var _groupedSeasonGenders2 = _interopRequireDefault(_groupedSeasonGenders);

	var _seasonGenderPercents = __webpack_require__(16);

	var _seasonGenderPercents2 = _interopRequireDefault(_seasonGenderPercents);

	var _seasonRolePercents = __webpack_require__(17);

	var _seasonRolePercents2 = _interopRequireDefault(_seasonRolePercents);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function render(seasons) {
	  (0, _seasonCastMembers2.default)(seasons, '#season-casts');
	  (0, _groupedSeasonGenders2.default)(seasons, '#season-genders');
	  (0, _seasonGenderPercents2.default)(seasons, '#season-percents');
	  (0, _seasonRolePercents2.default)(seasons, '#season-roles');
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = chartCasts;

	var _base = __webpack_require__(10);

	var _axis = __webpack_require__(11);

	var _addons = __webpack_require__(12);

	var _round = __webpack_require__(13);

	var _average = __webpack_require__(7);

	var _colors = __webpack_require__(14);

	function chartCasts(seasons, holderID) {
	  // normalize the genders to cover the same time frame
	  var tickValues = seasons.map(function (s) {
	    return s.season;
	  });

	  var base = (0, _base.chartBase)({
	    main: { width: 750, height: 300 },
	    left: { width: 50 },
	    bottom: { height: 50 },
	    top: { height: 30 },
	    right: { width: 100 }
	  }, holderID);

	  var seasonScale = d3.scale.ordinal().domain(tickValues).rangeRoundBands([0, base.bottom.width], 0.1);

	  var yMax = (0, _round.roundUp)(d3.max(seasons, function (s) {
	    return s.total_cast;
	  }), 5);
	  var yScale = d3.scale.linear().domain([0, yMax]).range([base.main.height, 0]);

	  var xAxis = d3.svg.axis().scale(seasonScale).orient('bottom').tickValues(tickValues).outerTickSize(0);

	  var yAxis = d3.svg.axis().scale(yScale).ticks(10).orient('left');

	  var yGrid = d3.svg.axis().scale(yScale).orient('right').tickSize(base.main.width).ticks(10).tickFormat('').outerTickSize(0);

	  (0, _axis.drawAxis)(base.bottom, xAxis, 'top');
	  (0, _axis.drawAxis)(base.left, yAxis, 'right');
	  (0, _axis.drawAxis)(base.main, yGrid, 'left');

	  var bandWidth = seasonScale.rangeBand();

	  // create a group for every age
	  base.main.element.selectAll('rect').data(seasons).enter().append('rect').attr('width', bandWidth).attr('x', function (d) {
	    return seasonScale(d.season);
	  }).attr('y', function (d) {
	    return yScale(d.total_cast);
	  }).attr('height', function (d) {
	    return base.main.height - yScale(d.total_cast);
	  }).style('fill', _colors.green);

	  (0, _addons.addTitle)(base.top, 'Cast Members Per Season');

	  base.bottom.element.append('text').text('Season').classed('centered', true).attr('transform', 'translate(' + base.bottom.width / 2 + ', ' + (base.bottom.height - 5) + ')');

	  var meanCount = (0, _average.meanProperty)(seasons, 'total_cast');
	  var meanLine = base.main.element.append('g').attr('transform', 'translate(0, ' + yScale(meanCount) + ')').classed('mean', true);

	  meanLine.append('line').attr('x1', 0).attr('x2', base.main.width).attr('y1', 0).attr('y2', 0);
	  meanLine.append('text').text('Mean = ' + (0, _round.roundFloat)(meanCount, 1)).attr('x', 3).attr('y', -3);
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.chartBase = chartBase;

	var _d = __webpack_require__(1);

	var _d2 = _interopRequireDefault(_d);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*
	 * A chart is made up of five sections, the first being the main area
	 * and the other four being the top, right, bottom, and left sections.
	 * The main section is where the actual chart is displayed. The other
	 * sections are useful for placing axes, labels, and legends. The main
	 * section should have both a width and a height. The vertical sections
	 * (top and bottom) should have heights. The horizontal sections (right
	 * and left) should have widths. All of those values should be integers.
	 *
	 * the main section is required, while default values will be used for
	 * the other sections if they are not provided.
	 *
	 *        ---------------------------------------
	 *        |                TOP                  |
	 *    ----+-------------------------------------+----
	 *    |   |                                     |   |
	 *    |   |                                     |   |
	 *    | L |                                     | R |
	 *    | E |                MAIN                 | I |
	 *    | F |                                     | G |
	 *    | T |                                     | H |
	 *    |   |                                     | T |
	 *    |   |                                     |   |
	 *    ----+-------------------------------------+----
	 *        |               BOTTOM                |
	 *        ---------------------------------------
	 *
	 * This will return an object for each section that is provided. If a section
	 * is not provided, that value will be null. The object for each section has
	 * three property, element (a d3-selected DOM element), width, and height.
	 */
	function chartBase(sections, holderID) {
	  var main = sections.main;
	  var _sections$top = sections.top;
	  var top = _sections$top === undefined ? { height: 0 } : _sections$top;
	  var _sections$right = sections.right;
	  var right = _sections$right === undefined ? { width: 0 } : _sections$right;
	  var _sections$bottom = sections.bottom;
	  var bottom = _sections$bottom === undefined ? { height: 0 } : _sections$bottom;
	  var _sections$left = sections.left;
	  var left = _sections$left === undefined ? { width: 0 } : _sections$left;

	  if (main === undefined || main.width === undefined || main.height === undefined) {
	    throw new Error('sections.main with width and height is required, received: ' + JSON.stringify(sections));
	  }

	  var totalWidth = left.width + main.width + right.width;
	  var totalHeight = top.height + main.height + bottom.height;

	  // everything should be placed in the sections, so this isn't being returned
	  // but if a reason comes up where it should, it's an easy fix
	  var svg = _d2.default.select(holderID).append('svg').attr('height', totalHeight).attr('width', totalWidth).classed('chart', true);

	  return {
	    main: {
	      element: svg.append('g').classed('main-section', true).attr('transform', 'translate(' + left.width + ',' + top.height + ')'),
	      width: main.width,
	      height: main.height
	    },
	    top: top.height === 0 ? null : {
	      element: svg.append('g').classed('top-section', true).attr('transform', 'translate(' + left.width + ',0)'),
	      width: main.width,
	      height: top.height
	    },
	    right: right.width === 0 ? null : {
	      element: svg.append('g').classed('right-section', true).attr('transform', 'translate(' + (left.width + main.width) + ',' + top.height + ')'),
	      width: right.width,
	      height: main.height
	    },
	    bottom: bottom.height === 0 ? null : {
	      element: svg.append('g').classed('bottom-section', true).attr('transform', 'translate(' + left.width + ',' + (top.height + main.height) + ')'),
	      width: main.width,
	      height: bottom.height
	    },
	    left: left.width === 0 ? null : {
	      element: svg.append('g').classed('left-section', true).attr('transform', 'translate(0,' + top.height + ')'),
	      width: left.width,
	      height: main.height
	    }
	  };
	}

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.drawAxis = drawAxis;

	var _d = __webpack_require__(1);

	var _d2 = _interopRequireDefault(_d);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*
	 * add an axis to a chart. This should be placed into one of the
	 * side sections (top, right, bottom, left);
	 *
	 * @section - the section object with the element to append the axis to
	 * @axis - the d3 axis to be drawn
	 * @side - which part of the section the axis should be pushed up against.
	 *   This will typically be the opposite of the axis's orient
	 *   (e.g., left oriented ticks should be on the right side of their section)
	 *    'top' - horizontal axis with ticks above the line
	 *    'bottom' - horizontal axis with ticks below the line
	 *    'left' - vertical axis with ticks to the left of the line
	 *    'right' - vertical axis with ticks to the right of the line
	 *
	 * returns the 'g' element that holds the axis
	 */
	function drawAxis(section, axis, side) {
	  var element = section.element;
	  var width = section.width;
	  var height = section.height;


	  var classes = ['axis', side === 'top' || side === 'bottom' ? 'x' : 'y'];

	  var left = 0;
	  var top = 0;
	  if (side === 'bottom') {
	    top = height;
	  } else if (side === 'right') {
	    left = width;
	  }
	  var transform = 'translate(' + left + ',' + top + ')';

	  return element.append('g').classed(classes.join(' '), true).attr('transform', transform).call(axis);
	}

/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.addTitle = addTitle;
	exports.verticalLegend = verticalLegend;
	exports.horizontalLegend = horizontalLegend;
	function addTitle(section, text) {
	  var element = section.element;
	  var width = section.width;
	  var height = section.height;

	  element.append('text').classed('title centered', true).text(text).attr('transform', 'translate(' + width / 2 + ', ' + height / 2 + ')');
	}

	/*
	 * add a vertical (stacked) legend to the specified @section
	 * @keys is an array of keys to draw in the legend. Each one should specify
	 * its text value and what color it is associated with in the chart.
	 * @options can be provided to configure the layout of the legend. These include:
	 *    offset - provide a top and left amount to translate the legend 'g' away
	 *             from the default position in the top left corner (0,0)
	 *    padding - the amount of padding around each key
	 */
	function verticalLegend(section, keys) {
	  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	  var element = section.element;
	  var offset = options.offset;
	  var _options$padding = options.padding;
	  var padding = _options$padding === undefined ? 0 : _options$padding;

	  var legend = element.append('g').classed('legend', true);

	  if (offset !== undefined) {
	    var _options$offset = options.offset;
	    var _options$offset$left = _options$offset.left;
	    var left = _options$offset$left === undefined ? 0 : _options$offset$left;
	    var _options$offset$top = _options$offset.top;
	    var top = _options$offset$top === undefined ? 0 : _options$offset$top;

	    legend.attr('transform', 'translate(' + left + ',' + top + ')');
	  }

	  var yOffset = 0;
	  keys.forEach(function (k, i) {
	    var key = legendKey(k.text, k.color, 0, yOffset, legend);
	    var bbox = key.node().getBBox();
	    yOffset += bbox.height + padding;
	  });
	}

	/*
	 * same as verticalLegend, but horizontal instead of vertical
	 */
	function horizontalLegend(section, keys) {
	  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	  var element = section.element;
	  var offset = options.offset;
	  var _options$padding2 = options.padding;
	  var padding = _options$padding2 === undefined ? 0 : _options$padding2;

	  var legend = element.append('g').classed('legend', true);

	  if (offset !== undefined) {
	    var _options$offset2 = options.offset;
	    var _options$offset2$left = _options$offset2.left;
	    var left = _options$offset2$left === undefined ? 0 : _options$offset2$left;
	    var _options$offset2$top = _options$offset2.top;
	    var top = _options$offset2$top === undefined ? 0 : _options$offset2$top;

	    legend.attr('transform', 'translate(' + left + ',' + top + ')');
	  }

	  var xOffset = 0;
	  keys.forEach(function (k, i) {
	    var key = legendKey(k.text, k.color, xOffset, 0, legend);
	    var bbox = key.node().getBBox();
	    xOffset += bbox.width + padding;
	  });
	}

	function legendKey(text, color, x, y, parent) {
	  var key = parent.append('g').classed('key', true).attr('transform', 'translate(' + x + ',' + y + ')');
	  key.append('rect').attr('x', 0).attr('y', -10).attr('width', 10).attr('height', 10).style('fill', color);
	  key.append('text').attr('transform', 'translate(12,0)').text(text);
	  return key;
	}

/***/ },
/* 13 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.roundDown = roundDown;
	exports.roundUp = roundUp;
	exports.roundFloat = roundFloat;
	function roundDown(age, int) {
	  return Math.floor(age / int) * int;
	}

	function roundUp(age, int) {
	  return Math.ceil(age / int) * int;
	}

	/*
	 * this doesn't have to be years
	 */
	function roundFloat(f) {
	  var count = arguments.length <= 1 || arguments[1] === undefined ? 2 : arguments[1];

	  return f.toFixed(count);
	}

/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var brightBlue = exports.brightBlue = '#459DBA';
	var yellowGreen = exports.yellowGreen = '#C2D400';
	var green = exports.green = '#83b95d';

	var lightBlue = exports.lightBlue = '#80cbc4';
	var brightPink = exports.brightPink = '#ec407a';
	var purple = exports.purple = '#b6869f';

	var genderColors = exports.genderColors = [brightBlue, yellowGreen];

	/*
	 * Don't Mix:
	 *   brightBlue + brightPink (similar saturation, bad for achromatopsia)
	 */

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = chartGroupedSeasonGenders;

	var _base = __webpack_require__(10);

	var _axis = __webpack_require__(11);

	var _addons = __webpack_require__(12);

	var _round = __webpack_require__(13);

	var _colors = __webpack_require__(14);

	function chartGroupedSeasonGenders(seasons, holderID) {
	  // normalize the genders to cover the same time frame

	  var tickValues = seasons.map(function (s) {
	    return s.season;
	  });

	  var base = (0, _base.chartBase)({
	    main: { width: 750, height: 300 },
	    left: { width: 50 },
	    bottom: { height: 50 },
	    top: { height: 30 },
	    right: { width: 100 }
	  }, holderID);

	  // the scale for each age group
	  var seasonScale = d3.scale.ordinal().domain(tickValues).rangeRoundBands([0, base.bottom.width], 0.1);

	  // the scale for each bar within an age group
	  var groupScale = d3.scale.ordinal().domain([0, 1]).rangeRoundBands([0, seasonScale.rangeBand()]);

	  var yMax = (0, _round.roundUp)(d3.max(seasons, function (s) {
	    return Math.max(s.male, s.female);
	  }), 5);

	  var yScale = d3.scale.linear().domain([0, yMax]).range([base.main.height, 0]);

	  var groupedXAxis = d3.svg.axis().scale(seasonScale).orient('bottom').tickValues(tickValues).outerTickSize(0);

	  var yAxis = d3.svg.axis().scale(yScale).ticks(10).orient('left');

	  var yGrid = d3.svg.axis().scale(yScale).orient('right').tickSize(base.main.width).ticks(10).tickFormat('').outerTickSize(0);

	  (0, _axis.drawAxis)(base.bottom, groupedXAxis, 'top');
	  (0, _axis.drawAxis)(base.left, yAxis, 'right');
	  (0, _axis.drawAxis)(base.main, yGrid, 'left');

	  // create a group for every age
	  var seasonGroups = base.main.element.selectAll('g.age').data(seasons).enter().append('g').classed('age', true).attr('transform', function (d, i) {
	    return 'translate(' + seasonScale(d.season) + ', 0)';
	  });

	  seasonGroups.selectAll('rect').data(function (d) {
	    return [d.male, d.female];
	  }).enter().append('rect').attr('width', groupScale.rangeBand()).attr('x', function (d, i) {
	    return groupScale(i);
	  }).attr('y', function (d) {
	    return yScale(d);
	  }).attr('height', function (d) {
	    return base.main.height - yScale(d);
	  }).style('fill', function (d, i) {
	    return _colors.genderColors[i];
	  });

	  (0, _addons.addTitle)(base.top, 'Cast Members Per Season (by Gender)');

	  (0, _addons.verticalLegend)(base.right, [{
	    color: _colors.genderColors[0],
	    text: 'Male'
	  }, {
	    color: _colors.genderColors[1],
	    text: 'Female'
	  }], {
	    offset: {
	      left: 10,
	      top: 50
	    }
	  });

	  base.bottom.element.append('text').text('Season').classed('centered', true).attr('transform', 'translate(' + base.bottom.width / 2 + ', ' + (base.bottom.height - 5) + ')');
	}

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = chartGenderPercents;

	var _base = __webpack_require__(10);

	var _axis = __webpack_require__(11);

	var _addons = __webpack_require__(12);

	var _colors = __webpack_require__(14);

	var _average = __webpack_require__(7);

	var _round = __webpack_require__(13);

	function chartGenderPercents(seasons, holderID) {
	  // normalize the genders to cover the same time frame
	  var tickValues = seasons.map(function (s) {
	    return s.season;
	  });

	  seasons.forEach(function (s) {
	    s.male_percent = s.male / s.total_cast;
	  });

	  var base = (0, _base.chartBase)({
	    main: { width: 850, height: 300 },
	    left: { width: 50 },
	    bottom: { height: 50 },
	    top: { height: 30 },
	    right: { width: 100 }
	  }, holderID);

	  var seasonScale = d3.scale.ordinal().domain(tickValues).rangeRoundBands([0, base.bottom.width], 0.1);

	  var formatPercent = d3.format('.0%');
	  var yScale = d3.scale.linear().domain([0, 1]).range([base.main.height, 0]);

	  var xAxis = d3.svg.axis().scale(seasonScale).orient('bottom').tickValues(tickValues).outerTickSize(0);

	  var yAxis = d3.svg.axis().scale(yScale).ticks(10).orient('left').tickFormat(formatPercent);

	  (0, _axis.drawAxis)(base.bottom, xAxis, 'top');
	  (0, _axis.drawAxis)(base.left, yAxis, 'right');

	  var bandWidth = seasonScale.rangeBand();

	  // create a group for every age
	  base.main.element.append('g').classed('male-percent', true).selectAll('rect').data(seasons).enter().append('rect').attr('width', bandWidth).attr('x', function (d) {
	    return seasonScale(d.season);
	  }).attr('y', function (d) {
	    return yScale(d.male_percent);
	  }).attr('height', function (d) {
	    return base.main.height - yScale(d.male_percent);
	  }).style('fill', _colors.genderColors[0]);

	  base.main.element.append('g').classed('female-percent', true).selectAll('rect').data(seasons).enter().append('rect').attr('width', bandWidth).attr('x', function (d) {
	    return seasonScale(d.season);
	  }).attr('y', 0).attr('height', function (d) {
	    return yScale(d.male_percent);
	  }).style('fill', _colors.genderColors[1]);

	  var halfWidth = seasonScale.rangeBand() / 2;
	  base.main.element.selectAll('text.percent').data(seasons).enter().append('text').classed('percent', true).attr('transform', function (d) {
	    var x = seasonScale(d.season) + halfWidth;
	    var y = yScale(d.male / d.total_cast);
	    return 'translate(' + x + ',' + y + ')';
	  }).attr('dy', -3).text(function (d) {
	    return Math.floor(d.male / d.total_cast * 100);
	  }).style('text-anchor', 'middle');

	  (0, _addons.addTitle)(base.top, 'Cast Member Genders');

	  (0, _addons.verticalLegend)(base.right, [{
	    color: _colors.genderColors[0],
	    text: 'Male'
	  }, {
	    color: _colors.genderColors[1],
	    text: 'Female'
	  }], {
	    offset: {
	      left: 10,
	      top: 50
	    }
	  });

	  base.bottom.element.append('text').text('Season').classed('centered', true).attr('transform', 'translate(' + base.bottom.width / 2 + ', ' + (base.bottom.height - 5) + ')');

	  /*
	  // draw a line representing what 50% gender ratio would be
	  const halfGroup = base.main.element.append('g');
	  halfGroup.append('line')
	    .attr('x1', 0)
	    .attr('y1', yScale(0.5))
	    .attr('x2', base.main.width)
	    .attr('y2', yScale(0.5))
	    .style('stroke', '#000')
	    .style('stroke-width', 1);
	    const meanCount = meanProperty(seasons, 'male_percent');
	  const standardDev = standardDeviation(seasons, 'male_percent', meanCount);
	  */
	}

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = chartRolePercents;

	var _base = __webpack_require__(10);

	var _axis = __webpack_require__(11);

	var _addons = __webpack_require__(12);

	var _average = __webpack_require__(7);

	var _round = __webpack_require__(13);

	var _colors = __webpack_require__(14);

	var colors = [_colors.brightPink, _colors.lightBlue];

	function chartRolePercents(seasons, holderID) {
	  var tickValues = seasons.map(function (s) {
	    return s.season;
	  });

	  seasons.forEach(function (s) {
	    s.repertory_percent = s.male / s.total_cast;
	  });

	  var base = (0, _base.chartBase)({
	    main: { width: 850, height: 300 },
	    left: { width: 50 },
	    bottom: { height: 50 },
	    top: { height: 30 },
	    right: { width: 100 }
	  }, holderID);

	  var seasonScale = d3.scale.ordinal().domain(tickValues).rangeRoundBands([0, base.bottom.width], 0.1);

	  var formatPercent = d3.format('.0%');
	  var yScale = d3.scale.linear().domain([0, 1]).range([base.main.height, 0]);

	  var xAxis = d3.svg.axis().scale(seasonScale).orient('bottom').tickValues(tickValues).outerTickSize(0);

	  var yAxis = d3.svg.axis().scale(yScale).ticks(10).orient('left').tickFormat(formatPercent);

	  (0, _axis.drawAxis)(base.bottom, xAxis, 'top');
	  (0, _axis.drawAxis)(base.left, yAxis, 'right');

	  var bandWidth = seasonScale.rangeBand();

	  // create a group for every age
	  base.main.element.append('g').classed('male-percent', true).selectAll('rect').data(seasons).enter().append('rect').attr('width', bandWidth).attr('x', function (d) {
	    return seasonScale(d.season);
	  }).attr('y', function (d) {
	    return yScale(d.repertory_percent);
	  }).attr('height', function (d) {
	    return base.main.height - yScale(d.repertory_percent);
	  }).style('fill', colors[0]);

	  base.main.element.append('g').classed('female-percent', true).selectAll('rect').data(seasons).enter().append('rect').attr('width', bandWidth).attr('x', function (d) {
	    return seasonScale(d.season);
	  }).attr('y', 0).attr('height', function (d) {
	    return yScale(d.repertory_percent);
	  }).style('fill', colors[1]);

	  var halfWidth = seasonScale.rangeBand() / 2;
	  base.main.element.selectAll('text.percent').data(seasons).enter().append('text').classed('percent', true).attr('transform', function (d) {
	    var x = seasonScale(d.season) + halfWidth;
	    var y = yScale(d.male / d.total_cast);
	    return 'translate(' + x + ',' + y + ')';
	  }).attr('dy', -3).text(function (d) {
	    return Math.floor(d.male / d.total_cast * 100);
	  }).style('text-anchor', 'middle');

	  (0, _addons.addTitle)(base.top, 'Cast Member Roles');

	  (0, _addons.verticalLegend)(base.right, [{
	    color: colors[0],
	    text: 'Repertory'
	  }, {
	    color: colors[1],
	    text: 'Featured'
	  }], {
	    offset: {
	      left: 10,
	      top: 50
	    }
	  });

	  base.bottom.element.append('text').text('Season').classed('centered', true).attr('transform', 'translate(' + base.bottom.width / 2 + ', ' + (base.bottom.height - 5) + ')');
	}

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = render;

	var _startingAges = __webpack_require__(19);

	var _startingAges2 = _interopRequireDefault(_startingAges);

	var _groupedStartingAges = __webpack_require__(20);

	var _groupedStartingAges2 = _interopRequireDefault(_groupedStartingAges);

	var _normalizedStartingAges = __webpack_require__(21);

	var _normalizedStartingAges2 = _interopRequireDefault(_normalizedStartingAges);

	var _startingAgesTable = __webpack_require__(22);

	var _startingAgesTable2 = _interopRequireDefault(_startingAgesTable);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function render(genders) {
	  (0, _startingAges2.default)(genders, '#starting-age');
	  (0, _groupedStartingAges2.default)(genders, '#starting-age-gender');
	  (0, _normalizedStartingAges2.default)(genders, '#starting-age-normalized');
	  (0, _startingAgesTable2.default)(genders, '#starting-age-table');
	}

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = chartStartingAges;

	var _base = __webpack_require__(10);

	var _axis = __webpack_require__(11);

	var _addons = __webpack_require__(12);

	var _round = __webpack_require__(13);

	var _colors = __webpack_require__(14);

	function chartStartingAges(data, holderID) {
	  // normalize the genders to cover the same time frame
	  var all = data.all;
	  var _all$start$ages = all.start.ages;
	  var ages = _all$start$ages.ages;
	  var offset = _all$start$ages.offset;

	  var tickValues = Array.from(new Array(ages.length)).map(function (u, i) {
	    return i + offset;
	  });

	  var base = (0, _base.chartBase)({
	    main: { width: 650, height: 300 },
	    left: { width: 50 },
	    bottom: { height: 50 },
	    top: { height: 30 },
	    right: { width: 100 }
	  }, holderID);

	  var ageScale = d3.scale.ordinal().domain(tickValues).rangeRoundBands([0, base.bottom.width], 0.5);

	  var yMax = (0, _round.roundUp)(d3.max(ages), 5);

	  var yScale = d3.scale.linear().domain([0, yMax]).range([base.main.height, 0]);

	  var xAxis = d3.svg.axis().scale(ageScale).orient('bottom').tickValues(tickValues).outerTickSize(0);

	  var yAxis = d3.svg.axis().scale(yScale).ticks(10).orient('left');

	  var yGrid = d3.svg.axis().scale(yScale).orient('right').tickSize(base.main.width).ticks(10).tickFormat('').outerTickSize(0);

	  (0, _axis.drawAxis)(base.bottom, xAxis, 'top');
	  (0, _axis.drawAxis)(base.left, yAxis, 'right');
	  (0, _axis.drawAxis)(base.main, yGrid, 'left');

	  var halfWidth = ageScale.rangeBand();

	  // create a group for every age
	  base.main.element.selectAll('rect').data(ages).enter().append('rect').attr('width', halfWidth).attr('x', function (d, i) {
	    return ageScale(i + offset);
	  }).attr('y', function (d) {
	    return yScale(d);
	  }).attr('height', function (d) {
	    return base.main.height - yScale(d);
	  }).style('fill', _colors.green);

	  (0, _addons.addTitle)(base.top, 'Starting Age of SNL Cast Members');

	  base.bottom.element.append('text').text('Age (Rounded Down)').classed('centered', true).attr('transform', 'translate(' + base.bottom.width / 2 + ', ' + (base.bottom.height - 5) + ')');
	}

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = chartGroupedStartingAges;

	var _base = __webpack_require__(10);

	var _axis = __webpack_require__(11);

	var _addons = __webpack_require__(12);

	var _round = __webpack_require__(13);

	var _colors = __webpack_require__(14);

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function chartGroupedStartingAges(data, holderID) {
	  // normalize the genders to cover the same time frame
	  var male = data.male;
	  var female = data.female;

	  var _mergeAges = mergeAges(male, female);

	  var ages = _mergeAges.ages;
	  var offset = _mergeAges.offset;

	  var tickValues = Array.from(new Array(ages.length)).map(function (u, i) {
	    return i + offset;
	  });

	  var base = (0, _base.chartBase)({
	    main: { width: 650, height: 300 },
	    left: { width: 50 },
	    bottom: { height: 50 },
	    top: { height: 30 },
	    right: { width: 100 }
	  }, holderID);

	  // the scale for each age group
	  var ageScale = d3.scale.ordinal().domain(tickValues).rangeRoundBands([0, base.bottom.width], 0.1);

	  // the scale for each bar within an age group
	  var groupScale = d3.scale.ordinal().domain([0, 1]).rangeRoundBands([0, ageScale.rangeBand()]);

	  var yMax = (0, _round.roundUp)(d3.max(ages, function (a) {
	    return Math.max(a[0], a[1]);
	  }), 5);

	  var yScale = d3.scale.linear().domain([0, yMax]).range([base.main.height, 0]);

	  var groupedXAxis = d3.svg.axis().scale(ageScale).orient('bottom').tickValues(tickValues).outerTickSize(0);

	  var yAxis = d3.svg.axis().scale(yScale).ticks(10).orient('left');

	  var yGrid = d3.svg.axis().scale(yScale).orient('right').tickSize(base.main.width).ticks(10).tickFormat('').outerTickSize(0);

	  (0, _axis.drawAxis)(base.bottom, groupedXAxis, 'top');
	  (0, _axis.drawAxis)(base.left, yAxis, 'right');
	  (0, _axis.drawAxis)(base.main, yGrid, 'left');

	  // create a group for every age
	  var ageGroups = base.main.element.selectAll('g.age').data(ages).enter().append('g').classed('age', true).attr('transform', function (d, i) {
	    return 'translate(' + ageScale(i + offset) + ', 0)';
	  });

	  ageGroups.selectAll('rect').data(function (d) {
	    return d;
	  }).enter().append('rect').attr('width', groupScale.rangeBand()).attr('x', function (d, i) {
	    return groupScale(i);
	  }).attr('y', function (d) {
	    return yScale(d);
	  }).attr('height', function (d) {
	    return base.main.height - yScale(d);
	  }).style('fill', function (d, i) {
	    return _colors.genderColors[i];
	  });

	  (0, _addons.addTitle)(base.top, 'Starting Age of SNL Cast Members (by Gender)');

	  (0, _addons.verticalLegend)(base.right, [{
	    color: _colors.genderColors[0],
	    text: 'Male'
	  }, {
	    color: _colors.genderColors[1],
	    text: 'Female'
	  }], {
	    offset: {
	      left: 10,
	      top: 100
	    }
	  });

	  base.bottom.element.append('text').text('Age (Rounded Down)').classed('centered', true).attr('transform', 'translate(' + base.bottom.width / 2 + ', ' + (base.bottom.height - 5) + ')');
	}

	/*
	 * merge the male and female ages so that they can be displaed side by side in a bar chart
	 */
	function mergeAges(male, female) {
	  var ms = male.start.ages;
	  var fs = female.start.ages;

	  var youngestMale = ms.offset;
	  var oldestMale = ms.offset + ms.ages.length;

	  var youngestFemale = fs.offset;
	  var oldestFemale = fs.offset + fs.ages.length;

	  var youngest = Math.min(youngestMale, youngestFemale);
	  var oldest = Math.max(oldestMale, oldestFemale);

	  var paddedMales = zeroPadArray(ms.ages, youngestMale - youngest, oldest - oldestMale);
	  var paddedFemales = zeroPadArray(fs.ages, youngestFemale - youngest, oldest - oldestFemale);

	  return {
	    ages: paddedMales.map(function (u, index) {
	      return [paddedMales[index], paddedFemales[index]];
	    }),
	    offset: youngest
	  };
	}

	function zeroPadArray(arr, front, back) {
	  return [].concat(_toConsumableArray(Array.from(new Array(front)).fill(0)), _toConsumableArray(arr), _toConsumableArray(Array.from(new Array(back).fill(0))));
	}

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = chartNormalizedStartingAges;

	var _base = __webpack_require__(10);

	var _axis = __webpack_require__(11);

	var _addons = __webpack_require__(12);

	var _round = __webpack_require__(13);

	var _colors = __webpack_require__(14);

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function chartNormalizedStartingAges(data, holderID) {
	  // normalize the genders to cover the same time frame
	  var male = data.male;
	  var female = data.female;

	  var _mergeAges = mergeAges(male, female);

	  var ages = _mergeAges.ages;
	  var offset = _mergeAges.offset;

	  var tickValues = Array.from(new Array(ages.length)).map(function (u, i) {
	    return i + offset;
	  });

	  var base = (0, _base.chartBase)({
	    main: { width: 650, height: 300 },
	    left: { width: 50 },
	    bottom: { height: 50 },
	    top: { height: 30 },
	    right: { width: 100 }
	  }, holderID);

	  // the scale for each age group
	  var ageScale = d3.scale.ordinal().domain(tickValues).rangeRoundBands([0, base.bottom.width], 0.1);

	  // the scale for each bar within an age group
	  var groupScale = d3.scale.ordinal().domain([0, 1]).rangeRoundBands([0, ageScale.rangeBand()]);

	  var yMax = d3.max(ages, function (a) {
	    return Math.max(a[0], a[1]);
	  });
	  yMax = (0, _round.roundUp)(yMax * 100, 5) / 100;
	  var formatPercent = d3.format('.0%');

	  var yScale = d3.scale.linear().domain([0, yMax]).range([base.main.height, 0]);

	  var groupedXAxis = d3.svg.axis().scale(ageScale).orient('bottom').tickValues(tickValues).outerTickSize(0);

	  var threePercTicks = [];
	  var perc = 0;
	  while (perc <= yMax) {
	    threePercTicks.push(perc);
	    perc += 0.03;
	  }

	  var yAxis = d3.svg.axis().scale(yScale).tickValues(threePercTicks).orient('left').tickFormat(formatPercent);

	  var yGrid = d3.svg.axis().scale(yScale).orient('right').tickSize(base.main.width).tickValues(threePercTicks).tickFormat('').outerTickSize(0);

	  (0, _axis.drawAxis)(base.bottom, groupedXAxis, 'top');
	  (0, _axis.drawAxis)(base.left, yAxis, 'right');
	  (0, _axis.drawAxis)(base.main, yGrid, 'left');

	  // create a group for every age
	  var ageGroups = base.main.element.selectAll('g.age').data(ages).enter().append('g').classed('age', true).attr('transform', function (d, i) {
	    return 'translate(' + ageScale(i + offset) + ', 0)';
	  });

	  ageGroups.selectAll('rect').data(function (d) {
	    return d;
	  }).enter().append('rect').attr('width', groupScale.rangeBand()).attr('x', function (d, i) {
	    return groupScale(i);
	  }).attr('y', function (d) {
	    return yScale(d);
	  }).attr('height', function (d) {
	    return base.main.height - yScale(d);
	  }).style('fill', function (d, i) {
	    return _colors.genderColors[i];
	  });

	  (0, _addons.addTitle)(base.top, 'Starting Age of SNL Cast Members (by Gender)');

	  (0, _addons.verticalLegend)(base.right, [{
	    color: _colors.genderColors[0],
	    text: 'Male'
	  }, {
	    color: _colors.genderColors[1],
	    text: 'Female'
	  }], {
	    offset: {
	      left: 10,
	      top: 100
	    }
	  });

	  base.bottom.element.append('text').text('Age (Rounded Down)').classed('centered', true).attr('transform', 'translate(' + base.bottom.width / 2 + ', ' + (base.bottom.height - 5) + ')');
	}

	/*
	 * merge the male and female ages so that they can be displaed side by side in a bar chart
	 */
	function mergeAges(male, female) {
	  var ms = male.start.ages;
	  var fs = female.start.ages;

	  var totalMale = ms.ages.reduce(function (acc, curr) {
	    return acc + curr;
	  }, 0);

	  var totalFemale = fs.ages.reduce(function (acc, curr) {
	    return acc + curr;
	  }, 0);

	  var femalePercents = fs.ages.map(function (count) {
	    return count / totalFemale;
	  });
	  var malePercents = ms.ages.map(function (count) {
	    return count / totalMale;
	  });

	  var youngestMale = ms.offset;
	  var oldestMale = ms.offset + ms.ages.length;

	  var youngestFemale = fs.offset;
	  var oldestFemale = fs.offset + fs.ages.length;

	  var youngest = Math.min(youngestMale, youngestFemale);
	  var oldest = Math.max(oldestMale, oldestFemale);

	  var paddedMales = zeroPadArray(malePercents, youngestMale - youngest, oldest - oldestMale);
	  var paddedFemales = zeroPadArray(femalePercents, youngestFemale - youngest, oldest - oldestFemale);

	  return {
	    ages: paddedMales.map(function (u, index) {
	      return [paddedMales[index], paddedFemales[index]];
	    }),
	    offset: youngest
	  };
	}

	function zeroPadArray(arr, front, back) {
	  return [].concat(_toConsumableArray(Array.from(new Array(front)).fill(0)), _toConsumableArray(arr), _toConsumableArray(Array.from(new Array(back).fill(0))));
	}

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = startingAgesTable;

	var _round = __webpack_require__(13);

	var _date = __webpack_require__(2);

	var _table = __webpack_require__(23);

	var _table2 = _interopRequireDefault(_table);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function startingAgesTable(data, holderID) {
	  var headers = ['', 'Median', 'Mean', 'Youngest', 'Oldest'];
	  var rows = ['all', 'male', 'female'].map(function (key) {
	    var startData = data[key].start;
	    var mean = startData.mean;
	    var median = startData.median;
	    var standardDev = startData.standardDev;
	    var oldest = startData.oldest;
	    var youngest = startData.youngest;

	    return [key, (0, _round.roundFloat)(median), (0, _round.roundFloat)(mean) + ' ± ' + (0, _round.roundFloat)(standardDev), youngest.name + ' (' + (0, _round.roundFloat)((0, _date.daysToYears)(youngest.start_age)) + ')', oldest.name + ' (' + (0, _round.roundFloat)((0, _date.daysToYears)(oldest.start_age)) + ')'];
	  });

	  (0, _table2.default)(rows, holderID, headers, 'Cast Member Starting Ages (in Years)');
	}

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = table;

	var _d = __webpack_require__(1);

	var _d2 = _interopRequireDefault(_d);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*
	 * Render a table with a row of th's for header values. Includes a title above the 
	 * header values if one is provided.
	 */
	function table(data, holderID) {
	  var headers = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];
	  var title = arguments[3];

	  var table = _d2.default.select(holderID).append('table');
	  var head = table.append('thead');

	  if (title !== undefined) {
	    head.append('tr').append('th').text(title).classed('title', true).attr('colspan', headers.length || 1);
	  }

	  head.append('tr').selectAll('th').data(headers).enter().append('th').text(function (d) {
	    return d;
	  });

	  table.append('tbody').selectAll('tr').data(data).enter().append('tr').selectAll('td').data(function (d) {
	    return d;
	  }).enter().append('td').text(function (d) {
	    return d;
	  });
	}

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = render;

	var _endingAges = __webpack_require__(25);

	var _endingAges2 = _interopRequireDefault(_endingAges);

	var _groupedEndingAges = __webpack_require__(26);

	var _groupedEndingAges2 = _interopRequireDefault(_groupedEndingAges);

	var _normalizedEndingAges = __webpack_require__(27);

	var _normalizedEndingAges2 = _interopRequireDefault(_normalizedEndingAges);

	var _endingAgesTable = __webpack_require__(28);

	var _endingAgesTable2 = _interopRequireDefault(_endingAgesTable);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function render(genders) {
	  (0, _endingAges2.default)(genders, '#ending-age');
	  (0, _groupedEndingAges2.default)(genders, '#ending-age-gender');
	  (0, _normalizedEndingAges2.default)(genders, '#ending-age-normalized');
	  (0, _endingAgesTable2.default)(genders, '#ending-age-table');
	}

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = chartEndingAges;

	var _base = __webpack_require__(10);

	var _axis = __webpack_require__(11);

	var _addons = __webpack_require__(12);

	var _round = __webpack_require__(13);

	var _colors = __webpack_require__(14);

	function chartEndingAges(data, holderID) {
	  // normalize the genders to cover the same time frame
	  var all = data.all;
	  var _all$end$ages = all.end.ages;
	  var ages = _all$end$ages.ages;
	  var offset = _all$end$ages.offset;

	  var tickValues = Array.from(new Array(ages.length)).map(function (u, i) {
	    return i + offset;
	  });

	  var base = (0, _base.chartBase)({
	    main: { width: 650, height: 300 },
	    left: { width: 50 },
	    bottom: { height: 50 },
	    top: { height: 30 },
	    right: { width: 100 }
	  }, holderID);

	  var ageScale = d3.scale.ordinal().domain(tickValues).rangeRoundBands([0, base.bottom.width], 0.5);

	  var yMax = (0, _round.roundUp)(d3.max(ages), 5);

	  var yScale = d3.scale.linear().domain([0, yMax]).range([base.main.height, 0]);

	  var xAxis = d3.svg.axis().scale(ageScale).orient('bottom').tickValues(tickValues).outerTickSize(0);

	  var yAxis = d3.svg.axis().scale(yScale).ticks(10).orient('left');

	  var yGrid = d3.svg.axis().scale(yScale).orient('right').tickSize(base.main.width).ticks(10).tickFormat('').outerTickSize(0);

	  (0, _axis.drawAxis)(base.bottom, xAxis, 'top');
	  (0, _axis.drawAxis)(base.left, yAxis, 'right');
	  (0, _axis.drawAxis)(base.main, yGrid, 'left');

	  var halfWidth = ageScale.rangeBand();

	  // create a group for every age
	  base.main.element.selectAll('rect').data(ages).enter().append('rect').attr('width', halfWidth).attr('x', function (d, i) {
	    return ageScale(i + offset);
	  }).attr('y', function (d) {
	    return yScale(d);
	  }).attr('height', function (d) {
	    return base.main.height - yScale(d);
	  }).style('fill', _colors.green);

	  (0, _addons.addTitle)(base.top, 'Ending Age of SNL Cast Members');

	  base.bottom.element.append('text').text('Age (Rounded Down)').classed('centered', true).attr('transform', 'translate(' + base.bottom.width / 2 + ', ' + (base.bottom.height - 5) + ')');
	}

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = chartGroupedEndingAges;

	var _base = __webpack_require__(10);

	var _axis = __webpack_require__(11);

	var _addons = __webpack_require__(12);

	var _round = __webpack_require__(13);

	var _colors = __webpack_require__(14);

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function chartGroupedEndingAges(data, holderID) {
	  // normalize the genders to cover the same time frame
	  var male = data.male;
	  var female = data.female;

	  var _mergeAges = mergeAges(male, female);

	  var ages = _mergeAges.ages;
	  var offset = _mergeAges.offset;

	  var tickValues = Array.from(new Array(ages.length)).map(function (u, i) {
	    return i + offset;
	  });

	  var base = (0, _base.chartBase)({
	    main: { width: 650, height: 300 },
	    left: { width: 50 },
	    bottom: { height: 50 },
	    top: { height: 30 },
	    right: { width: 100 }
	  }, holderID);

	  // the scale for each age group
	  var ageScale = d3.scale.ordinal().domain(tickValues).rangeRoundBands([0, base.bottom.width], 0.1);

	  // the scale for each bar within an age group
	  var groupScale = d3.scale.ordinal().domain([0, 1]).rangeRoundBands([0, ageScale.rangeBand()]);

	  var yMax = (0, _round.roundUp)(d3.max(ages, function (a) {
	    return Math.max(a[0], a[1]);
	  }), 5);

	  var yScale = d3.scale.linear().domain([0, yMax]).range([base.main.height, 0]);

	  var groupedXAxis = d3.svg.axis().scale(ageScale).orient('bottom').tickValues(tickValues).outerTickSize(0);

	  var yAxis = d3.svg.axis().scale(yScale).ticks(10).orient('left');

	  var yGrid = d3.svg.axis().scale(yScale).orient('right').tickSize(base.main.width).ticks(10).tickFormat('').outerTickSize(0);

	  (0, _axis.drawAxis)(base.bottom, groupedXAxis, 'top');
	  (0, _axis.drawAxis)(base.left, yAxis, 'right');
	  (0, _axis.drawAxis)(base.main, yGrid, 'left');

	  // create a group for every age
	  var ageGroups = base.main.element.selectAll('g.age').data(ages).enter().append('g').classed('age', true).attr('transform', function (d, i) {
	    return 'translate(' + ageScale(i + offset) + ', 0)';
	  });

	  ageGroups.selectAll('rect').data(function (d) {
	    return d;
	  }).enter().append('rect').attr('width', groupScale.rangeBand()).attr('x', function (d, i) {
	    return groupScale(i);
	  }).attr('y', function (d) {
	    return yScale(d);
	  }).attr('height', function (d) {
	    return base.main.height - yScale(d);
	  }).style('fill', function (d, i) {
	    return _colors.genderColors[i];
	  });

	  (0, _addons.addTitle)(base.top, 'Ending Age of SNL Cast Members (by Gender)');

	  (0, _addons.verticalLegend)(base.right, [{
	    color: _colors.genderColors[0],
	    text: 'Male'
	  }, {
	    color: _colors.genderColors[1],
	    text: 'Female'
	  }], {
	    offset: {
	      left: 10,
	      top: 50
	    }
	  });

	  base.bottom.element.append('text').text('Age (Rounded Down)').classed('centered', true).attr('transform', 'translate(' + base.bottom.width / 2 + ', ' + (base.bottom.height - 5) + ')');
	}

	/*
	 * merge the male and female ages so that they can be displaed side by side in a bar chart
	 */
	function mergeAges(male, female) {
	  var ms = male.end.ages;
	  var fs = female.end.ages;

	  var youngestMale = ms.offset;
	  var oldestMale = ms.offset + ms.ages.length;

	  var youngestFemale = fs.offset;
	  var oldestFemale = fs.offset + fs.ages.length;

	  var youngest = Math.min(youngestMale, youngestFemale);
	  var oldest = Math.max(oldestMale, oldestFemale);

	  var paddedMales = zeroPadArray(ms.ages, youngestMale - youngest, oldest - oldestMale);
	  var paddedFemales = zeroPadArray(fs.ages, youngestFemale - youngest, oldest - oldestFemale);

	  return {
	    ages: paddedMales.map(function (u, index) {
	      return [paddedMales[index], paddedFemales[index]];
	    }),
	    offset: youngest
	  };
	}

	function zeroPadArray(arr, front, back) {
	  return [].concat(_toConsumableArray(Array.from(new Array(front)).fill(0)), _toConsumableArray(arr), _toConsumableArray(Array.from(new Array(back).fill(0))));
	}

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = chartNormalizedEndingAges;

	var _base = __webpack_require__(10);

	var _axis = __webpack_require__(11);

	var _addons = __webpack_require__(12);

	var _round = __webpack_require__(13);

	var _colors = __webpack_require__(14);

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function chartNormalizedEndingAges(data, holderID) {
	  // normalize the genders to cover the same time frame
	  var male = data.male;
	  var female = data.female;

	  var _mergeAges = mergeAges(male, female);

	  var ages = _mergeAges.ages;
	  var offset = _mergeAges.offset;

	  var tickValues = Array.from(new Array(ages.length)).map(function (u, i) {
	    return i + offset;
	  });

	  var base = (0, _base.chartBase)({
	    main: { width: 650, height: 300 },
	    left: { width: 50 },
	    bottom: { height: 50 },
	    top: { height: 30 },
	    right: { width: 100 }
	  }, holderID);

	  // the scale for each age group
	  var ageScale = d3.scale.ordinal().domain(tickValues).rangeRoundBands([0, base.bottom.width], 0.1);

	  // the scale for each bar within an age group
	  var groupScale = d3.scale.ordinal().domain([0, 1]).rangeRoundBands([0, ageScale.rangeBand()]);

	  var yMax = d3.max(ages, function (a) {
	    return Math.max(a[0], a[1]);
	  });
	  yMax = (0, _round.roundUp)(yMax * 100, 3) / 100;
	  var formatPercent = d3.format('.0%');

	  var yScale = d3.scale.linear().domain([0, yMax]).range([base.main.height, 0]);

	  var groupedXAxis = d3.svg.axis().scale(ageScale).orient('bottom').tickValues(tickValues).outerTickSize(0);

	  var threePercTicks = [];
	  var perc = 0;
	  while (perc <= yMax) {
	    threePercTicks.push(perc);
	    perc += 0.03;
	  }

	  var yAxis = d3.svg.axis().scale(yScale).tickValues(threePercTicks).orient('left').tickFormat(formatPercent);

	  var yGrid = d3.svg.axis().scale(yScale).orient('right').tickSize(base.main.width).tickValues(threePercTicks).tickFormat('').outerTickSize(0);

	  (0, _axis.drawAxis)(base.bottom, groupedXAxis, 'top');
	  (0, _axis.drawAxis)(base.left, yAxis, 'right');
	  (0, _axis.drawAxis)(base.main, yGrid, 'left');

	  // create a group for every age
	  var ageGroups = base.main.element.selectAll('g.age').data(ages).enter().append('g').classed('age', true).attr('transform', function (d, i) {
	    return 'translate(' + ageScale(i + offset) + ', 0)';
	  });

	  ageGroups.selectAll('rect').data(function (d) {
	    return d;
	  }).enter().append('rect').attr('width', groupScale.rangeBand()).attr('x', function (d, i) {
	    return groupScale(i);
	  }).attr('y', function (d) {
	    return yScale(d);
	  }).attr('height', function (d) {
	    return base.main.height - yScale(d);
	  }).style('fill', function (d, i) {
	    return _colors.genderColors[i];
	  });

	  (0, _addons.addTitle)(base.top, 'Ending Age of SNL Cast Members (by Gender)');

	  (0, _addons.verticalLegend)(base.right, [{
	    color: _colors.genderColors[0],
	    text: 'Male'
	  }, {
	    color: _colors.genderColors[1],
	    text: 'Female'
	  }], {
	    offset: {
	      left: 10,
	      top: 100
	    }
	  });

	  base.bottom.element.append('text').text('Age (Rounded Down)').classed('centered', true).attr('transform', 'translate(' + base.bottom.width / 2 + ', ' + (base.bottom.height - 5) + ')');
	}

	/*
	 * merge the male and female ages so that they can be displaed side by side in a bar chart
	 */
	function mergeAges(male, female) {
	  var ms = male.end.ages;
	  var fs = female.end.ages;

	  var totalMale = ms.ages.reduce(function (acc, curr) {
	    return acc + curr;
	  }, 0);

	  var totalFemale = fs.ages.reduce(function (acc, curr) {
	    return acc + curr;
	  }, 0);

	  var femalePercents = fs.ages.map(function (count) {
	    return count / totalFemale;
	  });
	  var malePercents = ms.ages.map(function (count) {
	    return count / totalMale;
	  });

	  var youngestMale = ms.offset;
	  var oldestMale = ms.offset + ms.ages.length;

	  var youngestFemale = fs.offset;
	  var oldestFemale = fs.offset + fs.ages.length;

	  var youngest = Math.min(youngestMale, youngestFemale);
	  var oldest = Math.max(oldestMale, oldestFemale);

	  var paddedMales = zeroPadArray(malePercents, youngestMale - youngest, oldest - oldestMale);
	  var paddedFemales = zeroPadArray(femalePercents, youngestFemale - youngest, oldest - oldestFemale);

	  return {
	    ages: paddedMales.map(function (u, index) {
	      return [paddedMales[index], paddedFemales[index]];
	    }),
	    offset: youngest
	  };
	}

	function zeroPadArray(arr, front, back) {
	  return [].concat(_toConsumableArray(Array.from(new Array(front)).fill(0)), _toConsumableArray(arr), _toConsumableArray(Array.from(new Array(back).fill(0))));
	}

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = endingAgesTable;

	var _round = __webpack_require__(13);

	var _date = __webpack_require__(2);

	var _table = __webpack_require__(23);

	var _table2 = _interopRequireDefault(_table);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function endingAgesTable(data, holderID) {
	  var headers = ['', 'Median', 'Mean', 'Youngest', 'Oldest'];
	  var rows = ['all', 'male', 'female'].map(function (key) {
	    var endData = data[key].end;
	    var mean = endData.mean;
	    var median = endData.median;
	    var oldest = endData.oldest;
	    var youngest = endData.youngest;
	    var standardDev = endData.standardDev;

	    return [key, (0, _round.roundFloat)(median), (0, _round.roundFloat)(mean) + ' ± ' + (0, _round.roundFloat)(standardDev), youngest.name + ' (' + (0, _round.roundFloat)((0, _date.daysToYears)(youngest.end_age)) + ')', oldest.name + ' (' + (0, _round.roundFloat)((0, _date.daysToYears)(oldest.end_age)) + ')'];
	  });

	  (0, _table2.default)(rows, holderID, headers, 'Cast Member Ending Ages (in Years)');
	}

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = chartStartingAndEndingAges;

	var _base = __webpack_require__(10);

	var _axis = __webpack_require__(11);

	var _addons = __webpack_require__(12);

	var _round = __webpack_require__(13);

	var _colors = __webpack_require__(14);

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	var colors = [_colors.lightBlue, _colors.brightPink];

	function chartStartingAndEndingAges(data, holderID) {
	  // normalize the genders to cover the same time frame
	  var _data$all = data.all;
	  var start = _data$all.start;
	  var end = _data$all.end;

	  var _mergeAges = mergeAges(start, end);

	  var ages = _mergeAges.ages;
	  var offset = _mergeAges.offset;

	  var tickValues = Array.from(new Array(ages.length)).map(function (u, i) {
	    return i + offset;
	  });

	  /*
	   * CREATE SVG ELEMENTS
	   */
	  var base = (0, _base.chartBase)({
	    main: { width: 650, height: 300 },
	    left: { width: 50 },
	    bottom: { height: 50 },
	    top: { height: 30 },
	    right: { width: 100 }
	  }, holderID);

	  /*
	   * CREATE SCALES
	   */
	  // the scale for each age group
	  var ageScale = d3.scale.ordinal().domain(tickValues).rangeRoundBands([0, base.bottom.width], 0.1);

	  // the scale for each bar within an age group
	  var groupScale = d3.scale.ordinal().domain([0, 1]).rangeRoundBands([0, ageScale.rangeBand()]);

	  var yMax = d3.max(ages, function (a) {
	    return Math.max(a[0], a[1]);
	  });
	  yMax = (0, _round.roundUp)(yMax * 100, 3) / 100;
	  var formatPercent = d3.format('.0%');

	  var yScale = d3.scale.linear().domain([0, yMax]).range([base.main.height, 0]);

	  /*
	   * CREATES AXES
	   */

	  var groupedXAxis = d3.svg.axis().scale(ageScale).orient('bottom').tickValues(tickValues).outerTickSize(0);

	  var yAxis = d3.svg.axis().scale(yScale).ticks(10).orient('left').tickFormat(formatPercent);

	  var yGrid = d3.svg.axis().scale(yScale).orient('right').tickSize(base.main.width).ticks(10).tickFormat('').outerTickSize(0);

	  /*
	   * DRAW AXES
	   */
	  (0, _axis.drawAxis)(base.bottom, groupedXAxis, 'top');
	  (0, _axis.drawAxis)(base.left, yAxis, 'right');
	  (0, _axis.drawAxis)(base.main, yGrid, 'left');

	  /*
	   * DRAW CHART
	   */
	  // create a group for every age
	  var ageGroups = base.main.element.selectAll('g.age').data(ages).enter().append('g').classed('age', true).attr('transform', function (d, i) {
	    return 'translate(' + ageScale(i + offset) + ', 0)';
	  });

	  ageGroups.selectAll('rect').data(function (d) {
	    return d;
	  }).enter().append('rect').attr('width', groupScale.rangeBand()).attr('x', function (d, i) {
	    return groupScale(i);
	  }).attr('y', function (d) {
	    return yScale(d);
	  }).attr('height', function (d) {
	    return base.main.height - yScale(d);
	  }).style('fill', function (d, i) {
	    return colors[i];
	  });

	  /*
	   * DRAW ADDONS
	   */
	  (0, _addons.addTitle)(base.top, 'Starting and Ending Ages of SNL Cast Members');
	  (0, _addons.verticalLegend)(base.right, [{
	    color: colors[0],
	    text: 'Start'
	  }, {
	    color: colors[1],
	    text: 'End'
	  }], {
	    offset: {
	      left: 10,
	      top: 100
	    }
	  });

	  base.bottom.element.append('text').text('Age (Rounded Down)').classed('centered', true).attr('transform', 'translate(' + base.bottom.width / 2 + ', ' + (base.bottom.height - 5) + ')');
	}

	/*
	 * merge the male and female ages so that they can be displaed side by side in a bar chart
	 */
	function mergeAges(start, end) {
	  var sa = start.ages;
	  var ea = end.ages;

	  var totalStart = sa.ages.reduce(function (acc, curr) {
	    return acc + curr;
	  }, 0);

	  var totalEnd = ea.ages.reduce(function (acc, curr) {
	    return acc + curr;
	  }, 0);

	  var startPercents = sa.ages.map(function (count) {
	    return count / totalStart;
	  });
	  var endPercents = ea.ages.map(function (count) {
	    return count / totalEnd;
	  });

	  var youngestStart = sa.offset;
	  var oldestStart = sa.offset + sa.ages.length;

	  var youngestEnd = ea.offset;
	  var oldestEnd = ea.offset + ea.ages.length;

	  var youngest = Math.min(youngestStart, youngestEnd);
	  var oldest = Math.max(oldestStart, oldestEnd);

	  var paddedStarts = zeroPadArray(startPercents, youngestStart - youngest, oldest - oldestStart);
	  var paddedEnds = zeroPadArray(endPercents, youngestEnd - youngest, oldest - oldestEnd);

	  return {
	    ages: paddedStarts.map(function (u, index) {
	      return [paddedStarts[index], paddedEnds[index]];
	    }),
	    offset: youngest
	  };
	}

	function zeroPadArray(arr, front, back) {
	  return [].concat(_toConsumableArray(Array.from(new Array(front)).fill(0)), _toConsumableArray(arr), _toConsumableArray(Array.from(new Array(back).fill(0))));
	}

/***/ }
/******/ ]);