// Store our API endpoint inside queryURL
var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Create functions to be used for customising markers
// Function to set marker size based on magnitude
function markerSize(magnitude) {
    return magnitude * 5;
}

// Function to set marker colour based on magnitude
function markerColour(magnitude) {
    if (magnitude > 5) {
        return '#B22222'
    } else if (magnitude > 4) {
        return '#CD5C5C'
    } else if (magnitude > 3) {
        return '#F08080'
    } else if (magnitude > 2) {
        return '#DAA520'
    } else if (magnitude > 1) {
        return '#FFD700'
    } else {
        '#7FFF00'
    }
}

// Perform a GET request to the query URL
d3.json(queryURL, function(data) {
    var earthquakes = L.geoJSON(data.features, {
        onEachFeature: popUp,
        pointToLayer: marker 
    });
    createMap(earthquakes);
});

// Function to create markers
function marker(feature, location) {
    var options = {
        stroke: false,
        color: markerColour(feature.properties.mag),
        fillColor: markerColour(feature.properties.mag),
        radius: markerSize(feature.properties.mag)
    }

    return L.circleMarker(location, options);
}

// Function to create popups
function popUp(feature, layer) {
    return layer.bindPopup("<p>" + feature.properties.title + "</p>" +
        "<p>Type: " + feature.properties.type + "</p>" +
        "<p>Depth: " + feature.geometry.coordinates[2] + "/p>" + 
        "<p>Magnitude: " + feature.properties.mag + "</p>");
}

// Function to creat map and receive markers
function createMap(earthquakes) {

    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY
    });
  
    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      maxZoom: 18,
      id: "mapbox.dark",
      accessToken: API_KEY
    });
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
      center: [37.09, -95.71],
      zoom: 5,
      layers: [streetmap, earthquakes]
    });
  
    // Create legend
    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function(map) {
      var div = L.DomUtil.create("div", "legend");
      div.innerHTML += "<h4>Earthquake intensity</h4>";
      div.innerHTML += '<i style="background: #7FFF00"></i><span>-10-10</span><br>';
      div.innerHTML += '<i style="background: #FFD700"></i><span>10-30</span><br>';
      div.innerHTML += '<i style="background: #DAA520"></i><span>30-50</span><br>';
      div.innerHTML += '<i style="background: #F08080"></i><span>50-70</span><br>';
      div.innerHTML += '<i style="background: #CD5C5C"></i><span>70-90</span><br>';
      div.innerHTML += '<i style="background: #B22222"></i><span>90+</span><br>';      
      return div;
    };
    legend.addTo(myMap);

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
}