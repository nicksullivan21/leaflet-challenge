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
        return '#ff3300'
    } else if (magnitude > 4) {
        return '#e67300'
    } else if (magnitude > 3) {
        return '#ff9933'
    } else if (magnitude > 2) {
        return '#ffcc66'
    } else if (magnitude > 1) {
        return '#ccff66'
    } else if (magnitude > 0) {
        return '#99ff66'
    }
}

// Perform a GET request to the query URL
d3.json(queryURL, function(data) {
    var earthquakes = L.geoJSON(data.features, {
        onEachFeature: popUp,
        style: marker,
        pointToLayer: marker 
    });
    createMap(earthquakes);
});

// Function to create markers
function marker(feature, location) {
    var options = {
        stroke: true,
        color: '#000000',
        fillOpacity: 1,
        fillColor: markerColour(feature.properties.mag),
        radius: markerSize(feature.properties.mag),
        weight: 0.5
    }

    return L.circleMarker(location, options);
}

// Function to create popups
function popUp(feature, layer) {
    return layer.bindPopup("Location: " + feature.properties.place + "</p>" +
        "<p>Magnitude: " + feature.properties.mag + "</p>");
}

// Function to create map and receive markers
function createMap(earthquakes) {

  // Define streetmap layer
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    maxZoom: 18,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });
  
  // Define a baseMaps object to hold our base layers
  var baseMap = {
    "Street Map": streetmap,
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

  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    var grades = [0, 1 , 2, 3, 4, 5];
    var colours = ["#99ff66", "#ccff66", "#ffcc66", "#ff9933", "#e67300", "#ff3300"]
    
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: " + colours[i] + "'></i> " + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    
    return div;
  };
  legend.addTo(myMap);

}