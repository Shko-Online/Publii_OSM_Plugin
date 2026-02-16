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

const elements = document.getElementsByClassName("shko-online-osm") as HTMLCollectionOf<HTMLElement>;
const copyrightElement = document.getElementById("shko-online-osm-copyright");
let additionalCopyright = "";
if (copyrightElement) {
  additionalCopyright = copyrightElement.dataset.copyright ?? "";
}
for (const element of elements) {
  const lat = parseFloat(element.dataset.lat ?? "41.34151");
  const lng = parseFloat(element.dataset.lng ?? "19.77706");
  const zoom = parseFloat(element.dataset.zoom ?? "17");

  const map = L.map(element as HTMLElement).setView([lat, lng], zoom);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      `${additionalCopyright ? `${additionalCopyright} | ` : ""}&copy;&nbsp;<a href="https://shko.online">Shko Online</a> | &copy;&nbsp;<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>&nbsp;contributors`,
  }).addTo(map);

  const markerElements = element.getElementsByClassName("shko-online-osm-marker") as HTMLCollectionOf<HTMLElement>;
  for (const markerElement of markerElements) {    
    const markerLat = parseFloat(markerElement.dataset.lat ?? "41.34151");
    const markerLng = parseFloat(markerElement.dataset.lng ?? "19.77706");
    const marker = L.marker([markerLat, markerLng]).addTo(map);
    marker.bindPopup(markerElement.innerHTML);
    markerElement.innerHTML = "";
  }
}
