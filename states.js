// states.js
// Handles state list logic for the trip map

// Returns a Promise that resolves to an array of all state names
function getAllStates() {
  return fetch('us-states.json')
    .then(response => response.json())
    .then(statesData => statesData.features.map(f => f.properties.name));
}

// Returns a Promise that resolves to a Set of visited state names given tripPoints
function getVisitedStates(tripPoints) {
  return fetch('us-states.json')
    .then(response => response.json())
    .then(statesData => {
      const visitedStates = new Set();
      statesData.features.forEach(feature => {
        try {
          if (!feature.geometry || !feature.geometry.coordinates) {
            return;
          }
          let polygons = [];
          if (feature.geometry.type === 'Polygon') {
            polygons = [feature.geometry.coordinates];
          } else if (feature.geometry.type === 'MultiPolygon') {
            polygons = feature.geometry.coordinates;
          } else {
            return;
          }
          let isVisited = false;
          for (const polyCoords of polygons) {
            if (!polyCoords[0] || polyCoords[0].length < 4) {
              continue;
            }
            const ring = polyCoords[0];
            if (ring[0][0] !== ring[ring.length - 1][0] || ring[0][1] !== ring[ring.length - 1][1]) {
              ring.push(ring[0]);
            }
            const statePolygon = turf.polygon([ring]);
            isVisited = tripPoints.some(point => {
              try {
                const pointFeature = turf.point(point.geometry.coordinates);
                return turf.booleanPointInPolygon(pointFeature, statePolygon);
              } catch (e) {
                return false;
              }
            });
            if (isVisited) break;
          }
          if (isVisited) {
            visitedStates.add(feature.properties.name);
          }
        } catch (e) {
          // Ignore errors for individual states
        }
      });
      return visitedStates;
    });
}