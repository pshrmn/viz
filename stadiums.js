var teams = {
  "raiders": {
    coords: {
      "long": -122.2,
      "lat": 37.75
    },
    colors: {
      primary: "#C4C8CB",
      secondary: "#000000"
    }
  },
  "lions": {
    coords: {
      "long": -83.03,
      "lat": 42.33
    },
    colors: {
      primary: "#006DB0",
      secondary: "#C5C7CF"
    }
  },
  "saints": {
    coords: {
      "long": -90.07,
      "lat": 29.95
    },
    colors: {
      primary: "#D2B887",
      secondary: "#000000"
    }
  },
  "bills": {
    coords: {
      "long": -78.78,
      "lat": 42.77
    },
    colors: {
      primary: "#00338D",
      secondary: "#C60C30"
    }
  },
  "buccaneers": {
    coords: {
      "long": -82.5,
      "lat": 27.97
    },
    colors: {
      primary: "#D60A0B",
      secondary: "#89765F"
    }
  },
  "chargers": {
    coords: {
      "long": -117.12,
      "lat": 32.77
    },
    colors: {
      primary: "#08214A",
      secondary: "#EEC607"
    }
  },
  "redskins": {
    coords: {
      "long": -76.85,
      "lat": 38.9
    },
    colors: {
      primary: "#773141",
      secondary: "#FFB612"
    }
  },
  "broncos": {
    coords: {
      "long": -105.02,
      "lat": 39.73
    },
    colors: {
      primary: "#FB4F14",
      secondary: "#002244"
    }
  },
  "steelers": {
    coords: {
      "long": -80.0,
      "lat": 40.43
    },
    colors: {
      primary: "#000000",
      secondary: "#F2C800"
    }
  },
  "patriots": {
    coords: {
      "long": -71.25,
      "lat": 42.08
    },
    colors: {
      primary: "#0D254C",
      secondary: "#C80815"
    }
  },
  "dolphins": {
    coords: {
      "long": -80.23,
      "lat": 25.95
    },
    colors: {
      primary: "#008D97",
      secondary: "#F5811F"
    }
  },
  "falcons": {
    coords: {
      "long": -84.4,
      "lat": 33.75
    },
    colors: {
      primary: "#BD0D18",
      secondary: "#000000"
    }
  },
  "cowboys": {
    coords: {
      "long": -97.08,
      "lat": 32.73
    },
    colors: {
      primary: "#002244",
      secondary: "#8C8B8A"
    }
  },
  "packers": {
    coords: {
      "long": -88.05,
      "lat": 44.5
    },
    colors: {
      primary: "#213D30",
      secondary: "#FFCC00"
    }
  },
  "jaguars": {
    coords: {
      "long": -81.63,
      "lat": 30.32
    },
    colors: {
      primary: "#000000",
      secondary: "#D0B239"
    }
  },
  "jets": {
    coords: {
      "long": -73.7,
      "lat": 40.8
    },
    colors: {
      primary: "#0C371D",
      secondary: "#FFFFFF"
    }
  },
  "rams": {
    coords: {
      "long": -90.18,
      "lat": 38.62
    },
    colors: {
      primary: "#13264B",
      secondary: "#C9AF74"
    }
  },
  "49ers": {
    coords: {
      "long": -121.97,
      "lat": 37.4
    },
    colors: {
      primary: "#AF1E2C",
      secondary: "#E6BE8A"
    }
  },
  "eagles": {
    coords: {
      "long": -75.17,
      "lat": 39.9
    },
    colors: {
      primary: "#003B48",
      secondary: "#000000"
    }
  },
  "bengals": {
    coords: {
      "long": -84.5,
      "lat": 39.08
    },
    colors: {
      primary: "#000000",
      secondary: "#FB4F14"
    }
  },
  "vikings": {
    coords: {
      "long": -93.22,
      "lat": 44.97
    },
    colors: {
      primary: "#4F2682",
      secondary: "#FFC52F"
    }
  },
  "panthers": {
    coords: {
      "long": -80.85,
      "lat": 35.22
    },
    colors: {
      primary: "#000000",
      secondary: "#0088CE"
    }
  },
  "ravens": {
    coords: {
      "long": -76.62,
      "lat": 39.27
    },
    colors: {
      primary: "#280353",
      secondary: "#000000"
    }
  },
  "texans": {
    coords: {
      "long": -95.4,
      "lat": 29.68
    },
    colors: {
      primary: "#02253A",
      secondary: "#B31B34"
    }
  },
  "giants": {
    coords: {
      "long": -74.3,
      "lat": 40.8
    },
    colors: {
      primary: "#192F6B",
      secondary: "#CA001A"
    }
  },
  "bears": {
    coords: {
      "long": -87.62,
      "lat": 41.85
    },
    colors: {
      primary: "#03202F",
      secondary: "#DD4814"
    }
  },
  "browns": {
    coords: {
      "long": -81.68,
      "lat": 41.5
    },
    colors: {
      primary: "#26201E",
      secondary: "#E34912"
    }
  },
  "colts": {
    coords: {
      "long": -86.15,
      "lat": 39.75
    },
    colors: {
      primary: "#003B7B",
      secondary: "#FFFFFF"
    }
  },
  "seahawks": {
    coords: {
      "long": -122.32,
      "lat": 47.58
    },
    colors: {
      primary: "#06192E",
      secondary: "#4EAE47"
    }
  },
  "chiefs": {
    coords: {
      "long": -94.48,
      "lat": 39.03
    },
    colors: {
      primary: "#B20032",
      secondary: "#F2C800"
    }
  },
  "titans": {
    coords: {
      "long": -86.77,
      "lat": 36.15
    },
    colors: {
      primary: "#648FCC",
      secondary: "#000080"
    }
  },
  "cardinals": {
    coords: {
      "long": -112.25,
      "lat": 33.52
    },
    colors: {
      primary: "#870619",
      secondary: "#000000"
    }
  }
}

function drawStadiums(map, projection){
    var teamsArray = [];
    for ( var key in teams ) {
        var obj = teams[key];
        obj.name = key;
        teamsArray.push(obj);
    }

    map.append("g")
      .classed("teams", true)
      .selectAll("g.team")
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
            .attr("r", 8)
            .style("fill", function(d){
              return d.colors.primary;
            })
            .style("stroke", function(d){
              return d.colors.secondary;
            })
            .style("stroke-width", 2);
}
