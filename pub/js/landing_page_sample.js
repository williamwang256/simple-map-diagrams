/* Sample use of a Simple Map Diagram for the Landing Page */

'use strict'

// initialization
const lp_smd = new SimpleMapDiagram(25, 25, '', '', 'landing_page_bg', false)

// add some connections
lp_smd.addMultipleConnections([
    [0, 0, 24, 0],
    [0, 0, 0, 24],
    [24, 0, 24, 24],
    [0, 24, 24, 24],
    [0, 5, 17, 5],
    [6, 0, 6, 24],
    [0, 13, 17, 13],
    [17, 0, 17, 24],
    [6, 15, 24, 15],
    [13, 0, 13, 24],
    [0, 1, 17, 1],
    [0, 2, 6, 2],
    [0, 4, 6, 4],
    [1, 0, 1, 5],
    [3, 0, 3, 5],
    [17, 9, 24, 9],
    [5, 0, 5, 4],
    [4, 1, 4, 2],
    [12, 0, 12, 9],
    [12, 9, 13, 9],
    [0, 10, 17, 10],
    [13, 12, 17, 12]
])

// main town
lp_smd.addBlockPlace(0, 0, 2, 1,    'park',         '', '')
lp_smd.addBlockPlace(1, 1, 2, 1,    'building',     '', '')
lp_smd.addBlockPlace(3, 3, 2, 1,    'building',     '', '')
lp_smd.addBlockPlace(0, 2, 1, 2,    'building',     '', '')
lp_smd.addBlockPlace(6, 22, 3, 2,   'building',     '', '')
lp_smd.addBlockPlace(0, 1, 1, 1,    'hospital',     '', '')
lp_smd.addNodePlace(1, 2,           'specialEvent', '', '')
lp_smd.addNodePlace(6, 1,           'incident',     '', '')

// right side parks and water
lp_smd.addBlockPlace(17, 0, 7, 9,   'park',         '', '')
lp_smd.addBlockPlace(17, 17, 5, 5,  'park',         '', '')
lp_smd.addBlockPlace(20, 6, 4, 3,   'water',        '', '')

// short subway line
lp_smd.addLinePlace(6, 22, 17, 22,  'transitLine',  '', '')
lp_smd.addNodePlace(6, 22,          'poi',          '', '')
lp_smd.addNodePlace(17, 22,         'poi',          '', '')
lp_smd.addNodePlace(13, 22,         'poi',          '', '')
lp_smd.addNodePlace(9, 22,          'poi',          '', '')

// long subway line
lp_smd.addLinePlace(0, 1, 17, 1,    'transitLine',  '', '')
lp_smd.addNodePlace(0, 1,           'poi',          '', '')
lp_smd.addNodePlace(5, 1,           'poi',          '', '')
lp_smd.addNodePlace(13, 1,          'poi',          '', '')
lp_smd.addNodePlace(17, 1,          'poi',          '', '')

// vertical subway line & middle town
lp_smd.addLinePlace(14, 10, 14, 13, 'transitLine',  '', '')
lp_smd.addBlockPlace(13, 12, 1, 1,  'building',     '', '')
lp_smd.addBlockPlace(14, 12, 1, 1,  'hospital',     '', '')
lp_smd.addNodePlace(14, 10,         'poi',          '', '')
lp_smd.addNodePlace(14, 13,         'poi',          '', '')

// left most park
lp_smd.addBlockPlace(0, 10, 6, 10,  'park',         '', '')
lp_smd.addBlockPlace(3, 11, 2, 2,   'water',        '', '')