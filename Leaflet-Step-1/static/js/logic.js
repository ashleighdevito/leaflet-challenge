var myMap = L.map("map", {
center: [35, 66],
zoom: 4,
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(myMap);

  // Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var colors = ["#feb24c", "#fc4e2a", "#bd0026", "#49006a"];

function createFeatures(earthquakeData) {

  function markerSize(magnitude) {
    return Math.exp(magnitude)*1000;}
  function markerColor(depth) {
    if (depth < 20) return colors[0];
    else if (depth >= 20 && depth < 40) return colors[1];
    else if (depth >= 40 && depth < 60) return colors[2];
    else if (depth >= 60) return colors[3];
  }
  
  function onEachFeature(feature, marker) {
    marker = L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
      color: markerColor(feature.geometry.coordinates[2]),
      fillColor: markerColor(feature.geometry.coordinates[2]),
      radius: markerSize(feature.properties.mag)});
    marker.bindPopup(`<h3>Magnitude: ${feature.properties.mag}<span style="margin-left:40px">Depth: ${feature.geometry.coordinates[2]}km</span></h3><hr><h4>Location: ${feature.properties.place}</h4><hr><p>Time: ${new Date(feature.properties.time)}</p>`).addTo(myMap);
  }

  L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

};
// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
  });

// Set up the legend.
var legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");
  var limits = ["Less than 20km", "From 20 to 40km", "From 40 to 60km", "60km and Greater"];
  var labels = [];

  // Add the minimum and maximum.
  var legendInfo = "<h1>Earthquake Depth</h1>";

  div.innerHTML = legendInfo;

  limits.forEach(function(limit, index) {
    labels.push("<li style=\"background-color: " + colors[index] + ";padding-left: 10px\">" + limit + "</li>");
  });

  div.innerHTML += "<ul style=\"list-style: none;\">" + labels.join("") + "</ul>";
  return div;
};

// Adding the legend to the map
legend.addTo(myMap);
  