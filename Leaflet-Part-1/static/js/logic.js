// Create the 'basemap' tile layer that will be the background of our map.
let myMap = L.map('map').setView([38.7946, -106.5348], 4); // Center of the USA according to google.

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {
  // console.log("Earthquake Data:", data); Testing for bad data.

  // Loop through the data and add it to the map
  L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
      let depth = feature.geometry.coordinates[2];
      let radius = (depth !== null && depth !== undefined && !isNaN(depth)) ? Math.sqrt(feature.properties.mag) * 4 : 0;
    
      // Debugging logs
      console.log("LatLng:", latlng);
      console.log("Depth:", depth);
      console.log("Radius:", radius);
    
      if (isNaN(radius) || radius <= 0) {
        radius = 0;
        // console.log("Setting radius to 0 due to invalid value"); If using the Math.sqrt function to emphasize circle sizes, this is needed. Negative (above ground), readings will give it a NaN and cause error codes in the console, even while most of the rest work. This just sets all negative values to 0.  
      }
    
      // Return marker
      return L.circleMarker(latlng, {
        radius: radius,
        fillColor: getColor(depth),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });
    }
    ,

    onEachFeature: function (feature, layer) {
      let depth = feature.geometry.coordinates[2];
      layer.bindPopup("<strong>Magnitude</strong>: " + feature.properties.mag + "<br><strong>Location</strong>: " + feature.properties.place + "<br><strong>Depth</strong>: " + depth.toFixed(3) + " km");
    }
  }).addTo(myMap);
});


// Function to set marker color based on depth
function getColor(depth) {
  if (depth === null || depth === undefined || isNaN(depth)) {
    return "#FFFFFF";  // Return a fallback color (white) if depth is null, undefined, or NaN
  }

  return depth > 110 ? "#990000" // dark red
    : depth > 90 ? "#ff0000"     // slightly lighter red
    : depth > 70 ? "#ff6600"     // orange
    : depth > 50 ? "#ffcc00"     // yellow
    : depth > 30 ? "#66ff00"     // green
    : depth > 10 ? "#33cc33"     // lighter green
    : "#009900"                  // Dark green
    ;                
}

// Create a legend control
let legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
  let div = L.DomUtil.create('div', 'info legend');

  div.innerHTML += '<strong>Earthquake Depths<br>Below Ground<br>Last 7 Days</strong><br><br>';  // Title "Earthquake Depths Below Ground"
  // Define the depth ranges and colors
  let depths = [-10, 10, 30, 50, 70, 90, 110, 130];  // Define the depth ranges
  let colors = [
    "#009900",  // Dark green (< 10)
    "#33cc33",  // Lighter green (10 to 30)
    "#66ff00",  // Green (30 to 50)
    "#ffcc00",  // Yellow (50 to 70)
    "#ff6600",  // Orange (70 to 90)
    "#ff0000",  // Red (90 to 110)
    "#990000"   // Dark red (110+)
  ];

  // Loop through the depth ranges and generate the color-coded legend
  for (let i = 0; i < depths.length - 1; i++) {
    // Add the regular legend entries
    if (i === depths.length - 2) {
      // Special handling for the last range
      div.innerHTML += 
        '<div><i style="background:' + colors[i] + '"></i> ' + depths[i] + '&ndash;' + depths[i + 1] + '+ km</div>';
    } else {
      div.innerHTML += 
        '<div><i style="background:' + colors[i] + '"></i> ' + depths[i] + '&ndash;' + depths[i + 1] + ' km</div>';
    }
  }

  return div;
};

// Add the legend to the map
legend.addTo(myMap);




// // OPTIONAL: Step 2
// // Create the 'street' tile layer as a second background of the map


// // Create the map object with center and zoom options.


// // Then add the 'basemap' tile layer to the map.

// // OPTIONAL: Step 2
// // Create the layer groups, base maps, and overlays for our two sets of data, earthquakes and tectonic_plates.
// // Add a control to the map that will allow the user to change which layers are visible.


// // Make a request that retrieves the earthquake geoJSON data.
// d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {

//   // This function returns the style data for each of the earthquakes we plot on
//   // the map. Pass the magnitude and depth of the earthquake into two separate functions
//   // to calculate the color and radius.
//   function styleInfo(feature) {

//   }

//   // This function determines the color of the marker based on the depth of the earthquake.
//   function getColor(depth) {

//   }

//   // This function determines the radius of the earthquake marker based on its magnitude.
//   function getRadius(magnitude) {

//   }

//   // Add a GeoJSON layer to the map once the file is loaded.
//   L.geoJson(data, {
//     // Turn each feature into a circleMarker on the map.
//     pointToLayer: function (feature, latlng) {

//     },
//     // Set the style for each circleMarker using our styleInfo function.
//     style: styleInfo,
//     // Create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
//     onEachFeature: function (feature, layer) {

//     }
//   // OPTIONAL: Step 2
//   // Add the data to the earthquake layer instead of directly to the map.
//   }).addTo(map);

//   // Create a legend control object.
//   let legend = L.control({
//     position: "bottomright"
//   });

//   // Then add all the details for the legend
//   legend.onAdd = function () {
//     let div = L.DomUtil.create("div", "info legend");

//     // Initialize depth intervals and colors for the legend


//     // Loop through our depth intervals to generate a label with a colored square for each interval.


//     return div;
//   };

//   // Finally, add the legend to the map.


//   // OPTIONAL: Step 2
//   // Make a request to get our Tectonic Plate geoJSON data.
//   d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function (plate_data) {
//     // Save the geoJSON data, along with style information, to the tectonic_plates layer.


//     // Then add the tectonic_plates layer to the map.

//   });
// });
