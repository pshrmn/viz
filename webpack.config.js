module.exports = {
  entry: {
    index: "./src/index.js"
  },
  resolve: {
    extensions: ["", ".js"]
  },
  externals: {
    "d3": "d3"
  },
  output: {
    path: __dirname + "/public/",
    filename: "[name].js",
  },
  module: {
    loaders: [
     {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  }
};
