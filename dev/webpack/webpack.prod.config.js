const TerserPlugin = require("terser-webpack-plugin");
// import TerserPlugin from "terser-webpack-plugin";

const config = (env) => ({
  mode: "production",
  bail: false,
  // cache: true,
  // devtool: "inline-source-map",
  entry: {

  },
  output: {
    path: "/cloud/web",
    filename: "[name].bundle.js",
    chunkFilename: "[name].chunk.[chunkhash:8].js",
    //publicPath: "", //Set by __webpack_public_path__
  },
  module: {
    rules: [
      { test: /\.s[ac]ss$/, use: ["style-loader", "css-loader", "sass-loader"] },
      // { test: /\.(ts|tsx)$/, use: [{ loader: "ts-loader" }] },
      //https://github.com/privatenumber/esbuild-loader#readme
      { test: /\.(ts|tsx)$/, use: [{ 
          loader: "esbuild-loader", 
          options: {loader: "tsx", target: "es2015"}
        }],
      },
    ],
  },
  resolve: {
    // modules: ["node_modules", "/src"], //We always use relative paths, so not needed. https://webpack.js.org/configuration/resolve/#resolvemodules
    extensions: [".js", ".jsx", ".ts", ".tsx"], //Used when no file extensions are provided in import statements
  },
  plugins: [
  ],
  optimization: {
    splitChunks: {
      minChunks: 4, //Only move those things to the common "vendors" bundle, which are repeated 4 times (default: 1, makes vendor.chunk.js TOO large)
    },
    minimize: true,
    minimizer: [
      new TerserPlugin({
        test: /\.js$/i,
        extractComments: false,
        parallel: true,
        terserOptions: {
          format: {
            comments: false,
          },
          mangle: true
        },
      })
    ]
  }
});

module.exports = config;
