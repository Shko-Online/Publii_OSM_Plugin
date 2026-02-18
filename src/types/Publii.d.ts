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

export type InsertionType =
  | "publiiHead"
  | "publiiFooter"
  | `customHtml.${string}`
  | "customHeadCode"
  | "customBodyCode"
  | "customCommentsCode"
  | "customSearchInput"
  | "customSearchContent"
  | "customSocialSharing"
  | "customFooterCode";
export type RendererEvent = "beforeRender" | "afterRender";
export type ModifiersType =
  | "menuStructure"
  | "unassignedMenuStructure"
  | "globalContext"
  | "postTitle"
  | "postText"
  | "postExcerpt"
  | "postItemData"
  | "pageTitle"
  | "pageText"
  | "pageExcerpt"
  | "pageItemData"
  | "authorItemData"
  | "tagItemData"
  | "featuredImageItemData"
  | "socialMetaTags"
  | "jsonLD"
  | "htmlOutput"
  | "feedXmlOutput"
  | "feedJsonOutput"
  | `customHtml.${string}`
  | "contentStructure";
export interface PluginConfig {
  state: boolean;
  config: unknown;
}

/**
 * Interface for the Page data used in the page modifiers.
 * @see https://github.com/GetPublii/Publii/blob/master/app/back-end/modules/render-html/items/page.js
 */
export interface PageData {
  id: number;
  title: string;
  slug: string;
}

export interface PostData {
  id: number;
  title: string;
  slug: string;
}

/**
 * Interface for the Renderer, which is responsible for rendering the static site.
 * @see https://github.com/GetPublii/Publii/blob/master/app/back-end/modules/render-html/renderer.js
 */
export interface Renderer {
  loadCommonData(): void;
  siteConfig: {
    domain: string;
    // Other site configuration properties
  };
  globalContext: {
    context: string[];
    config: {
      site: {
        pageAsFrontpage?: number;
      }
    }
    // Define properties for global context
  };
  menuContext: string[];
  commonData: {
    tags: /*globalContextGenerator.getAllTags()*/ any[];
    mainTags: /*globalContextGenerator.getAllMainTags()*/ any[];
    authors: /*globalContextGenerator.getAuthors()*/ any[];
    pages: /*globalContextGenerator.getPages()*/ any[];
    menus: /*menus*/ any[];
    unassignedMenus: /*unassignedMenus*/ any[];
    featuredPosts: {
      homepage: /*globalContextGenerator.getFeaturedPosts('homepage')*/ any[];
      tag: /*globalContextGenerator.getFeaturedPosts('tag')*/ any[];
      author: /*globalContextGenerator.getFeaturedPosts('author')*/ any[];
    };
    hiddenPosts: /*globalContextGenerator.getHiddenPosts()*/ any[];
  };
  getPluginsConfig(): { [pluginName: string]: PluginConfig };

  /**
   * Trigger events during rendering process
   */
  triggerEvent(eventName: RendererEvent): void;
}

export interface API {
  addInsertion(
    place: InsertionType,
    callback: (rendererInstance: Renderer) => string,
    priority?: number,
    pluginInstance?: unknown,
  ): void;
  addModifier(
    value: ModifiersType,
    callback: (
      rendererInstance: Renderer,
      text: string
    ) => string,
    priority?: number,
    pluginInstance?: unknown,
  ): void;
  addModifier(
    value: "postText",
    callback: (
      rendererInstance: Renderer,
      text: string,
      postData: {postData: PostData},
    ) => string,
    priority?: number,
    pluginInstance?: unknown,
  ): void;
  addModifier(
    value: "pageText",
    callback: (
      rendererInstance: Renderer,
      text: string,
      pageData: {pageData: PageData},
    ) => string,
    priority?: number,
    pluginInstance?: unknown,
  ): void;
  addEvent(
    value: RendererEvent,
    callback: (rendererInstance: Renderer) => void,
    priority?: number,
    pluginInstance?: unknown,
  ): void;
}

export interface Plugin {
  addInsertions?: () => void;
  addModifiers?: () => void;
  addEvents?: () => void;
}
