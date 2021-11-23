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
smd.addBlockPlace(4, 2, 1, 2, 'Queen\'s Park', 'park', 'Queen\'s Park is an urban park in Downtown Toronto, Ontario, Canada. Opened in 1860 by Edward, Prince of Wales, it was named in honour of Queen Victoria. The park is the site of the Ontario Legislative Building, which houses the Legislative Assembly of Ontario. Source: Wikipedia.')
smd.addBlockPlace(0, 1, 1, 1, 'North Park', 'park')
smd.addBlockPlace(3, 3, 1, 1, 'U of T', 'building', 'The University of Toronto is a public research university in Toronto, Ontario, Canada, located on the grounds that surround Queen\'s Park. It was founded by royal charter in 1827 as King\'s College, the first institution of higher learning in Upper Canada. Source: Wikipedia.')
smd.addBlockPlace(7, 3, 1, 1, 'Pond', 'water')

// add some line places
smd.addLinePlace(0, 0, 8, 0, 'Main Street', 'street')
smd.addLinePlace(3, 0, 3, 4, 'Line 1', 'transitLine')

// add some node places
smd.addNodePlace(3, 2, 'Subway Station', 'poi')

// add some control menus
smd.addFilterByClassBox(['park', 'building'])
smd.addFilterByNameBox()
