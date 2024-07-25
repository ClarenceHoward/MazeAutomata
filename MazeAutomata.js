

/*This is the background game animation*/

const backgroundGrid = document.getElementById("tiles");

let columns = 50,
    rows = 35,
    gameloopInterval = 25; // Delay after last click before resuming game loop (in milliseconds)
    const Graph = graphlib.Graph;
    const graph = new Graph();
    let seeds = new Set();
    let disconnected = new Set();
    


// Updates the Boolean array tileStates if a tile is clicked.
// Pauses the next interval until 750ms after the last click.
// const handleOnClick = index =>{
//   console.log("click");
//     seeds.add([index, getRandomInt(0,3)])
  
// }

class Pair {
  constructor(index, direction) {
      this.index = index;
      this.direction = direction;
      disconnected.delete(index);
  }
  
  getIndex(){
    return this.index;
  }

  setIndex(index){
    this.index = index;
  }

  getDirection(){
    return this.direction;
  }

  setDirection(direction){
    this.direction = direction
  }
}


//Creates a single tile, adds it to the div, and sets its click event to
// toggle the boolean state at the tile index of the array tileStates.
const createTile = index => {
  const tile = document.createElement("div");
  tile.classList.add("tile");
  tile.onclick = () => handleOnClick(index);
  disconnected.add(index);
  return tile;
}

/* Creates and append *quantity* amount of tiles to the div element tiles*/
const createTiles = quantity => {
  backgroundGrid.innerHTML = "";
  for (let index = 0; index < quantity; index++) {
    graph.setNode(index, {visited: false});
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

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomBranch(seed){
  let direction = seed.getDirection();
  let random = getRandomInt(0,4);

  if(random == 0){
    if(getRandomInt(0,3) == 0){
      if(getRandomInt(0,1) == 0){
        let newSeed = new Pair(seed.getIndex(),(direction+1) % 4 );
        newCell(newSeed);
        seeds.add(newSeed);
      }
      else{
        seed.setDirection( (direction+1) % 4);
      }
      
    }
    else{
      if(getRandomInt(0,3) == 0){
        let newSeed = new Pair(seed.getIndex(),(direction-1) % 4 );
        newCell(newSeed);
        seeds.add(newSeed);
      }
      else{
        seed.setDirection( (direction-1) % 4);
      }
      
    }
  }
  // return direction;
}


function getNext(index, direction){
  let next;  

  

  switch(direction){

    case 0:
      next = index-columns;
      break;

    case 1:
      next = index + 1;
      break;

    case 2:
      next = index+columns;
      break;

    case 3:
      next = index-1;
      break;
  }

  return next;
}

function wrapAround(index, nextSeed){
  
  let a = nextSeed % columns == 0 ;
  let b = (index % columns ) == (columns - 1);
  let c = a&&b;

  let d = index % columns == 0 ;
  let e = (nextSeed % columns ) == (columns - 1);
  let f = d&&e;

  return c || f;

}

function newCell(seed){

  let nextSeed = getNext(seed.getIndex(), seed.getDirection());
  
  if(nextSeed < rows*columns && !wrapAround(seed.getIndex(), nextSeed)){
    if(graph.outEdges(nextSeed) == 0){
      addEdges(seed.getIndex(), nextSeed, seed.getDirection());
      seed.setIndex(nextSeed);
      disconnected.delete(nextSeed);
      return true;
    }
  }
  else{
    return false;
  }
}



function updateTiles() {


  for(let seed of seeds){
    randomBranch(seed);
    
    
    

    if(!newCell(seed)){
      
      seed.setDirection( (seed.getDirection()+1) % 4);
      if(!newCell(seed)){
        seed.setDirection( (seed.getDirection()+1) % 4);
        if(!newCell(seed)){
          seed.setDirection( (seed.getDirection()+1) % 4);
          if(!newCell(seed)){
            seed.setDirection( (seed.getDirection()+1) % 4);
            if(!newCell(seed)){
              seeds.delete(seed);
              if(seeds.size < 4){
    
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
          }

            
      
        }
      }
  }
  
}

}

function setMargin(elementId, side, value) {
  const tile = document.querySelectorAll('.tile')[elementId];
  if(tile){
    tile.style[`margin-${side}`] = value;
  }
    
  
}

function setType(elementID, type){
  const tile = document.querySelectorAll('.tile')[i];
    tile.classList.add(type);
}

function addEdges(node1, node2, direction){
  graph.setEdge(node1, node2);
  graph.setEdge(node2,node1);

  switch(direction){

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

function getRandomElement(set) {
  // Convert the set to an array
  const array = Array.from(set);
  // Generate a random index based on the array length
  const randomIndex = Math.floor(Math.random() * array.length);
  // Return the element at the random index
  return array[randomIndex];
}


// Main loop. Updates model then view.
function gameLoop () {
  updateTiles();
    if(seeds.size == 0){
    console.log("done");
    depthFirstSearch(0);
    console.log("done1");
    clearInterval(intervalId);
    console.log("done2");
  }


}






document.addEventListener('DOMContentLoaded', () => {
  createGrid();
  let randInt = getRandomInt(0,rows*columns);
  
  seeds.add(new Pair(randInt,2));
  seeds.add(new Pair(randInt,4));
  intervalId = setInterval(gameLoop, gameloopInterval); // Updates per millisecond
});

window.onresize = () => createGrid();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function recursiveSearch(node){
  
  if(Number(node) == ((rows*columns)-1)){
    let tile = document.querySelectorAll('.tile')[node];
    if(tile){
      tile.classList.add('dfs');
    }
    return Number(node);
  }

  else{
    graph.setNode(node, { state: true});
    let tile = document.querySelectorAll('.tile')[node];
    if(tile){
      tile.classList.add('dfs');
    }
    for (let element of graph.outEdges(node))  {
      if(!graph.node(element.w).state ){
        await sleep(gameloopInterval);
         let newNode = await recursiveSearch(element.w);
        if(newNode == (rows*columns)-1){
          console.log("found");
          if(tile){
            tile.classList.remove("marked");
            tile.classList.add('dfs');
          }

          
          return newNode;
        }

      }
    }
    if(tile){
      tile.classList.remove("dfs");
      tile.classList.add("marked");
    }
      
    return node;
  }
  
  

}

function  depthFirstSearch(start){
  
   recursiveSearch(0);
  
}

