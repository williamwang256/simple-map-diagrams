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
smd.addBlockPlace(4, 2, 1, 2, 'central park', 'park')
smd.addBlockPlace(0, 1, 1, 1, 'north park', 'park')
smd.addBlockPlace(3, 3, 1, 1, 'uoft', 'building')
smd.addBlockPlace(7, 3, 1, 1, 'pond', 'water')

// add some line places
smd.addLinePlace(0, 0, 8, 0, 'main street', 'street')

// add some nodes places
smd.addNodePlace(3, 0, 'subway station', 'poi')

// add some control menus
smd.addFilterBox(['park', 'building'])
