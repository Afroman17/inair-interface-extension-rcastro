const createBundler = require("@airtable/blocks-webpack-bundler").default;
const path = require("path");

function createConfig(baseConfig) {
  const cssRule = baseConfig.module.rules.find(
    (rule) => rule.test && rule.test.toString().includes("css")
  );
  cssRule.use = [
    "style-loader",
    "css-loader",
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [require("@tailwindcss/postcss")],
        },
      },
    },
  ];

  // Add path aliases to match tsconfig.json
  baseConfig.resolve = baseConfig.resolve || {};
  baseConfig.resolve.alias = {
    ...baseConfig.resolve.alias,
    "@": path.resolve(__dirname, "src"),
    "@components": path.resolve(__dirname, "src/components"),
    "@ui": path.resolve(__dirname, "src/components/ui"),
    "@hooks": path.resolve(__dirname, "src/hooks"),
    "@lib": path.resolve(__dirname, "src/lib"),
    "@stores": path.resolve(__dirname, "src/stores"),
    "@styles": path.resolve(__dirname, "src/styles"),
    "@types": path.resolve(__dirname, "src/types"),
    "@api": path.resolve(__dirname, "src/api"),
  };

  return baseConfig;
}

exports.default = () => {
  return createBundler(createConfig);
};
