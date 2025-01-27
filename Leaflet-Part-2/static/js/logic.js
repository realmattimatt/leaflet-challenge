// Create the 'basemap' tile layer that will be the background of our map.
let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Create the 'street' tile layer as a second background of the map
let basemap = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://carto.com/attributions">CartoDB</a>'
});

// Create the 'satellite' tile layer as a third background of the map
let satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: '&copy; <a href="https://www.esri.com/en-us/home">ESRI</a>',
  maxZoom: 19
});


// Create the map object with center and zoom options.
let myMap = L.map("map", {
  center: [38.7946, -106.5348],
  zoom: 4,
  layers: [basemap]  // Default base layer is basemap
});

// Create the layer groups, base maps, and overlays for our two sets of data, earthquakes and tectonic_plates.
let earthquakes = L.layerGroup(); // Assume you will add earthquake data to this layer
let tectonic_plates = L.layerGroup(); // Assume you will add tectonic plate data to this layer

let baseMaps = {
  "Basemap": basemap,
  "Streetmap": streetmap,
  "Satellite": satellite,  
};

let overlayMaps = {
  "Earthquakes": earthquakes,
  "Tectonic Plates": tectonic_plates
};

// Add a control to the map that will allow the user to change which layers are visible.
L.control.layers(baseMaps, overlayMaps).addTo(myMap);

// Make a request that retrieves the earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {

  // This function returns the style data for each of the earthquakes we plot on
  function styleInfo(feature) {
    return {
      radius: getRadius(feature, feature.geometry.coordinates[2]),  // Pass latlng as feature.geometry.coordinates[2] for depth
      fillColor: getColor(feature.geometry.coordinates[2]),
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };
  }

  // This function determines the color of the marker based on the depth of the earthquake.
  function getColor(depth) {
    if (depth === null || depth === undefined || isNaN(depth)) {
      return "#FFFFFF";  // Return a fallback color (white) if depth is null, undefined, or NaN
    }

    // Handle negative depths (e.g., for underwater quakes, you could return a neutral color or any color you prefer)
    if (depth < 0) {
      return "#999999";  // A neutral color (gray) for negative depths
    }

    return depth > 110 ? "#990000"   // Dark red
      : depth > 90 ? "#ff0000"     // Slightly lighter red
      : depth > 70 ? "#ff6600"     // Orange
      : depth > 50 ? "#ffcc00"     // Yellow
      : depth > 30 ? "#66ff00"     // Green
      : depth > 10 ? "#33cc33"     // Lighter green
      : "#009900";                 // Dark green
  }

  // This function determines the radius of the earthquake marker based on its magnitude.
  function getRadius(feature, depth) {
    if (depth < 0) {
      return 0;  // No marker size for negative depths
    }

    let radius = (depth !== null && depth !== undefined && !isNaN(depth)) ? Math.sqrt(feature.properties.mag) * 4 : 0;

    if (isNaN(radius) || radius <= 0) {
      radius = 0;
    }
    // Return circle marker with radius and color
    return radius;
  }

  // Add a GeoJSON layer to the earthquakes layer (not directly to the map)
  L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, { // Add latlng to circleMarker creation
        radius: getRadius(feature, feature.geometry.coordinates[2]),  // Use the depth as second argument
        fillColor: getColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });
    },
    style: styleInfo,
    onEachFeature: function (feature, layer) {
      let depth = feature.geometry.coordinates[2];  // Get the depth from the feature
      layer.bindPopup("<strong>Magnitude</strong>: " + feature.properties.mag + "<br><strong>Location</strong>: " + feature.properties.place + "<br><strong>Depth</strong>: " + depth.toFixed(3) + " km");
    }
  }).addTo(earthquakes);  // Add data to the earthquakes layer

  earthquakes.addTo(myMap);  // Add earthquakes layer to the map

  // Create a legend control object.
  let legend = L.control({
    position: "bottomright"
  });

  // Then add all the details for the legend
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");
    div.innerHTML += '<strong>Earthquake Depths<br>Below Ground<br>Last 7 Days</strong><br><br>';  // Title "Earthquake Depths Below Ground"
    let intervals = [0, 10, 30, 50, 70, 90, 110]; // Depth intervals
    let labels = [];

    // Loop through each interval and create a colored square for the legend
    for (let i = 0; i < intervals.length; i++) {
      div.innerHTML +=
        '<i style="background:' + getColor(intervals[i] + 1) + '"></i> ' +
        intervals[i] + (intervals[i + 1] ? '&ndash;' + intervals[i + 1] + ' km<br>' : ' km+');
    }
    return div;
  };

  // Finally, add the legend to the map.
  legend.addTo(myMap);  // Add the legend to the map

  // OPTIONAL: Step 2 - Tectonic Plate data
  d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function (plate_data) {
    L.geoJson(plate_data, {
      style: {
        color: "#ff6600", // Color for tectonic plate lines
        weight: 2
      }
    }).addTo(tectonic_plates);

    tectonic_plates.addTo(myMap);  // Add tectonic plates layer to map
  });
});
