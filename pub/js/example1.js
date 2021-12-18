/* Example #1. Use of the Simple Map Diagrams Library (Campus Map) */

"use strict";

// initialization
const e1_smd = new SimpleMapDiagram(
    10, 
    5,
    'Main Campus Map', 
    'This is a sample use case of the Simple Map Diagrams library, demonstrating a campus map.',
    'example1',
    true
)

// add some connections
e1_smd.addMultipleConnections([
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
e1_smd.addBlockPlace(4, 2, 1, 2, 'Central Park', 'park', 'The main park on campus. ')
e1_smd.addBlockPlace(0, 1, 1, 1, 'North Park', 'park', 'Smaller park on the north side of campus.')
e1_smd.addBlockPlace(3, 3, 1, 1, 'Chem Lab', 'building', 'Chemistry lab at the University of SMD.')
e1_smd.addBlockPlace(1, 3, 1, 1, 'CS Dept.', 'building', 'Department of Computer Science at the University of SMD.')
e1_smd.addBlockPlace(1, 2, 1, 1, 'Student Centre', 'building', 'Student centre at the University of SMD. Come here to ask questions.')
e1_smd.addBlockPlace(7, 3, 1, 1, 'Small Pond', 'water', 'Small pond south of campus.')
e1_smd.addBlockPlace(2, 3, 1, 1, 'SMD Hospital', 'hospital', 'University of SMD Hospital.')
e1_smd.addBlockPlace(6, 3, 1, 1, 'John\'s Park', 'park', 'Small park in downtown with a pond.')

// add some line places
e1_smd.addLinePlace(0, 0, 8, 0, 'Main Street', 'street', 'Main street north of campus. No closures. Lots of traffic right now.')
e1_smd.addLinePlace(4, 0, 4, 4, 'University Street', 'street', 'Major road through the campus. No closures. Traffic moving well.')
e1_smd.addLinePlace(3, 0, 3, 4, 'Subway Line 1', 'transitLine', 'Line 1 of the city\'s subway system.')

// add some node places
e1_smd.addNodePlace(3, 2, 'University Station', 'poi', 'University subway station, right by campus. Access subway line 1 and bus route 2. No disruptions ongoing.')
e1_smd.addNodePlace(3, 4, 'Downtown Station', 'poi', 'Downtown subway station. Access subway line 1 and bus route 3. No disruptions ongoing.')
e1_smd.addNodePlace(6, 2, 'Special Event', 'specialEvent', 'Club fair happening here today 3-4pm.')
e1_smd.addNodePlace(6, 4, 'Road closure', 'incident', 'Construction ongoing. Please avoid the area.')

// use the default set up
e1_smd.defaultSetUp()