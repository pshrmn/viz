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

	var _basicsGraphics = __webpack_require__(8);

	var _basicsGraphics2 = _interopRequireDefault(_basicsGraphics);

	var _seasonCastMemberGraphics = __webpack_require__(16);

	var _seasonCastMemberGraphics2 = _interopRequireDefault(_seasonCastMemberGraphics);

	var _startingAgeGraphics = __webpack_require__(26);

	var _startingAgeGraphics2 = _interopRequireDefault(_startingAgeGraphics);

	var _endingAgeGraphics = __webpack_require__(35);

	var _endingAgeGraphics2 = _interopRequireDefault(_endingAgeGraphics);

	var _startingAndEndingAges = __webpack_require__(40);

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

	  (0, _basicsGraphics2.default)(castMembers);
	  (0, _seasonCastMemberGraphics2.default)(seasons, castMembers);
	  (0, _startingAgeGraphics2.default)(genders, castMembers);
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
	exports.mean = mean;
	exports.meanProperty = meanProperty;
	exports.medianProperty = medianProperty;
	exports.standardDeviation = standardDeviation;
	/*
	 * return the mean value of the data in the array. The data array must be
	 * an array of numbers.
	 */
	function mean(data) {
	  var total = data.reduce(function (acc, d) {
	    return acc + d;
	  }, 0);
	  return total / data.length;
	}

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

	var _total = __webpack_require__(9);

	var _total2 = _interopRequireDefault(_total);

	var _genders = __webpack_require__(13);

	var _genders2 = _interopRequireDefault(_genders);

	var _roles = __webpack_require__(14);

	var _roles2 = _interopRequireDefault(_roles);

	var _genderRoles = __webpack_require__(15);

	var _genderRoles2 = _interopRequireDefault(_genderRoles);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function render(castMembers) {
	  (0, _total2.default)(castMembers, '#basic-total');
	  (0, _genders2.default)(castMembers, '#basic-genders');
	  (0, _roles2.default)(castMembers, '#basic-roles');
	  (0, _genderRoles2.default)(castMembers, '#basic-gender-roles');
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = genderChart;

	var _d = __webpack_require__(1);

	var _d2 = _interopRequireDefault(_d);

	var _base = __webpack_require__(10);

	var _text = __webpack_require__(11);

	var _colors = __webpack_require__(12);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function genderChart(castMembers, holderID) {
	  var formatPercent = _d2.default.format('.0%');
	  var genders = castMembers.reduce(function (acc, cm) {
	    if (cm.gender === 'male') {
	      acc[0]++;
	    } else {
	      acc[1]++;
	    }
	    return acc;
	  }, [0, 0]);
	  var data = [{
	    count: castMembers.length,
	    fill: _colors.green,
	    align: 'start'
	  }];
	  // BASE
	  var base = (0, _base.chartBase)({
	    main: { width: 750, height: 25 },
	    top: { height: 25 }
	  }, holderID);

	  // SCALES
	  var genderScale = _d2.default.scale.linear().domain([0, castMembers.length]).range([0, base.main.width]);

	  (0, _text.addTitle)(base.top, 'Cast Members', 'left');

	  // CHART
	  var allGs = base.main.element.selectAll('g').data(data).enter().append('g');

	  allGs.append('rect').attr('x', 0).attr('y', 0).attr('width', function (d) {
	    return genderScale(d.count);
	  }).attr('height', base.main.height).style('fill', function (d) {
	    return d.fill;
	  });

	  allGs.append('text').text(function (d) {
	    return 'Total Cast Members - ' + d.count;
	  }).style('text-anchor', function (d) {
	    return d.align;
	  }).attr('dx', function (d, i) {
	    return i === 0 ? 5 : -5;
	  }).attr('dy', '0.3em').attr('transform', function (d, i) {
	    var x = i === 0 ? 0 : genderScale(d.count);
	    var y = base.main.height / 2;
	    return 'translate(' + x + ',' + y + ')';
	  });
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
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.addTitle = addTitle;
	exports.addLabel = addLabel;
	function addTitle(section, text) {
	  var align = arguments.length <= 2 || arguments[2] === undefined ? 'center' : arguments[2];
	  var element = section.element;
	  var width = section.width;
	  var height = section.height;

	  var x = undefined;
	  var anchor = undefined;

	  if (align === 'left') {
	    x = 0;
	    anchor = 'start';
	  } else if (align === 'center') {
	    x = width / 2;
	    anchor = 'middle';
	  } else {
	    x = width;
	    anchor = 'end';
	  }
	  element.append('text').text(text).classed('title centered', true).style('text-anchor', anchor).attr('transform', 'translate(' + x + ', ' + height / 2 + ')').attr('dy', '0.5em');
	}

	/*
	 * Add a text label that is centered in the provided section's element.
	 * Takes into account the size of the ticks (as provided by the user) when
	 * determining the positioning.
	 */
	function addLabel(section, text) {
	  var orient = arguments.length <= 2 || arguments[2] === undefined ? 'bottom' : arguments[2];
	  var tickSize = arguments.length <= 3 || arguments[3] === undefined ? 25 : arguments[3];
	  var element = section.element;
	  var width = section.width;
	  var height = section.height;


	  var transformed = '';
	  switch (orient) {
	    case 'top':
	    case 'bottom':
	      var heightOffset = (height - tickSize) / 2 + tickSize;
	      transformed = 'translate(' + width / 2 + ',' + heightOffset + ')';
	      break;
	    case 'left':
	    case 'right':
	      var widthOffset = (width + tickSize) / 2 - tickSize;
	      transformed = 'translate(' + widthOffset + ',' + height / 2 + ')rotate(-90)';
	      break;
	  }

	  element.append('text').text(text).style('text-anchor', 'middle').attr('transform', transformed);
	}

/***/ },
/* 12 */
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
	var purple = exports.purple = '#906e9e';

	var genderColors = exports.genderColors = [brightBlue, yellowGreen];

	/*
	 * Don't Mix:
	 *   brightBlue + brightPink (similar saturation, bad for achromatopsia)
	 */

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = genderChart;

	var _d = __webpack_require__(1);

	var _d2 = _interopRequireDefault(_d);

	var _base = __webpack_require__(10);

	var _text = __webpack_require__(11);

	var _colors = __webpack_require__(12);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function genderChart(castMembers, holderID) {
	  var formatPercent = _d2.default.format('.0%');
	  var genders = castMembers.reduce(function (acc, cm) {
	    if (cm.gender === 'male') {
	      acc[0]++;
	    } else {
	      acc[1]++;
	    }
	    return acc;
	  }, [0, 0]);
	  var data = [{
	    gender: 'Male',
	    count: genders[0],
	    offset: 0,
	    fill: _colors.genderColors[0],
	    align: 'start'
	  }, {
	    gender: 'Female',
	    count: genders[1],
	    offset: genders[0],
	    fill: _colors.genderColors[1],
	    align: 'end'
	  }];
	  // BASE
	  var base = (0, _base.chartBase)({
	    main: { width: 750, height: 25 },
	    top: { height: 25 }
	  }, holderID);

	  // SCALES
	  var genderScale = _d2.default.scale.linear().domain([0, castMembers.length]).range([0, base.main.width]);

	  (0, _text.addTitle)(base.top, 'By Gender', 'left');

	  // CHART
	  var genderGs = base.main.element.selectAll('g').data(data).enter().append('g').attr('transform', function (d) {
	    return 'translate(' + genderScale(d.offset) + ',0)';
	  });

	  genderGs.append('rect').attr('x', 0).attr('y', 0).attr('width', function (d) {
	    return genderScale(d.count);
	  }).attr('height', base.main.height).style('fill', function (d) {
	    return d.fill;
	  });

	  genderGs.append('text').text(function (d) {
	    return d.gender + ' - ' + d.count + ' (' + formatPercent(d.count / castMembers.length) + ')';
	  }).style('text-anchor', function (d) {
	    return d.align;
	  }).attr('dx', function (d, i) {
	    return i === 0 ? 5 : -5;
	  }).attr('dy', '0.3em').attr('transform', function (d, i) {
	    var x = i === 0 ? 0 : genderScale(d.count);
	    var y = base.main.height / 2;
	    return 'translate(' + x + ',' + y + ')';
	  });
	}

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = roleChart;

	var _d = __webpack_require__(1);

	var _d2 = _interopRequireDefault(_d);

	var _base = __webpack_require__(10);

	var _text = __webpack_require__(11);

	var _colors = __webpack_require__(12);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function roleChart(castMembers, holderID) {
	  var formatPercent = _d2.default.format('.0%');
	  var roles = castMembers.reduce(function (acc, cm) {
	    if (cm.featured.length && cm.repertory.length) {
	      acc[1]++;
	    } else if (cm.repertory.length) {
	      acc[0]++;
	    } else {
	      acc[2]++;
	    }
	    return acc;
	  }, [0, 0, 0]);
	  var data = [{
	    role: 'Repertory',
	    align: 'start',
	    count: roles[0],
	    offset: 0,
	    fill: _colors.lightBlue,
	    dx: 5
	  }, {
	    role: 'Both',
	    align: 'middle',
	    count: roles[1],
	    offset: roles[0],
	    fill: _colors.purple,
	    dx: 0
	  }, {
	    role: 'Featured',
	    align: 'end',
	    count: roles[2],
	    offset: roles[0] + roles[1],
	    fill: _colors.brightPink,
	    dx: -5
	  }];

	  // BASE
	  var base = (0, _base.chartBase)({
	    main: { width: 750, height: 25 },
	    top: { height: 25 }
	  }, holderID);

	  // SCALES
	  var roleScale = _d2.default.scale.linear().domain([0, castMembers.length]).range([0, base.main.width]);

	  (0, _text.addTitle)(base.top, 'By Role', 'left');

	  // CHART
	  var roleGs = base.main.element.selectAll('g').data(data).enter().append('g').attr('transform', function (d) {
	    return 'translate(' + roleScale(d.offset) + ',0)';
	  });

	  roleGs.append('rect').attr('x', 0).attr('y', 0).attr('width', function (d) {
	    return roleScale(d.count);
	  }).attr('height', base.main.height).style('fill', function (d) {
	    return d.fill;
	  });

	  roleGs.append('text').text(function (d) {
	    return d.role + ' - ' + d.count + ' (' + formatPercent(d.count / castMembers.length) + ')';
	  }).style('text-anchor', function (d) {
	    return d.align;
	  }).attr('dx', function (d) {
	    return d.dx;
	  }).attr('dy', '0.3em').attr('transform', function (d, i) {
	    var x = 0;
	    if (i === 1) {
	      x = roleScale(d.count) / 2;
	    } else if (i === 2) {
	      x = roleScale(d.count);
	    }
	    var y = base.main.height / 2;
	    return 'translate(' + x + ',' + y + ')';
	  });
	}

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = roleChart;

	var _d = __webpack_require__(1);

	var _d2 = _interopRequireDefault(_d);

	var _base = __webpack_require__(10);

	var _text = __webpack_require__(11);

	var _colors = __webpack_require__(12);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function roleChart(castMembers, holderID) {
	  var formatPercent = _d2.default.format('.0%');
	  var roleKeys = ['Repertory', 'Both', 'Featured'];
	  var roleColors = [_colors.lightBlue, _colors.purple, _colors.brightPink];

	  var genderCounts = castMembers.reduce(function (acc, cm) {
	    var offset = -1;
	    if (cm.featured.length && cm.repertory.length) {
	      offset = 1;
	    } else if (cm.repertory.length) {
	      offset = 0;
	    } else {
	      offset = 2;
	    }
	    acc[cm.gender][offset]++;
	    return acc;
	  }, { male: [0, 0, 0], female: [0, 0, 0] });

	  var genderData = [{
	    gender: 'male',
	    data: genderCounts.male,
	    fill: _colors.brightBlue
	  }, {
	    gender: 'female',
	    data: genderCounts.female,
	    fill: _colors.yellowGreen
	  }];

	  genderData.forEach(function (g, i) {
	    g.offsets = g.data.reduce(function (acc, curr) {
	      var last = acc[acc.length - 1];
	      return acc.concat([last + curr]);
	    }, [0]);
	    g.total = g.data.reduce(function (acc, d) {
	      return acc + d;
	    }, 0);
	    g.gOffset = i === 0 ? 0 : genderData[i - 1].total;
	    g.roleData = g.data.map(function (d, i) {
	      return {
	        count: d,
	        fill: roleColors[i],
	        offset: g.offsets[i],
	        percent: d / g.total
	      };
	    });
	  });

	  // BASE
	  var base = (0, _base.chartBase)({
	    main: { width: 750, height: 30 },
	    top: { height: 25 }
	  }, holderID);

	  // SCALES
	  var roleScale = _d2.default.scale.linear().domain([0, castMembers.length]).range([0, base.main.width]);

	  (0, _text.addTitle)(base.top, 'By Role & Gender', 'left');

	  // CHART
	  var genderGs = base.main.element.selectAll('g.gender').data(genderData).enter().append('g').classed('gender', true).attr('transform', function (d) {
	    return 'translate(' + roleScale(d.gOffset) + ',0)';
	  });

	  var roleGs = genderGs.selectAll('g.role').data(function (d) {
	    return d.roleData;
	  }).enter().append('g').classed('role', true).attr('transform', function (d) {
	    return 'translate(' + roleScale(d.offset) + ',5)';
	  });

	  roleGs.append('rect').attr('x', 0).attr('y', 0).attr('width', function (d) {
	    return roleScale(d.count);
	  }).attr('height', 25).style('fill', function (d, i) {
	    return roleColors[i];
	  });

	  roleGs.append('text').text(function (d) {
	    return d.count + ' (' + formatPercent(d.percent) + ')';
	  }).style('text-anchor', 'middle').attr('dx', 0).attr('dy', '0.3em').attr('transform', function (d, i) {
	    return 'translate(' + roleScale(d.count) / 2 + ',' + 25 / 2 + ')';
	  });

	  genderGs.append('rect').classed('gender-bar', true).attr('x', 0).attr('y', 0).attr('height', 3).attr('width', function (d) {
	    return roleScale(d.total);
	  }).style('fill', function (d) {
	    return d.fill;
	  });
	}

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = render;

	var _seasonCastMembers = __webpack_require__(17);

	var _seasonCastMembers2 = _interopRequireDefault(_seasonCastMembers);

	var _groupedSeasonGenders = __webpack_require__(20);

	var _groupedSeasonGenders2 = _interopRequireDefault(_groupedSeasonGenders);

	var _groupedSeasonRoles = __webpack_require__(22);

	var _groupedSeasonRoles2 = _interopRequireDefault(_groupedSeasonRoles);

	var _seasonGenderPercents = __webpack_require__(23);

	var _seasonGenderPercents2 = _interopRequireDefault(_seasonGenderPercents);

	var _seasonRolePercents = __webpack_require__(24);

	var _seasonRolePercents2 = _interopRequireDefault(_seasonRolePercents);

	var _seasonExperience = __webpack_require__(25);

	var _seasonExperience2 = _interopRequireDefault(_seasonExperience);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function render(seasons, castMembers) {
	  (0, _seasonCastMembers2.default)(seasons, '#season-casts');
	  (0, _groupedSeasonGenders2.default)(seasons, '#season-genders');
	  (0, _groupedSeasonRoles2.default)(seasons, '#season-roles');
	  (0, _seasonGenderPercents2.default)(seasons, '#season-gender-percents');
	  (0, _seasonRolePercents2.default)(seasons, '#season-role-percents');
	  (0, _seasonExperience2.default)(castMembers, '#season-experience');
	}

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = chartCasts;

	var _d = __webpack_require__(1);

	var _d2 = _interopRequireDefault(_d);

	var _base = __webpack_require__(10);

	var _axis = __webpack_require__(18);

	var _text = __webpack_require__(11);

	var _round = __webpack_require__(19);

	var _average = __webpack_require__(7);

	var _colors = __webpack_require__(12);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function chartCasts(seasons, holderID) {
	  var tickValues = seasons.map(function (s) {
	    return s.season;
	  });
	  var yMax = (0, _round.roundUp)(_d2.default.max(seasons, function (s) {
	    return s.total_cast;
	  }), 5);

	  // BASE
	  var base = (0, _base.chartBase)({
	    main: { width: 750, height: 300 },
	    left: { width: 50 },
	    bottom: { height: 50 },
	    top: { height: 30 },
	    right: { width: 100 }
	  }, holderID);

	  // SCALES
	  var seasonScale = _d2.default.scale.ordinal().domain(tickValues).rangeRoundBands([0, base.bottom.width], 0.1);

	  var yScale = _d2.default.scale.linear().domain([0, yMax]).range([base.main.height, 0]);

	  // AXES
	  var xAxis = _d2.default.svg.axis().scale(seasonScale).orient('bottom').tickValues(tickValues).outerTickSize(0);

	  var yAxis = _d2.default.svg.axis().scale(yScale).ticks(10).orient('left');

	  var yGrid = _d2.default.svg.axis().scale(yScale).orient('right').tickSize(base.main.width).ticks(10).tickFormat('').outerTickSize(0);

	  (0, _axis.drawAxis)(base.bottom, xAxis, 'top');
	  (0, _axis.drawAxis)(base.left, yAxis, 'right');
	  (0, _axis.drawAxis)(base.main, yGrid, 'left');
	  (0, _text.addTitle)(base.top, 'Cast Members Per Season');
	  (0, _text.addLabel)(base.bottom, 'Season', 'bottom');

	  // CHART
	  var halfBand = seasonScale.rangeBand() / 2;
	  var quarterBand = halfBand / 2;
	  base.main.element.selectAll('rect').data(seasons).enter().append('rect').attr('width', halfBand).attr('x', function (d) {
	    return seasonScale(d.season) + quarterBand;
	  }).attr('y', function (d) {
	    return yScale(d.total_cast);
	  }).attr('height', function (d) {
	    return base.main.height - yScale(d.total_cast);
	  }).style('fill', _colors.green);

	  var meanCount = (0, _average.meanProperty)(seasons, 'total_cast');
	  var meanLine = base.main.element.append('g').attr('transform', 'translate(0, ' + yScale(meanCount) + ')').classed('mean', true);

	  meanLine.append('line').attr('x1', 0).attr('x2', base.main.width).attr('y1', 0).attr('y2', 0);
	  meanLine.append('text').text('Mean = ' + (0, _round.roundFloat)(meanCount, 1)).attr('x', 3).attr('y', -3);
	}

/***/ },
/* 18 */
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
/* 19 */
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
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = chartGroupedSeasonGenders;

	var _d = __webpack_require__(1);

	var _d2 = _interopRequireDefault(_d);

	var _base = __webpack_require__(10);

	var _axis = __webpack_require__(18);

	var _text = __webpack_require__(11);

	var _legend = __webpack_require__(21);

	var _round = __webpack_require__(19);

	var _colors = __webpack_require__(12);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function chartGroupedSeasonGenders(seasons, holderID) {
	  var tickValues = seasons.map(function (s) {
	    return s.season;
	  });
	  var yMax = (0, _round.roundUp)(_d2.default.max(seasons, function (s) {
	    return Math.max(s.male, s.female);
	  }), 5);

	  // BASE
	  var base = (0, _base.chartBase)({
	    main: { width: 750, height: 300 },
	    left: { width: 50 },
	    bottom: { height: 50 },
	    top: { height: 30 },
	    right: { width: 100 }
	  }, holderID);

	  // SCALES
	  // the scale for each age group
	  var seasonScale = _d2.default.scale.ordinal().domain(tickValues).rangeRoundBands([0, base.bottom.width], 0.1);

	  // the scale for each bar within an age group
	  var groupScale = _d2.default.scale.ordinal().domain([0, 1]).rangeRoundBands([0, seasonScale.rangeBand()]);

	  var yScale = _d2.default.scale.linear().domain([0, yMax]).range([base.main.height, 0]);

	  // AXES
	  var groupedXAxis = _d2.default.svg.axis().scale(seasonScale).orient('bottom').tickValues(tickValues).outerTickSize(0);

	  var yAxis = _d2.default.svg.axis().scale(yScale).ticks(10).orient('left');

	  var yGrid = _d2.default.svg.axis().scale(yScale).orient('right').tickSize(base.main.width).ticks(10).tickFormat('').outerTickSize(0);

	  (0, _axis.drawAxis)(base.bottom, groupedXAxis, 'top');
	  (0, _axis.drawAxis)(base.left, yAxis, 'right');
	  (0, _axis.drawAxis)(base.main, yGrid, 'left');
	  (0, _text.addTitle)(base.top, 'Cast Members Per Season (by Gender)');
	  (0, _text.addLabel)(base.bottom, 'Season', 'bottom');
	  (0, _legend.verticalLegend)(base.right, [{ color: _colors.genderColors[0], text: 'Male' }, { color: _colors.genderColors[1], text: 'Female' }], {
	    offset: {
	      left: 10,
	      top: 50
	    }
	  });

	  // CHART
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
	}

/***/ },
/* 21 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.verticalLegend = verticalLegend;
	exports.horizontalLegend = horizontalLegend;
	/*
	 * add a vertical (stacked) legend to the specified @section
	 * @keys is an array of keys to draw in the legend. Each one should specify
	 * its text value and what color it is associated with in the chart.
	 * @options can be provided to configure the layout of the legend. These include:
	 *    offset - provide a top and left amount to translate the legend 'g' away
	 *             from the default position in the top left corner (0,0)
	 *    padding - the amount of padding around each key (top and bottom)
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
	 * same as verticalLegend, but horizontal instead of vertical.
	 * padding will be left and right
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
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = chartGroupedSeasonGenders;

	var _d = __webpack_require__(1);

	var _d2 = _interopRequireDefault(_d);

	var _base = __webpack_require__(10);

	var _axis = __webpack_require__(18);

	var _text = __webpack_require__(11);

	var _legend = __webpack_require__(21);

	var _round = __webpack_require__(19);

	var _colors = __webpack_require__(12);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var roleColors = [_colors.lightBlue, _colors.brightPink];

	function chartGroupedSeasonGenders(seasons, holderID) {
	  var tickValues = seasons.map(function (s) {
	    return s.season;
	  });
	  seasons.forEach(function (s) {
	    s.rep_count = s.repertory.male + s.repertory.female;
	    s.feat_count = s.featured.male + s.featured.female;
	  });
	  var yMax = (0, _round.roundUp)(_d2.default.max(seasons, function (s) {
	    return Math.max(s.rep_count, s.feat_count);
	  }), 5);

	  // BASE
	  var base = (0, _base.chartBase)({
	    main: { width: 750, height: 300 },
	    left: { width: 50 },
	    bottom: { height: 50 },
	    top: { height: 30 },
	    right: { width: 100 }
	  }, holderID);

	  // SCALES
	  // the scale for each age group
	  var seasonScale = _d2.default.scale.ordinal().domain(tickValues).rangeRoundBands([0, base.bottom.width], 0.1);

	  // the scale for each bar within an age group
	  var groupScale = _d2.default.scale.ordinal().domain([0, 1]).rangeRoundBands([0, seasonScale.rangeBand()]);

	  var yScale = _d2.default.scale.linear().domain([0, yMax]).range([base.main.height, 0]);

	  // AXES
	  var groupedXAxis = _d2.default.svg.axis().scale(seasonScale).orient('bottom').tickValues(tickValues).outerTickSize(0);

	  var yAxis = _d2.default.svg.axis().scale(yScale).ticks(10).orient('left');

	  var yGrid = _d2.default.svg.axis().scale(yScale).orient('right').tickSize(base.main.width).ticks(10).tickFormat('').outerTickSize(0);

	  (0, _axis.drawAxis)(base.bottom, groupedXAxis, 'top');
	  (0, _axis.drawAxis)(base.left, yAxis, 'right');
	  (0, _axis.drawAxis)(base.main, yGrid, 'left');
	  (0, _text.addTitle)(base.top, 'Cast Members Per Season (by Role)');
	  (0, _text.addLabel)(base.bottom, 'Season', 'bottom');
	  (0, _legend.verticalLegend)(base.right, [{ color: roleColors[0], text: 'Repertory' }, { color: roleColors[1], text: 'Featured' }], {
	    offset: {
	      left: 10,
	      top: 50
	    }
	  });

	  // CHART
	  var seasonGroups = base.main.element.selectAll('g.age').data(seasons).enter().append('g').classed('age', true).attr('transform', function (d, i) {
	    return 'translate(' + seasonScale(d.season) + ', 0)';
	  });

	  seasonGroups.selectAll('rect').data(function (d) {
	    return [d.rep_count, d.feat_count];
	  }).enter().append('rect').attr('width', groupScale.rangeBand()).attr('x', function (d, i) {
	    return groupScale(i);
	  }).attr('y', function (d) {
	    return yScale(d);
	  }).attr('height', function (d) {
	    return base.main.height - yScale(d);
	  }).style('fill', function (d, i) {
	    return roleColors[i];
	  });
	}

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = chartGenderPercents;

	var _d = __webpack_require__(1);

	var _d2 = _interopRequireDefault(_d);

	var _base = __webpack_require__(10);

	var _axis = __webpack_require__(18);

	var _text = __webpack_require__(11);

	var _legend = __webpack_require__(21);

	var _colors = __webpack_require__(12);

	var _average = __webpack_require__(7);

	var _round = __webpack_require__(19);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function chartGenderPercents(seasons, holderID) {
	  // save here instead of calculating this multiple times
	  seasons.forEach(function (s) {
	    s.male_percent = s.male / s.total_cast;
	  });

	  var tickValues = seasons.map(function (s) {
	    return s.season;
	  });
	  var formatPercent = _d2.default.format('.0%');
	  var meanPercent = (0, _average.meanProperty)(seasons, 'male_percent');
	  var roundMean = Math.round(meanPercent * 100) / 100;
	  // BASE
	  var base = (0, _base.chartBase)({
	    main: { width: 900, height: 300 },
	    left: { width: 50 },
	    bottom: { height: 50 },
	    top: { height: 30 },
	    right: { width: 100 }
	  }, holderID);

	  // SCALES
	  var seasonScale = _d2.default.scale.ordinal().domain(tickValues).rangeRoundBands([0, base.bottom.width], 0.1, 0);

	  var yScale = _d2.default.scale.linear().domain([0, 1]).range([base.main.height, 0]);

	  // AXES
	  var xAxis = _d2.default.svg.axis().scale(seasonScale).orient('bottom').tickValues(tickValues).outerTickSize(0);

	  var perTicks = [0, 0.25, 0.5, 0.75, 1.0].concat(roundMean).sort();
	  var yAxis = _d2.default.svg.axis().scale(yScale).tickValues(perTicks).orient('left').tickFormat(formatPercent);

	  (0, _axis.drawAxis)(base.bottom, xAxis, 'top');
	  (0, _axis.drawAxis)(base.left, yAxis, 'right');

	  (0, _text.addTitle)(base.top, 'Cast Member Genders');
	  (0, _text.addLabel)(base.bottom, 'Season', 'bottom');
	  (0, _legend.verticalLegend)(base.right, [{ color: _colors.genderColors[1], text: 'Female' }, { color: _colors.genderColors[0], text: 'Male' }], {
	    offset: {
	      left: 10,
	      top: 50
	    }
	  });

	  // CHART
	  var bandWidth = seasonScale.rangeBand();
	  var bars = base.main.element.append('g').classed('bars', true).selectAll('g.bar').data(seasons).enter().append('g').classed('bar', true).attr('transform', function (d) {
	    return 'translate(' + seasonScale(d.season) + ',0)';
	  });

	  bars.append('rect').classed('male-percent', true).attr('width', bandWidth).attr('x', 0).attr('y', function (d) {
	    return yScale(d.male_percent);
	  }).attr('height', function (d) {
	    return base.main.height - yScale(d.male_percent);
	  }).style('fill', _colors.genderColors[0]);

	  bars.append('rect').classed('female-percent', true).attr('width', bandWidth).attr('x', 0).attr('y', 0).attr('height', function (d) {
	    return yScale(d.male_percent);
	  }).style('fill', _colors.genderColors[1]);

	  var halfWidth = bandWidth / 2;
	  bars.append('text').classed('percent', true).attr('transform', function (d) {
	    var x = halfWidth;
	    var y = yScale(d.male_percent) + 15;
	    return 'translate(' + x + ',' + y + ')';
	  }).text(function (d) {
	    return Math.floor(d.male / d.total_cast * 100);
	  }).style('text-anchor', 'middle').style('font-size', '14px');

	  // draw a line depicting the mean percentage
	  base.main.element.append('line').attr('x1', 0).attr('x2', base.main.width).attr('y1', yScale(meanPercent)).attr('y2', yScale(meanPercent)).style('stroke-dasharray', '2, 5');
	}

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = chartRolePercents;

	var _d = __webpack_require__(1);

	var _d2 = _interopRequireDefault(_d);

	var _base = __webpack_require__(10);

	var _axis = __webpack_require__(18);

	var _text = __webpack_require__(11);

	var _legend = __webpack_require__(21);

	var _average = __webpack_require__(7);

	var _round = __webpack_require__(19);

	var _colors = __webpack_require__(12);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var roleColors = [_colors.brightPink, _colors.lightBlue];

	function chartRolePercents(seasons, holderID) {
	  seasons.forEach(function (s) {
	    var rep_count = s.repertory.male + s.repertory.female;
	    s.repertory_percent = rep_count / s.total_cast;
	  });
	  var tickValues = seasons.map(function (s) {
	    return s.season;
	  });
	  var formatPercent = _d2.default.format('.0%');
	  var meanPercent = (0, _average.meanProperty)(seasons, 'repertory_percent');
	  var roundMean = Math.round(meanPercent * 100) / 100;
	  // BASE
	  var base = (0, _base.chartBase)({
	    main: { width: 900, height: 300 },
	    left: { width: 50 },
	    bottom: { height: 50 },
	    top: { height: 30 },
	    right: { width: 100 }
	  }, holderID);

	  // SCALES
	  var seasonScale = _d2.default.scale.ordinal().domain(tickValues).rangeRoundBands([0, base.bottom.width], 0.1);

	  var yScale = _d2.default.scale.linear().domain([0, 1]).range([base.main.height, 0]);

	  // AXES
	  var xAxis = _d2.default.svg.axis().scale(seasonScale).orient('bottom').tickValues(tickValues).outerTickSize(0);

	  var perTicks = [0, 0.25, 0.5, 0.75, 1.0].concat(roundMean).sort();
	  var yAxis = _d2.default.svg.axis().scale(yScale).tickValues(perTicks).orient('left').tickFormat(formatPercent);

	  (0, _axis.drawAxis)(base.bottom, xAxis, 'top');
	  (0, _axis.drawAxis)(base.left, yAxis, 'right');

	  (0, _text.addTitle)(base.top, 'Cast Member Roles');
	  (0, _text.addLabel)(base.bottom, 'Season', 'bottom');
	  (0, _legend.verticalLegend)(base.right, [{ color: roleColors[0], text: 'Repertory' }, { color: roleColors[1], text: 'Featured' }], {
	    offset: {
	      left: 10,
	      top: 50
	    }
	  });

	  // CHART
	  var bandWidth = seasonScale.rangeBand();
	  var bars = base.main.element.append('g').classed('bars', true).selectAll('g.bar').data(seasons).enter().append('g').classed('bar', true).attr('transform', function (d) {
	    return 'translate(' + seasonScale(d.season) + ',0)';
	  });

	  bars.append('rect').classed('rep-percent', true).attr('width', bandWidth).attr('x', 0).attr('y', function (d) {
	    return yScale(d.repertory_percent);
	  }).attr('height', function (d) {
	    return base.main.height - yScale(d.repertory_percent);
	  }).style('fill', roleColors[0]);

	  bars.append('rect').classed('feat-percent', true).attr('width', bandWidth).attr('x', 0).attr('y', 0).attr('height', function (d) {
	    return yScale(d.repertory_percent);
	  }).style('fill', roleColors[1]);

	  /*
	   * unline in seasonGenderPercents, here the percent text is separate from
	   * the bars. This is done solely because the text here is a differnt color
	   * than the mean line, and I want the mean line behind the text (but on top
	   * of the bars).
	   */
	  // draw a line depicting the mean percentage
	  base.main.element.append('line').attr('x1', 0).attr('x2', base.main.width).attr('y1', yScale(meanPercent)).attr('y2', yScale(meanPercent)).style('stroke-dasharray', '2, 5');

	  var halfWidth = bandWidth / 2;
	  base.main.element.append('g').classed('perc-tect', true).selectAll('text.percent').data(seasons).enter().append('text').classed('percent', true).attr('transform', function (d) {
	    var x = seasonScale(d.season) + halfWidth;
	    var y = yScale(d.repertory_percent) + 15;
	    return 'translate(' + x + ',' + y + ')';
	  }).text(function (d) {
	    return Math.floor(d.repertory_percent * 100);
	  }).style('text-anchor', 'middle').style('font-size', '14px').style('fill', '#fff');
	}

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = chartSeasonExperience;

	var _d = __webpack_require__(1);

	var _d2 = _interopRequireDefault(_d);

	var _base = __webpack_require__(10);

	var _axis = __webpack_require__(18);

	var _text = __webpack_require__(11);

	var _legend = __webpack_require__(21);

	var _average = __webpack_require__(7);

	var _colors = __webpack_require__(12);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function chartSeasonExperience(castMembers, holderID) {
	  var seasonExperiences = calculateExperience(castMembers);
	  var meanPercent = (0, _average.mean)(seasonExperiences);
	  var tickValues = seasonExperiences.map(function (s, i) {
	    return i + 1;
	  });
	  var yMax = Math.ceil(_d2.default.max(seasonExperiences));

	  // BASE
	  var base = (0, _base.chartBase)({
	    main: { width: 900, height: 300 },
	    left: { width: 50 },
	    bottom: { height: 50 },
	    top: { height: 30 },
	    right: { width: 100 }
	  }, holderID);

	  // SCALES
	  var seasonScale = _d2.default.scale.ordinal().domain(tickValues).rangeRoundBands([0, base.bottom.width], 0.1);

	  var yScale = _d2.default.scale.linear().domain([0, yMax]).range([base.main.height, 0]);

	  // AXES
	  var xAxis = _d2.default.svg.axis().scale(seasonScale).orient('bottom').tickValues(tickValues).outerTickSize(0);

	  var baseTicks = Array.from(new Array(yMax + 1)).map(function (u, i) {
	    return i;
	  });
	  var meanTicks = baseTicks.concat([meanPercent]).sort();
	  var yAxis = _d2.default.svg.axis().scale(yScale).tickValues(meanTicks).orient('left');

	  var yGrid = _d2.default.svg.axis().scale(yScale).orient('right').tickSize(base.main.width).tickValues(baseTicks).tickFormat('').outerTickSize(0);

	  (0, _axis.drawAxis)(base.bottom, xAxis, 'top');
	  (0, _axis.drawAxis)(base.left, yAxis, 'right');
	  (0, _axis.drawAxis)(base.main, yGrid, 'left');
	  (0, _text.addTitle)(base.top, 'Cast Member Experience');
	  (0, _text.addLabel)(base.bottom, 'Season', 'bottom');
	  (0, _text.addLabel)(base.left, 'Mean Years Experience', 'left');

	  // CHART

	  var barWidth = seasonScale.rangeBand();
	  base.main.element.append('g').classed('bars', true).selectAll('rect.bar').data(seasonExperiences).enter().append('rect').classed('bar', true).attr('x', function (d, i) {
	    return seasonScale(i + 1);
	  }).attr('y', function (d) {
	    return yScale(d);
	  }).attr('width', barWidth).attr('height', function (d) {
	    return base.main.height - yScale(d);
	  }).style('fill', _colors.purple);

	  var halfWidth = barWidth / 2;
	  var texts = base.main.element.append('g').classed('text', true).selectAll('text').data(seasonExperiences).enter().append('text').text(function (d) {
	    return Math.round(d * 10) / 10;
	  }).attr('transform', function (d, i) {
	    var x = seasonScale(i + 1) + halfWidth;
	    var y = yScale(d) - 17;
	    return 'translate(' + x + ',' + y + ')';
	  }).attr('dy', '1em').style('text-anchor', 'middle').style('font-size', 14);

	  base.main.element.append('line').attr('x1', 0).attr('x2', base.main.width).attr('y1', yScale(meanPercent)).attr('y2', yScale(meanPercent)).style('stroke-dasharray', '2, 5');
	}

	function calculateExperience(castMembers) {
	  var seasons = {};
	  castMembers.forEach(function (cm) {
	    var experience = 0;
	    cm.featured.forEach(function (s) {
	      if (seasons[s] === undefined) {
	        seasons[s] = {
	          total: 0,
	          count: 0
	        };
	      }
	      seasons[s].total += experience;
	      seasons[s].count++;
	      experience++;
	    });
	    cm.repertory.forEach(function (s) {
	      if (seasons[s] === undefined) {
	        seasons[s] = {
	          total: 0,
	          count: 0
	        };
	      }
	      seasons[s].total += experience;
	      seasons[s].count++;
	      experience++;
	    });
	  });
	  var seasonKeys = Object.keys(seasons);
	  var seasonExperiences = Array.from(new Array(seasonKeys.length)).fill(0);
	  seasonKeys.forEach(function (key) {
	    var _seasons$key = seasons[key];
	    var total = _seasons$key.total;
	    var count = _seasons$key.count;

	    seasonExperiences[key - 1] = total / count;
	  });
	  return seasonExperiences;
	}

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = render;

	var _startingAges = __webpack_require__(27);

	var _startingAges2 = _interopRequireDefault(_startingAges);

	var _groupedStartingAges = __webpack_require__(28);

	var _groupedStartingAges2 = _interopRequireDefault(_groupedStartingAges);

	var _normalizedStartingAges = __webpack_require__(30);

	var _normalizedStartingAges2 = _interopRequireDefault(_normalizedStartingAges);

	var _startingAgesTable = __webpack_require__(31);

	var _startingAgesTable2 = _interopRequireDefault(_startingAgesTable);

	var _startingAgeBySeasonAndGender = __webpack_require__(33);

	var _startingAgeBySeasonAndGender2 = _interopRequireDefault(_startingAgeBySeasonAndGender);

	var _startingAgeBySeasonAndRole = __webpack_require__(34);

	var _startingAgeBySeasonAndRole2 = _interopRequireDefault(_startingAgeBySeasonAndRole);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function render(genders, castMembers) {
	  (0, _startingAges2.default)(genders, '#starting-age');
	  (0, _groupedStartingAges2.default)(genders, '#starting-age-gender');
	  (0, _normalizedStartingAges2.default)(genders, '#starting-age-normalized');
	  (0, _startingAgesTable2.default)(genders, '#starting-age-table');
	  (0, _startingAgeBySeasonAndGender2.default)(castMembers, '#starting-age-season-gender');
	  (0, _startingAgeBySeasonAndRole2.default)(castMembers, '#starting-age-season-role');
	}

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = chartStartingAges;

	var _d = __webpack_require__(1);

	var _d2 = _interopRequireDefault(_d);

	var _base = __webpack_require__(10);

	var _axis = __webpack_require__(18);

	var _text = __webpack_require__(11);

	var _round = __webpack_require__(19);

	var _colors = __webpack_require__(12);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function chartStartingAges(data, holderID) {
	  var all = data.all;
	  var _all$start$ages = all.start.ages;
	  var ages = _all$start$ages.ages;
	  var offset = _all$start$ages.offset;

	  var tickValues = Array.from(new Array(ages.length)).map(function (u, i) {
	    return i + offset;
	  });
	  var yMax = (0, _round.roundUp)(_d2.default.max(ages), 5);

	  // BASE
	  var base = (0, _base.chartBase)({
	    main: { width: 650, height: 300 },
	    left: { width: 50 },
	    bottom: { height: 50 },
	    top: { height: 30 },
	    right: { width: 100 }
	  }, holderID);

	  // SCALES
	  var ageScale = _d2.default.scale.ordinal().domain(tickValues).rangeRoundBands([0, base.bottom.width], 0.5);

	  var yScale = _d2.default.scale.linear().domain([0, yMax]).range([base.main.height, 0]);

	  // AXES
	  var xAxis = _d2.default.svg.axis().scale(ageScale).orient('bottom').tickValues(tickValues).outerTickSize(0);

	  var yAxis = _d2.default.svg.axis().scale(yScale).ticks(10).orient('left');

	  var yGrid = _d2.default.svg.axis().scale(yScale).orient('right').tickSize(base.main.width).ticks(10).tickFormat('').outerTickSize(0);

	  (0, _axis.drawAxis)(base.bottom, xAxis, 'top');
	  (0, _axis.drawAxis)(base.left, yAxis, 'right');
	  (0, _axis.drawAxis)(base.main, yGrid, 'left');
	  (0, _text.addTitle)(base.top, 'Starting Age of SNL Cast Members');
	  (0, _text.addLabel)(base.bottom, 'Age (Rounded Down)', 'bottom');

	  // CHART
	  var halfWidth = ageScale.rangeBand();
	  base.main.element.selectAll('rect').data(ages).enter().append('rect').attr('width', halfWidth).attr('x', function (d, i) {
	    return ageScale(i + offset);
	  }).attr('y', function (d) {
	    return yScale(d);
	  }).attr('height', function (d) {
	    return base.main.height - yScale(d);
	  }).style('fill', _colors.green);
	}

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = chartGroupedStartingAges;

	var _d = __webpack_require__(1);

	var _d2 = _interopRequireDefault(_d);

	var _base = __webpack_require__(10);

	var _axis = __webpack_require__(18);

	var _text = __webpack_require__(11);

	var _legend = __webpack_require__(21);

	var _round = __webpack_require__(19);

	var _colors = __webpack_require__(12);

	var _merge = __webpack_require__(29);

	var _merge2 = _interopRequireDefault(_merge);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function chartGroupedStartingAges(data, holderID) {
	  var male = data.male;
	  var female = data.female;

	  var _mergeData = (0, _merge2.default)({ data: male.start.ages.ages, offset: male.start.ages.offset }, { data: female.start.ages.ages, offset: female.start.ages.offset });

	  var ages = _mergeData.data;
	  var offset = _mergeData.offset;

	  var tickValues = Array.from(new Array(ages.length)).map(function (u, i) {
	    return i + offset;
	  });
	  var yMax = (0, _round.roundUp)(_d2.default.max(ages, function (a) {
	    return Math.max(a[0], a[1]);
	  }), 5);

	  // BASE
	  var base = (0, _base.chartBase)({
	    main: { width: 650, height: 300 },
	    left: { width: 50 },
	    bottom: { height: 50 },
	    top: { height: 30 },
	    right: { width: 100 }
	  }, holderID);

	  // SCALES
	  // the scale for each age group
	  var ageScale = _d2.default.scale.ordinal().domain(tickValues).rangeRoundBands([0, base.bottom.width], 0.1);

	  // the scale for each bar within an age group
	  var groupScale = _d2.default.scale.ordinal().domain([0, 1]).rangeRoundBands([0, ageScale.rangeBand()]);

	  var yScale = _d2.default.scale.linear().domain([0, yMax]).range([base.main.height, 0]);

	  // AXES
	  var groupedXAxis = _d2.default.svg.axis().scale(ageScale).orient('bottom').tickValues(tickValues).outerTickSize(0);

	  var yAxis = _d2.default.svg.axis().scale(yScale).ticks(10).orient('left');

	  var yGrid = _d2.default.svg.axis().scale(yScale).orient('right').tickSize(base.main.width).ticks(10).tickFormat('').outerTickSize(0);

	  (0, _axis.drawAxis)(base.bottom, groupedXAxis, 'top');
	  (0, _axis.drawAxis)(base.left, yAxis, 'right');
	  (0, _axis.drawAxis)(base.main, yGrid, 'left');
	  (0, _text.addTitle)(base.top, 'Starting Age of SNL Cast Members (by Gender)');
	  (0, _text.addLabel)(base.bottom, 'Age (Rounded Down)', 'bottom');
	  (0, _legend.verticalLegend)(base.right, [{ color: _colors.genderColors[0], text: 'Male' }, { color: _colors.genderColors[1], text: 'Female' }], {
	    offset: {
	      left: 10,
	      top: 100
	    }
	  });

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
	}

/***/ },
/* 29 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = mergeData;

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	/*
	 * merges the first and second data sets. first and second are both objects containing
	 * an array of data and an offset. Each position in the array represents a value that is
	 * calculated by adding the offset and the index. For example, given the object:
	 * {
	 *   data: [4,5,6],
	 *   offset: 24
	 * }
	 * data[0] represents the value 24, data[1] is 25, and data[2] is 26.
	 * In order to merge the data arrays together, both need to have the same offset and length.
	 * This is done by padding the arrays at the beginning and end as needed. The default padding
	 * is the number 0, but a different one can be used if provided.
	 *
	 * This returns an object with two properties, data and offset.
	 * data is the array of merged data. offset is the lower of the offsets between first and second
	 */
	function mergeData(first, second) {
	  var pad = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
	  var firstData = first.data;
	  var firstOffset = first.offset;
	  var secondData = second.data;
	  var secondOffset = second.offset;


	  var lowFirst = firstOffset;
	  var highFirst = firstOffset + firstData.length;

	  var lowSecond = secondOffset;
	  var highSecond = secondOffset + secondData.length;

	  var lowest = Math.min(lowFirst, lowSecond);
	  var highest = Math.max(highFirst, highSecond);

	  var paddedFirst = padArray(firstData, lowFirst - lowest, highest - highFirst, pad);
	  var paddedSecond = padArray(secondData, lowSecond - lowest, highest - highSecond, pad);

	  return {
	    data: paddedFirst.map(function (u, index) {
	      return [paddedFirst[index], paddedSecond[index]];
	    }),
	    offset: lowest
	  };
	}

	/*
	 * return a new array of length front + arr.length + back. The front number of items at the
	 * beginning of the array and the end number of items at the end of the array will have the
	 * pad value.
	 */
	function padArray(arr, front, back) {
	  var pad = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];

	  return [].concat(_toConsumableArray(Array.from(new Array(front)).fill(pad)), _toConsumableArray(arr), _toConsumableArray(Array.from(new Array(back).fill(pad))));
	}

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = chartNormalizedStartingAges;

	var _d = __webpack_require__(1);

	var _d2 = _interopRequireDefault(_d);

	var _base = __webpack_require__(10);

	var _axis = __webpack_require__(18);

	var _text = __webpack_require__(11);

	var _legend = __webpack_require__(21);

	var _round = __webpack_require__(19);

	var _colors = __webpack_require__(12);

	var _merge = __webpack_require__(29);

	var _merge2 = _interopRequireDefault(_merge);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function chartNormalizedStartingAges(data, holderID) {
	  var male = data.male;
	  var female = data.female;

	  // normalize the counts per age as a percentage

	  var maleStartAges = male.start.ages;
	  var totalMale = maleStartAges.ages.reduce(function (acc, curr) {
	    return acc + curr;
	  }, 0);
	  var malePercents = maleStartAges.ages.map(function (count) {
	    return count / totalMale;
	  });

	  var femaleStartAges = female.start.ages;
	  var totalFemale = femaleStartAges.ages.reduce(function (acc, curr) {
	    return acc + curr;
	  }, 0);
	  var femalePercents = femaleStartAges.ages.map(function (count) {
	    return count / totalFemale;
	  });

	  var _mergeData = (0, _merge2.default)({ data: malePercents, offset: maleStartAges.offset }, { data: femalePercents, offset: femaleStartAges.offset });

	  var ages = _mergeData.data;
	  var offset = _mergeData.offset;

	  var tickValues = Array.from(new Array(ages.length)).map(function (u, i) {
	    return i + offset;
	  });
	  var yMax = (0, _round.roundUp)(_d2.default.max(ages, function (a) {
	    return Math.max(a[0], a[1]);
	  }) * 100, 5) / 100;
	  var formatPercent = _d2.default.format('.0%');

	  // BASE
	  var base = (0, _base.chartBase)({
	    main: { width: 650, height: 300 },
	    left: { width: 50 },
	    bottom: { height: 50 },
	    top: { height: 30 },
	    right: { width: 100 }
	  }, holderID);

	  // SCALES
	  // the scale for each age group
	  var ageScale = _d2.default.scale.ordinal().domain(tickValues).rangeRoundBands([0, base.bottom.width], 0.1);

	  // the scale for each bar within an age group
	  var groupScale = _d2.default.scale.ordinal().domain([0, 1]).rangeRoundBands([0, ageScale.rangeBand()]);

	  var yScale = _d2.default.scale.linear().domain([0, yMax]).range([base.main.height, 0]);

	  // AXES
	  var groupedXAxis = _d2.default.svg.axis().scale(ageScale).orient('bottom').tickValues(tickValues).outerTickSize(0);

	  var threePercTicks = [];
	  var perc = 0;
	  while (perc <= yMax) {
	    threePercTicks.push(perc);
	    perc += 0.03;
	  }

	  var yAxis = _d2.default.svg.axis().scale(yScale).tickValues(threePercTicks).orient('left').tickFormat(formatPercent);

	  var yGrid = _d2.default.svg.axis().scale(yScale).orient('right').tickSize(base.main.width).tickValues(threePercTicks).tickFormat('').outerTickSize(0);

	  (0, _axis.drawAxis)(base.bottom, groupedXAxis, 'top');
	  (0, _axis.drawAxis)(base.left, yAxis, 'right');
	  (0, _axis.drawAxis)(base.main, yGrid, 'left');
	  (0, _text.addTitle)(base.top, 'Starting Age of SNL Cast Members (by Gender)');
	  (0, _text.addLabel)(base.bottom, 'Age (Rounded Down)', 'bottom');
	  (0, _legend.verticalLegend)(base.right, [{ color: _colors.genderColors[0], text: 'Male' }, { color: _colors.genderColors[1], text: 'Female' }], {
	    offset: {
	      left: 10,
	      top: 100
	    }
	  });

	  // CHART
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
	}

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = startingAgesTable;

	var _round = __webpack_require__(19);

	var _date = __webpack_require__(2);

	var _table = __webpack_require__(32);

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
/* 32 */
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
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	exports.default = chartStartingAges;

	var _d2 = __webpack_require__(1);

	var _d3 = _interopRequireDefault(_d2);

	var _base = __webpack_require__(10);

	var _axis = __webpack_require__(18);

	var _text = __webpack_require__(11);

	var _legend = __webpack_require__(21);

	var _round = __webpack_require__(19);

	var _date = __webpack_require__(2);

	var _colors = __webpack_require__(12);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var _genderColors = _slicedToArray(_colors.genderColors, 2);

	var maleColor = _genderColors[0];
	var femaleColor = _genderColors[1];
	function chartStartingAges(castMembers, holderID) {
	  var filteredCastMembers = castMembers.filter(function (cm) {
	    return cm.start_age !== undefined;
	  });
	  var minSeason = Infinity;
	  var maxSeason = -Infinity;
	  var startSeasons = filteredCastMembers.forEach(function (cm) {
	    var fs = cm.firstSeason;
	    if (fs < minSeason) {
	      minSeason = fs;
	    }
	    if (fs > maxSeason) {
	      maxSeason = fs;
	    }
	  });
	  var tickValues = Array.from(new Array(maxSeason - minSeason + 1)).map(function (u, i) {
	    return i + minSeason;
	  });
	  var maxYears = (0, _round.roundUp)((0, _date.daysToYears)(_d3.default.max(filteredCastMembers, function (cm) {
	    return cm.start_age;
	  })), 5);

	  // BASE
	  var base = (0, _base.chartBase)({
	    main: { width: 750, height: 300 },
	    left: { width: 50 },
	    bottom: { height: 50 },
	    top: { height: 30 },
	    right: { width: 100 }
	  }, holderID);

	  // SCALES
	  var seasonScale = _d3.default.scale.ordinal().domain(tickValues).rangeRoundBands([0, base.bottom.width], 0.1);

	  // find out the oldest starting age, convert to years
	  var yScale = _d3.default.scale.linear().domain([0, 50]).range([base.main.height, 0]);

	  // AXES
	  var xAxis = _d3.default.svg.axis().scale(seasonScale).orient('bottom').tickValues(tickValues).outerTickSize(0);

	  var yAxis = _d3.default.svg.axis().scale(yScale).ticks(10).orient('left');

	  (0, _axis.drawAxis)(base.bottom, xAxis, 'top');
	  (0, _axis.drawAxis)(base.left, yAxis, 'right');
	  (0, _text.addTitle)(base.top, 'Starting Age By Season');
	  (0, _text.addLabel)(base.bottom, 'Season', 'bottom');
	  (0, _text.addLabel)(base.left, 'Starting Age', 'left');
	  (0, _legend.verticalLegend)(base.right, [{ color: maleColor, text: 'Male' }, { color: femaleColor, text: 'Female' }], {
	    offset: {
	      left: 10,
	      top: 100
	    }
	  });

	  base.main.element.append('g').classed('scale-bars', true).selectAll('rect').data(tickValues).enter().append('rect').attr('x', function (d) {
	    return seasonScale(d);
	  }).attr('y', 0).attr('width', seasonScale.rangeBand()).attr('height', base.main.height);

	  // CHART
	  var halfWidth = seasonScale.rangeBand() / 2;
	  // create a group for every age
	  base.main.element.selectAll('circle').data(filteredCastMembers).enter().append('circle').attr('r', 2).attr('cx', function (d) {
	    return seasonScale(d.firstSeason) + halfWidth;
	  }).attr('cy', function (d) {
	    return yScale((0, _date.daysToYears)(d.start_age));
	  }).style('fill', function (d) {
	    return d.gender === 'male' ? maleColor : femaleColor;
	  });
	}

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = chartStartingAges;

	var _d = __webpack_require__(1);

	var _d2 = _interopRequireDefault(_d);

	var _base = __webpack_require__(10);

	var _axis = __webpack_require__(18);

	var _text = __webpack_require__(11);

	var _legend = __webpack_require__(21);

	var _round = __webpack_require__(19);

	var _date = __webpack_require__(2);

	var _colors = __webpack_require__(12);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function chartStartingAges(castMembers, holderID) {
	  var filteredCastMembers = castMembers.filter(function (cm) {
	    return cm.start_age !== undefined;
	  });
	  var minSeason = Infinity;
	  var maxSeason = -Infinity;
	  var startSeasons = filteredCastMembers.forEach(function (cm) {
	    var fs = cm.firstSeason;
	    if (fs < minSeason) {
	      minSeason = fs;
	    }
	    if (fs > maxSeason) {
	      maxSeason = fs;
	    }
	  });
	  var tickValues = Array.from(new Array(maxSeason - minSeason + 1)).map(function (u, i) {
	    return i + minSeason;
	  });
	  // find out the oldest starting age, convert to years
	  var maxYears = (0, _round.roundUp)((0, _date.daysToYears)(_d2.default.max(filteredCastMembers, function (cm) {
	    return cm.start_age;
	  })), 5);

	  // BASE
	  var base = (0, _base.chartBase)({
	    main: { width: 750, height: 300 },
	    left: { width: 50 },
	    bottom: { height: 50 },
	    top: { height: 30 },
	    right: { width: 100 }
	  }, holderID);

	  // SCALES
	  var seasonScale = _d2.default.scale.ordinal().domain(tickValues).rangeRoundBands([0, base.bottom.width], 0.1);

	  var yScale = _d2.default.scale.linear().domain([0, 50]).range([base.main.height, 0]);

	  // AXES
	  var xAxis = _d2.default.svg.axis().scale(seasonScale).orient('bottom').tickValues(tickValues).outerTickSize(0);

	  var yAxis = _d2.default.svg.axis().scale(yScale).ticks(10).orient('left');

	  var yGrid = _d2.default.svg.axis().scale(yScale).orient('right').tickSize(base.main.width).ticks(10).tickFormat('').outerTickSize(0);

	  (0, _axis.drawAxis)(base.bottom, xAxis, 'top');
	  (0, _axis.drawAxis)(base.left, yAxis, 'right');
	  (0, _text.addTitle)(base.top, 'Starting Age of SNL Cast Members');
	  (0, _text.addLabel)(base.bottom, 'Season', 'bottom');
	  (0, _text.addLabel)(base.left, 'Starting Age', 'left');
	  (0, _legend.verticalLegend)(base.right, [{ color: _colors.lightBlue, text: 'Repertory' }, { color: _colors.brightPink, text: 'Featured' }], {
	    offset: {
	      left: 10,
	      top: 100
	    }
	  });

	  base.main.element.append('g').classed('scale-bars', true).selectAll('rect').data(tickValues).enter().append('rect').attr('x', function (d) {
	    return seasonScale(d);
	  }).attr('y', 0).attr('width', seasonScale.rangeBand()).attr('height', base.main.height);

	  // CHART
	  var halfWidth = seasonScale.rangeBand() / 2;
	  // create a group for every age
	  base.main.element.selectAll('circle').data(filteredCastMembers).enter().append('circle').attr('r', 2).attr('cx', function (d) {
	    return seasonScale(d.firstSeason) + halfWidth;
	  }).attr('cy', function (d) {
	    return yScale((0, _date.daysToYears)(d.start_age));
	  }).style('fill', function (d) {
	    return d.featured.length === 0 ? _colors.lightBlue : _colors.brightPink;
	  });
	}

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = render;

	var _endingAges = __webpack_require__(36);

	var _endingAges2 = _interopRequireDefault(_endingAges);

	var _groupedEndingAges = __webpack_require__(37);

	var _groupedEndingAges2 = _interopRequireDefault(_groupedEndingAges);

	var _normalizedEndingAges = __webpack_require__(38);

	var _normalizedEndingAges2 = _interopRequireDefault(_normalizedEndingAges);

	var _endingAgesTable = __webpack_require__(39);

	var _endingAgesTable2 = _interopRequireDefault(_endingAgesTable);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function render(genders) {
	  (0, _endingAges2.default)(genders, '#ending-age');
	  (0, _groupedEndingAges2.default)(genders, '#ending-age-gender');
	  (0, _normalizedEndingAges2.default)(genders, '#ending-age-normalized');
	  (0, _endingAgesTable2.default)(genders, '#ending-age-table');
	}

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = chartEndingAges;

	var _d = __webpack_require__(1);

	var _d2 = _interopRequireDefault(_d);

	var _base = __webpack_require__(10);

	var _axis = __webpack_require__(18);

	var _text = __webpack_require__(11);

	var _round = __webpack_require__(19);

	var _colors = __webpack_require__(12);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function chartEndingAges(data, holderID) {
	  var all = data.all;
	  var _all$end$ages = all.end.ages;
	  var ages = _all$end$ages.ages;
	  var offset = _all$end$ages.offset;


	  var tickValues = Array.from(new Array(ages.length)).map(function (u, i) {
	    return i + offset;
	  });
	  var yMax = (0, _round.roundUp)(_d2.default.max(ages), 5);

	  // BASE
	  var base = (0, _base.chartBase)({
	    main: { width: 650, height: 300 },
	    left: { width: 50 },
	    bottom: { height: 50 },
	    top: { height: 30 },
	    right: { width: 100 }
	  }, holderID);

	  // SCALES
	  var ageScale = _d2.default.scale.ordinal().domain(tickValues).rangeRoundBands([0, base.bottom.width], 0.5);

	  var yScale = _d2.default.scale.linear().domain([0, yMax]).range([base.main.height, 0]);

	  // AXES
	  var xAxis = _d2.default.svg.axis().scale(ageScale).orient('bottom').tickValues(tickValues).outerTickSize(0);

	  var yAxis = _d2.default.svg.axis().scale(yScale).ticks(10).orient('left');

	  var yGrid = _d2.default.svg.axis().scale(yScale).orient('right').tickSize(base.main.width).ticks(10).tickFormat('').outerTickSize(0);

	  (0, _axis.drawAxis)(base.bottom, xAxis, 'top');
	  (0, _axis.drawAxis)(base.left, yAxis, 'right');
	  (0, _axis.drawAxis)(base.main, yGrid, 'left');

	  (0, _text.addTitle)(base.top, 'Ending Age of SNL Cast Members');
	  (0, _text.addLabel)(base.bottom, 'Age (Rounded Down', 'bottom');

	  // CHART
	  var halfWidth = ageScale.rangeBand();
	  base.main.element.selectAll('rect').data(ages).enter().append('rect').attr('width', halfWidth).attr('x', function (d, i) {
	    return ageScale(i + offset);
	  }).attr('y', function (d) {
	    return yScale(d);
	  }).attr('height', function (d) {
	    return base.main.height - yScale(d);
	  }).style('fill', _colors.green);
	}

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = chartGroupedEndingAges;

	var _d = __webpack_require__(1);

	var _d2 = _interopRequireDefault(_d);

	var _base = __webpack_require__(10);

	var _axis = __webpack_require__(18);

	var _text = __webpack_require__(11);

	var _legend = __webpack_require__(21);

	var _round = __webpack_require__(19);

	var _colors = __webpack_require__(12);

	var _merge = __webpack_require__(29);

	var _merge2 = _interopRequireDefault(_merge);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function chartGroupedEndingAges(data, holderID) {
	  var male = data.male;
	  var female = data.female;

	  var _mergeData = (0, _merge2.default)({ data: male.start.ages.ages, offset: male.start.ages.offset }, { data: female.start.ages.ages, offset: female.start.ages.offset });

	  var ages = _mergeData.data;
	  var offset = _mergeData.offset;

	  var tickValues = Array.from(new Array(ages.length)).map(function (u, i) {
	    return i + offset;
	  });
	  var yMax = (0, _round.roundUp)(_d2.default.max(ages, function (a) {
	    return Math.max(a[0], a[1]);
	  }), 5);

	  // BASE
	  var base = (0, _base.chartBase)({
	    main: { width: 650, height: 300 },
	    left: { width: 50 },
	    bottom: { height: 50 },
	    top: { height: 30 },
	    right: { width: 100 }
	  }, holderID);

	  // SCALES
	  // the scale for each age group
	  var ageScale = _d2.default.scale.ordinal().domain(tickValues).rangeRoundBands([0, base.bottom.width], 0.1);

	  // the scale for each bar within an age group
	  var groupScale = _d2.default.scale.ordinal().domain([0, 1]).rangeRoundBands([0, ageScale.rangeBand()]);

	  var yScale = _d2.default.scale.linear().domain([0, yMax]).range([base.main.height, 0]);

	  // AXES
	  var groupedXAxis = _d2.default.svg.axis().scale(ageScale).orient('bottom').tickValues(tickValues).outerTickSize(0);

	  var yAxis = _d2.default.svg.axis().scale(yScale).ticks(10).orient('left');

	  var yGrid = _d2.default.svg.axis().scale(yScale).orient('right').tickSize(base.main.width).ticks(10).tickFormat('').outerTickSize(0);

	  (0, _axis.drawAxis)(base.bottom, groupedXAxis, 'top');
	  (0, _axis.drawAxis)(base.left, yAxis, 'right');
	  (0, _axis.drawAxis)(base.main, yGrid, 'left');

	  (0, _text.addTitle)(base.top, 'Ending Age of SNL Cast Members (by Gender)');
	  (0, _text.addLabel)(base.bottom, 'Age (Rounded Down)', 'bottom');
	  (0, _legend.verticalLegend)(base.right, [{ color: _colors.genderColors[0], text: 'Male' }, { color: _colors.genderColors[1], text: 'Female' }], {
	    offset: {
	      left: 10,
	      top: 50
	    }
	  });

	  // CHART
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
	}

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = chartNormalizedEndingAges;

	var _d = __webpack_require__(1);

	var _d2 = _interopRequireDefault(_d);

	var _base = __webpack_require__(10);

	var _axis = __webpack_require__(18);

	var _text = __webpack_require__(11);

	var _legend = __webpack_require__(21);

	var _round = __webpack_require__(19);

	var _colors = __webpack_require__(12);

	var _merge = __webpack_require__(29);

	var _merge2 = _interopRequireDefault(_merge);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function chartNormalizedEndingAges(data, holderID) {
	  var male = data.male;
	  var female = data.female;

	  // NORMALIZE the counts per age as a percentage

	  var maleEndAges = male.end.ages;
	  var totalMale = maleEndAges.ages.reduce(function (acc, curr) {
	    return acc + curr;
	  }, 0);
	  var malePercents = maleEndAges.ages.map(function (count) {
	    return count / totalMale;
	  });

	  var femaleEndAges = female.end.ages;
	  var totalFemale = femaleEndAges.ages.reduce(function (acc, curr) {
	    return acc + curr;
	  }, 0);
	  var femalePercents = femaleEndAges.ages.map(function (count) {
	    return count / totalFemale;
	  });

	  var _mergeData = (0, _merge2.default)({ data: malePercents, offset: maleEndAges.offset }, { data: femalePercents, offset: femaleEndAges.offset });

	  var ages = _mergeData.data;
	  var offset = _mergeData.offset;


	  var tickValues = Array.from(new Array(ages.length)).map(function (u, i) {
	    return i + offset;
	  });
	  var yMax = (0, _round.roundUp)(_d2.default.max(ages, function (a) {
	    return Math.max(a[0], a[1]);
	  }) * 100, 3) / 100;
	  var formatPercent = _d2.default.format('.0%');

	  // BASE
	  var base = (0, _base.chartBase)({
	    main: { width: 650, height: 300 },
	    left: { width: 50 },
	    bottom: { height: 50 },
	    top: { height: 30 },
	    right: { width: 100 }
	  }, holderID);

	  // SCALES
	  // the scale for each age group
	  var ageScale = _d2.default.scale.ordinal().domain(tickValues).rangeRoundBands([0, base.bottom.width], 0.1);

	  // the scale for each bar within an age group
	  var groupScale = _d2.default.scale.ordinal().domain([0, 1]).rangeRoundBands([0, ageScale.rangeBand()]);

	  var yScale = _d2.default.scale.linear().domain([0, yMax]).range([base.main.height, 0]);

	  // AXES
	  var groupedXAxis = _d2.default.svg.axis().scale(ageScale).orient('bottom').tickValues(tickValues).outerTickSize(0);

	  // create a tick every 3%
	  var threePercTicks = [];
	  var perc = 0;
	  while (perc <= yMax) {
	    threePercTicks.push(perc);
	    perc += 0.03;
	  }

	  var yAxis = _d2.default.svg.axis().scale(yScale).tickValues(threePercTicks).orient('left').tickFormat(formatPercent);

	  var yGrid = _d2.default.svg.axis().scale(yScale).orient('right').tickSize(base.main.width).tickValues(threePercTicks).tickFormat('').outerTickSize(0);

	  (0, _axis.drawAxis)(base.bottom, groupedXAxis, 'top');
	  (0, _axis.drawAxis)(base.left, yAxis, 'right');
	  (0, _axis.drawAxis)(base.main, yGrid, 'left');

	  (0, _text.addTitle)(base.top, 'Ending Age of SNL Cast Members (by Gender)');
	  (0, _text.addLabel)(base.bottom, 'Age (Rounded Down', 'bottom');
	  (0, _legend.verticalLegend)(base.right, [{ color: _colors.genderColors[0], text: 'Male' }, { color: _colors.genderColors[1], text: 'Female' }], {
	    offset: {
	      left: 10,
	      top: 100
	    }
	  });

	  // CHART
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
	}

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = endingAgesTable;

	var _round = __webpack_require__(19);

	var _date = __webpack_require__(2);

	var _table = __webpack_require__(32);

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
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = chartStartingAndEndingAges;

	var _d = __webpack_require__(1);

	var _d2 = _interopRequireDefault(_d);

	var _base = __webpack_require__(10);

	var _axis = __webpack_require__(18);

	var _text = __webpack_require__(11);

	var _legend = __webpack_require__(21);

	var _round = __webpack_require__(19);

	var _colors = __webpack_require__(12);

	var _merge = __webpack_require__(29);

	var _merge2 = _interopRequireDefault(_merge);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var colors = [_colors.lightBlue, _colors.brightPink];

	function chartStartingAndEndingAges(data, holderID) {
	  var _data$all = data.all;
	  var start = _data$all.start;
	  var end = _data$all.end;

	  // NORMALIZE the counts per age as a percentage

	  var startAges = start.ages;
	  var totalStart = startAges.ages.reduce(function (acc, curr) {
	    return acc + curr;
	  }, 0);
	  var startPercents = startAges.ages.map(function (count) {
	    return count / totalStart;
	  });

	  var endAges = end.ages;
	  var totalEnd = endAges.ages.reduce(function (acc, curr) {
	    return acc + curr;
	  }, 0);
	  var endPercents = endAges.ages.map(function (count) {
	    return count / totalEnd;
	  });

	  var _mergeData = (0, _merge2.default)({ data: startPercents, offset: startAges.offset }, { data: endPercents, offset: endAges.offset });

	  var ages = _mergeData.data;
	  var offset = _mergeData.offset;


	  var tickValues = Array.from(new Array(ages.length)).map(function (u, i) {
	    return i + offset;
	  });
	  var yMax = (0, _round.roundUp)(_d2.default.max(ages, function (a) {
	    return Math.max(a[0], a[1]);
	  }) * 100, 3) / 100;
	  var formatPercent = _d2.default.format('.0%');

	  // BASE
	  var base = (0, _base.chartBase)({
	    main: { width: 650, height: 300 },
	    left: { width: 50 },
	    bottom: { height: 50 },
	    top: { height: 30 },
	    right: { width: 100 }
	  }, holderID);

	  // SCALES
	  // the scale for each age group
	  var ageScale = _d2.default.scale.ordinal().domain(tickValues).rangeRoundBands([0, base.bottom.width], 0.1);

	  // the scale for each bar within an age group
	  var groupScale = _d2.default.scale.ordinal().domain([0, 1]).rangeRoundBands([0, ageScale.rangeBand()]);

	  var yScale = _d2.default.scale.linear().domain([0, yMax]).range([base.main.height, 0]);

	  // AXES
	  var groupedXAxis = _d2.default.svg.axis().scale(ageScale).orient('bottom').tickValues(tickValues).outerTickSize(0);

	  var yAxis = _d2.default.svg.axis().scale(yScale).ticks(10).orient('left').tickFormat(formatPercent);

	  var yGrid = _d2.default.svg.axis().scale(yScale).orient('right').tickSize(base.main.width).ticks(10).tickFormat('').outerTickSize(0);

	  (0, _axis.drawAxis)(base.bottom, groupedXAxis, 'top');
	  (0, _axis.drawAxis)(base.left, yAxis, 'right');
	  (0, _axis.drawAxis)(base.main, yGrid, 'left');

	  (0, _text.addTitle)(base.top, 'Starting and Ending Ages of SNL Cast Members');
	  (0, _text.addLabel)(base.bottom, 'Age (Rounded Down)', 'bottom');
	  (0, _legend.verticalLegend)(base.right, [{ color: colors[0], text: 'Start' }, { color: colors[1], text: 'End' }], {
	    offset: {
	      left: 10,
	      top: 100
	    }
	  });

	  // CHART
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
	}

/***/ }
/******/ ]);