//inserts the body element into the DOM.
let body = document.querySelector('body');
let settingsButton = document.getElementById('settingsButton');
let overlay = document.getElementById('overlay');
let overlayExitIcon = document.getElementById('overlayExitIcon');
let generateGameButton = document.getElementById('generateGameButton');
let startGameButton = document.getElementById('startGameButton');
let stopGameButton = document.getElementById('stopGameButton');
let stepBackButton = document.getElementById('stepBackButton');
let stepForwardButton = document.getElementById('stepForwardButton');
var setIntervalId = null;
let cellColorOnAlive =  "rgb(83, 109, 89)";
var tickTime = 500;

settingsButton.addEventListener('click', function() {
  document.getElementById("overlay").classList.remove("hidden"); 
});

overlayExitIcon.addEventListener('click', function() {
//sets the overlay to hidden to exit out of the game settings menu
      document.getElementById("overlay").classList.add('hidden');

      document.getElementById("gridDimensionsFieldX").value = numberOfCellsX;
      document.getElementById("gridDimensionsFieldY").value = numberOfCellsY;
      document.getElementById("ticValueField").value = tickTime;
});

generateGameButton.addEventListener('click', function() {
  if(Number(document.getElementById("gridDimensionsFieldX").value) !== 0) {
  numberOfCellsX = Number(document.getElementById("gridDimensionsFieldX").value);    
  }
  if(Number(document.getElementById("gridDimensionsFieldY").value) !== 0) {
  numberOfCellsY = Number(document.getElementById("gridDimensionsFieldY").value);  
}
  if(Number(document.getElementById("gridDimensionsFieldY").value) !== 0) {
  tickTime = Number(document.getElementById("ticValueField").value);  
}
document.getElementById("overlay").classList.add('hidden');    
clearInterval(setIntervalId);
resetGame(); 
});


startGameButton.addEventListener('click', function() {
 if(!gameState.running) {
    gameState.running = true;
    // gameState.drawMatrix(gameState.getNextState())
    (function() {
      
      setIntervalId = setInterval(function() {
        gameState.drawMatrix(gameState.getNextState());
      }, tickTime);
    }());
    startGameButton.innerHTML = "Stop"
    startGameButton.style.backgroundColor = "red";
    stepForwardButton.style.visibility = "hidden";
 }
 else if(gameState.running) {
    gameState.running = false;
    if(setIntervalId) {
     clearInterval(setIntervalId);    
    }
    startGameButton.innerHTML = "Start"
    startGameButton.style.backgroundColor = "rgb(66, 244, 110)";
    stepForwardButton.style.visibility = "visible";
 }
});

resetButton.addEventListener('click', function() {
  //not sure why clearing the interval is not working inside of the clearInterval function.
  if(setIntervalId) {
     console.log("setIntervalId = " + setIntervalId);
     clearInterval(setIntervalId);    
  }
  resetGame();
});


stepForwardButton.addEventListener('click', function() {
  gameState.drawMatrix(gameState.getNextState());
});




let GameState = function(numberOfCellsX, numberOfCellsY) {
   this.running = false;
   this.rows = [];
  
   this.patternVectors = [];
   this.patternVectors.push([-1, -1]);
   this.patternVectors.push([0, -1]);
   this.patternVectors.push([1, -1]);
   this.patternVectors.push([-1, 0]);
   // patternVectors.push([0, 0]);
   this.patternVectors.push([1, 0]);
   this.patternVectors.push([-1, 1]);
   this.patternVectors.push([0, 1]);
   this.patternVectors.push([1, 1]);
  
}

GameState.prototype.getNextState = function() {
    let stateMatrix = this.rows;
    let numberOfRows = stateMatrix.length;
    let numberOfColumns = stateMatrix[0].length;
    let nextMatrixState = [];
    let numberOfNeighbors = 0;
    let cell = "";

    //need to take into account the current state of the cell...
    let findCellState = function(cell, numberOfNeighbors) {
      let numberOfNeighborsToLive = 2;
      let numberOfNeighborsToDie = 4;
      if(cell.newDiv.style.backgroundColor === cellColorOnAlive) {
        if(numberOfNeighbors >= numberOfNeighborsToLive && numberOfNeighbors<numberOfNeighborsToDie ) {
          return true
        }
        else if(numberOfNeighbors < numberOfNeighborsToLive || numberOfNeighbors > numberOfNeighborsToDie) {
          return false;
        }      
      }
      else if(cell.newDiv.style.backgroundColor !== cellColorOnAlive) {
        if(numberOfNeighbors === 3) {
          return true;
        }
        else if(numberOfNeighbors !== 3) {
          return false;
        }
      }

    }

    for(let i = 0; i < numberOfRows; i++) {
      var rowElement = [];
      for(let j = 0; j < numberOfColumns; j++) {
        cell = stateMatrix[i][j];
        numberOfNeighbors = 0;
        console.log("At cell = (" + j + "," + i + ")");
        this.patternVectors.forEach(function(element) {
          console.log("checking x = " + String(j + element[0]) + ", and y = " + String(i + element[1]));
          if(stateMatrix[i+element[1]] && stateMatrix[i+element[1]][j+element[0]] && stateMatrix[i+element[1]][j+element[0]].newDiv.style.backgroundColor === cellColorOnAlive) {
            console.log("found one");
            numberOfNeighbors++;
          }
        });
        if(findCellState(cell, numberOfNeighbors)) {
          console.log("this cell is going to now be alive!");
          cell.newDiv.cellState = "alive";
          rowElement.push(cellColorOnAlive);
        }
        else if(!findCellState(cell, numberOfNeighbors)) {
          console.log("nope: this cell ain't gonna live");
          cell.newDiv.cellState = "dead";
          rowElement.push("transparent");
        }
      }
      nextMatrixState.push(rowElement);
    }
  return nextMatrixState;
}

GameState.prototype.drawMatrix = function(matrix) {
  let numberOfRows = matrix.length;
  let numberOfColumns = matrix[0].length;
  console.log("matrix in matrix = ");
  console.log(matrix);
  
  for(let i = 0; i < numberOfRows; i++) {
    for(let j = 0; j < numberOfColumns; j++) {
      this.rows[i][j].newDiv.style.backgroundColor = matrix[i][j]
      if(matrix[i][j] === cellColorOnAlive) {
        this.rows[i][j].newDiv.cellState = "alive";
      }
    }
  }
}



//constructor function for the grid. Contains helper function for creating individual cells.
let GridContainer = function(numberOfCellsX, numberOfCellsY) {
  let numberOfCells = numberOfCellsX*numberOfCellsY;
  let xCordinateOfCell = 1;
  let yCordinateOfCell = 1;
  let rowElement = [];
  
  // dynamically creates styling details for the container grid.
  let dimensionsX = 100;
  let dimensionsY = 100;
  this.gridContainer = document.createElement("div");
  ticTacInterface.appendChild(this.gridContainer);
  this.gridContainer.style.width = String(dimensionsX) + "%";
  this.gridContainer.style.height = String(dimensionsY) + "%";
  this.gridContainer.style.display = "flex";
  if(numberOfCellsX>=numberOfCellsY) {
    this.gridContainer.style.flexDirection = "row";    
  }
  else if(numberOfCellsX<numberOfCellsY) {
    this.gridContainer.style.flexDirection = "column";    
  }

  this.gridContainer.style.alignContent = "center";
  this.gridContainer.style.alignItems = "center"
  this.gridContainer.style.flexWrap = "wrap"; 
  
  
  //funciton for setting the state of each of the cells.
  function clickCell() {
    if(gameState.running === false) {
      if(this.cellState === "dead") {
        console.log("this cell is now alive.");
        this.style.backgroundColor = cellColorOnAlive; 
        this.cellState = "alive";
      }
      else if(this.cellState === "alive") {
        console.log("this cell is now dead")
        this.style.backgroundColor = "transparent";
        this.cellState = "dead";
      }
    }
  }
  
  
  // makes sure that the cells are highlighted when hovered over if and only if the cell is dead. If this were not checked for the then red cells would convert back blue when hovered over
  function hoverEffect() {
    if(this.cellState === "dead" && !gameState.running) {
      this.style.backgroundColor = "rgba(205, 253, 253, 0.3)"      
    }
  }
  
  // makes sure that the cells are DEhighlighted when DEhoevered over if and only if the cell is dead. If this were not checked for then the red cells would convert to blue when the mouse DEhovers off of them.
  function hoverOffEffect() {
    if(this.cellState === "dead" && !gameState.running) {
      this.style.backgroundColor = "transparent";      
    }
  }
  
  // helper constructor function used to create a single cell. Cells can either be 'alive' or 'dead'.
  let Cell = function(width, height, color, name) {
    this.newDiv = document.createElement("div");
    this.newDiv.name = name;
    this.newDiv.cellState = "dead";
    this.newDiv.style.backgroundColor = "transparent";
    if(numberOfCellsY === numberOfCellsX) {
      this.newDiv.style.height= "calc(100%/" + numberOfCellsY + ")";
      this.newDiv.style.width = "calc(100%/" + numberOfCellsX + ")"; 
    }
    else if(numberOfCellsY > numberOfCellsX) {
      this.newDiv.style.height= "calc(100%/" + numberOfCellsY + ")";
      this.newDiv.style.width = "calc(100%/" + numberOfCellsY + ")";
      
    }
    else if(numberOfCellsY < numberOfCellsX) {
      this.newDiv.style.height= "calc(100%/" + numberOfCellsX + ")";
      this.newDiv.style.width = "calc(100%/" + numberOfCellsX + ")";      
    }
    this.newDiv.style.border = "1px black solid"
    this.newDiv.style.cursor = "pointer";
    this.newDiv.onclick = clickCell.bind(this.newDiv);
    this.newDiv.onmouseover = hoverEffect.bind(this.newDiv);
    this.newDiv.onmouseout  = hoverOffEffect.bind(this.newDiv);
  }

  // the interatinon logic which creates a grid of cell according to the variables passed in from outside of the GridContainer constructor function.
  for(let i = 0; i < numberOfCellsX; i++) {
    for(let j = 0; j < numberOfCellsY; j++) {
      let newSquareName = "("+ xCordinateOfCell+","+ yCordinateOfCell+")";
      console.log(newSquareName);
      let newSquare = new Cell(numberOfCellsX, numberOfCellsY, cellColorOnAlive, newSquareName); 
      this.gridContainer.appendChild(newSquare.newDiv);
      rowElement.push(newSquare);
      if(numberOfCellsX < numberOfCellsY) {
        if(yCordinateOfCell%numberOfCellsY === 0) {
            console.log("create row")
            gameState.rows.push(rowElement);
            rowElement = [];
            yCordinateOfCell = 0;
            xCordinateOfCell++;
          }
          yCordinateOfCell++;
}
      else {
          if(xCordinateOfCell%numberOfCellsX === 0) {
              console.log("create row");
              gameState.rows.push(rowElement);
              rowElement = [];
              xCordinateOfCell = 0;
              yCordinateOfCell++;
            }
            xCordinateOfCell++;       
      }
    }
  }
  
  // need to clear grid
  this.clearGrid = function() {
    ticTacInterface.removeChild(this.gridContainer);    
  }


} 

function resetGame(setIntervalId) {
    gameState.running = false;
    clearInterval(setIntervalId);
    startGameButton.innerHTML = "Start"
    startGameButton.style.backgroundColor = "rgb(66, 244, 110)";
    stepForwardButton.style.visibility = "visible";
    newGridContainer.clearGrid();
    gameState = new GameState(numberOfCellsX, numberOfCellsY);
    newGridContainer = new GridContainer(numberOfCellsX, numberOfCellsY);  
}

// initalizes the grid of cells based on the parameters numberofCellsX and numberOfCellsY
let numberOfCellsX = 10;
let numberOfCellsY = 10;
let gameState = new GameState();
let newGridContainer = new GridContainer(numberOfCellsX, numberOfCellsY);

