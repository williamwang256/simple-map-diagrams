/* Example #2. Use of the Simple Map Diagrams Library (Subway Map) */

'use strict'

// initialization
const e3_smd = new SimpleMapDiagram(6, 6, 'Summer Festival 2022',
    'Event ground of the Summer Festival for 2022, in Toronto. ',
    'example3')

// add some connections
e3_smd.addMultipleConnections([
    [0, 0, 5, 0],
    [2, 0, 2, 4],
    [0, 0, 0, 4],
    [4, 0, 4, 4],
    [0, 3, 4, 3],
    [0, 4, 4, 4],
    [5, 0, 5, 2],
    [0, 2, 5, 2]
])

// add the places
e3_smd.addBlockPlace(0, 3, 4, 1, 'park', 'Lakeside Park', 'Today\'s events: ')
e3_smd.addBlockPlace(0, 0, 2, 2, 'park', 'Robert Smith Park', 'Today\'s events: ')
e3_smd.addBlockPlace(0, 2, 2, 1, 'building', 'Community Centre', 'Today\'s events: ')
e3_smd.addBlockPlace(0, 4, 5, 1, 'water', 'Lake Ontario')
e3_smd.addLinePlace(2, 0, 2, 4, 'street', 'Lakefront Road', 'ROAD CLOSED DUE TO ONGOING FESTIVAL.')
e3_smd.addNodePlace(2, 1, 'incident', 'Road Closure', 'Follow detour signs placed at the intersection.')
e3_smd.addNodePlace(0, 2, 'specialEvent', 'Live Show!', 'Come see the live show from 1-2pm today!')
e3_smd.addNodePlace(2, 3, 'specialEvent', 'Live Show!', 'Come see the live show from 1-2pm today!')

// add some menus
e3_smd.addInfoBox()
e3_smd.addFilterByNameBox()


