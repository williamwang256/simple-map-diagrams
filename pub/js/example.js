/* Example usage of the Simple Map Diagrams Library. */

"use strict";

// initialization
const smd = new SimpleMapDiagram()
smd.setUp(10, 5, 'Campus Map')

// add some connections
smd.addMultipleConnections([
    [0, 0, 8, 0],
    [0, 0, 0, 4],
    [0, 4, 8, 4],
    [8, 0, 8, 4],
    [2, 0, 2, 4],
    [0, 3, 8, 3],
    [7, 0, 7, 4],
    [3, 0, 3, 4],
    [4, 0, 4, 4],
    [0, 2, 8, 2]
])

// add some block places
smd.addBlockPlace(4, 2, 1, 2, 'Central Park', 'park')
smd.addBlockPlace(0, 1, 1, 1, 'North Park', 'park')
smd.addBlockPlace(3, 3, 1, 1, 'U of T', 'building')
smd.addBlockPlace(7, 3, 1, 1, 'Pond', 'water')

// add some line places
smd.addLinePlace(0, 0, 8, 0, 'Main Street', 'street')
smd.addLinePlace(3, 0, 3, 4, 'Line 1', 'transitLine')

// add some node places
smd.addNodePlace(3, 2, 'Subway Station', 'poi')

// add some control menus
smd.addFilterByClassBox(['park', 'building'])
smd.addFilterByNameBox()
