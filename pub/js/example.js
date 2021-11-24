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
smd.addBlockPlace(4, 2, 1, 2, 'Central Park', 'park', 'The main park on campus. ')
smd.addBlockPlace(0, 1, 1, 1, 'North Park', 'park', 'Smaller park on the north side of campus.')
smd.addBlockPlace(3, 3, 1, 1, 'Chem Lab', 'building', 'Chemistry lab at the University of SMD.')
smd.addBlockPlace(1, 3, 1, 1, 'CS Dept.', 'building', 'Department of Computer Science at the University of SMD.')
smd.addBlockPlace(1, 2, 1, 1, 'Student Centre', 'building', 'Student centre at the University of SMD. Come here to ask questions.')
smd.addBlockPlace(7, 3, 1, 1, 'Small Pond', 'water', 'Small pond south of campus.')
smd.addBlockPlace(6, 3, 1, 1, 'John\'s Park', 'park', 'Small park in downtown with a pond.')

// add some line places
smd.addLinePlace(0, 0, 8, 0, 'Main Street', 'street', 'Main street north of campus. No closures. Lots of traffic right now.')
smd.addLinePlace(4, 0, 4, 4, 'University Street', 'street', 'Major road through the campus. No closures. Traffic moving well.')
smd.addLinePlace(3, 0, 3, 4, 'Subway Line 1', 'transitLine', 'Line 1 of the city\'s subway system.')

// add some node places
smd.addNodePlace(3, 2, 'University Station', 'poi', 'University subway station, right by campus. Access subway line 1 and bus route 2. No disruptions ongoing.')
smd.addNodePlace(3, 4, 'Downtown Station', 'poi', 'Downtown subway station. Access subway line 1 and bus route 3. No disruptions ongoing.')
smd.addNodePlace(1, 1, 'Special Event', 'specialEvent', 'Club fair happening here today 3-4pm.')
smd.addNodePlace(6, 4, 'Road closure', 'incident', 'Construction ongoing. Please avoid the area.')

// add some control menus
smd.addFilterByClassBox('Filter items by type:', 'These options provides users of the website to highlight items on the map by a certain type.', ['park', 'building'])
smd.addFilterByNameBox('View items by name:', 'These options provides users of the website to highlight a certain item on the map.')
