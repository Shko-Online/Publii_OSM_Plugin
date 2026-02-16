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

import type Publii = require("./types/Publii");
import { escape } from "html-escaper";

type PluginConfig = {
  additionalCopyrightText?: string;
};

class ShkoOnlineOSMPlugin implements Publii.Plugin {
  API: Publii.API;
  name: string;
  config: PluginConfig;
  constructor(API: Publii.API, name: string, config: PluginConfig) {
    this.API = API;
    this.name = name;
    this.config = config;
  }

  addInsertions() {
    this.API.addInsertion("publiiHead", this.addStyles, 1, this);
    this.API.addInsertion("publiiFooter", this.addScripts, 1, this);
  }

  addStyles(rendererInstance: Publii.Renderer) {
    let styles = "";
    if (this.shouldLoadOSM(rendererInstance)) {
      styles += `<link rel="stylesheet" href="${rendererInstance.siteConfig.domain}/media/plugins/shkoOnlineOSM/leaflet_${LEAFLET_VERSION}.css" />`;
    }
    return styles;
  }

  addScripts(rendererInstance: Publii.Renderer) {
    let scripts = "";
    if (this.shouldLoadOSM(rendererInstance)) {
      scripts += `<script src="${rendererInstance.siteConfig.domain}/media/plugins/shkoOnlineOSM/leaflet_${LEAFLET_VERSION}.js"></script>`;
      scripts += `<script ${
        this.config.additionalCopyrightText
          ? `id="shko-online-osm-copyright" data-copyright="${escape(this.config.additionalCopyrightText)}"`
          : ""
      } src="${rendererInstance.siteConfig.domain}/media/plugins/shkoOnlineOSM/shko-online.osm.builder_${PLUGIN_VERSION}.js"></script>`;
    }
    return scripts;
  }

  shouldLoadOSM(rendererInstance: Publii.Renderer): boolean {
    let context = rendererInstance.globalContext.context;
    console.log(rendererInstance.globalContext);
    if (Array.isArray(context)) {
      // Check if context contains '404' or 'search'
      if (context.includes("404") || context.includes("search")) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
}

export default ShkoOnlineOSMPlugin;
