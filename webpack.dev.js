const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

// let htmlPageNames = ["addProduct", "productDetails", "makePayment"];
let htmlPageNames = [];
let multipleHtmlPlugins = htmlPageNames.map((name) => {
  return new HtmlWebpackPlugin({
    template: `./src/${name}.html`, // relative path to the HTML files
    favicon: "./src/img/html-img/logo.png", // link to favicon icon
    filename: `${name}.html`, // output HTML files
    chunks: [`${name}`], // respective JS files
  });
});

module.exports = {
  devtool: "source-map",
  mode: "development",
  entry: {
    index: "./src/js/index.ts",
    addProduct: "./src/js/addProduct.ts",
    productDetails: "./src/js/productDetails.ts",
    makePayment: "./src/js/makePayment.ts",
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "public"),
  },

  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.(png|svg|jpg|gif|ico)$/,
        include: /css-img/,
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[hash].[ext]",
            emitFile: true,
            outputPath: "img",
            publicPath: "../img"
          }
        }
      },
      {
        test: /\.(png|svg|jpg|gif|ico)$/,
        include: /html-img/,
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[hash].[ext]",
            emitFile: true,
            outputPath: "img",
            publicPath: "./img"
          }
        }
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader", //3. Inject styles into DOM
          "css-loader", //2. Turns css into commonjs
          "sass-loader", //1. Turns sass into css
        ],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: './src/img/products', to: './img/products' }],
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      chunks: ["index"],
    }),
  ].concat(multipleHtmlPlugins),
  resolve: {
    extensions: [".ts", ".js", ".css", ".scss"],
  },
};
