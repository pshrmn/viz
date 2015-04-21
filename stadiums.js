// approximate coordinates of team stadiums
var teams = {
  "raiders": {
    "long": -122.2,
    "lat": 37.75
  },
  "lions": {
    "long": -83.03,
    "lat": 42.33
  },
  "saints": {
    "long": -90.07,
    "lat": 29.95
  },
  "bills": {
    "long": -78.78,
    "lat": 42.77
  },
  "buccaneers": {
    "long": -82.5,
    "lat": 27.97
  },
  "chargers": {
    "long": -117.12,
    "lat": 32.77
  },
  "redskins": {
    "long": -76.85,
    "lat": 38.9
  },
  "broncos": {
    "long": -105.02,
    "lat": 39.73
  },
  "steelers": {
    "long": -80.0,
    "lat": 40.43
  },
  "patriots": {
    "long": -71.25,
    "lat": 42.08
  },
  "dolphins": {
    "long": -80.23,
    "lat": 25.95
  },
  "falcons": {
    "long": -84.4,
    "lat": 33.75
  },
  "cowboys": {
    "long": -97.08,
    "lat": 32.73
  },
  "packers": {
    "long": -88.05,
    "lat": 44.5
  },
  "jaguars": {
    "long": -81.63,
    "lat": 30.32
  },
  "jets": {
    "long": -73.7,
    "lat": 40.8
  },
  "rams": {
    "long": -90.18,
    "lat": 38.62
  },
  "49ers": {
    "long": -121.97,
    "lat": 37.4
  },
  "eagles": {
    "long": -75.17,
    "lat": 39.9
  },
  "bengals": {
    "long": -84.5,
    "lat": 39.08
  },
  "vikings": {
    "long": -93.22,
    "lat": 44.97
  },
  "panthers": {
    "long": -80.85,
    "lat": 35.22
  },
  "ravens": {
    "long": -76.62,
    "lat": 39.27
  },
  "texans": {
    "long": -95.4,
    "lat": 29.68
  },
  "giants": {
    "long": -74.3,
    "lat": 40.8
  },
  "bears": {
    "long": -87.62,
    "lat": 41.85
  },
  "browns": {
    "long": -81.68,
    "lat": 41.5
  },
  "colts": {
    "long": -86.15,
    "lat": 39.75
  },
  "seahawks": {
    "long": -122.32,
    "lat": 47.58
  },
  "chiefs": {
    "long": -94.48,
    "lat": 39.03
  },
  "titans": {
    "long": -86.77,
    "lat": 36.15
  },
  "cardinals": {
    "long": -112.25,
    "lat": 33.52
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
                var coords = projection([d.long, d.lat]);
                return "translate(" + coords[0] + "," + coords[1] + ")";
            })
            .attr("title", function(d){
                return d.name;
            })
            .append("circle")
                .attr("r", 5)
}
