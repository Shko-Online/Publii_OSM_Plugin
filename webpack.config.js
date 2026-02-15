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
const path = require("path");
const { CleanPlugin, BannerPlugin, Compilation } = require("webpack");

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
      new CopyPlugin({
        patterns: [
          {
            from: "plugin.json",
            to: "plugin.json",
            context: "src",
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
            to: "front-assets",
            info: { minimized: true },
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
            to: "front-assets",
            info: { minimized: true },
            context: "node_modules",
          },
          {
            from: "leaflet/dist/leaflet.js.map",
            to: "front-assets",
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
      filename: "shko-online.osm.builder.js",
      path: path.join(__dirname, "dist", "shkoOnlineOSM", "front-assets"),
    },
    plugins: [
      //       new BannerPlugin({
      //         raw: true,
      //         banner: `/*
      //     Copyright (C) 2026 Shko Online - https://shko.online

      //     This program is free software: you can redistribute it and/or modify
      //     it under the terms of the GNU General Public License as published by
      //     the Free Software Foundation, either version 3 of the License, or
      //     (at your option) any later version.

      //     This program is distributed in the hope that it will be useful,
      //     but WITHOUT ANY WARRANTY; without even the implied warranty of
      //     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
      //     GNU General Public License for more details.

      //     You should have received a copy of the GNU General Public License
      //     along with this program.  If not, see <https://www.gnu.org/licenses/>.
      // */`,
      //         stage: Compilation.PROCESS_ASSETS_STAGE_REPORT,
      //       }),
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
