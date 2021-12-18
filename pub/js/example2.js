/* Example #2. Use of the Simple Map Diagrams Library (Campus Map) */

'use strict'

// initialization
const e2_smd = new SimpleMapDiagram(4, 3, 'Secondary Campus Map',
    'This is a demonstration of creating multiple instances of the Simple Map Diagrams library.',
    'example2')

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
e2_smd.addLinePlace(0, 0, 0, 2,  'transitLine', 'Main Building',    'Main building of the secondary campus')
e2_smd.addBlockPlace(0, 0, 2, 1, 'park',        'Campus Park',      'Small park on the secondary campus')
e2_smd.addBlockPlace(1, 1, 1, 1, 'building',    'Campus Park',      'Small park on the secondary campus')

// default set up
e2_smd.defaultSetUp()
