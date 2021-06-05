const webpack = require("webpack");

module.exports = {
  entry: "./dist/index.js",
  output: {
    filename: "app.js",
    library: "QuickType",
  },
  mode: "production",
  resolve: {
    fallback: {
      buffer: require.resolve("buffer/"),
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: "process/browser.js",
    }),
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
  ],
};
