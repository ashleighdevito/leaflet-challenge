//define map
var myMap = L.map("map", {
center: [35, 66],
zoom: 4,
});

//define baselayer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(myMap);

//define query
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//set color gradient
var colors = ["#feb24c", "#fc4e2a", "#bd0026", "#49006a"];

//function to create markers for each data point
function createFeatures(earthquakeData) {

  //function to set the markersize correlated to quake magnitude
  function markerSize(magnitude) {
  return (Math.exp(magnitude)*1000);}

  //function to set the markercolor correlated to quake depth 
  function markerColor(depth) {
    if (depth < 20) return colors[0];
    else if (depth >= 20 && depth < 40) return colors[1];
    else if (depth >= 40 && depth < 60) return colors[2];
    else if (depth >= 60) return colors[3];
  }

  //function to define attributes for each marker
  function onEachFeature(feature, marker) {
    
    quakemag = feature.properties.mag
    quakedepth = feature.geometry.coordinates[2]
  
    marker = L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
      color: markerColor(quakedepth),
      fillColor: markerColor(quakedepth),
      radius: markerSize(quakemag)});
    marker.bindPopup(`<h3>Magnitude: ${quakemag}<span style="margin-left:40px">Depth: ${quakedepth}km</span></h3><hr><h4>Location: ${feature.properties.place}</h4><hr><p>Time: ${new Date(feature.properties.time)}</p>`).addTo(myMap);
  }

  //create a layer by passing all of the quake data through the feature function
  L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

};
//perform a get request for the URL
d3.json(queryUrl).then(function (data) {
    //when data aquired, send data abject createFeatures function.
    createFeatures(data.features);
  });

//set up the legend
var legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");
  var limits = ["Less than 20km", "From 20 to 40km", "From 40 to 60km", "60km and Greater"];
  var labels = [];

  //add title
  var legendInfo = "<h1>Earthquake Depth</h1>";

  div.innerHTML = legendInfo;

  //create HTML for each depth possibility
  limits.forEach(function(limit, index) {
    labels.push("<li style=\"background-color: " + colors[index] + ";padding-left: 10px\">" + limit + "</li>");
  });

  div.innerHTML += "<ul style=\"list-style: none;\">" + labels.join("") + "</ul>";
  return div;
};

//add the legend to the map
legend.addTo(myMap);
  