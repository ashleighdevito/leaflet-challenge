# leaflet-challenge

This is a web visualization of all Eathquakes detected by the US Geological Survey over the previous 7 days, updated by the minute.

The data is gathered from the [USGS GEOjson Feed](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php) where it is then imported and displayed over a world map.  Each earthquake is represented by a circle. Clicking on a circle with trigger a popup with additional information regarding the event.  

The size of circle is exponentially related to the magnitude of the earthquake, and the color corresponds to the depth where the earthquake begins to rupture.

A legend on the bottom right of the page describes the scale for depth.


![image](Leaflet-Step-1/images/map_example.PNG?raw=true "Example Map Result")

The second portion of this project augments the view to include:

    an additional topographic baselayer
    tectonic plate boundary locations

The tectonic plate boundary data was gathered from the a [GitHub](https://github.com/fraxen/tectonicplates) with a GEOjson conversion of data originally published in Geochemistry Geophysics Geosystems.
