const path = require("path");

module.exports = {
	// This is the entry point or start of our react applicaton
	entry: "./src/App.js",

	// The plain compiled Javascript will be output into this file
	output: {
		filename: "public/bundle.js"
	},

	resolve: {
		extensions: [".js", ".jsx"],
		modules: [path.join(__dirname, "src"), "node_modules"]
	},

	// This section desribes the transformations we will perform
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				include: /src/,
				exclude: path.resolve(__dirname, "node_modules"),
				loader: "babel-loader",
				options: {
					// These are the specific transformations we'll be using.
					presets: ["react", "es2015", "stage-2"]
				}
			},
			{ // CSS 
				test: /(\.min)?\.css$/,
				use: ["style-loader", "css-loader"]
			},
			{ // WOFF, WOFF2 
				test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				// Limiting the size of the woff fonts breaks font-awesome ONLY for the extract text plugin
				// loader: "url?limit=10000"
				use: ["url-loader"]
			},
			{ // TTG, EOT 
				test: /\.(ttf|eot)(\?[\s\S]+)?$/,
				use: ["file-loader"]
			},
			{ // SVG 
				test: /\.svg$/,
				exclude: /node_modules/,
				use: ["svg-react-loader"],
				// options: {
				// 	classIdPrefix: "[name]-[hash:8]__",
				// 	filters: [
				// 			function (value) {
				// 					// ...
				// 					this.update(newvalue);
				// 			}
				// 	],
				// 	propsMap: {
				// 			fillRule: 'fill-rule',
				// 			foo: 'bar'
				// 	},
				// 	xmlnsTest: /^xmlns.*$/
				// }
			},
			{ // GIF, PNG, JPG, JPEG
				test: /\.(gif|png|jpe?g)$/i,
				// include: /public/, // only process files in public
				exclude: path.resolve(__dirname, "node_modules"),
				
				// exclude: [
				// 	path.resolve(__dirname, "node_modules"),
				// 	path.resolve(__dirname, "public", "libs")
				// ],
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
		]
	},
	devtool: "eval-source-map",

	node: {
    // console: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
	}
	
};
