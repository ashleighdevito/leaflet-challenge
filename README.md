# leaflet-challenge

## Step 1
This is a web visualization of all Eathquakes detected by the US Geological Survey over the previous 7 days, updated by the minute.

The data is gathered from the [USGS GEOjson Feed](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php) where it is then imported and displayed over a world map.  Each earthquake is represented by a circle. Clicking on a circle with trigger a popup with additional information regarding the event.  

The size of circle is exponentially related to the magnitude of the earthquake, and the color corresponds to the depth where the earthquake begins to rupture.

A legend on the bottom right of the page describes the scale for depth.


![image](Leaflet-Step-1/images/map_example.PNG?raw=true "Example Map Result - Step 1")


## Step 2

The second portion of this project augments the view to include:

    topographic basemap
    tectonic plate boundary overlay

The tectonic plate boundary data was gathered from the a [GitHub](https://github.com/fraxen/tectonicplates) with a GEOjson conversion of data originally published in Geochemistry Geophysics Geosystems.

The control in the upper right corner of the map allows for a toggle between the topographic and street view base layer and the data overlays.  Each of the two data layers can be independently added or removed from the map view.

Popups providing detail for each quake event are active on the Earthquake layer.

![image](Leaflet-Step-2/images/map_example_second.PNG?raw=true "Example Map Result - Step 2")
