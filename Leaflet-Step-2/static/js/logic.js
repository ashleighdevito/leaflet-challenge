//start
var colors = ["#feb24c", "#fc4e2a", "#bd0026", "#49006a"];

function createMap(earthquakes) {
  
  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes
  };
    
    L.map("map", {
    center: [35, 66],
    zoom: 4,
    layers: [topo, earthquakes]
    });
  }

function createFeatures(earthquakeData) {

    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
      function markerSize(magnitude) {
        return Math.exp(magnitude)*1000;}
      function markerColor(depth) {
        if (depth < 20) return colors[0];
        else if (depth >= 20 && depth < 40) return colors[1];
        else if (depth >= 40 && depth < 60) return colors[2];
        else if (depth >= 60) return colors[3];
      }
    
      function onEachFeature(feature, marker) {
        
        quakemag = feature.properties.mag
        quakedepth = feature.geometry.coordinates[2]
      
        marker = L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
          color: markerColor(quakedepth),
          fillColor: markerColor(quakedepth),
          radius: markerSize(quakemag)});
        marker.bindPopup(`<h3>Magnitude: ${quakemag}<span style="margin-left:40px">Depth: ${quakedepth}km</span></h3><hr><h4>Location: ${feature.properties.place}</h4><hr><p>Time: ${new Date(feature.properties.time)}</p>`).addTo(myMap);
      }
    
      var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature
      });
        // Send our earthquakes layer to the createMap function/
      
      createMap(earthquakes);
      };
  // Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});


// layer.circle([data.feature.geometry.coordinates[1], data.feature.geometry.coordinates[0]], {});