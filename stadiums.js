// approximate coordinates of team stadiums
var teams = {
  "raiders": {
    coords: {
      "long": -122.2,
      "lat": 37.75
    },
    colors: {
      primary: undefined,
      secondary: undefined
    }
  },
  "lions": {
    coords: {
      "long": -83.03,
      "lat": 42.33
    },
    colors: {
      primary: undefined,
      secondary: undefined
    }
  },
  "saints": {
    coords: {
      "long": -90.07,
      "lat": 29.95
    },
    colors: {
      primary: undefined,
      secondary: undefined
    }
  },
  "bills": {
    coords: {
      "long": -78.78,
      "lat": 42.77
    },
    colors: {
      primary: undefined,
      secondary: undefined
    }
  },
  "buccaneers": {
    coords: {
      "long": -82.5,
      "lat": 27.97
    },
    colors: {
      primary: undefined,
      secondary: undefined
    }
  },
  "chargers": {
    coords: {
      "long": -117.12,
      "lat": 32.77
    },
    colors: {
      primary: undefined,
      secondary: undefined
    }
  },
  "redskins": {
    coords: {
      "long": -76.85,
      "lat": 38.9
    },
    colors: {
      primary: undefined,
      secondary: undefined
    }
  },
  "broncos": {
    coords: {
      "long": -105.02,
      "lat": 39.73
    },
    colors: {
      primary: undefined,
      secondary: undefined
    }
  },
  "steelers": {
    coords: {
      "long": -80.0,
      "lat": 40.43
    },
    colors: {
      primary: undefined,
      secondary: undefined
    }
  },
  "patriots": {
    coords: {
      "long": -71.25,
      "lat": 42.08
    },
    colors: {
      primary: undefined,
      secondary: undefined
    }
  },
  "dolphins": {
    coords: {
      "long": -80.23,
      "lat": 25.95
    },
    colors: {
      primary: undefined,
      secondary: undefined
    }
  },
  "falcons": {
    coords: {
      "long": -84.4,
      "lat": 33.75
    },
    colors: {
      primary: undefined,
      secondary: undefined
    }
  },
  "cowboys": {
    coords: {
      "long": -97.08,
      "lat": 32.73
    },
    colors: {
      primary: undefined,
      secondary: undefined
    }
  },
  "packers": {
    coords: {
      "long": -88.05,
      "lat": 44.5
    },
    colors: {
      primary: undefined,
      secondary: undefined
    }
  },
  "jaguars": {
    coords: {
      "long": -81.63,
      "lat": 30.32
    },
    colors: {
      primary: undefined,
      secondary: undefined
    }
  },
  "jets": {
    coords: {
      "long": -73.7,
      "lat": 40.8
    },
    colors: {
      primary: undefined,
      secondary: undefined
    }
  },
  "rams": {
    coords: {
      "long": -90.18,
      "lat": 38.62
    },
    colors: {
      primary: undefined,
      secondary: undefined
    }
  },
  "49ers": {
    coords: {
      "long": -121.97,
      "lat": 37.4
    },
    colors: {
      primary: undefined,
      secondary: undefined
    }
  },
  "eagles": {
    coords: {
      "long": -75.17,
      "lat": 39.9
    },
    colors: {
      primary: undefined,
      secondary: undefined
    }
  },
  "bengals": {
    coords: {
      "long": -84.5,
      "lat": 39.08
    },
    colors: {
      primary: undefined,
      secondary: undefined
    }
  },
  "vikings": {
    coords: {
      "long": -93.22,
      "lat": 44.97
    },
    colors: {
      primary: undefined,
      secondary: undefined
    }
  },
  "panthers": {
    coords: {
      "long": -80.85,
      "lat": 35.22
    },
    colors: {
      primary: undefined,
      secondary: undefined
    }
  },
  "ravens": {
    coords: {
      "long": -76.62,
      "lat": 39.27
    },
    colors: {
      primary: undefined,
      secondary: undefined
    }
  },
  "texans": {
    coords: {
      "long": -95.4,
      "lat": 29.68
    },
    colors: {
      primary: undefined,
      secondary: undefined
    }
  },
  "giants": {
    coords: {
      "long": -74.3,
      "lat": 40.8
    },
    colors: {
      primary: undefined,
      secondary: undefined
    }
  },
  "bears": {
    coords: {
      "long": -87.62,
      "lat": 41.85
    },
    colors: {
      primary: undefined,
      secondary: undefined
    }
  },
  "browns": {
    coords: {
      "long": -81.68,
      "lat": 41.5
    },
    colors: {
      primary: undefined,
      secondary: undefined
    }
  },
  "colts": {
    coords: {
      "long": -86.15,
      "lat": 39.75
    },
    colors: {
      primary: undefined,
      secondary: undefined
    }
  },
  "seahawks": {
    coords: {
      "long": -122.32,
      "lat": 47.58
    },
    colors: {
      primary: undefined,
      secondary: undefined
    }
  },
  "chiefs": {
    coords: {
      "long": -94.48,
      "lat": 39.03
    },
    colors: {
      primary: undefined,
      secondary: undefined
    }
  },
  "titans": {
    coords: {
      "long": -86.77,
      "lat": 36.15
    },
    colors: {
      primary: undefined,
      secondary: undefined
    }
  },
  "cardinals": {
    coords: {
      "long": -112.25,
      "lat": 33.52
    },
    colors: {
      primary: undefined,
      secondary: undefined
    }
  }
}

function drawMap(map){
    var mapData = topojson.feature(map, map.objects.states).features;

    var width = 960;
    var height = 600;
    var scale = 1200;
    var margin = {
        top: 75,
        right: 75,
        bottom: 75,
        left: 75
    };

    var projection = d3.geo.albersUsa()
        .scale(scale)
        .translate([width / 2, height / 2]);

    var path = d3.geo.path()
        .projection(projection);

    var svg = d3.select('body').append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
    
    var country = svg.append("g")
        .datum(mapData)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .classed("country", true);

    var states = country.append("g").selectAll("g.state")
            .data(function(d){ return d;})
        .enter().append("g")
            .classed("state", true)
            .append("path")
                .classed("outline", true)
                .attr("d", path);

    // eastern most longitude: 66.95
    // western most longitude: 124.78
    // southern most latitude: 24.44
    // northern most latitude: 49.38

    var teamsArray = [];
    for ( var key in teams ) {
        var obj = teams[key];
        obj.name = key;
        teamsArray.push(obj);
    }

    country.append("g").selectAll("g.team")
            .data(teamsArray)
        .enter().append("g")
            .classed("team", true)
            .attr("transform", function(d){
                var coords = projection([d.coords.long, d.coords.lat]);
                return "translate(" + coords[0] + "," + coords[1] + ")";
            })
            .attr("title", function(d){
                return d.name;
            })
            .append("circle")
                .attr("r", 5)
}

function connect(svg){
    var defs = svg.append("svg:defs");
    defs.append("svg:marker")
        .attr("id", "arrowhead")
        .attr("markerHeight", 15)
        .attr("markerWidth", 15)
        .append("path")
            .attr("d", "M2,2 L2,11 L10,6 L2,2");

    function arrow(start, end){

    }

    return arrow;
}