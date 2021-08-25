//start
var colors = ["#feb24c", "#fc4e2a", "#bd0026", "#49006a"];

//function to begin the map
function createMap(earthquakes) {

  //create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  //function to assemble map
  function totalMap(tecplates) {

    //create a baseMaps object.
    var baseMaps = {
      "Street Map": street,
      "Topographic Map": topo
    };

    //create an overlay object to hold our overlay.
    var overlayMaps = {
      Earthquakes: earthquakes,
      "Tectonic Plates": tecplates
    };
      
    //define default myMap
    var myMap = L.map("map", {
      center: [35, 66],
      zoom: 4,
      layers: [topo, earthquakes]
    });
    
    //add layer control
    L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
    }).addTo(myMap);

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

  }

  //store api endpoint
  var tecquery = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

  //promise function to gather tectonic data
  d3.json(tecquery).then(function (data) {

    //once we get a response, send the data.features object to the createFeaturesTec function
    createFeaturesTec(data.features)
  });

  //function to create tectonic plate data layer
  function createFeaturesTec(tectonicData) {

    var tecplates = L.geoJSON(tectonicData);
    
    //send layer to the total map funtion
    totalMap(tecplates);
  }
};

//function to define visualization of earthquake data
function createFeatures(earthquakeData) {

  //defining size of earthquake marker as a relation of magnitude
  function markerSize(magnitude) {
  return (Math.exp(magnitude)*.5);}
        
  //defining color of earthquake marker as a relation of depth
  function markerColor(depth) {
    if (depth < 20) return colors[0];
    else if (depth >= 20 && depth < 40) return colors[1];
    else if (depth >= 40 && depth < 60) return colors[2];
    else if (depth >= 60) return colors[3];
  }
  
  //function to assemble markers into a layer
  function quakemarker(feature, lnglat) {
    quakemag = feature.properties.mag
    quakedepth = feature.geometry.coordinates[2]
    var options = {
      color: markerColor(quakedepth),
      fillColor: markerColor(quakedepth),
      radius: markerSize(quakemag)
    };

    return L.circleMarker(lnglat, options)
  }

  //function to add popup data to each marker
  function popinfo(feature, layer) {
    quakemag = feature.properties.mag
    quakedepth = feature.geometry.coordinates[2]

    layer.bindPopup(`<h3>Magnitude: ${quakemag}<span style="margin-left:40px">Depth: ${quakedepth}km</span></h3><hr><h4>Location: ${feature.properties.place}</h4><hr><p>Time: ${new Date(feature.properties.time)}</p>`);
  }
  
  //save marker layer and popups into a single variable
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: quakemarker,
    onEachFeature: popinfo
  });
  
  //send our earthquakes layer to the createMap function  
  createMap(earthquakes);
};

//store our API endpoint as queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//perform a GET request to the query URL
d3.json(queryUrl).then(function (data) {
  //once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});