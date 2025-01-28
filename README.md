# **leaflet-challenge**

## **Table of Contents**

- [**leaflet-challenge**](#leaflet-challenge)
  - [**Table of Contents**](#table-of-contents)
  - [**Project Overview**](#project-overview)
  - [**Features**](#features)
  - [**Technologies / Dependencies Needed and Used**](#technologies--dependencies-needed-and-used)
  - [**How to Run the Application**](#how-to-run-the-application)
  - [**Visualizations**](#visualizations)
  - [**Data Source**](#data-source)
  - [**Visualization Details**](#visualization-details)
  - [**Development Process**](#development-process)
  - [**Sources**](#sources)
  - [**Additional Information**](#additional-information)
    - [Solution:](#solution)
  - [**License**](#license)
  - [**Project By**](#project-by)
  - [**Contact**](#contact)

## **Project Overview**
![Dashboard Screenshot](/Images/Images/Part1_overview.png)<br><br>
This project is focused on building an interactive map using Leaflet.js to visualize data related to global earthquakes and tectonic plates. By leveraging GeoJSON data from various sources, such as the USGS Earthquake Feed and OpenStreetMap, the map dynamically updates to display real-time earthquake activity, along with key information about the tectonic plates' locations and boundaries.


## **Features**
* Real-Time Earthquake Data: The map shows earthquake data from the USGS, updated in real time, using GeoJSON format for easy integration with Leaflet.
* Tectonic Plate Boundaries: Tectonic plates are plotted on the map, providing a visual reference for the correlation between seismic activity and plate boundaries.
* Interactive Map: Users can zoom, pan, and click on map elements to access additional information, such as earthquake magnitudes, depths, and locations.
* 1. Part 1 of interactive map can be found here [Github Pages Part 1](https://realmattimatt.github.io/leaflet-challenge.html)
* 2. Part 2 of interactive map can be found here [Github Pages Part 2](https://realmattimatt.github.io/leaflet-challenge/indexPart2.html)

## **Technologies / Dependencies Needed and Used**
* HTML: For structuring the content of the webpage.
* CSS: For styling the map and other elements to ensure a user-friendly interface.
* JavaScript: For implementing interactivity, data handling, and integrating with external libraries.
* Leaflet: A leading JavaScript library for interactive maps, used to render the map and display real-time data.
* D3: A JavaScript library for manipulating documents based on data, particularly used for rendering dynamic, data-driven visualizations on the map.

## **How to Run the Application**
add here

## **Visualizations**
![Sample Earthquake Map](/Images/Images/Sample_earthquake_map.png)

![Above Ground Earthquake Image](Images\Images\Above_ground_earthquake.png)

![Geographical Sample](Images\Images\Geographical_sample.png)

## **Data Source**
The data used in this dashboard is sourced from the [USGS](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php), [github.com/fraxen/tectonicplates](https://github.com/fraxen/tectonicplates), and [openstreetmap.org](https://www.openstreetmap.org)

## **Visualization Details**
add here

## **Development Process**
add here

## **Sources**
* Office hours / instructional time / T.A's
* [Leaflet-JS](https://leafletjs.com/reference)
* [openstreetmap.org](https://www.openstreetmap.org)
* [USGS](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php)
* [github.com/fraxen/tectonicplates](https://github.com/fraxen/tectonicplates)
* Xpert Learning Assistant
* [CSS W3Schools](https://www.w3schools.com/css/)
* [HTML](https://www.w3schools.com/html/)
* Chat GPT


## **Additional Information**
Issue with Negative Magnitude Values in Radius Calculation:

In the project, the radius of each earthquake marker is determined by the formula `Math.sqrt(feature.properties.mag) * 6`. However, the `Math.sqrt` function in JavaScript returns `NaN` (Not-a-Number) if the input is a negative number. 

This caused issues when the magnitude (`feature.properties.mag`) had negative values, resulting in an invalid radius (i.e., `NaN`), which prevented the marker from being rendered correctly.<br>
If radius was just set to a fixed value, making all circles the same radius this was not an issue. Unfortunately attempting to make the circles vary according to distance below ground, the few earthquakes that did happen above ground, caused the Math.sqrt to error. 

### Solution:

To address this, a check was added to ensure that the radius is valid. If the radius is `NaN` or less than or equal to `0`, it is set to `0` to prevent rendering errors:

```javascript
if (isNaN(radius) || radius <= 0) {
  radius = 0;
  console.log("Setting radius to 0 due to invalid value");
}
```

## **License**
This project is licensed under the [GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007](./LICENSE) - see the LICENSE file for details here.

## **Project By**
**Matthew Matti** – Developer, Creator of this leaflet-challenge

## **Contact**
For any questions or feedback, feel free to reach out to me at [mattimatt@hotmail.com](mailto:mattimatt@hotmail.com).

![License](https://img.shields.io/badge/license-GPL%203-blue)