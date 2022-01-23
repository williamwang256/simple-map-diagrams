# Simple Map Diagrams JavaScript Library

Link to deployed landing page: https://fierce-shelf-08886.herokuapp.com/

## Getting Started

- The first thing you will need to do is to load the `simple_map_diagrams.js` script into the HTML file of your webpage. It includes the code for the core functionality of the Simple Map Diagrams Library that is required before you can start using it.

- Next, the `simple_map_diagrams.css` file needs to be linked into the HTML file. It provides all the styling used by the Simple Map Diagrams library.

- And that's it! No other external modules or libraries are needed. Simple Map Diagramss uses Vanilla JavaScript only.

Now that you have the Simple Map Diagrams code loaded in, you can start adding maps to you webpage! In a separate script, you may instantiate and set up an instance of Simple Map Diagram as follows: 

`const smd = new SimpleMapDiagram(10, 5, 'sample title', 'sample description', 'example1')`

This call will go through a series of tasks to set up all the necessary objects and containers needed for the map, and add it to the document, under the container specified by the given id (in this case, the element with id 'example1'). Once this is done, you are ready to start customizing the map! See the list of API functions below for instructions on how to do so.

The documentation for the API calls and other features is located here: https://fierce-shelf-08886.herokuapp.com/api.html
