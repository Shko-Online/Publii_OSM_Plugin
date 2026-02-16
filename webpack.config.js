/*
    Copyright (C) 2026 Shko Online - https://shko.online

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

const CopyPlugin = require("copy-webpack-plugin");
const FileManagerPlugin = require("filemanager-webpack-plugin");
const package = require("./package.json");
const leaftletPackage = require("leaflet/package.json");
const path = require("path");
const { CleanPlugin, DefinePlugin } = require("webpack");

/**
 * @type {import('webpack').Configuration[]}
 */
module.exports = [
  {
    mode: "production",
    name: "shkoOnlineOSM",
    devtool: "source-map",
    entry: "./src/main.ts",
    output: {
      iife: false,
      path: __dirname + "/dist/shkoOnlineOSM",
      libraryExport: "default",
      libraryTarget: "commonjs2",
    },
    optimization: {
      usedExports: true,
      concatenateModules: true,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: [/node_modules/, /src\/script\.ts/],
        },
      ],
    },
    plugins: [
      new CleanPlugin(),
      new DefinePlugin({
        PLUGIN_VERSION: JSON.stringify(package.version),
        LEAFLET_VERSION: JSON.stringify(leaftletPackage.version),
      }),
      new CopyPlugin({
        patterns: [
          {
            from: "plugin.json",
            to: "plugin.json",
            context: "src",
            transform: (content) => {
              const pluginJson = JSON.parse(content.toString());
              pluginJson.version = package.version;
              pluginJson.assets.front = pluginJson.assets.front.map((asset) => {
                return asset
                  .replace("${PLUGIN_VERSION}", package.version)
                  .replace("${LEAFLET_VERSION}", leaftletPackage.version);
              });
              return JSON.stringify(pluginJson, null, 2);
            },
          },
          {
            from: "Thumbnail.svg",
            to: "Thumbnail.svg",
            context: "src",
          },
          {
            from: "LICENSE",
            context: ".",
          },
          {
            from: "leaflet/dist/leaflet.css",
            to: `front-assets/leaflet_${leaftletPackage.version}.css`,
        
            context: "node_modules",
          },
          {
            from: "leaflet/dist/images/*",
            to: "front-assets/images/[name][ext]",
            info: { minimized: true },
            context: "node_modules",
          },
          {
            from: "leaflet/dist/leaflet.js",
            to: `front-assets/leaflet_${leaftletPackage.version}.js`,
            info: { minimized: true },
            context: "node_modules",
          },
          {
            from: "leaflet/dist/leaflet.js.map",
            to: `front-assets/leaflet_${leaftletPackage.version}.js.map`,
            info: { minimized: true },
            context: "node_modules",
          },
        ],
      }),
    ],
    target: "node",
  },
  {
    name: "shkoOnlineOSMScript",
    mode: "production",
    dependencies: ["shkoOnlineOSM"],
    entry: "./src/script.ts",
    devtool: "source-map",
    target: "web",
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: [/node_modules/, /main\.ts/],
        },
      ],
    },
    optimization: {
      usedExports: true,
      concatenateModules: true,
    },
    externals: {
      leaflet: "L",
    },
    output: {
      iife: true,
      filename: `shko-online.osm.builder_${package.version}.js`,
      path: path.join(__dirname, "dist", "shkoOnlineOSM", "front-assets"),
    },
    plugins: [
      new FileManagerPlugin({
        events: {
          onEnd: {
            archive: [
              {
                source: "dist",
                destination: path.join(
                  "dist",
                  `/shkoOnlineOSM_${package.version}.zip`,
                ),
              },
            ],
          },
        },
      }),
    ],
  },
];
