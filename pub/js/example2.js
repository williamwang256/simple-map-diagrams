/* Example #2. Use of the Simple Map Diagrams Library (Campus Map) */

"use strict";

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
