/* Example #2. Use of the Simple Map Diagrams Library (Subway Map) */

'use strict'

// initialization
const e2_smd = new SimpleMapDiagram(10, 10, 'TTC Subway Line 1',
    'Line 1 Subway of the Toronto Transit Commission in Toronto, Ontario, Canada. ',
    'example2')

// add some connections
e2_smd.addMultipleConnections([
    [5, 0, 5, 9],
    [3, 4, 3, 9],
    [3, 9, 5, 9],
    [1, 4, 3, 4],
    [1, 0, 1, 4],
    [0, 4, 9, 4]

])

// the subway line
e2_smd.addLinePlace(5, 0, 5, 9, 'transitLine')
e2_smd.addLinePlace(3, 4, 3, 9, 'transitLine')
e2_smd.addLinePlace(3, 9, 5, 9, 'transitLine')
e2_smd.addLinePlace(1, 4, 3, 4, 'transitLine')
e2_smd.addLinePlace(1, 0, 1, 4, 'transitLine')

// line 2
e2_smd.addLinePlace(0, 4, 9, 4, 'transitLine1', 'Line 2')

// the stations
e2_smd.addNodePlace(1, 0, 'poi', 'Downsview Station', 'End of the line.')
e2_smd.addNodePlace(1, 2, 'poi', 'St. Clair West Station')
e2_smd.addNodePlace(1, 4, 'poi', 'Spadina Station', 'Connection to Line 2.')
e2_smd.addNodePlace(3, 4, 'poi', 'St. George Station', 'Transfer here to Line 2.')
e2_smd.addNodePlace(3, 5, 'poi', 'Museum Station ')
e2_smd.addNodePlace(3, 6, 'poi', 'Queen\'s Park Station', 'Construction ongoing. Expect delays.')
e2_smd.addNodePlace(3, 7, 'poi', 'St. Patrick Station')
e2_smd.addNodePlace(3, 8, 'poi', 'Osgoode Station')
e2_smd.addNodePlace(3, 9, 'poi', 'St. Andrew Station')
e2_smd.addNodePlace(4, 9, 'poi', 'Union Station', 'Connection to GO Train and VIA.')
e2_smd.addNodePlace(5, 9, 'poi', 'King Station')
e2_smd.addNodePlace(5, 8, 'poi', 'Queen Station')
e2_smd.addNodePlace(5, 7, 'poi', 'Dundas Station')
e2_smd.addNodePlace(5, 6, 'poi', 'College Station', 'Elevator out of service.')
e2_smd.addNodePlace(5, 5, 'poi', 'Wellesley Station ')
e2_smd.addNodePlace(5, 4, 'poi', 'Bloor-Yonge Station', 'Connection to Line 2.')
e2_smd.addNodePlace(5, 2, 'poi', 'St. Clair Station')
e2_smd.addNodePlace(5, 0, 'poi', 'Finch Station', 'End of the line.')

// add some menus
e2_smd.addInfoBox()
e2_smd.addFilterByNameBox()
e2_smd.addNavigationMenu()

