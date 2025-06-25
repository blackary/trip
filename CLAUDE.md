# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a travel planning web application that visualizes a multi-loop RV trip across the United States. The application displays an interactive map showing:
- Trip points (campsites, attractions, stops) organized by loops
- State polygons colored by visit status (visited/planned)
- Interactive filtering by trip loops
- Future vs current trip points

## Architecture

### Core Files
- `index.html` - Main HTML page with embedded JavaScript for map initialization and UI
- `states.js` - State detection logic using geometric point-in-polygon calculations
- `trip.yml` - GeoJSON FeatureCollection in YAML format containing all trip points
- `us-states.json` - GeoJSON data for US state boundaries (large file ~40k tokens)

### Key Libraries
- Leaflet.js - Interactive mapping
- Turf.js - Geospatial calculations (point-in-polygon for state detection)
- js-yaml - YAML parsing for trip data
- Simple.css - Basic styling framework

### Data Structure
Trip points in `trip.yml` have properties:
- `name` - Location name
- `loop` - Trip loop number (1, 2, 3, etc.)
- `future` - Boolean indicating if point is planned vs visited
- Geometry with lat/lng coordinates

### State Detection Logic
The `getVisitedStates()` and `getPlannedStates()` functions in `states.js` use Turf.js to:
1. Load US state polygon data
2. Check if trip points fall within state boundaries
3. Handle both Polygon and MultiPolygon geometries
4. Return Sets of state names for map coloring

## Development Notes

- Trip data uses cache-busting query parameters (`?v=" + Date.now()`)
- Map shows different icons for future vs current points when viewing "All" loops
- State coloring: green for visited, blue for planned, gray for unvisited
- Loop filtering dynamically updates both map markers and state highlighting