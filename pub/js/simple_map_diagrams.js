/********** Simple Map Diagrams Library. **********/

(function(global, document) {

    /***
     * Create an instance of a Simple Map Diagram.
     * 
     * Input: the dimentions of the map, and the id of the container for it.
     */
    function SimpleMapDiagram(width, height, title, description, container) {
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

        // do some preliminary setup
        mapSetUp.bind(this)(title, description)
        initializeNodes.bind(this)(this.width, this.height)
    }

    // some global (private) variables
    let _id = 0                     // global id counter
    let _source = undefined         // global source - used for navigation
    let _destination = undefined    // global destination - used for navigation
    let _state = 'view'             // global state - used for navigation buttons
    
    // a global map between places class names, and actual display names
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
         * API function to do the default setup. Includes all availible menus.
         */
        defaultSetUp: function() {
            defaultInitialize.bind(this)()
        },

        /***
         * API function to add a connection between the given nodes.
         * 
         * Input: the x-y coordinates of the nodes.
         * Return: true on success, false on failure (e.g., values out of bound)
         */
        addConnection: function(x1, y1, x2, y2) {
            if (!(x1 === x2 || y1 === y2)) return false
            if (!validator(x1, y2) || !validator(x2, y2)) return false
            addConnection.bind(this)(x1, y1, x2, y2)
        },

        /***
         * API function to add multiple connections to the graph at once.
         * 
         * Input: a list of the connections to add, in the following form:
         * [[x1, y1, x2, y2], [...], [...], ... ]
         * Return: true on success, false on failure (e.g., values out of bound)
         */
        addMultipleConnections: function(connections) {
            connections.map((element) => {
                const x1 = element[0], y1 = element[1], x2 = element[2], y2 = element[3]
                if (!(x1 === x2 || y1 === y2)) return false
            if (!validator(x1, y2) || !validator(x2, y2)) return false
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
        addBlockPlace: function(x, y, width, height, type, name, description) {
            if (!validator(x, y) || !validator(width, height)) return false     // validate input
            if (x + width >= this.width) return false
            if (y + height >= this.height) return false
            try {
                if (_placeTypeMap.get(type)[1] !== 'block') return false        // unrecognized type
                const blockPlace = new BlockPlace(x, y, width, height, type, name, description)
                createBlockPlace.bind(this)(blockPlace)
                this.blockPlaces.push(blockPlace)
            } catch (error) {
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
        addLinePlace: function(x1, y1, x2, y2, type, name, description) {
            if (!validator(x1, y1) || !validator(x2, y2)) return false      // validate input
            try {
                if (_placeTypeMap.get(type)[1] !== 'line') return false     // unrecognized type
                const linePlace = new LinePlace(x1, y1, x2, y2, type, name, description)
                createLinePlace.bind(this)(linePlace)
                this.linePlaces.push(linePlace)
            } catch (error) {
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
        addNodePlace: function(x, y, type, name, description) {
            if (!validator(x, y)) return false
            try {
                if (_placeTypeMap.get(type)[1] !== 'node') return false
                const nodePlace = new NodePlace(x, y, type, name, description)
                createNodePlace.bind(this)(nodePlace)
                this.nodePlaces.push(nodePlace)
            } catch (error) {
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

    /********** Classes for place objects **********/

    /***
     * A class representing a block place.
     */
    class BlockPlace {

        /***
         * Constructor for the BlockPlace class.
         * Note: type must match one of the pre-defined types in the CSS file. This is 
         * assumed to have been already verifed prior to calling this constructor.
         * 
         * Input: the x-y coordinates, width, height (all non-negative integers), and the
         * name, type, and description of the place.
         */
        constructor(x, y, width, height, type, name, description) {
            this.x = x
            this.y = y
            this.width = width
            this.height = height
            this.name = name
            this.type = type
            this.description = description
        }

        /***
         * Gets the id of this place.
         * 
         * Input: the SMD id of the SMD this place belongs to.
         */
        getID(id) {
            return id + '.b.' + this.x + '.' + this.y
        }
    }

    /***
     * A class representing a line place.
     */
    class LinePlace {

        /***
         * Constructor for the LinePlace class.
         * Note: type must match one of the pre-defined types in the CSS file. This is 
         * assumed to have been already verifed prior to calling this constructor.
         * 
         * Input: the x-y coordinates (non-negative integers) of both endpoints, the name, type, and 
         * description of the line place.
         */
        constructor(x1, y1, x2, y2, type, name, description) {
            this.x1 = x1
            this.y1 = y1
            this.x2 = x2
            this.y2 = y2
            this.name = name
            this.type = type
            this.description = description
        }

        /***
         * Gets the id of this place.
         * 
         * Input: the SMD id of the SMD this place belongs to.
         */
        getID(id) {
            return id + '.l.' + this.x1 + '.' + this.y1 + '.' + this.x2 + '.' + this.y2
        }
    }

    /***
     * A class representing a node place.
     */
    class NodePlace {

        /***
         * Constructor for the NodePlace class.
         * Note: type must match one of the pre-defined types in the CSS file. This is 
         * assumed to have been already verifed prior to calling this constructor.
         * 
         * Input: the x-y coordinates (integers), name, type, and description of the 
         * node place.
         */
        constructor(x, y, type, name, description) {
            this.x = x
            this.y = y
            this.name = name
            this.type = type
            this.description = description
        }

        /***
         * Gets the id of this place.
         * 
         * Input: the SMD id of the SMD this place belongs to.
         */
        getID(id) {
            return id + '.n.' + this.x + '.' + this.y
        }
    }

    /***
     * A class representing a node on the graph. Used for layout purposes and Navigation
     * algorithm. Not all nodes will represent visible DOM elements upon intialization.
     */
    class Node {

        /***
         * Constructor for the Node class.
         * 
         * Input: the x-y coordinates (non-negative integers) of the node.
         */
        constructor(x, y) {
            this.x = x
            this.y = y
            this.parent = null
            this.visited = false
            this.neighbours = []
        }

        /***
         * Gets the id of this place.
         * 
         * Input: the SMD id of the SMD this place belongs to.
         */
        getID(id) {
            return id + '.sn.' + this.x + '.' + this.y
        }
    }

    /********** Helper functions **********/

    /***
     * Function to perform default set up tasks.
     */
    function defaultInitialize() {
        initializeInfoBox.bind(this)()
        initializeNavigationMenu.bind(this)()
        addLegend.bind(this)(
            getAllItemClasses(this.blockPlaces)
            .concat(getAllItemClasses(this.linePlaces)) 
            .concat(getAllItemClasses(this.nodePlaces)), this.id
        )

        // get all the places on the map
        const all_places = this.blockPlaces.concat(this.linePlaces).concat(this.nodePlaces)

        addFilterMenu.bind(this)(
            getAllItemClasses(all_places), 
            'Filter items by type:', 
            all_places, 
            getPlacesByType
            
        )
        addFilterMenu.bind(this)(
            getAllItemNames(all_places), 
            'Filter items by name:', 
            all_places, 
            getPlaceByName
        )
    }

    /***
     * Function to return a list of all places of a certain class. 
     * 
     * Input: the class of elements to get, and a list of elements to filter from.
     * Returns: a list of ids of elements.
     */
    function getPlacesByType(type, elements) {
        const list = []
        elements.map((element) => {
            if (element.type === type) {
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
            if (!list.includes(element.type)) {
                list.push(element.type)
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
     * Function to find a path between two locations. Uses the Breadth 
     * First Search graph algorithm.
     * 
     * Input: the x-y coordinates of the start and destination.
     * Returns: a list of the nodes along the path if a path was found, 
     * undefined otherwise.
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
            u.neighbours.map((neighbour) => {
                if (neighbour.visited === false) {
                    neighbour.visited = true
                    neighbour.parent = u
                    queue.push(neighbour)
                }
            })
        }
    }

    /***
     * Function to clear the tree structure formed by findShortestPath(), and remove the 
     * navigation path that was displayed on the map.
     */
    function clearNavigation() {
        // clear the tree structure
        this.nodes.map((column) => {
            column.map((node) => {
                node.visited = false
                node.parent = null
            })
        })

        // reset the labels and delete the path that was drawn
        const navigationContainer = document.getElementById(this.id + '.navigationContainer')
        const srcLabel = document.getElementById(this.id + '.srcLabel')
        const destLabel = document.getElementById(this.id + '.destLabel')

        navigationContainer.textContent = ''
        srcLabel.textContent = 
            'Click on the "Choose starting point" button below and then \
            click on a place on the map to mark as the start point.'
        destLabel.textContent = 
            'Click on the "Choose destination" button below and then \
            click on a place on the map to mark as the destination.'
    }

    /***
     * Function to validate coordinates.
     * 
     * Input: the x-y coordinates.
     * Return: true if valid, false otherwise.
     */
    function validator(x, y) {
        if (x < 0 || x >= this.width) return false
        if (y < 0 || y >= this.height) return false
        return true
    }

    /********** DOM manipulation functions **********/

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
        const subtitle = document.createElement('label')

        subtitle.className = 'controlLabel'
        titleContainer.className = 'titleContainer'
        titleContainer.id = this.id + '.titleContainer'

        titleContainer.append(titleElement, subtitle)
        titleElement.append(document.createTextNode(title))
        subtitle.append(document.createTextNode(description))
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

        // create a container for the nodes
        const nodes = document.createElement('div')
        nodes.id = this.id + '.nodes'

        // create a container for the connections
        const connections = document.createElement('div')
        connections.id = this.id + '.connectionsContainer'

        // create container for the places
        const blockPlaces = document.createElement('div')
        const linePlaces = document.createElement('div')
        const nodePlaces = document.createElement('div')
        blockPlaces.id = this.id + '.blockPlacesContainer'
        linePlaces.id = this.id + '.linePlacesContainer'
        nodePlaces.id = this.id + '.nodePlacesContainer'

        // add to the main map container
        map.append(nodes, connections, blockPlaces, linePlaces, nodePlaces)

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
        const descriptionLabel = document.createElement('label')
        infoLabel.id = this.id + '.selectedLabel'
        infoLabel.append(document.createTextNode('Click an item to start.'))   
        descriptionLabel.id = this.id + '.descLabel'
        descriptionLabel.className = 'controlLabel'

        // add to the document
        controlBox.append(infoLabel, descriptionLabel)
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
        const list = document.createElement('ul')
        const srcLabel = document.createElement('li')
        const destLabel = document.createElement('li')

        navLabel.append(document.createTextNode('Navigation Menu'))
        list.className = 'SMDlist'
        
        srcLabel.id = this.id + '.srcLabel'
        srcLabel.className = 'controlLabel'
        srcLabel.append(document.createTextNode(
            'Click on the "Choose starting point" button below and then \
            click on a place on the map to mark as the start point.'))
        
        destLabel.id = this.id + '.destLabel'
        destLabel.className = 'controlLabel'
        destLabel.append(document.createTextNode(
            'Click on the "Choose destination" button below and then \
            click on a place on the map to mark as the destination.'))
        
        list.append(srcLabel, destLabel)
        navigationBox.append(navLabel, list)

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

        // create some buttons on the map (clear all button, etc.)
        const clearButton = document.createElement('button')
        clearButton.classList.add('SMDbutton')
        clearButton.append(document.createTextNode('Clear all'))
        mapContainer.insertBefore(clearButton, mapContainer.firstChild)
        clearButton.classList.add('mapButton')
        clearButton.addEventListener('click', () => {
            clearAllHighlights.bind(this)()
            clearNavigation.bind(this)()
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
                const newNode = new Node(i, j)
                const node = document.createElement('div')
                const item = document.createElement('li')

                node.style.left = i * 50 + 50 + 'px'
                node.style.top = j * 50 + 50 + 'px'
                node.id = newNode.getID(this.id)
                node.classList.add('node', 'invisibleIntersection')
                item.append(node)
                column.append(item)
                this.nodes[i][j] = newNode

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
        // create an element and add it to the document
        const connectionsContainer = document.getElementById(this.id + '.connectionsContainer')
        const line = document.createElement('div')
        line.classList.add('line')
        line.classList.add('connection')

        // determine the width of the connection line and add intersections along the way
        let width = 5;
        if (x1 !== x2) {
            width = ((x2 - x1) * 50)
            document.getElementById(this.nodes[x1][y1].getID(this.id)).classList.add('node', 'intersection')
            document.getElementById(this.nodes[x2][y1].getID(this.id)).classList.add('node', 'intersection')
        }
        
        // determine the height of the connection line and add intersections along the way
        let height = 5;
        if (y1 !== y2) {
            height = ((y2 - y1) * 50)
            document.getElementById(this.nodes[x1][y1].getID(this.id)).classList.add('node', 'intersection')
            document.getElementById(this.nodes[x1][y2].getID(this.id)).classList.add('node', 'intersection')
        }

        // update the neighbours between the two nodes
        for (let i = x1; i <= x2; i++) {
            if (i > 0) this.nodes[i][y1].neighbours.push(this.nodes[i-1][y1])
            if (i < x2) this.nodes[i][y1].neighbours.push(this.nodes[i+1][y1])
        }
        for (let i = y1; i <= y2; i++) {
            if (i > 0) this.nodes[x1][i].neighbours.push(this.nodes[x1][i-1])
            if (i < y2) this.nodes[x1][i].neighbours.push(this.nodes[x1][i+1])
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
        block.classList.add('block', blockPlace.type)
        block.style.width = (blockPlace.width * 50 - 5) + 'px'
        block.style.height = (blockPlace.height * 50 - 5) + 'px'
        block.style.left = (blockPlace.x * 50 + 60) + 'px'
        block.style.top = (blockPlace.y * 50 + 60) + 'px'
        blockPlacesContainer.append(block)

        // add a label
        const label = document.createElement('label')
        label.className = 'placeLabel'
        label.append(document.createTextNode(blockPlace.name))
        block.append(label)

        // look for free place to put the label
        let tmp_x = blockPlace.x, tmp_y = blockPlace.y
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
                // control box not initialized -- not an issue, just continue execution
            }
        })

        // when the place is hovered over, make the text bold
        const element = document.getElementById(blockPlace.getID(this.id))
        block.addEventListener('mouseover', () => { element.classList.add('hoverOver') })
        block.addEventListener('mouseleave', () => { element.classList.remove('hoverOver') })
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
        line.classList.add('line', linePlace.type)

        // determine the width of the line
        let width = 5;
        if (linePlace.x1 !== linePlace.x2) width = ((linePlace.x2 - linePlace.x1) * 50)
        
        // determine the height of the line
        let height = 5;
        if (linePlace.y1 !== linePlace.y2) height = ((linePlace.y2 - linePlace.y1) * 50)

        // create the element
        line.style.width = width + 'px'
        line.style.height = height + 'px'
        line.style.left = (50 * (linePlace.x1 + 1) + 5) + 'px'
        line.style.top = (50 * (linePlace.y1 + 1) + 5) + 'px'
        linePlacesContainer.append(line)

        // add a label
        const label = document.createElement('label')
        label.append(document.createTextNode(linePlace.name))
        label.className = ('placeLabel')
        line.append(label)

        // look for free place to put the label
        const coordinates = searchPreliminaryLocations.bind(this)(linePlace.x1, linePlace.x2)
        let tmp_x = linePlace.x1, tmp_y = linePlace.x2
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
                // control box not initialized -- not an issue, just continue execution
            }
        })

        // when the place is hovered over, make the text bold
        const element = document.getElementById(linePlace.getID(this.id))
        line.addEventListener('mouseover', () => { element.classList.add('hoverOver') })
        line.addEventListener('mouseleave', () => { element.classList.remove('hoverOver') })
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
        node.className = nodePlace.type

        // determine placement
        node.style.left = nodePlace.x * 50 + 50 + 'px'
        node.style.top = nodePlace.y * 50 + 50 + 'px'
        node.classList.add('node', nodePlace.type)
        nodePlacesContainer.append(node)
        
        // add a label
        const label = document.createElement('label')
        label.appendChild(document.createTextNode(nodePlace.name))
        label.className = 'placeLabel'
        node.append(label)

        // look for free place to put the label
        const coordinates = searchPreliminaryLocations.bind(this)(nodePlace.x, nodePlace.y)
        let tmp_x = coordinates[0], tmp_y = coordinates[1]
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
                if (_VERBOSE) console.log('skipping updating info box -- info box not initialized.')
            }
        })

        // when the place is hovered over, make the text bold
        const element = document.getElementById(nodePlace.getID(this.id))
        node.addEventListener('mouseover', () => { element.classList.add('hoverOver') })
        node.addEventListener('mouseleave', () => { element.classList.remove('hoverOver') })
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
            row.append(iconCell, labelCell)

            const name = _placeTypeMap.get(element)[0]
            const type = _placeTypeMap.get(element)[1]

            // add a mini icon
            const icon = document.createElement('div')
            icon.classList.add(type + 'Icon', element)
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
        places.map((element) => { createLegendRow(element) })
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
        submitButton.classList.add('SMDbutton', 'submitButton')
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
        source.classList.add('node', 'navigationEndPoint')
        source.style.left = path[0].x * 50 + 50 + 'px'
        source.style.top = path[0].y * 50 + 50 + 'px'
        source.style.zIndex = 5

        // draw destination
        const dest = document.createElement('div')
        dest.id = this.id + 'dest'
        dest.classList.add('node', 'navigationEndPoint')
        dest.style.left = path[path.length-1].x * 50 + 50 + 'px'
        dest.style.top = path[path.length-1].y * 50 + 50 + 'px'
        dest.style.zIndex = 5

        navigationContainer.append(source, dest)
        
        for (let i = 1; i < path.length; i++) {
            // get the x-y coordinates of the two nodes to connect
            const x1 = path[i - 1].x, y1 = path[i - 1].y, x2 = path[i].x,  y2 = path[i].y

            // draw a path between them
            const line = document.createElement('div')
            line.classList.add('line', 'path')

            // determine the width of the connection line
            let width = 7;
            if (x1 !== x2) width = (Math.abs(x2 - x1) * 50 + 5)
            
            // determine the height of the connection line
            let height = 7;
            if (y1 !== y2) height = (Math.abs(y2 - y1) * 50 + 5)

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
