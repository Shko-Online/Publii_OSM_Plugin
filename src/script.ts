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

import L from "leaflet";

const elements = document.getElementsByClassName("shko-online-osm");
for (const element of elements) {
  const lat = parseFloat(element.getAttribute("data-lat") ?? "41.34151");
  const lng = parseFloat(element.getAttribute("data-lng") ?? "19.77706");
  const zoom = parseFloat(element.getAttribute("data-zoom") ?? "17");

  const map = L.map(element as HTMLElement).setView([lat, lng], zoom);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://shko.online">Shko Online</a> | &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
}
