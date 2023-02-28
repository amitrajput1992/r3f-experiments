const path = require("path");
const { inspect } = require("util");

module.exports = {
  core: {
    builder: "webpack5",
  },
  stories: [
    "../stories/**/*.stories.@(ts|tsx)",
  ],
  addons: [
    "@storybook/addon-essentials"
  ],
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of "DEVELOPMENT" or "PRODUCTION"
    // You can change the configuration based on that.
    // "PRODUCTION" is used when building the static version of storybook.
    //console.log(config, JSON.stringify(config.module.rules));
    return {
      ...config,
      output: {
        ...config.output,
        //Added for https://github.com/storybookjs/storybook/issues/13371#issuecomment-804030789
        filename: "[name].bundle.js"
      },
      module: {
        ...config.module,
        rules: [
          ...config.module.rules,
          { test: /\.s[ac]ss$/, use: ["style-loader", "css-loader", "sass-loader"] },
          // { test: /\.(ts|tsx)$/, use: [{ loader: "ts-loader" }] },
          //https://github.com/privatenumber/esbuild-loader#readme
          { test: /\.(ts|tsx)$/, use: [{ 
              loader: "esbuild-loader", 
              options: {loader: "tsx", target: "es2015"}
            }]
          },
        ]
      },
      resolve: {
        ...config.resolve,
        extensions: [...config.resolve.extensions, ".ts", ".tsx"],
        modules: [...config.resolve.modules, "/src"],
        fallback: {
          ...config.resolve.fallback,
          "crypto": false,
        }
      },
      plugins: [
        ...config.plugins,
      ],
      node: {
        ...config.node,
      }
    };
  }
};
