/* Simple Map Diagrams Library.

URL: https://fierce-shelf-08886.herokuapp.com/examples.html
*/

id = 0      // global id counter
DEBUG = false

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
    setUp: function(width, height, title, description) {
        mapSetUp(width, height, title, description, this.id)
        initializeNodes(width, height, this.nodes, this.id)
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
    addBlockPlace: function(x, y, width, height, name, type, description) {
        const blockPlace = new BlockPlace(x, y, width, height, name, type, description)
        createBlockPlace(blockPlace, this.id, this.labelSpots)
        this.blockPlaces.push(blockPlace)
    },

    /* add a line place to the map. note: type must match one of the pre-defined types */
    addLinePlace: function(x1, y1, x2, y2, name, type, description) {
        const linePlace = new LinePlace(x1, y1, x2, y2, name, type, description)
        createLinePlace(linePlace, this.id, this.labelSpots)
        this.linePlaces.push(linePlace)
    },

    /* add a node place to the map. note: type must match one of the pre-defined types */
    addNodePlace: function(x, y, name, type, description) {
        const nodePlace = new NodePlace(x, y, name, type, description)
        createNodePlace(nodePlace, this.id, this.labelSpots)
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
        initializeControlBox(this.id)
    },

    /* add a filter box which will give users the option to filter by certain place type */
    addFilterByClassBox: function(title, description, options) {
        const all_places = this.blockPlaces.concat(this.linePlaces).concat(this.nodePlaces)
        // if no options are given, default to include all
        if (!options) {
            options = getAllItemClasses(all_places)
        }
        addFilterBox(options, title, description, all_places, getAllPlacesByClass, this.id)
    },

    /* add a filter box which will give users the option to filter by certain place type */
    addFilterByNameBox: function(title, description, options) {
        const all_places = this.blockPlaces.concat(this.linePlaces).concat(this.nodePlaces)
        // if no options are given, default to include all
        if (!options) {
            options = getAllItemNames(all_places)
        }
        addFilterBox(options, title, description, all_places, getPlaceByName, this.id)
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
function getAllPlacesByClass(type, elements, id) {
    const list = []
    elements.map((element) => {
        if (element.class === type) {
            list.push(element.getID(id))
        }
    })
    return list
}

/* get a certain place */
function getPlaceByName(name, elements, id) {
    const list = []
    elements.map((element) => {
        if (element.name === name) {
            list.push(element.getID(id))
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

/*** DOM manipulation functions ***/

/* function to set up the map */
function mapSetUp(width, height, title, description, id) {
    const body = $('body')

    // create a container for this Simple Map Diagram
    const container = document.createElement('div')
    container.id = id + '.SMDcontainer'
    container.className = 'SMDcontainer'
    body.append(container)

    // create a container for the control menus
    const controlCentre = document.createElement('div')
    controlCentre.id = id + '.controlCentre'
    controlCentre.className = 'controlContainer'
    container.append(controlCentre)

    // create a title and subtitle
    const titleContainer = document.createElement('div')
    const titleElement = document.createElement('h3')
    titleElement.append(document.createTextNode(title))
    const subtitle = document.createElement('p')
    subtitle.className = 'controlLabel'
    subtitle.append(document.createTextNode(description))
    titleContainer.id = id + '.titleContainer'
    titleContainer.className = 'titleContainer'
    titleContainer.append(titleElement)
    titleContainer.append(subtitle)
    container.append(titleContainer)

    // create a container for the map
    const mapContainer = document.createElement('div')
    mapContainer.id = id + '.mapContainer'
    mapContainer.className = 'mapContainer'
    mapContainer.style.height = (height * 50 + 60) + 'px'
    mapContainer.style.width = (width * 50 + 60) + 'px'
    container.append(mapContainer)
    
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
function initializeControlBox(id) {
    const controlCentre = document.getElementById(id + '.controlCentre')
    const controlBox = document.createElement('div')
    controlBox.className = 'controlBox'

    // labels to display information
    const infoLabel = document.createElement('h3')
    infoLabel.id = id + '.selectedLabel'
    infoLabel.append(document.createTextNode('Click an item to start.'))
    const descriptionLabel = document.createElement('p')
    descriptionLabel.id = id + '.descLabel'
    descriptionLabel.className = 'controlLabel'

    controlBox.append(infoLabel)
    controlBox.append(descriptionLabel)
    infoLabel.append(document.createTextNode(''))

    // add to the document
    controlCentre.append(controlBox)
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
            node.id = id + '.sn.' + i + '.' + j
            nodes[i][j] = {
                description: '',
                id: node.id
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
    line.classList.add('line')
    line.classList.add('connection')

    /* determine the width of the connection line */
    let width = 5;
    if (x1 !== x2) {
        width = ((x2 - x1) * 50)
        document.getElementById(nodes[x1][y1].id).classList.add('node')
        document.getElementById(nodes[x2][y1].id).classList.add('node')
        document.getElementById(nodes[x1][y1].id).classList.add('intersection')
        document.getElementById(nodes[x2][y1].id).classList.add('intersection')
    }
    
    /* determine the height of the connection line */
    let height = 5;
    if (y1 !== y2) {
        height = ((y2 - y1) * 50)
        document.getElementById(nodes[x1][y1].id).classList.add('node')
        document.getElementById(nodes[x1][y2].id).classList.add('node')
        document.getElementById(nodes[x1][y1].id).classList.add('intersection')
        document.getElementById(nodes[x1][y2].id).classList.add('intersection')
    }

    /* create the element */
    line.style.width = width + 'px'
    line.style.height = height + 'px'
    line.style.left = (50 * (x1 + 1) + 5) + 'px'
    line.style.top = (50 * (y1 + 1) + 5) + 'px'
    connectionsContainer.append(line)
}

/* function to add a block place to the map (i.e., a place that fits between streets) */
function createBlockPlace(blockPlace, id, labelSpots) {
    const blockPlacesContainer = document.getElementById(id + '.blockPlacesContainer')
    const block = document.createElement('div')
    block.id = blockPlace.getID(id)
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
    while (labelSpots.includes(tmp_x + '.' + tmp_y) && tmp_y <= blockPlace.height) {
        if (tmp_x - blockPlace.x >= blockPlace.width) {
            tmp_y++
            tmp_x = blockPlace.x
        } else {
            tmp_x++
        }
    }
    labelSpots.push(tmp_x + '.' + tmp_y)
    label.style.left = 50 * (tmp_x - blockPlace.x) + 'px'
    label.style.top = 50 * (tmp_y - blockPlace.y)+ 'px'

    // when the place is clicked, display its information
    block.addEventListener('click', function(e) {
        try {
            const infoLabel = document.getElementById(id + '.selectedLabel')
            const descriptionLabel = document.getElementById(id + '.descLabel')
            infoLabel.textContent = blockPlace.name
            descriptionLabel.textContent = blockPlace.description
        } catch (error) {
            if (DEBUG) console.log('skipping updating info box -- info box not initialized.')
        }
    })

    // when the place is hover over-ed, make the text bold
    const element = document.getElementById(blockPlace.getID(id))
    block.addEventListener('mouseover', function(e) {
        element.classList.add('hoverOver')
    })
    block.addEventListener('mouseleave', function(e) {
        element.classList.remove('hoverOver')
    })
}

/* function to add a line place to the map (i.e., a place that fits on a connection) */
function createLinePlace(linePlace, id, labelSpots) {
    const linePlacesContainer = document.getElementById(id + '.linePlacesContainer')
    const line = document.createElement('div')
    line.id = linePlace.getID(id)
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
    let tmp_x = linePlace.x1
    let tmp_y = linePlace.y1
        if (!labelSpots.includes(tmp_x + '.' + tmp_y)) {
        // nothing to do here
    } else if (!labelSpots.includes((tmp_x - 1) + '.' - tmp_y)) {
        tmp_x--
    } else if (!labelSpots.includes(tmp_x + '.' + (tmp_y + 1))) {
        tmp_y--
    } else if (!labelSpots.includes((tmp_x - 1) + '.' + (tmp_y - 1))) {
        tmp_x--
        tmp_y--
    } else {
        while (labelSpots.includes(tmp_x + '.' + tmp_y) && tmp_y <= (linePlace.y2 - linePlace.y1)) {
            if (tmp_x - linePlace.x1 >= linePlace.x2 - linePlace.x1) {
                tmp_y++
                tmp_x = linePlace.x1
            } else {
                tmp_x++
            }
        }
    }
    labelSpots.push(tmp_x + '.' + tmp_y)
    label.style.left = tmp_x * 50 + 'px'
    label.style.top = tmp_y * 50 + 'px'
    
    // when the place is clicked, display its information
    line.addEventListener('click', function(e) {
        try {
            const infoLabel = document.getElementById(id + '.selectedLabel')
            const descriptionLabel = document.getElementById(id + '.descLabel')
            infoLabel.textContent = linePlace.name
            descriptionLabel.textContent = linePlace.description
        } catch (error) {
            if (DEBUG) console.log('skipping updating info box -- info box not initialized.')
        }
    })

    // when the place is hover over-ed, make the text bold
    const element = document.getElementById(linePlace.getID(id))
    line.addEventListener('mouseover', function(e) {
        element.classList.add('hoverOver')
    })
    line.addEventListener('mouseleave', function(e) {
        element.classList.remove('hoverOver')
    })
}

/* function to add a node place to the map (i.e., a place that falls on a node) */
function createNodePlace(nodePlace, id, labelSpots) {
    const nodePlacesContainer = document.getElementById(id + '.nodePlacesContainer')
    const node = document.createElement('div')
    node.id = nodePlace.getID(id)
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
    let tmp_x = nodePlace.x
    let tmp_y = nodePlace.y
    if (!labelSpots.includes(tmp_x + '.' + tmp_y)) {
        // nothing to do here
    } else if (!labelSpots.includes((tmp_x - 1) + '.' - tmp_y)) {
        tmp_x--
    } else if (!labelSpots.includes(tmp_x + '.' + (tmp_y + 1))) {
        tmp_y--
    } else if (!labelSpots.includes((tmp_x - 1) + '.' + (tmp_y - 1))) {
        tmp_x--
        tmp_y--
    }
    labelSpots.push(tmp_x + '.' + tmp_y)
    label.style.left = tmp_x * 50 + 'px'
    label.style.top = tmp_y * 50 + 'px'

    // when the place is clicked, display its information
    node.addEventListener('click', function(e) {
        try {
            const infoLabel = document.getElementById(id + '.selectedLabel')
            const descriptionLabel = document.getElementById(id + '.descLabel')
            infoLabel.textContent = nodePlace.name
            descriptionLabel.textContent = nodePlace.description
        } catch (error) {
            if (DEBUG) console.log('skipping updating info box -- info box not initialized.')
        }
    })

    // when the place is hover over-ed, make the text bold
    const element = document.getElementById(nodePlace.getID(id))
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
function addLegend(blocks, lines, nodes, id) {
    const controlCentre = document.getElementById(id + '.controlCentre')
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

    // block places
    blocks.map((element) => {
        const row = document.createElement('tr')
        const iconCell = document.createElement('td')
        const labelCell = document.createElement('td')
        row.append(iconCell)
        row.append(labelCell)

        // add a mini icon
        const icon = document.createElement('div')
        icon.classList.add('blockIcon')
        icon.classList.add(element)
        icon.id = id + '.icb.' + element
        iconCell.append(icon)
        list.append(row)

        // add a label
        const label = document.createElement('label')
        label.append(document.createTextNode(element))
        label.htmlFor = icon.id
        label.className = 'controlLabel'
        labelCell.append(label)
    })

    // line places
    lines.map((element) => {
        const row = document.createElement('tr')
        const iconCell = document.createElement('td')
        const labelCell = document.createElement('td')
        row.append(iconCell)
        row.append(labelCell)

        // add a mini icon
        const icon = document.createElement('div')
        icon.classList.add('lineIcon')
        icon.classList.add(element)
        icon.id = id + '.icl.' + element
        iconCell.append(icon)
        list.append(row)

        // add a label
        const label = document.createElement('label')
        label.append(document.createTextNode(element))
        label.htmlFor = icon.id
        label.className = 'controlLabel'
        labelCell.append(label)
    })

    // node places
    nodes.map((element) => {
        const row = document.createElement('tr')
        const iconCell = document.createElement('td')
        const labelCell = document.createElement('td')
        row.append(iconCell)
        row.append(labelCell)
        
        // add a mini icon
        const icon = document.createElement('div')
        icon.classList.add('nodeIcon')
        icon.classList.add(element)
        icon.id = id + '.icn.' + element
        iconCell.append(icon)
        list.append(row)

        // add a label
        const label = document.createElement('label')
        label.append(document.createTextNode(element))
        label.htmlFor = icon.id
        label.className = 'controlLabel'
        labelCell.append(label)
    })

}

/* function to add a menu to filter places by type */
function addFilterBox(options, title, description, places, elementGetter, id) {
    const controlCentre = document.getElementById(id + '.controlCentre')
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
        checkBox.id = id + '.fb.' + element
        checkBox.type = 'checkbox'

        // add a label
        const label = document.createElement('label')
        label.append(document.createTextNode(element))
        label.htmlFor = checkBox.id
        label.className = 'controlLabel'
        item.append(checkBox)
        item.append(label)
        
        list.append(item)
        const elements = elementGetter(element, places, id)

        // when a place name is clicked, highlight it on the map
        checkBox.addEventListener('click', function(e) {
            elements.map((id) => {
                toggleHighlightBlockPlace(id)
            })
        })
    })
}
