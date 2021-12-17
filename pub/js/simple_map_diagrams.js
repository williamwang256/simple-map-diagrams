/* Simple Map Diagrams Library.

URL: https://fierce-shelf-08886.herokuapp.com/examples.html
*/

id = 0      // global id counter
DEBUG = false

current = null
source = undefined
destination = undefined
state = 'view'

function SimpleMapDiagram(width, height) {
    this.nodes = []
    this.streets = []

    // lists to stores the places on the map
    this.blockPlaces = []
    this.linePlaces = []
    this.nodePlaces = []

    this.labelSpots = []

    // width and height of the map
    this.width = width
    this.height = height

    // unique identifier; incremented every time a SMD is created
    this.id = id
    id++
}

SimpleMapDiagram.prototype = {

    /* set up all the nodes on the grid */
    setUp: function(title, description) {
        mapSetUp.bind(this)(title, description)
        initializeNodes.bind(this)(this.width, this.height)
    },

    /* add a connection between nodes (x1, y1) and (x2, y2) */
    addConnection: function(x1, y1, x2, y2) {
        addConnection.bind(this)(x1, y1, x2, y2)
    },

    /* adds multiple connections */
    addMultipleConnections: function(connections) {
        connections.map((element) => {
            addConnection.bind(this)(element[0], element[1], element[2], element[3])
        })
    },

    /* add a block place to the map. note: type must match one of the pre-defined types */
    addBlockPlace: function(x, y, width, height, name, type, description) {
        const blockPlace = new BlockPlace(x, y, width, height, name, type, description)
        createBlockPlace.bind(this)(blockPlace)
        this.blockPlaces.push(blockPlace)
    },

    /* add a line place to the map. note: type must match one of the pre-defined types */
    addLinePlace: function(x1, y1, x2, y2, name, type, description) {
        const linePlace = new LinePlace(x1, y1, x2, y2, name, type, description)
        createLinePlace.bind(this)(linePlace)
        this.linePlaces.push(linePlace)
    },

    /* add a node place to the map. note: type must match one of the pre-defined types */
    addNodePlace: function(x, y, name, type, description) {
        const nodePlace = new NodePlace(x, y, name, type, description)
        createNodePlace.bind(this)(nodePlace)
        this.nodePlaces.push(nodePlace)
    },

    /* highlight all places of a given type */
    highlightAllByType: function(type) {
        this.blockPlaces.map((element) => {
            if (element.class === type) {
                toggleHighlightBlockPlace(element.getID(this.id), this.id)
            }
        })
    },

    /* highlight all places with a given name */
    highlightAllByName: function(name) {
        // if no options are given, default to include all
        this.blockPlaces.map((element) => {
            if (element.name === name) {
                toggleHighlightBlockPlace(element.getID(this.id), this.id)
            }
        })
    },

    /* add an information box to display place information */
    addInfoBox: function() {
        initializeControlBox.bind(this)()
    },

    /* add a filter box which will give users the option to filter by certain place type */
    addFilterByClassBox: function(title, description, options) {
        const all_places = this.blockPlaces.concat(this.linePlaces).concat(this.nodePlaces)
        // if no options are given, default to include all
        if (!options) {
            options = getAllItemClasses(all_places)
        }
        addFilterBox.bind(this)(options, title, description, all_places, getAllPlacesByClass)
    },

    /* add a filter box which will give users the option to filter by certain place type */
    addFilterByNameBox: function(title, description, options) {
        const all_places = this.blockPlaces.concat(this.linePlaces).concat(this.nodePlaces)
        // if no options are given, default to include all
        if (!options) {
            options = getAllItemNames(all_places)
        }
        addFilterBox.bind(this)(options, title, description, all_places, getPlaceByName)
    },

    /* add a legend to the map */
    addLegend: function() {
        addLegend(getAllItemClasses(this.blockPlaces), 
            getAllItemClasses(this.linePlaces), getAllItemClasses(this.nodePlaces), this.id)
    }
}

/*** Classes for place objects ***/

/* block place class */
class BlockPlace {
	constructor(x, y, width, height, name, type, description) {
		this.x = x
		this.y = y
		this.width = width
		this.height = height
        this.name = name
        this.class = type
        this.description = description
    }

    /* get the id of this place, given its SMD id*/
	getID(id) {
        return id + '.b.' + this.x + '.' + this.y
    }
}

/* line place class */
class LinePlace {
	constructor(x1, y1, x2, y2, name, type, description) {
		this.x1 = x1
		this.y1 = y1
        this.x2 = x2
		this.y2 = y2
        this.name = name
        this.class = type
        this.description = description
	}

    /* get the id of this place, given its SMD id*/
	getID(id) {
        return id + '.l.' + this.x1 + '.' + this.y1 + '.' + this.x2 + '.' + this.y2
    }
}

/* node place class */
class NodePlace {
	constructor(x, y, name, type, description) {
		this.x = x
		this.y = y
        this.name = name
        this.class = type
        this.description = description
	}

    /* get the id of this place, given its SMD id*/
	getID(id) {
        return id + '.n.' + this.x + '.' + this.y
    }
}

/*** Helper functions ***/

/* return a list of all places of a certain class */
function getAllPlacesByClass(type, elements) {
    const list = []
    elements.map((element) => {
        if (element.class === type) {
            list.push(element.getID(this.id))
        }
    })
    return list
}

/* get a certain place */
function getPlaceByName(name, elements) {
    const list = []
    elements.map((element) => {
        if (element.name === name) {
            list.push(element.getID(this.id))
        }
    })
    return list
}

/* function to get a list of all place classes on the map */
function getAllItemClasses(elements) {
    const list = []
    elements.map((element) => {
        if (!list.includes(element.class)) {
            list.push(element.class)
        }
    })
    return list
}

/* function to get a list of all names of places on the map */
function getAllItemNames(elements) {
    const list = []
    elements.map((element) => {
        if (!list.includes(element.name)) {
            list.push(element.name)
        }
    })
    return list
}

/* function to search preliminary locations for labels */
function searchPreliminaryLocations(x, y) {
    let tmp_x = x
    let tmp_y = y
    if (!this.labelSpots.includes(tmp_x + '.' + tmp_y)) {
        // nothing to do here
    } else if (!this.labelSpots.includes((tmp_x - 1) + '.' - tmp_y)) {
        tmp_x--
    } else if (!this.labelSpots.includes(tmp_x + '.' + (tmp_y + 1))) {
        tmp_y--
    } else if (!this.labelSpots.includes((tmp_x - 1) + '.' + (tmp_y - 1))) {
        tmp_x--
        tmp_y--
    } else {
        return null
    }
    return [tmp_x, tmp_y]
}

/* function to find a path between two locations, using Breadth First Search */
function findShortestPath(x1, y1, x2, y2) {
    this.nodes[x1][y1].visited = true
    const queue = []
    queue.push(this.nodes[x1][y1])
    while (queue.length !== 0) {
        u = queue.shift()
        if (u === this.nodes[x2][y2]) {
            let curr = u
            const ret = []
            while (curr !== null) {
                ret.push(curr)
                curr = curr.parent
            }
            return ret
        }
        for (let i = 0; i < u.neighbours.length; i++) {
            if (u.neighbours[i].visited === false) {
                u.neighbours[i].visited = true
                u.neighbours[i].parent = u
                queue.push(u.neighbours[i])
            }
        }
    }
}

/* function to clear the tree structure formed by BFS, and remove nav on map */
function clearNavigation() {
    for (let i = 0; i < this.width; i++) {
        for (let j = 0; j < this.height; j++) {
            this.nodes[i][j].visited = false
            this.nodes[i][j].parent = null
        }
    }
    const navigationContainer = document.getElementById(this.id + '.navigationContainer')
    navigationContainer.textContent = ''
    const srcLabel = document.getElementById(this.id + '.srcLabel')
    const destLabel = document.getElementById(this.id + '.destLabel')
    srcLabel.textContent = 'Select an item to mark as source.'
    destLabel.textContent = 'Select an item to mark as destination.'

}

/*** DOM manipulation functions ***/

/* function to set up the map */
function mapSetUp(title, description) {
    const body = $('body')

    // create a container for this Simple Map Diagram
    const container = document.createElement('div')
    container.id = this.id + '.SMDcontainer'
    container.className = 'SMDcontainer'
    body.append(container)

    // create a title and subtitle
    const titleContainer = document.createElement('div')
    const titleElement = document.createElement('h2')
    titleElement.append(document.createTextNode(title))
    const subtitle = document.createElement('p')
    subtitle.className = 'controlLabel'
    subtitle.append(document.createTextNode(description))
    titleContainer.id = this.id + '.titleContainer'
    titleContainer.className = 'titleContainer'
    titleContainer.append(titleElement)
    titleContainer.append(subtitle)
    container.append(titleContainer)

    // create a container for the map
    const mapContainer = document.createElement('div')
    mapContainer.id = this.id + '.mapContainer'
    mapContainer.className = 'controlContainer'
    container.append(mapContainer)

    // the map itself
    const map = document.createElement('div')
    map.id = this.id + '.map'
    map.className = 'mapContainer'
    map.style.height = (this.height * 50 + 60) + 'px'
    map.style.width = (this.width * 50 + 60) + 'px'
    mapContainer.append(map)
    
    // create a container for the nodes
    const nodes = document.createElement('div')
    nodes.id = this.id + '.nodes'

    // create a container for the connections
    const connections = document.createElement('div')
    connections.id = this.id + '.connectionsContainer'

    // create container for the places
    const blockPlaces = document.createElement('div')
    blockPlaces.id = this.id + '.blockPlacesContainer'
    const linePlaces = document.createElement('div')
    linePlaces.id = this.id + '.linePlacesContainer'
    const nodePlaces = document.createElement('div')
    nodePlaces.id = this.id + '.nodePlacesContainer'

    // add to the main map container
    map.append(nodes)
    map.append(connections)
    map.append(blockPlaces)
    map.append(linePlaces)
    map.append(nodePlaces)

    // create a container for the control menus
    const controlCentre = document.createElement('div')
    controlCentre.id = this.id + '.controlCentre'
    controlCentre.className = 'controlContainer'
    container.append(controlCentre)

    // create a container for the navigation route
    const navigationContainer = document.createElement('div')
    navigationContainer.id = this.id + '.navigationContainer'
    map.append(navigationContainer)
}

/* function to set up the info box */
function initializeControlBox() {
    const mapContainer = document.getElementById(this.id + '.mapContainer')
    const controlBox = document.createElement('div')
    controlBox.className = 'controlBox'

    // labels to display information
    const infoLabel = document.createElement('h4')
    infoLabel.id = this.id + '.selectedLabel'
    infoLabel.append(document.createTextNode('Click an item to start.'))
    const descriptionLabel = document.createElement('p')
    descriptionLabel.id = this.id + '.descLabel'
    descriptionLabel.className = 'controlLabel'
    controlBox.append(infoLabel)
    controlBox.append(descriptionLabel)

    // labels to display navigation information
    const navLabel = document.createElement('h4')
    navLabel.append(document.createTextNode('Navigation'))
    const list = document.createElement('ul')
    const srcLabel = document.createElement('li')
    srcLabel.id = this.id + '.srcLabel'
    srcLabel.className = 'controlLabel'
    srcLabel.append(document.createTextNode('Select an item to mark as source.'))
    const destLabel = document.createElement('li')
    destLabel.id = this.id + '.destLabel'
    destLabel.className = 'controlLabel'
    destLabel.append(document.createTextNode('Select an item to mark as destination.'))
    list.append(srcLabel)
    list.append(destLabel)
    controlBox.append(navLabel)
    controlBox.append(list)

    // button to mark the source
    const srcButton = document.createElement('button')
    controlBox.append(srcButton)
    srcButton.className = 'navigateButton'
    srcButton.append(document.createTextNode('Choose starting point'))
    srcButton.addEventListener('click', () => { state = 'selectSrc' })

    // button to mark the destination
    const destButton = document.createElement('button')
    controlBox.append(destButton)
    destButton.className = 'navigateButton'
    destButton.append(document.createTextNode('Choose destination'))
    destButton.addEventListener('click', () => { state = 'selectDest' })

    // button to display navigation on screen
    const navigateButton = document.createElement('button')
    controlBox.append(navigateButton)
    navigateButton.className = 'navigateButton'
    navigateButton.append(document.createTextNode('Navigate!'))
    navigateButton.addEventListener('click', () => {
        clearNavigation.bind(this)()
        if (source === undefined || destination === undefined) {
            alert('Missing source or destination.')
        } else {
            const path = findShortestPath.bind(this)(
                source.x, 
                source.y, 
                destination.x, 
                destination.y,
            )
            if (path === undefined) {
                alert('Could not find a path.')
                clearNavigation.bind(this)()
            } else {
                drawPath.bind(this)(path)
            }
            source = undefined
            destination = undefined
        }
    })

    // button to clear navigation
    const clearButton = document.createElement('button')
    controlBox.append(clearButton)
    clearButton.className = 'navigateButton'
    clearButton.append(document.createTextNode('Clear'))
    clearButton.addEventListener('click', () => {
        clearNavigation.bind(this)()
    })

    // add to the document
    mapContainer.append(controlBox)
}

/* function to set up the grid of nodes */
function initializeNodes() {
    const nodesContainer = document.getElementById(this.id + '.nodes')

    // initialize a 2D grid of nodes
    for (let i = 0; i < this.width; i++) {
        const column = document.createElement('ul')
        this.nodes[i] = []
        for (let j = 0; j < this.height; j++) {
            const node = document.createElement('div')
            const item = document.createElement('li')
            node.style.left = i * 50 + 50 + 'px'
            node.style.top = j * 50 + 50 + 'px'
            node.id = this.id + '.sn.' + i + '.' + j
            node.classList.add('node')
            node.classList.add('invisibleIntersection')
            this.nodes[i][j] = {
                id: node.id,
                neighbours: [],     // these fields are used for BFS
                parent: null,
                visited: false,
                x: i,
                y: j
            }
            
            item.appendChild(node)
            column.appendChild(item)
            node.addEventListener('click', () => {
                if (state === 'selectSrc') {
                    const srcLabel = document.getElementById(this.id + '.srcLabel')
                    source = this.nodes[i][j]
                    srcLabel.textContent = 'Source: unknown intersection'
                } else if (state === 'selectDest') {
                    const destLabel = document.getElementById(this.id + '.destLabel')
                    destination = this.nodes[i][j]
                    destLabel.textContent = 'Destination: unknown intersection'
                }
            })
        }
        nodesContainer.append(column)
    }
}

/* function to add a connection between two nodes */
function addConnection(x1, y1, x2, y2) {
    const connectionsContainer = document.getElementById(this.id + '.connectionsContainer')
    const line = document.createElement('div')
    line.classList.add('line')
    line.classList.add('connection')

    // determine the width of the connection line
    let width = 5;
    if (x1 !== x2) {
        width = ((x2 - x1) * 50)
        document.getElementById(this.nodes[x1][y1].id).classList.add('node')
        document.getElementById(this.nodes[x2][y1].id).classList.add('node')
        document.getElementById(this.nodes[x1][y1].id).classList.add('intersection')
        document.getElementById(this.nodes[x2][y1].id).classList.add('intersection')
    }
    
    // determine the height of the connection line
    let height = 5;
    if (y1 !== y2) {
        height = ((y2 - y1) * 50)
        document.getElementById(this.nodes[x1][y1].id).classList.add('node')
        document.getElementById(this.nodes[x1][y2].id).classList.add('node')
        document.getElementById(this.nodes[x1][y1].id).classList.add('intersection')
        document.getElementById(this.nodes[x1][y2].id).classList.add('intersection')
    }

    // update neighbours
    for (let i = x1; i <= x2; i++) {
        if (i > 0) {
            this.nodes[i][y1].neighbours.push(this.nodes[i-1][y1])
        }
        if (i < x2) {
            this.nodes[i][y1].neighbours.push(this.nodes[i+1][y1])
        }
    }
    for (let i = y1; i <= y2; i++) {
        if (i > 0) {
            this.nodes[x1][i].neighbours.push(this.nodes[x1][i-1])
        }
        if (i < y2) {
            this.nodes[x1][i].neighbours.push(this.nodes[x1][i+1])
        }
    }

    // create the element
    line.style.width = width + 'px'
    line.style.height = height + 'px'
    line.style.left = (50 * (x1 + 1) + 5) + 'px'
    line.style.top = (50 * (y1 + 1) + 5) + 'px'
    connectionsContainer.append(line)
}

/* function to add a block place to the map (i.e., a place that fits between streets) */
function createBlockPlace(blockPlace) {
    const blockPlacesContainer = document.getElementById(this.id + '.blockPlacesContainer')
    const block = document.createElement('div')
    block.id = blockPlace.getID(this.id)
    block.classList.add('block')
    block.classList.add(blockPlace.class)
    block.style.width = (blockPlace.width * 50 - 5) + 'px'
    block.style.height = (blockPlace.height * 50 - 5) + 'px'
    block.style.left = (blockPlace.x * 50 + 60) + 'px'
    block.style.top = (blockPlace.y * 50 + 60) + 'px'
    blockPlacesContainer.append(block)

    // add a label
    const label = document.createElement('label')
    label.appendChild(document.createTextNode(blockPlace.name))
    label.className = 'placeLabel'
    block.append(label)

    // look for free place to put the label
    let tmp_x = blockPlace.x
    let tmp_y = blockPlace.y
    while (this.labelSpots.includes(tmp_x + '.' + tmp_y) && tmp_y <= blockPlace.height) {
        if (tmp_x - blockPlace.x >= blockPlace.width) {
            tmp_y++
            tmp_x = blockPlace.x
        } else {
            tmp_x++
        }
    }
    this.labelSpots.push(tmp_x + '.' + tmp_y)
    label.style.left = 50 * (tmp_x - blockPlace.x) + 'px'
    label.style.top = 50 * (tmp_y - blockPlace.y)+ 'px'

    // when the place is clicked, display its information
    block.addEventListener('click', () => {
        try {
            if (state === 'view') {
                const infoLabel = document.getElementById(this.id + '.selectedLabel')
                const descriptionLabel = document.getElementById(this.id + '.descLabel')
                infoLabel.textContent = blockPlace.name
                descriptionLabel.textContent = blockPlace.description
                current = blockPlace
            } else if (state === 'selectSrc') {
                const srcLabel = document.getElementById(this.id + '.srcLabel')
                source = blockPlace
                srcLabel.textContent = 'Source: ' + blockPlace.name
            } else if (state === 'selectDest') {
                const destLabel = document.getElementById(this.id + '.destLabel')
                destination = blockPlace
                destLabel.textContent = 'Destination: ' + blockPlace.name
            }
        } catch (error) {
            if (DEBUG) console.log('skipping updating info box -- info box not initialized.')
        }
    })

    // when the place is hover over-ed, make the text bold
    const element = document.getElementById(blockPlace.getID(this.id))
    block.addEventListener('mouseover', function(e) {
        element.classList.add('hoverOver')
    })
    block.addEventListener('mouseleave', function(e) {
        element.classList.remove('hoverOver')
    })
}

/* function to add a line place to the map (i.e., a place that fits on a connection) */
function createLinePlace(linePlace) {
    const linePlacesContainer = document.getElementById(this.id + '.linePlacesContainer')
    const line = document.createElement('div')
    line.id = linePlace.getID(this.id)
    line.classList.add('line')
    line.classList.add(linePlace.class)

    // determine the width of the line
    let width = 5;
    if (linePlace.x1 !== linePlace.x2) {
        width = ((linePlace.x2 - linePlace.x1) * 50)
    }
    
    // determine the height of the line
    let height = 5;
    if (linePlace.y1 !== linePlace.y2) {
        height = ((linePlace.y2 - linePlace.y1) * 50)
    }

    // create the element
    line.style.width = width + 'px'
    line.style.height = height + 'px'
    line.style.left = (50 * (linePlace.x1 + 1) + 5) + 'px'
    line.style.top = (50 * (linePlace.y1 + 1) + 5) + 'px'
    linePlacesContainer.append(line)

    // add a label
    const label = document.createElement('label')
    label.appendChild(document.createTextNode(linePlace.name))
    label.className = ('placeLabel')
    line.append(label)

    // look for free place to put the label
    const coordinates = searchPreliminaryLocations.bind(this)(linePlace.x1, linePlace.x2)
    let tmp_x = linePlace.x1
    let tmp_y = linePlace.x2
    if (coordinates === null) {
        while (this.labelSpots.includes(tmp_x + '.' + tmp_y) && tmp_y <= (linePlace.y2 - linePlace.y1)) {
            if (tmp_x - linePlace.x1 >= linePlace.x2 - linePlace.x1) {
                tmp_y++
                tmp_x = linePlace.x1
            } else {
                tmp_x++
            }
        }
    } else {
        tmp_x = coordinates[0]
        tmp_y = coordinates[1]
    }

    this.labelSpots.push(tmp_x + '.' + tmp_y)
    label.style.left = (tmp_x - linePlace.x1) + 'px'
    label.style.top = (tmp_y - linePlace.y1) + 'px'
    
    // when the place is clicked, display its information
    line.addEventListener('click', () => {
        try {
            if (state === 'view') {
                const infoLabel = document.getElementById(this.id + '.selectedLabel')
                const descriptionLabel = document.getElementById(this.id + '.descLabel')
                infoLabel.textContent = linePlace.name
                descriptionLabel.textContent = linePlace.description
                current = linePlace
            }
        } catch (error) {
            if (DEBUG) console.log('skipping updating info box -- info box not initialized.')
        }
    })

    // when the place is hover over-ed, make the text bold
    const element = document.getElementById(linePlace.getID(this.id))
    line.addEventListener('mouseover', function(e) {
        element.classList.add('hoverOver')
    })
    line.addEventListener('mouseleave', function(e) {
        element.classList.remove('hoverOver')
    })
}

/* function to add a node place to the map (i.e., a place that falls on a node) */
function createNodePlace(nodePlace) {
    const nodePlacesContainer = document.getElementById(this.id + '.nodePlacesContainer')
    const node = document.createElement('div')
    node.id = nodePlace.getID(this.id)
    node.className = nodePlace.class

    // determine placement
    node.style.left = nodePlace.x * 50 + 50 + 'px'
    node.style.top = nodePlace.y * 50 + 50 + 'px'
    node.classList.add('node')
    node.classList.add(nodePlace.class)
    nodePlacesContainer.append(node)
    
    // add a label
    const label = document.createElement('label')
    label.appendChild(document.createTextNode(nodePlace.name))
    label.className = 'placeLabel'
    node.append(label)

    // look for free place to put the label
    const coordinates = searchPreliminaryLocations.bind(this)(nodePlace.x, nodePlace.y)
    let tmp_x = coordinates[0]
    let tmp_y = coordinates[1]
    this.labelSpots.push(tmp_x + '.' + tmp_y)
    label.style.left = (tmp_x - nodePlace.x) * 50 + 'px'
    label.style.top = (tmp_y - nodePlace.y) * 50 + 'px'

    // when the place is clicked, display its information
    node.addEventListener('click', () => {
        try {
            if (state === 'view') {
                const infoLabel = document.getElementById(this.id + '.selectedLabel')
                const descriptionLabel = document.getElementById(this.id + '.descLabel')
                infoLabel.textContent = nodePlace.name
                descriptionLabel.textContent = nodePlace.description
                current = nodePlace
            } else if (state === 'selectSrc') {
                const srcLabel = document.getElementById(this.id + '.srcLabel')
                source = nodePlace
                srcLabel.textContent = 'Source: ' + nodePlace.name
            } else if (state === 'selectDest') {
                const destLabel = document.getElementById(this.id + '.destLabel')
                destination = nodePlace
                destLabel.textContent = 'Destination: ' + nodePlace.name
            }
        } catch (error) {
            if (DEBUG) console.log('skipping updating info box -- info box not initialized.')
        }
    })

    // when the place is hover over-ed, make the text bold
    const element = document.getElementById(nodePlace.getID(this.id))
    node.addEventListener('mouseover', function(e) {
        element.classList.add('hoverOver')
    })
    node.addEventListener('mouseleave', function(e) {
        element.classList.remove('hoverOver')
    })
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

/* function to add a legend to the map */
function addLegend(blocks, lines, nodes) {
    const controlCentre = document.getElementById(this.id + '.controlCentre')
    const legend = document.createElement('div')
    legend.className = 'controlBox'
    controlCentre.append(legend)

    // add a title
    const label = document.createElement('h3')
    label.append(document.createTextNode('Legend'))
    const instruction = document.createElement('p')
    instruction.className = 'controlLabel'
    instruction.append(document.createTextNode('this is a legend lol'))
    legend.append(label)
    legend.append(instruction)

    // add a list of items
    const list = document.createElement('table')
    legend.append(list)

    // helper function to create legend rows
    const createLegendRow = (element, type) => {
        const row = document.createElement('tr')
        const iconCell = document.createElement('td')
        const labelCell = document.createElement('td')
        row.append(iconCell)
        row.append(labelCell)

        // add a mini icon
        const icon = document.createElement('div')
        icon.classList.add(type + 'Icon')
        icon.classList.add(element)
        icon.id = this.id + '.' + type + '.' + element
        iconCell.append(icon)
        list.append(row)

        // add a label
        const label = document.createElement('label')
        label.append(document.createTextNode(element))
        label.htmlFor = icon.id
        label.className = 'controlLabel'
        labelCell.append(label)
    }

    // add all types of elements to the legend
    blocks.map((element) => {
        createLegendRow(element, 'block')
    })
    lines.map((element) => {
        createLegendRow(element, 'line')
    })
    nodes.map((element) => {
        createLegendRow(element, 'node')
    })

}

/* function to add a menu to filter places by type */
function addFilterBox(options, title, description, places, elementGetter) {
    const controlCentre = document.getElementById(this.id + '.controlCentre')
    const filterBox = document.createElement('div')
    filterBox.className = 'controlBox'
    controlCentre.append(filterBox)
    
    // add a title
    const label = document.createElement('h3')
    label.append(document.createTextNode(title))
    const instruction = document.createElement('p')
    instruction.className = 'controlLabel'
    instruction.append(document.createTextNode(description))
    filterBox.append(label)
    filterBox.append(instruction)

    // add a list of clickable items
    const list = document.createElement('ul')
    filterBox.append(list)
    
    options.map((element) => {
        const item = document.createElement('li')
        
        // add a check box
        const checkBox = document.createElement('input')
        checkBox.id = this.id + '.fb.' + element
        checkBox.type = 'checkbox'

        // add a label
        const label = document.createElement('label')
        label.append(document.createTextNode(element))
        label.htmlFor = checkBox.id
        label.className = 'controlLabel'
        item.append(checkBox)
        item.append(label)
        
        list.append(item)
        const elements = elementGetter.bind(this)(element, places)

        // when a place name is clicked, highlight it on the map
        checkBox.addEventListener('click', () => {
            elements.map((id) => {
                toggleHighlightBlockPlace(id)
            })
        })
    })
}

/* function to draw a path between two nodes on the map */
function drawPath(path) {
    // draw source
    const navigationContainer = document.getElementById(this.id + '.navigationContainer')
    const source = document.createElement('div')
    source.id = this.id + 'source'
    source.style.left = path[0].x * 50 + 50 + 'px'
    source.style.top = path[0].y * 50 + 50 + 'px'
    source.classList.add('node')
    source.classList.add('navigationEndPoint')
    source.style.zIndex = 5
    navigationContainer.append(source)

    // draw destination
    const dest = document.createElement('div')
    dest.id = this.id + 'dest'
    dest.style.left = path[path.length-1].x * 50 + 50 + 'px'
    dest.style.top = path[path.length-1].y * 50 + 50 + 'px'
    dest.classList.add('node')
    dest.classList.add('navigationEndPoint')
    dest.style.zIndex = 5
    navigationContainer.append(dest)
    
    for (let i = 1; i < path.length; i++) {

        const x1 = path[i - 1].x
        const y1 = path[i - 1].y
        const x2 = path[i].x
        const y2 = path[i].y

        const line = document.createElement('div')
        line.classList.add('line')
        line.classList.add('path')

        // determine the width of the connection line
        let width = 7;
        if (x1 !== x2) {
            width = (Math.abs(x2 - x1) * 50)
        }
        
        // determine the height of the connection line
        let height = 7;
        if (y1 !== y2) {
            height = (Math.abs(y2 - y1) * 50)
        }

        // create the element
        line.style.width = width + 'px'
        line.style.height = height + 'px'
        line.style.left = (50 * (Math.min(x1, x2) + 1) + 5) + 'px'
        line.style.top = (50 * (Math.min(y1, y2) + 1) + 5) + 'px'
        line.style.zIndex = 4
        navigationContainer.append(line)
    }
}
