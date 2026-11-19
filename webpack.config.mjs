import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";

const repositoryRoot = dirname(fileURLToPath(import.meta.url));

export default {
  context: repositoryRoot,
  mode: "production",
  target: "web",
  entry: {
    app: "./src/frontend/app.mjs",
  },
  output: {
    path: resolve(repositoryRoot, "dist"),
    filename: "[name].js",
    clean: true,
    assetModuleFilename: "fonts/[name][ext][query]",
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin({ filename: "[name].css" })],
  optimization: {
    minimizer: ["...", new CssMinimizerPlugin()],
  },
};
