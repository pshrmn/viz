module.exports = {
  context: __dirname + "/src",
  entry: "./index.js",
  resolve: {
    extensions: ["", ".js", ".jsx"]
  },
  output: {
    path: __dirname + "/public/js/",
    filename: "bundle.js",
  },
  externals: {
    "react": "React",
    "react-dom": "ReactDOM",
    "d3": "d3",
    "topojson": "topojson"
  },
  module: {
    loaders: [
     {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          stage: 0,
          optional: ["runtime"]
        }
      }
    ]
  }
};
