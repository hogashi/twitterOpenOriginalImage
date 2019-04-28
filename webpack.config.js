module.exports = {
  entry: {
    main: "./src/main.ts",
    background: "./src/background.ts",
  },
  output: {
    filename: "[name].bundle.js",
    path: __dirname + "/dist/js"
  },

  // Enable sourcemaps for debugging webpack's output.
  // devtool: "source-map",

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".json"]
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          // 下から順に処理される
          { loader: "babel-loader" },
        ],
        exclude: /node_modules/,
      },
    ],
  },

  optimization: {
    minimize: false
  },

  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  externals: {
    "react": "React",
    "react-dom": "ReactDOM"
  }
};
