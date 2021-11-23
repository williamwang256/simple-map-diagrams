/* Simple Map Diagrams Library. */

id = 0      // global id counter

function SimpleMapDiagram(width, height) {
    this.nodes = []
    this.streets = []
    this.blockPlaces = []
    this.linePlaces = []
    this.nodePlaces = []
    this.width = width
    this.height = height
    this.id = id
    id++
}

SimpleMapDiagram.prototype = {

    /* set up all the nodes on the grid */
    setUp: function(width, height, title) {
        mapSetUp(width, height, title, this.id)
        initializeNodes(width, height, this.nodes, this.id)
        initializeInfoBox(this.id)
    },

    /* add a connection between nodes (x1, y1) and (x2, y2) */
    addConnection: function(x1, y1, x2, y2) {
        addConnection(x1, y1, x2, y2, this.nodes, this.id)
    },

    /* adds multiple connections */
    addMultipleConnections: function(connections) {
        connections.map((element) => {
            addConnection(element[0], element[1], element[2], element[3], this.nodes, this.id)
        })
    },

    /* add a block place to the map. note: type must match one of the pre-defined types */
    addBlockPlace: function(x, y, width, height, name, type) {
        const placeObj = {
            x: x,
            y: y,
            width: width,
            height: height,
            name: name,
            class: type
        }
        createBlockPlace(placeObj, this.id)
        this.blockPlaces.push(placeObj)
    },

    /* add a line place to the map. note: type must match one of the pre-defined types */
    addLinePlace: function(x1, y1, x2, y2, name, type) {
        const placeObj = {
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            name: name,
            class: type
        }
        createLinePlace(placeObj, this.id)
        this.linePlaces.push(placeObj)
    },

    /* add a node place to the map. note: type must match one of the pre-defined types */
    addNodePlace: function(x, y, name, type) {
        const placeObj = {
            x: x,
            y: y,
            name: name,
            class: type
        }
        createNodePlace(placeObj, this.id)
        this.nodePlaces.push(placeObj)
    },

    /* highlight all places of a given type */
    highlightAllByType: function(type) {
        this.blockPlaces.map((element) => {
            if (element.class === type) {
                toggleHighlightBlockPlace(this.id + '.b.' + element.x + '.' + element.y, this.id)
            }
        })
    },

    /* highlight all places with a given name */
    highlightAllByName: function(name) {
        this.blockPlaces.map((element) => {
            if (element.name === name) {
                toggleHighlightBlockPlace(this.id + '.b.' + element.x + '.' + element.y, this.id)
            }
        })
    },

    /* add a filter box which will give users the option to filter out certain elements */
    addFilterBox: function(options) {
        addFilterBox(options, this.blockPlaces, this.id)
    }
}

/* return a list of all places of a certain class */
function getAllPlacesByClass(type, elements, id) {
    const list = []
    elements.map((element) => {
        if (element.class === type) {
            list.push(id + '.b.' + element.x + '.' + element.y)
        }
    })
    return list
}

/* get a certain place */
function getPlaceByName(name, elements, id) {
    const list = []
    elements.map((element) => {
        if (element.name === type) {
            return id + '.b.' + element.x + '.' + element.y
        }
    })
}

/*** DOM manipulation functions ***/

/* function to set up the map */
function mapSetUp(width, height, title, id) {
    const body = $('body')

    // create a container for the map
    const mapContainer = document.createElement('div')
    mapContainer.id = id + '.mapContainer'
    mapContainer.className = 'mapContainer'
    mapContainer.style.height = (height * 50 + 60) + 'px'
    mapContainer.style.width = (width * 50 + 60) + 'px'
    body.append(mapContainer)

    // create a title
    const titleElement = document.createElement('h3')
    titleElement.append(document.createTextNode(title))
    mapContainer.append(titleElement)

    // create a container for the nodes
    const nodes = document.createElement('div')
    nodes.id = id + '.nodes'

    // create a container for the connections
    const connections = document.createElement('div')
    connections.id = id + '.connectionsContainer'

    // create container for the places
    const blockPlaces = document.createElement('div')
    blockPlaces.id = id + '.blockPlacesContainer'
    const linePlaces = document.createElement('div')
    linePlaces.id = id + '.linePlacesContainer'
    const nodePlaces = document.createElement('div')
    nodePlaces.id = id + '.nodePlacesContainer'

    // add to the main map container
    mapContainer.appendChild(nodes)
    mapContainer.appendChild(connections)
    mapContainer.appendChild(blockPlaces)
    mapContainer.appendChild(linePlaces)
    mapContainer.appendChild(nodePlaces)
}

/* function to set up the info box */
function initializeInfoBox(id) {
    const body = $('body')
    const infoBox = document.createElement('div')
    
    // title
    const title = document.createElement('h3')
    title.append(document.createTextNode('Currently selected:'))
    infoBox.append(title)

    // label to display information
    const infoLabel = document.createElement('p')
    infoBox.className = 'infoBox'
    infoLabel.id = id + '.label'
    infoBox.append(infoLabel)
    infoLabel.append(document.createTextNode(''))

    // add to the document
    body.append(infoBox)
}

/* function to set up the grid of nodes */
function initializeNodes(width, height, nodes, id) {
    const nodesContainer = document.getElementById(id + '.nodes')

    /* initialize a 2D grid of nodes */ 
    for (let i = 0; i < width; i++) {
        const column = document.createElement('ul')
        nodes[i] = []
        for (let j = 0; j < height; j++) {
            const node = document.createElement('div')
            const item = document.createElement('li')
            node.style.left = i * 50 + 50 + 'px'
            node.style.top = j * 50 + 50 + 'px'
            node.id = id + '.n.' + i + '.' + j
            nodes[i][j] = {
                description: "",
                element: node
            }
            item.appendChild(node)
            column.appendChild(item)
        }
        nodesContainer.append(column)
    }
}

/* function to add a connection between two nodes */
function addConnection(x1, y1, x2, y2, nodes, id) {
    const connectionsContainer = document.getElementById(id + '.connectionsContainer')
    const line = document.createElement('div')
    line.className = 'connection'

    /* determine the width of the connection line */
    let width = 5;
    if (x1 !== x2) {
        width = ((x2 - x1) * 50)
        nodes[x1][y1].element.className = 'intersection'
        nodes[x2][y1].element.className = 'intersection'
    }
    
    /* determine the height of the connection line */
    let height = 5;
    if (y1 !== y2) {
        height = ((y2 - y1) * 50)
        nodes[x1][y1].element.className = 'intersection'
        nodes[x1][y2].element.className = 'intersection'
    }

    /* create the element */
    line.style.width = width + 'px'
    line.style.height = height + 'px'
    line.style.left = (50 * (x1 + 1) + 5) + 'px'
    line.style.top = (50 * (y1 + 1) + 5) + 'px'
    connectionsContainer.append(line)
}

/* function to add a block place to the map (i.e., a place that fits between streets) */
function createBlockPlace(place, id) {
    const blockPlacesContainer = document.getElementById(id + '.blockPlacesContainer')
    const block = document.createElement('div')
    block.id = id + '.b.' + place.x + '.' + place.y
    block.className = place.class
    block.style.width = (place.width * 50 - 5) + 'px'
    block.style.height = (place.height * 50 - 5) + 'px'
    block.style.left = (place.x * 50 + 60) + 'px'
    block.style.top = (place.y * 50 + 60) + 'px'
    blockPlacesContainer.append(block)

    // when the place is clicked, display its information
    block.addEventListener('click', function(e) {
        const infoLabel = document.getElementById(id + '.label')
        infoLabel.textContent = place.name
    })

    // add a label
    const label = document.createElement('label')
    label.appendChild(document.createTextNode(place.name))
    label.className = 'placeLabel'
    block.append(label)
}

/* function to add a line place to the map (i.e., a place that fits on a connection) */
function createLinePlace(place, id) {
    const linePlacesContainer = document.getElementById(id + '.linePlacesContainer')
    const line = document.createElement('div')
    line.id = id + '.l.' + place.x1 + '.' + place.y1 + '.' + place.x2 + '.' + place.y2
    line.className = place.class

    // determine the width of the line
    let width = 5;
    if (place.x1 !== place.x2) {
        width = ((place.x2 - place.x1) * 50)
    }
    
    // determine the height of the line
    let height = 5;
    if (place.y1 !== place.y2) {
        height = ((place.y2 - place.y1) * 50)
    }

    // when the place is clicked, display its information
    line.addEventListener('click', function(e) {
        const infoLabel = document.getElementById('label')
        infoLabel.textContent = place.name
    })

    // create the element
    line.style.width = width + 'px'
    line.style.height = height + 'px'
    line.style.left = (50 * (place.x1 + 1) + 5) + 'px'
    line.style.top = (50 * (place.y1 + 1) + 5) + 'px'
    

    // add a label
    const label = document.createElement('label')
    label.appendChild(document.createTextNode(place.name))
    label.className = ('placeLabel')
    line.append(label)
    linePlacesContainer.append(line)
}

/* function to add a node place to the map (i.e., a place that falls on a node) */
function createNodePlace(place, id) {
    const nodePlacesContainer = document.getElementById(id + '.nodePlacesContainer')
    const node = document.createElement('div')
    node.id = id + '.n.' + place.x + '.' + place.y
    node.className = place.class

    // determine placement
    node.style.left = place.x * 50 + 50 + 'px'
    node.style.top = place.y * 50 + 50 + 'px'
    node.className = place.class
    
    // when the place is clicked, display its information
    node.addEventListener('click', function(e) {
        const infoLabel = document.getElementById(id + '.label')
        infoLabel.textContent = place.name
    })

    // add a label
    const label = document.createElement('label')
    label.appendChild(document.createTextNode(place.name))
    label.className = 'placeLabel'
    node.append(label)
    nodePlacesContainer.append(node)
}

/* function to toggle highlight on a block place with given id */
function toggleHighlightBlockPlace(id) {
    const element = document.getElementById(id)
    if (element.classList.contains('highlight')) {
        element.classList.remove('highlight')
    } else {
        element.classList.add('highlight')
    }    
}

/* function to add a menu to filter places by type */
function addFilterBox(options, places, id) {
    const body = $('body')
    const filterBox = document.createElement('div')
    filterBox.className = 'infoBox'
    body.append(filterBox)
    
    // add a title
    const label = document.createElement('h3')
    label.append(document.createTextNode('Highlight by type:'))
    const instruction = document.createElement('p')
    instruction.append(document.createTextNode('Click on a place type to highlight on the map.'))
    filterBox.append(label)
    filterBox.append(instruction)

    // add a list of clickable items
    const list = document.createElement('ul')
    filterBox.append(list)
    
    options.map((element) => {
        const item = document.createElement('li')
        item.append(document.createTextNode(element))
        list.append(item)
        const elements = getAllPlacesByClass(element, places, id)

        // when a place name is clicked, highlight it on the map
        item.addEventListener('click', function(e) {
            elements.map((id) => {
                toggleHighlightBlockPlace(id)
            })
        })
    })
}
