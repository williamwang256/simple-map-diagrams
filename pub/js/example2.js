/* Example #2. Use of the Simple Map Diagrams Library (Campus Map) */

"use strict";

// Example information
const e2_title = document.createElement('h1')
e2_title.append(document.createTextNode('Example #2. Campus Map'))
const e2_description = document.createElement('p')
e2_description.append(document.createTextNode(
    'Sample use case of the Simple Map Diagrams library on a University\'s website, showing an interactive campus map. \
    Streets are arranged in a grid, and different types of places, such as parks, buildings, roads, and events are located across the map.'
))
document.getElementById('example2').append(e2_title)
document.getElementById('example2').append(e2_description)

// initialization
const e2_smd = new SimpleMapDiagram(4, 3, 'example2')
e2_smd.setUp('Secondary Campus Map', 'This is a demonstration of creating multiple instances of the Simple Map Diagrams library.')

// add some connections
e2_smd.addMultipleConnections([
    [0, 0, 3, 0],
    [0, 0, 0, 2],
    [0, 2, 3, 2],
    [3, 0, 3, 2],
    [1, 1, 3, 1],
    [1, 0, 1, 2]
])

// add some places and menus
e2_smd.addLinePlace(0, 0, 0, 2, 'Main Building', 'transitLine', 'Main building of the secondary campus')
e2_smd.addBlockPlace(0, 0, 2, 1, 'Campus Park', 'park', 'Small park on the secondary campus')
e2_smd.addBlockPlace(1, 1, 1, 1, 'Campus Park', 'building', 'Small park on the secondary campus')

// default set up
e2_smd.defaultSetUp()

document.getElementById('example2').append(document.createElement('hr'))