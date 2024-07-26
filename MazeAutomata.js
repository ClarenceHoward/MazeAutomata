

//==============================================================================
// CONFIGURATION AND EVENT LISTENERS
//==============================================================================


const backgroundGrid = document.getElementById("tiles");

// Configuration variables
let columns = 75,
    rows = 50,
    branchProb = 4,
    turnProb = 4,
    gameloopInterval = 30,
    intervalId;

const Graph = graphlib.Graph;
let graph = new Graph();
let seeds = new Set();
let disconnected = new Set();


//==============================================================================



document.getElementById('SpeedSlider').addEventListener('input', function() {
  clearInterval(intervalId);
  gameloopInterval = this.value;
  document.getElementById('speedValue').innerText = gameloopInterval;
  intervalId = setInterval(gameLoop, gameloopInterval);
});

document.getElementById('BranchSlider').addEventListener('input', function() {
  branchProb = this.value;
  document.getElementById('branchValue').innerText = "1/" + branchProb;
});

document.getElementById('TurnSlider').addEventListener('input', function() {
  turnProb = this.value;
  document.getElementById('turnValue').innerText = "1/" + turnProb;
});

document.getElementById('generate').addEventListener('click', function() {
  let randInt = getRandomInt(0, rows * columns);
  seeds.add(new Pair(randInt, 2));
  intervalId = setInterval(gameLoop, gameloopInterval); // Updates per millisecond
});

document.getElementById('solve').addEventListener('click', function() {
  depthFirstSearch(0);
});

document.getElementById('reset').addEventListener('click', function() {
  clearInterval(intervalId);
  graph = new Graph();
  seeds = new Set();
  disconnected = new Set();
  createGrid();
});

// Recreate the grid on window resize
window.onresize = () => createGrid();





//==============================================================================
// GRID INITIALIZATION AND MAIN LOOP
//==============================================================================



// Pair class to represent a seed with index and direction
class Pair {
  constructor(index, direction) {
      this.index = index;
      this.direction = direction;
      disconnected.delete(index);
  }

  getIndex() {
      return this.index;
  }

  setIndex(index) {
      this.index = index;
  }

  getDirection() {
      return this.direction;
  }

  setDirection(direction) {
      this.direction = direction;
  }
}

// Creates a single tile and adds it to the div
const createTile = index => {
  const tile = document.createElement("div");
  tile.classList.add("tile");
  disconnected.add(index);
  return tile;
}

// Creates and appends tiles to the background grid
const createTiles = quantity => {
  backgroundGrid.innerHTML = "";
  for (let index = 0; index < quantity; index++) {
      graph.setNode(index, { visited: false });
      backgroundGrid.appendChild(createTile(index));
  }
}

// Creates the grid layout
const createGrid = () => {
  backgroundGrid.style.setProperty("--columns", columns);
  backgroundGrid.style.setProperty("--rows", rows);
  createTiles(columns * rows);
  updateTiles();
}




// Main game loop
function gameLoop() {
  updateTiles();
  if (seeds.size == 0) {
      clearInterval(intervalId);
  }
}

// Initialize the grid when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  createGrid();
});





//==============================================================================
// MAZE GENERATION FUNCTIONS
//==============================================================================

// Randomly changes the direction of a seed
function randomTurn(seed) {
    let direction = seed.getDirection();
    let random = getRandomInt(0, turnProb);

    if (random == 0) {
        if (getRandomInt(0, 1) == 0) {
            seed.setDirection((direction + 1) % 4);
        } else {
            seed.setDirection((direction - 1) % 4);
        }
    }
}

// Randomly creates a new branch from a seed
function randomBranch(seed) {
    let direction = seed.getDirection();
    let random = getRandomInt(0, branchProb);

    if (random == 0) {
        if (getRandomInt(0, 1) == 0) {
            let newSeed = new Pair(seed.getIndex(), (direction + 1) % 4);
            newCell(newSeed);
            seeds.add(newSeed);
        } else {
            let newSeed = new Pair(seed.getIndex(), (direction - 1) % 4);
            newCell(newSeed);
            seeds.add(newSeed);
        }
    }
}

// Gets the next index based on current index and direction
function getNext(index, direction) {
    let next;

    switch (direction) {
        case 0:
            next = index - columns;
            break;
        case 1:
            next = index + 1;
            break;
        case 2:
            next = index + columns;
            break;
        case 3:
            next = index - 1;
            break;
    }

    return next;
}

// Checks if the next move wraps around the grid
function wrapAround(index, nextSeed) {
    let a = nextSeed % columns == 0;
    let b = (index % columns) == (columns - 1);
    let c = a && b;

    let d = index % columns == 0;
    let e = (nextSeed % columns) == (columns - 1);
    let f = d && e;

    return c || f;
}

// Creates a new cell in the maze
function newCell(seed) {
    let nextSeed = getNext(seed.getIndex(), seed.getDirection());

    if (nextSeed < rows * columns && !wrapAround(seed.getIndex(), nextSeed)) {
        if (graph.outEdges(nextSeed) == 0) {
            addEdges(seed.getIndex(), nextSeed, seed.getDirection());
            seed.setIndex(nextSeed);
            disconnected.delete(nextSeed);
            return true;
        }
    } else {
        return false;
    }
}

// Creates a new seed when all existing seeds are stuck
function failSafe() {
    if (seeds.size < 1) {
        let newSeedFound = false;

        while (!newSeedFound && disconnected.size > 0) {
            for (let j of disconnected) {
                let index = getRandomElement(disconnected);
                for (let i = 0; i < 4; i++) {
                    let nextSeed = getNext(index, i);
                    if (nextSeed >= 0 && nextSeed < rows * columns && !wrapAround(index, nextSeed)) {
                        if (graph.outEdges(nextSeed).length > 0) {
                            addEdges(index, nextSeed, i);
                            seeds.add(new Pair(index, i));
                            newSeedFound = true;
                            break;
                        }
                    }
                }
                if (newSeedFound) break;
            }
        }
    }
}

// Updates the tiles in the maze
function updateTiles() {
    for (let seed of seeds) {
        randomTurn(seed);
        randomBranch(seed);
        if (!newCell(seed)) {
            seed.setDirection((seed.getDirection() + 1) % 4);

            if (!newCell(seed)) {
                seed.setDirection((seed.getDirection() + 1) % 4);

                if (!newCell(seed)) {
                    seed.setDirection((seed.getDirection() + 1) % 4);

                    if (!newCell(seed)) {
                        seed.setDirection((seed.getDirection() + 1) % 4);

                        if (!newCell(seed)) {
                            seeds.delete(seed);

                            if (seeds.size < 1) {
                                let newSeedFound = false;
                                while (!newSeedFound && disconnected.size > 0) {
                                    for (let j of disconnected) {
                                        let index = getRandomElement(disconnected);
                                        for (let i = 0; i < 4; i++) {
                                            let nextSeed = getNext(index, i);
                                            if (nextSeed >= 0 && nextSeed < rows * columns && !wrapAround(index, nextSeed)) {
                                                if (graph.outEdges(nextSeed).length > 0) {
                                                    addEdges(index, nextSeed, i);
                                                    seeds.add(new Pair(index, i));
                                                    newSeedFound = true;
                                                    break;
                                                }
                                            }
                                            if (newSeedFound) {
                                                break;
                                            }
                                        }
                                        if (newSeedFound) {
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

// Sets the margin for a tile
function setMargin(elementId, side, value) {
    const tile = document.querySelectorAll('.tile')[elementId];
    if (tile) {
        tile.style[`margin-${side}`] = value;
    }
}

// Sets the type of a tile
function setType(elementID, type) {
    const tile = document.querySelectorAll('.tile')[i];
    tile.classList.add(type);
}

// Adds edges between nodes in the graph
function addEdges(node1, node2, direction) {
    graph.setEdge(node1, node2);
    graph.setEdge(node2, node1);

    switch (direction) {
        case 0:
            setMargin(node1, 'top', 0);
            setMargin(node2, "bottom", 0);
            break;
        case 2:
            setMargin(node2, 'top', 0);
            setMargin(node1, "bottom", 0);
            break;
        case 1:
            setMargin(node1, 'right', 0);
            setMargin(node2, "left", 0);
            break;
        case 3:
            setMargin(node1, 'left', 0);
            setMargin(node2, "right", 0);
            break;
    }
}



//==============================================================================
// MAZE SOLVING FUNCTIONS
//==============================================================================


// Recursive depth-first search for solving the maze
async function recursiveSearch(node) {
    if (Number(node) == ((rows * columns) - 1)) {
        let tile = document.querySelectorAll('.tile')[node];
        if (tile) {
            tile.classList.add('dfs');
        }
        return Number(node);
    } else {
        graph.setNode(node, { state: true });
        let tile = document.querySelectorAll('.tile')[node];
        if (tile) {
            tile.classList.add('dfs');
        }
        for (let element of graph.outEdges(node)) {
            if (!graph.node(element.w).state) {
                await sleep(gameloopInterval);
                let newNode = await recursiveSearch(element.w);
                if (newNode == (rows * columns) - 1) {
                    console.log("found");
                    if (tile) {
                        tile.classList.remove("marked");
                        tile.classList.add('dfs');
                    }
                    return newNode;
                }
            }
        }
        if (tile) {
            tile.classList.remove("dfs");
            tile.classList.add("marked");
        }
        return node;
    }
}

// Initiates the depth-first search to solve the maze
function depthFirstSearch(start) {
    recursiveSearch(0);
}


//==============================================================================
// Helper Functions / Misc
//==============================================================================

// Utility function to create a delay
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Utility function to get a random integer
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Gets a random element from a set
function getRandomElement(set) {
  const array = Array.from(set);
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}