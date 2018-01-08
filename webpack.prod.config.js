const path = require("path");
const CompressionPlugin = require("compression-webpack-plugin");
const webpack = require("webpack");

// const staticSourcePath = path.join(__dirname, 'static');
const sourcePath = path.join(__dirname, "src");
const buildPath = path.join(__dirname, "dist");
const publicPath = path.join(__dirname, "public");

module.exports = {
	devtool: "cheap-module-source-map", // Debug our react code in chrome.
	entry: "./src/App.js", // entry point for react app
	output: {
		filename: "public/bundle.js" // output file
	},
	resolve: {
		extensions: [".js", ".jsx"],
		modules: [path.join(__dirname, "src"), "node_modules"]
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				loader: "babel-loader",
				include: /src/, // only process files in src. avoids processing node modules and server files
				exclude: path.resolve(__dirname, "node_modules"),
				options: {
					presets: ["react", "es2015", "stage-2"]
				}
			},
			{
				test: /(\.min)?\.css$/,
				use: ["style-loader", "css-loader"]
			},
			{
				test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				// Limiting the size of the woff fonts breaks font-awesome ONLY for the extract text plugin
				// loader: "url?limit=10000"
				use: ["url-loader"]
			},
			{
				test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
				use: ["file-loader"]
			},
			{
				test: /\.scss$/,
				use: [
					"style-loader", // creates style nodes from JS strings
					"css-loader", // translates CSS into CommonJS
					"sass-loader" // compiles Sass to CSS
				]
			},
			{
				test: /\.(gif|png|jpe?g)$/i,
				use: [
					{
						loader: 'file-loader',
						options: {
							emitFile: false,
						},
					},
					{
						loader: 'image-webpack-loader',
						options: {
							bypassOnDebug: true,
						},
					},
				],
			},
			{
				test: /\.svg$/,
				exclude: /node_modules/,
				use: ["svg-react-loader"],
			}
		]
	},

	// For optimizing/minifying
	plugins: [
		new webpack.DefinePlugin({
			// <-- key to reducing React's size
			"process.env": {
				NODE_ENV: JSON.stringify("production")
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			sourceMap: true,
			compress: { warnings: true }
		}), //minify everything
		new webpack.optimize.AggressiveMergingPlugin(), //Merge chunks
		new CompressionPlugin({
			// Compress js to .gz files
			asset: "[path].gz[query]",
			algorithm: "gzip",
			test: /\.js$|\.css$|\.html$/,
			threshold: 10240,
			minRatio: 0.8
		}),
	]
};
