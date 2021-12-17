/* Simple Map Diagrams Library. */

(function(global, document) {

    /***
     * Create an instance of a Simple Map Diagram.
     * 
     * Input: the dimentions of the map, and the id of the container for it.
     */
    function SimpleMapDiagram(width, height, container) {
        this.nodes = []             // list to store the nodes

        // determine the container in which to put this SMD instance - either the
        // given container, or default to being a child of the body
        this.container = (container !== undefined) ? 
            document.getElementById(container) : document.body

        // lists to stores key features of the map
        this.blockPlaces = []       // list to store the block places
        this.linePlaces = []        // list to store the line places
        this.nodePlaces = []        // list to store the node places
        this.labelSpots = []        // list to store the spots occupied by labels

        // width and height of the map
        this.width = width
        this.height = height

        // unique identifier; incremented every time a SMD is created
        this.id = _id
        _id++
    }

    // some global (private) variables
    let _id = 0                     // global id counter
    let _source = undefined         // global source - used for navigation
    let _destination = undefined    // global destination - used for navigation
    let _state = 'view'             // global state - used for navigation buttons
    
    let _placeTypeMap = new Map()
    _placeTypeMap.set('park', ['Park', 'block'])
    _placeTypeMap.set('building', ['Building', 'block'])
    _placeTypeMap.set('water', ['Water', 'block'])
    _placeTypeMap.set('hospital', ['Hospital', 'block'])
    _placeTypeMap.set('street', ['Street', 'line'])
    _placeTypeMap.set('transitLine', ['Transit Line', 'line'])
    _placeTypeMap.set('poi', ['Point of Interest', 'node'])
    _placeTypeMap.set('specialEvent', ['Special Event', 'node'])
    _placeTypeMap.set('incident', ['Incident', 'node'])

    SimpleMapDiagram.prototype = {

        /***
         * API function to do the fundamental setup of the map.
         * 
         * Input: the title and description of the map.
         */
        setUp: function(title, description) {
            mapSetUp.bind(this)(title, description)
            initializeNodes.bind(this)(this.width, this.height)
        },

        /***
         * API function to do the default setup. Includes all availible menus.
         */
        defaultSetUp: function() {
            initializeInfoBox.bind(this)()
            initializeNavigationMenu.bind(this)()
            addLegend.bind(this)(
                getAllItemClasses(this.blockPlaces)
                .concat(getAllItemClasses(this.linePlaces)) 
                .concat(getAllItemClasses(this.nodePlaces)), this.id
            )
            const all_places = this.blockPlaces.concat(this.linePlaces).concat(this.nodePlaces)
            addFilterMenu.bind(this)(getAllItemClasses(all_places), 'Filter items by type:', all_places, getPlacesByType)
            addFilterMenu.bind(this)(getAllItemNames(all_places), 'Filter items by name:', all_places, getPlaceByName)
        },

        /***
         * API function to add a connection between the given nodes.
         * 
         * Input: the x-y coordinates of the nodes.
         * Return: true on success, false on failure (e.g., a diagonal line is given)
         */
        addConnection: function(x1, y1, x2, y2) {
            if (!(x1 === x2 || y1 === y2)) return false
            addConnection.bind(this)(x1, y1, x2, y2)
            return true
        },

        /***
         * API function to add multiple connections to the graph at once.
         * 
         * Input: a list of the connections to add, in the following form:
         * [[x1, y1, x2, y2], [...], [...], ... ]
         * Return: true on success, false on failure (e.g., a diagonal line is given)
         */
        addMultipleConnections: function(connections) {
            connections.map((element) => {
                addConnection.bind(this)(element[0], element[1], element[2], element[3])
            })
        },

        /***
         * API function to add a block place to the map. 
         * Note: type must match one of the pre-defined types in the CSS file.
         * 
         * Input: the x-y coordinates, width and height, name, title, and description of the place.
         * Return: true on success, false on failure (e.g., unrecognized type).
         */
        addBlockPlace: function(x, y, width, height, name, type, description) {
            try {
                if (_placeTypeMap.get(type)[1] !== 'block') return false
                const blockPlace = new BlockPlace(x, y, width, height, name, type, description)
                createBlockPlace.bind(this)(blockPlace)
                this.blockPlaces.push(blockPlace)
            } catch (error) {
                if (_DEBUG) console.log('unrecognized block place type')
                return false
            }
            return true
        },

        /***
         * API function to add a line place to the map. 
         * Note: type must match one of the pre-defined types in the CSS file.
         * 
         * Input: the x-y coordinates of the start and end, name, title, and description of the place.
         * Return: true on success, false on failure (e.g., unrecognized type).
         */
        addLinePlace: function(x1, y1, x2, y2, name, type, description) {
            try {
                if (_placeTypeMap.get(type)[1] !== 'line') return false
                const linePlace = new LinePlace(x1, y1, x2, y2, name, type, description)
                createLinePlace.bind(this)(linePlace)
                this.linePlaces.push(linePlace)
            } catch (error) {
                if (_DEBUG) console.log('unrecognized line place type')
                return false
            }
            return true
        },

        /***
         * API function to add a node place to the map. 
         * Note: type must match one of the pre-defined types in the CSS file.
         * 
         * Input: the x-y coordinates, name, title, and description of the place.
         * Return: true on success, false on failure (e.g., unrecognized type).
         */
        addNodePlace: function(x, y, name, type, description) {
            try {
                if (_placeTypeMap.get(type)[1] !== 'node') return false
                const nodePlace = new NodePlace(x, y, name, type, description)
                createNodePlace.bind(this)(nodePlace)
                this.nodePlaces.push(nodePlace)
            } catch (error) {
                if (_DEBUG) console.log('unrecognized node place type')
                return false
            }
            return true
        },

        /***
         * API function to add a box to the map to display information about places.
         */
        addInfoBox: function() {
            initializeInfoBox.bind(this)()
            
        },

        /***
         * API function to add a navigation menu to the map.
         */
        addNavigationMenu: function() {
            initializeNavigationMenu.bind(this)()
        },

        /***
         * API function to add a filter box which will give users the option to 
         * filter by certain place type.
         * 
         * Input: the options to be included. If none are given, default to including all.
         */
        addFilterByClassBox: function() {
            const all_places = this.blockPlaces.concat(this.linePlaces).concat(this.nodePlaces)
            addFilterMenu.bind(this)(getAllItemClasses(all_places), 'Filter items by type:', all_places, getPlacesByType)
        },

        /***
         * API function to add a filter box which will give users the option to 
         * filter by certain place type.
         */
        addFilterByNameBox: function() {
            const all_places = this.blockPlaces.concat(this.linePlaces).concat(this.nodePlaces)
            addFilterMenu.bind(this)(getAllItemNames(all_places), 'Filter items by name:', all_places, getPlaceByName)
        },

        /***
         * API function to add a legend to the map.
         */
        addLegend: function() {
            addLegend(getAllItemClasses(this.blockPlaces)
            .concat(getAllItemClasses(this.linePlaces))
            .concat(getAllItemClasses(this.nodePlaces), this.id))
        }
    }

    /*** Classes for place objects ***/

    /***
     * A class representing a block place.
     */
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

        /***
         * Gets the id of this place, given its SMD id
         */
        getID(id) {
            return id + '.b.' + this.x + '.' + this.y
        }
    }

    /***
     * A class representing a line place.
     */
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

        /***
         * Gets the id of this place, given its SMD id
         */
        getID(id) {
            return id + '.l.' + this.x1 + '.' + this.y1 + '.' + this.x2 + '.' + this.y2
        }
    }

    /***
     * A class representing a node place.
     */
    class NodePlace {
        constructor(x, y, name, type, description) {
            this.x = x
            this.y = y
            this.name = name
            this.class = type
            this.description = description
        }

        /***
         * Gets the id of this place, given its SMD id
         */
        getID(id) {
            return id + '.n.' + this.x + '.' + this.y
        }
    }

    /*** Helper functions ***/

    /***
     * Function to return a list of all places of a certain class. 
     * 
     * Input: the class of elements to get, and a list of elements to filter from.
     * Returns: a list of ids of elements.
     */
    function getPlacesByType(type, elements) {
        const list = []
        elements.map((element) => {
            if (element.class === type) {
                list.push(element.getID(this.id))
            }
        })
        return list
    }

    /***
     * Function to get a list of all elements with a given name.
     * 
     * Input: the name of the element to get, and a list of elements to filter from.
     * Returns: a list of ids of elements.
     */
    function getPlaceByName(name, elements) {
        const list = []
        elements.map((element) => {
            if (element.name === name) {
                list.push(element.getID(this.id))
            }
        })
        return list
    }

    /***
     * Function to get a list of all place classes present on the map.
     * 
     * Input: a list of elements to filter from.
     * Returns: a list of classes.
     */
    function getAllItemClasses(elements) {
        const list = []
        elements.map((element) => {
            if (!list.includes(element.class)) {
                list.push(element.class)
            }
        })
        return list
    }

    /***
     * Function to get a list of all names of places on the map.
     * 
     * Input: a list of elements to filter from.
     * Returns: a list of classes.
     */
    function getAllItemNames(elements) {
        const list = []
        elements.map((element) => {
            if (!list.includes(element.name)) {
                list.push(element.name)
            }
        })
        return list
    }

    /***
     * Function to search surrounding area (within one unit) of a place to put its label.
     * 
     * Input: the x-y coordinate of the place.
     * Returns: the x-y coordinate of a free space if found, null otherwise.
     */
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

    /***
     * Function to find a path between two locations. Uses the Breadth First Search graph algorithm.
     * 
     * Input: the x-y coordinates of the start and destination.
     * Returns: a list of the nodes along the path if a path was found, undefined otherwise.
     */
    function findShortestPath(x1, y1, x2, y2) {
        // initialization
        this.nodes[x1][y1].visited = true
        const queue = []
        queue.push(this.nodes[x1][y1])

        // perform the search
        while (queue.length !== 0) {
            u = queue.shift()
            if (u === this.nodes[x2][y2]) {
                // found the destination, prepare a list to return
                let curr = u
                const ret = []
                while (curr !== null) {
                    ret.push(curr)
                    curr = curr.parent
                }
                return ret
            }
            // look at surrounding neighbours
            for (let i = 0; i < u.neighbours.length; i++) {
                if (u.neighbours[i].visited === false) {
                    u.neighbours[i].visited = true
                    u.neighbours[i].parent = u
                    queue.push(u.neighbours[i])
                }
            }
        }
    }

    /***
     * Function to clear the tree structure formed by findShortestPath(), and remove the 
     * navigation path that was displayed on the map.
     */
    function clearNavigation() {
        // clear the tree structure
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                this.nodes[i][j].visited = false
                this.nodes[i][j].parent = null
            }
        }
        // reset the labels and delete the path that was drawn
        const navigationContainer = document.getElementById(this.id + '.navigationContainer')
        navigationContainer.textContent = ''
        const srcLabel = document.getElementById(this.id + '.srcLabel')
        const destLabel = document.getElementById(this.id + '.destLabel')
        srcLabel.textContent = 'Select a place to mark as starting point.'
        destLabel.textContent = 'Select a place to mark as destination.'
    }

    /*** DOM manipulation functions ***/

    /***
     * DOM manipulation function to do fundamental set up for map diagram. Initializes all applicable
     * containers, titles, etc. and adds them to the body of the document.
     * 
     * Input: the title and description of the map.
     */
    function mapSetUp(title, description) {
        const body = this.container

        // create a container for this Simple Map Diagram
        const container = document.createElement('div')
        container.id = this.id + '.SMDcontainer'
        container.className = 'SMDcontainer'
        body.append(container)

        // create a title and subtitle along with a container for them
        const titleContainer = document.createElement('div')
        const titleElement = document.createElement('h2')
        titleElement.append(document.createTextNode(title))
        const subtitle = document.createElement('label')
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

        // create the map itself
        const map = document.createElement('div')
        map.id = this.id + '.map'
        map.className = 'mapContainer'
        map.style.height = (this.height * 50 + 60) + 'px'
        map.style.width = (this.width * 50 + 60) + 'px'
        mapContainer.append(map)

        // create some buttons on the map (clear all button, etc.)
        const clearButton = document.createElement('button')
        clearButton.classList.add('SMDbutton')
        clearButton.append(document.createTextNode('Clear all'))
        mapContainer.append(clearButton)
        clearButton.classList.add('mapButton')
        clearButton.addEventListener('click', () => {
            clearAllHighlights.bind(this)()
            clearNavigation.bind(this)()
        })
        
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

    /***
     * DOM manipulation function to initialize the information box beneath the map.
     */
    function initializeInfoBox() {
        const mapContainer = document.getElementById(this.id + '.mapContainer')
        const controlBox = document.createElement('div')
        controlBox.className = 'underBox'

        // labels to display information
        const infoLabel = document.createElement('h4')
        infoLabel.id = this.id + '.selectedLabel'
        infoLabel.append(document.createTextNode('Click an item to start.'))
        const descriptionLabel = document.createElement('label')
        descriptionLabel.id = this.id + '.descLabel'
        descriptionLabel.className = 'controlLabel'
        controlBox.append(infoLabel)
        controlBox.append(descriptionLabel)

        // add to the document
        mapContainer.append(controlBox)
    }

    /***
     * DOM manipulation function to create a navigation menu.
     */
    function initializeNavigationMenu() {
        const mapContainer = document.getElementById(this.id + '.mapContainer')
        const navigationBox = document.createElement('div')
        navigationBox.className = 'underBox'

        // labels to display information
        const navLabel = document.createElement('h4')
        navLabel.append(document.createTextNode('Navigation'))
        const list = document.createElement('ul')
        list.className = 'SMDlist'
        const srcLabel = document.createElement('li')
        srcLabel.id = this.id + '.srcLabel'
        srcLabel.className = 'controlLabel'
        srcLabel.append(document.createTextNode('Select a place to mark as starting point.'))
        const destLabel = document.createElement('li')
        destLabel.id = this.id + '.destLabel'
        destLabel.className = 'controlLabel'
        destLabel.append(document.createTextNode('Select a place to mark as destination.'))
        list.append(srcLabel)
        list.append(destLabel)
        navigationBox.append(navLabel)
        navigationBox.append(list)

        // button to mark the source
        const srcButton = document.createElement('button')
        srcButton.classList.add('SMDbutton')
        navigationBox.append(srcButton)
        srcButton.append(document.createTextNode('Choose starting point'))
        srcButton.addEventListener('click', () => { _state = 'selectSrc' })

        // button to mark the destination
        const destButton = document.createElement('button')
        destButton.classList.add('SMDbutton')
        navigationBox.append(destButton)
        destButton.append(document.createTextNode('Choose destination'))
        destButton.addEventListener('click', () => { _state = 'selectDest' })

        // button to display navigation on screen
        const navigateButton = document.createElement('button')
        navigateButton.classList.add('SMDbutton')
        navigationBox.append(navigateButton)
        navigateButton.append(document.createTextNode('Navigate!'))
        navigateButton.classList.add('submitButton')
        navigateButton.addEventListener('click', () => {
            clearNavigation.bind(this)()
            if (_source === undefined || _destination === undefined) {
                alert('Missing source or destination.')
            } else {
                const path = findShortestPath.bind(this)(
                    _source.x, 
                    _source.y, 
                    _destination.x, 
                    _destination.y,
                )
                if (path === undefined) {
                    alert('Could not find a path.')
                    clearNavigation.bind(this)()
                } else {
                    drawPath.bind(this)(path)
                }
                _source = undefined
                _destination = undefined
                _state = 'view'
            }
        })

        // add to the document
        mapContainer.append(navigationBox)
    }

    /***
     * DOM manipulation function to initialize a grid of nodes.
     */
    function initializeNodes() {
        const nodesContainer = document.getElementById(this.id + '.nodes')

        // initialize a 2D grid of nodes, organized using unordered lists
        for (let i = 0; i < this.width; i++) {
            const column = document.createElement('ul')
            column.className = 'SMDlist'
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
                    if (_state === 'selectSrc') {
                        const srcLabel = document.getElementById(this.id + '.srcLabel')
                        _source = this.nodes[i][j]
                        srcLabel.textContent = 'Source: unnamed intersection'
                    } else if (_state === 'selectDest') {
                        const destLabel = document.getElementById(this.id + '.destLabel')
                        _destination = this.nodes[i][j]
                        destLabel.textContent = 'Destination: unnamed intersection'
                    }
                })
            }
            nodesContainer.append(column)
        }
    }

    /*** 
     * DOM manipulation function to add a connection between two nodes.
     * 
     * Input: the x-y coordinates of both nodes.
     */
    function addConnection(x1, y1, x2, y2) {
        const connectionsContainer = document.getElementById(this.id + '.connectionsContainer')
        const line = document.createElement('div')
        line.classList.add('line')
        line.classList.add('connection')

        // determine the width of the connection line and add intersections along the way
        let width = 5;
        if (x1 !== x2) {
            width = ((x2 - x1) * 50)
            document.getElementById(this.nodes[x1][y1].id).classList.add('node')
            document.getElementById(this.nodes[x2][y1].id).classList.add('node')
            document.getElementById(this.nodes[x1][y1].id).classList.add('intersection')
            document.getElementById(this.nodes[x2][y1].id).classList.add('intersection')
        }
        
        // determine the height of the connection line and add intersections along the way
        let height = 5;
        if (y1 !== y2) {
            height = ((y2 - y1) * 50)
            document.getElementById(this.nodes[x1][y1].id).classList.add('node')
            document.getElementById(this.nodes[x1][y2].id).classList.add('node')
            document.getElementById(this.nodes[x1][y1].id).classList.add('intersection')
            document.getElementById(this.nodes[x1][y2].id).classList.add('intersection')
        }

        // update the neighbours between the two nodes
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

        // create the element and add it to the document
        line.style.width = width + 'px'
        line.style.height = height + 'px'
        line.style.left = (50 * (x1 + 1) + 5) + 'px'
        line.style.top = (50 * (y1 + 1) + 5) + 'px'
        connectionsContainer.append(line)
    }

    /***
     * DOM manipulation function to add a block place to the map (i.e., a place that fits 
     * between streets).
     * 
     * Input: a blockPlace object, containing all required info about the block place.
     */
    function createBlockPlace(blockPlace) {
        const blockPlacesContainer = document.getElementById(this.id + '.blockPlacesContainer')
        
        // create the block place based on the given information and add to document
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
                if (_state === 'view') {
                    const infoLabel = document.getElementById(this.id + '.selectedLabel')
                    const descriptionLabel = document.getElementById(this.id + '.descLabel')
                    infoLabel.textContent = blockPlace.name
                    descriptionLabel.textContent = blockPlace.description
                    _current = blockPlace
                } else if (_state === 'selectSrc') {
                    const srcLabel = document.getElementById(this.id + '.srcLabel')
                    _source = blockPlace
                    srcLabel.textContent = 'Source: ' + blockPlace.name
                } else if (_state === 'selectDest') {
                    const destLabel = document.getElementById(this.id + '.destLabel')
                    _destination = blockPlace
                    destLabel.textContent = 'Destination: ' + blockPlace.name
                }
            } catch (error) {
                if (_DEBUG) console.log('skipping updating info box -- info box not initialized.')
            }
        })

        // when the place is hovered over, make the text bold
        const element = document.getElementById(blockPlace.getID(this.id))
        block.addEventListener('mouseover', function(e) {
            element.classList.add('hoverOver')
        })
        block.addEventListener('mouseleave', function(e) {
            element.classList.remove('hoverOver')
        })
    }

    /***
     * DOM manipulation function to add a line place to the map (i.e., a place that fits 
     * on a connection).
     * 
     * Input: a blockPlace object, containing all required info about the block place.
     */
    function createLinePlace(linePlace) {
        const linePlacesContainer = document.getElementById(this.id + '.linePlacesContainer')
        
        // create the line place based on the given information and add to document
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
                if (_state === 'view') {
                    const infoLabel = document.getElementById(this.id + '.selectedLabel')
                    const descriptionLabel = document.getElementById(this.id + '.descLabel')
                    infoLabel.textContent = linePlace.name
                    descriptionLabel.textContent = linePlace.description
                    _current = linePlace
                }
            } catch (error) {
                if (_DEBUG) console.log('skipping updating info box -- info box not initialized.')
            }
        })

        // when the place is hovered over, make the text bold
        const element = document.getElementById(linePlace.getID(this.id))
        line.addEventListener('mouseover', function(e) {
            element.classList.add('hoverOver')
        })
        line.addEventListener('mouseleave', function(e) {
            element.classList.remove('hoverOver')
        })
    }

    /***
     * DOM manipulation function to add a node place to the map (i.e., a place that fits 
     * on a node).
     * 
     * Input: a blockPlace object, containing all required info about the block place.
     */
    function createNodePlace(nodePlace) {
        const nodePlacesContainer = document.getElementById(this.id + '.nodePlacesContainer')
        
        // create the node place based on the given information and add to document
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
                if (_state === 'view') {
                    const infoLabel = document.getElementById(this.id + '.selectedLabel')
                    const descriptionLabel = document.getElementById(this.id + '.descLabel')
                    infoLabel.textContent = nodePlace.name
                    descriptionLabel.textContent = nodePlace.description
                    _current = nodePlace
                } else if (_state === 'selectSrc') {
                    const srcLabel = document.getElementById(this.id + '.srcLabel')
                    _source = nodePlace
                    srcLabel.textContent = 'Source: ' + nodePlace.name
                } else if (_state === 'selectDest') {
                    const destLabel = document.getElementById(this.id + '.destLabel')
                    _destination = nodePlace
                    destLabel.textContent = 'Destination: ' + nodePlace.name
                }
            } catch (error) {
                if (_DEBUG) console.log('skipping updating info box -- info box not initialized.')
            }
        })

        // when the place is hovered over, make the text bold
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

    /***
     * DOM manipulation function to add a legend to the map.
     * 
     * Input: lists of all places on the map.
     */
    function addLegend(places) {
        const controlCentre = document.getElementById(this.id + '.controlCentre')
        const legend = document.createElement('div')
        legend.className = 'sideBox'
        controlCentre.append(legend)

        // add a title
        const label = document.createElement('h3')
        label.append(document.createTextNode('Legend'))
        legend.append(label)

        // add a list of items
        const list = document.createElement('table')
        legend.append(list)

        // helper function to create legend rows
        const createLegendRow = (element) => {
            const row = document.createElement('tr')
            const iconCell = document.createElement('td')
            const labelCell = document.createElement('td')
            row.append(iconCell)
            row.append(labelCell)

            const name = _placeTypeMap.get(element)[0]
            const type = _placeTypeMap.get(element)[1]

            // add a mini icon
            const icon = document.createElement('div')
            icon.classList.add(type + 'Icon')
            icon.classList.add(element)
            icon.id = this.id + '.' + type + '.' + element
            iconCell.append(icon)
            list.append(row)

            // add a label
            const label = document.createElement('label')
            label.htmlFor = icon.id
            label.className = 'controlLabel'
            label.append(document.createTextNode(name))
            labelCell.append(label)
        }

        // add all types of elements to the legend
        places.map((element) => {
            createLegendRow(element)
        })
    }

    /***
     * DOM manipulation function to add a menu to filter all places by type.
     */
    function addFilterMenu(options, title, places, elementGetter) {
        const controlCentre = document.getElementById(this.id + '.controlCentre')
        const filterBox = document.createElement('div')
        filterBox.className = 'sideBox'
        controlCentre.append(filterBox)
        
        // add a title
        const label = document.createElement('h3')
        label.append(document.createTextNode(title))
        filterBox.append(label)

        // add a select box
        const list = document.createElement('select')
        list.className = 'SMDselect'
        filterBox.append(list)
        options.map((element) => {
            const item = document.createElement('option')
            item.value = element
            try {
                // try to convert a place type to an ordinary string
                item.append(document.createTextNode(_placeTypeMap.get(element)[0]))
            } catch (error) {
                // if this is a name, just add it directly
                item.append(document.createTextNode(element))
            }
            list.append(item)
        })
        const submitButton = document.createElement('button')
        submitButton.classList.add('SMDbutton')
        submitButton.classList.add('submitButton')
        submitButton.append(document.createTextNode('OK'))
        submitButton.addEventListener('click', () => {
            const elements = elementGetter.bind(this)(list.value, places)
            clearAllHighlights.bind(this)()
            elements.map((id) => {
                toggleHighlightBlockPlace(id)
            })
        })
        filterBox.append(submitButton)
        
    }

    /***
     * DOM manipulation function to draw a path between two nodes on the map.
     * 
     * Input: the path to draw.
     */
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
            // get the x-y coordinates of the two nodes to connect
            const x1 = path[i - 1].x
            const y1 = path[i - 1].y
            const x2 = path[i].x
            const y2 = path[i].y

            // draw a path between them
            const line = document.createElement('div')
            line.classList.add('line')
            line.classList.add('path')

            // determine the width of the connection line
            let width = 7;
            if (x1 !== x2) {
                width = (Math.abs(x2 - x1) * 50 + 5)
            }
            
            // determine the height of the connection line
            let height = 7;
            if (y1 !== y2) {
                height = (Math.abs(y2 - y1) * 50 + 5)
            }

            // create the element and add to the document
            line.style.width = width + 'px'
            line.style.height = height + 'px'
            line.style.left = (50 * (Math.min(x1, x2) + 1) + 5) + 'px'
            line.style.top = (50 * (Math.min(y1, y2) + 1) + 5) + 'px'
            line.style.zIndex = 4
            navigationContainer.append(line)
        }
    }

    /***
     * DOM manipulation function to clear all highlighted items.
     */
    function clearAllHighlights() {
        const all_places = this.blockPlaces.concat(this.linePlaces).concat(this.nodePlaces)
        all_places.map((place) => {
            const element = document.getElementById(place.getID(this.id))
            element.classList.remove('highlight')
        })
    }

    global.SimpleMapDiagram = global.SimpleMapDiagram || SimpleMapDiagram

})(window, window.document)
