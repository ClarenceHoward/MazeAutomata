

/*This is the background game animation*/

const backgroundGrid = document.getElementById("tiles");

let columns = 50,
    rows = 30,
    gameloopInterval = 100; // Delay after last click before resuming game loop (in milliseconds)
    const Graph = graphlib.Graph;
    const graph = new Graph();


// Updates the Boolean array tileStates if a tile is clicked.
// Pauses the next interval until 750ms after the last click.
const handleOnClick = index => {
  tileStates[index] = !tileStates[index]; // Toggle state
  updateTileState(index);
  debounceGameLoop();
}

// Debounce function to pause the game loop after a click and resume it after a delay



//Creates a single tile, adds it to the div, and sets its click event to
// toggle the boolean state at the tile index of the array tileStates.
const createTile = index => {
  const tile = document.createElement("div");
  tile.classList.add("tile");
  tile.onclick = () => handleOnClick(index);
  return tile;
}

/* Creates and append *quantity* amount of tiles to the div element tiles*/
const createTiles = quantity => {
  backgroundGrid.innerHTML = "";
  for (let index = 0; index < quantity; index++) {
    graph.setNode(index);
    backgroundGrid.appendChild(createTile(index));
  }
}

const createGrid = () => {

  //Size of the tiles 
  const size = document.body.clientWidth > 800 ? 50 : 25;
  
  // Size of the grid layout
  // columns = Math.floor(document.body.clientWidth / size);
  // rows = Math.floor(document.body.clientHeight / size);
  
  // Pass dimensions to style sheet to create grid layout
  backgroundGrid.style.setProperty("--columns", columns);
  backgroundGrid.style.setProperty("--rows", rows);
  
  // Populate the grid initialize each respective boolean in
  // tileStates to false. 
  createTiles(columns * rows);
   updateTiles();

}

// Counts the live neighbours of a single cell



function updateTiles() {

  for(i=0; i<tileStates.length; i++){
    const tile = document.querySelectorAll('.tile')[i];
  if (tileStates[i]) {
    tile.classList.add('clicked');
  } else {
    tile.classList.remove('clicked');
  }
  }
}






// Main loop. Updates model then view.
function gameLoop () {
  tileStates = getNextState();
  updateTiles();


}






document.addEventListener('DOMContentLoaded', () => {
  createGrid();
  intervalId = setInterval(gameLoop, gameloopInterval); // Updates per millisecond
});

window.onresize = () => createGrid();

function recursiveSearch(graph, node, stack){

}

function  depthFirstSearch(graph, start){


}

