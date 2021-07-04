GRID_ROWS = 20;
GRID_COLUMNS = 20;

function setup() {
  // DISPLAY
  createCanvas(1440,900);
  background(220);
  frameRate(30);
  
  // BUTTONS
  button = createButton('BFS');
  button.position(20, 20);
  button.mousePressed(runBFS);
  
  button = createButton('DFS');
  button.position(65, 20);
  button.mousePressed(runDFS);
  
  button = createButton('Dijkstra');
  button.position(111, 20);
  button.mousePressed(runDijkstra);
  
  button = createButton('Guloso');
  button.position(174, 20);
  button.mousePressed(runDijkstra);
  
  button = createButton('A*');
  button.position(235, 20);
  button.mousePressed(runAStar);
  
  button = createButton('Reset');
  button.position(268, 20);
  button.mousePressed(reset);
  
  
  do {
    // ENTITIES
    grid = new Grid(GRID_ROWS, GRID_COLUMNS);
    grid.generate();
    
    player = new Player();
    player.spawn();
    food = new Food();
    food.spawn();
    
    // GRAPH UTILS
    graph = [];
    initializeGraph();
  }
  while (!validGraph());
  
  // SEARCH UTILS
  queue = [];
  queueIndex = 0;
  dist = [];
  dist2 = []; // to be used in A*
  visited = [];
  beforeOnPath = [];
  pathToFood = [];
  pathToFoodIndex = 0;
  
  // STATES
  entrypoint = true;
  visitingCells = false;
  highlightPath = false;
  
  // ALGORITHM CONTROLLER
  activeAlgorithm = null;
  
  foodCounter = 0;
  
  grid.draw();
  player.draw();
  food.draw();
}

function draw() {
  if (entrypoint) {
    // console.log("entrada");
    visitingCells = false;
    highlightPath = false;
    
  } else if (visitingCells) {
    // console.log("visitando");
    let currentCell = fetchNextToVisit();
    if (currentCell.x != player.position.x || currentCell.y != player.position.y) {
      grid.cells[currentCell.x][currentCell.y].cor = getVisitedCellColor(currentCell);
    }
    if (currentCell.x == food.position.x && currentCell.y == food.position.y) {
      visitingCells = false;
      pathToFood = buildPathToFood();
      highlightPath = true;
      pathToFoodIndex = 0;
    } else {
      let nextCells = fetchNextCells(currentCell, activeAlgorithm);
      for (let i = 0; i < nextCells.length; i++) {
        queue.push(nextCells[i]);
      }
    }
  } else if (highlightPath) {
    // console.log("pintando");
    if (pathToFoodIndex < pathToFood.length) {
      let cellOnPath = pathToFood[pathToFoodIndex];
      grid.cells[cellOnPath.x][cellOnPath.y].cor = PATH_CELL;
      pathToFoodIndex += 1;
    } else {
      pathToFoodIndex = 0;
      followPath = true;
      highlightPath = false;
    }
  } else if (followPath) {
    if (pathToFoodIndex < pathToFood.length) {
      if (player.pixelPos.dist(getCellPixelMapping(food.position)) < 3) {
        reset();
        followPath = false;
        foodCounter = foodCounter + 1;
      } else {
        let nextCell = pathToFood[pathToFoodIndex];
        let nextCellPixelPos = getCellPixelMapping(nextCell);
        player.arrive(nextCellPixelPos);
        player.run();
        if (player.pixelPos.dist(nextCellPixelPos) < 7) {
          let startIdx = pathToFoodIndex;
          while (pathToFoodIndex + 1 < pathToFood.length) {
            if (!(pathToFood[pathToFoodIndex + 1].x == pathToFood[startIdx].x || pathToFood[pathToFoodIndex + 1].y == pathToFood[startIdx].y)) {
              break;
            }
            pathToFoodIndex += 1;
          }
        }
      }
    } else {
      followPath = false;
      entrypoint = false;
      reset();
    }
  }

 
  background(255);
  grid.draw();
  player.draw();
  food.draw();
  updateCounter();
  /*
  player.arrive(food.getPos());
  player.run();
  player.position = food.position;
  */
}

function updateCounter() { 
  texto = "Food: " + foodCounter;
  textSize(32);
  text(texto, 800, 110); 
}

function reset() {
  // entrypoint = true;
  visitingCells = true;
  
  grid.clean();
  grid.draw();
  
  player.position = food.position;
  player.draw();
  food = new Food();
  food.spawn();
  food.draw();
  
  if (activeAlgorithm == 'BFS') {
    runBFS();
  } else if (activeAlgorithm == 'DFS') {
    runDFS();
  } else if (activeAlgorithm == 'Dijkstra') {
    runDijkstra();
  } else if (activeAlgorithm == 'Guloso') {
    runGuloso();
  } else if (activeAlgorithm == 'A*') {
    runAStar();
  }
}

function initializeGraph() {
  let dx = [0, 0, 1, -1];
  let dy = [1, -1, 0, 0];
  graph = [];
  for (let i = 0; i < GRID_ROWS; ++i) {
    graph.push([]);
    for (let j = 0; j < GRID_COLUMNS; ++j) {
      graph[i].push([]);
    }
  }
  for (let i = 0; i < GRID_ROWS; ++i) {
    for (let j = 0; j < GRID_COLUMNS; ++j) {
      // starting at grid[i][j]
      // sum of weights of each cell
      for (let k = 0; k < 4; ++k) {
        let nx = i + dx[k];
        let ny = j + dy[k];
        if (nx >= 0 && ny >= 0 && nx < GRID_ROWS && ny < GRID_COLUMNS) {
          if (grid.cells[nx][ny].kind != WALL) {
            let w1 = getWeight(grid.cells[i][j].kind);
            let w2 = getWeight(grid.cells[nx][ny].kind);
            //graph[i][j].push([createVector(nx, ny), w1 + w2]); 
            graph[i][j].push([createVector(nx, ny), w2]); 
          }
        }
      }
    }
  }
}

function initializeVisited() {
  visited = [];
  beforeOnPath = [];
  dist = [];
  dist2 = [];
  for (let i = 0; i < GRID_ROWS; ++i) {
    visited.push([]);
    beforeOnPath.push([]);
    dist.push([]);
    dist2.push([]);
    for (let j = 0; j < GRID_COLUMNS; ++j) {
      visited[i].push(false);
      beforeOnPath[i].push(null);
      dist[i].push(123456789);
      dist2[i].push(food.position.dist(createVector(i, j)));
    }
  }
}

function validGraph() {
  let dx = [0, 0, 1, -1];
  let dy = [1, -1, 0, 0];
  visited = [];
  for (let i = 0; i < GRID_ROWS; ++i) {
    visited.push([]);
    for (let j = 0; j < GRID_COLUMNS; ++j) {
      visited[i].push(false);
    }
  }
  q = [];
  q.push(player.position);
  visited[player.position.x][player.position.y] = true;
  
  while (q.length) {
    u = q.pop();
    for (let k = 0; k < 4; ++k) {
      let nx = u.x + dx[k];
      let ny = u.y + dy[k];
      if (nx >= 0 && ny >= 0 && nx < GRID_ROWS && ny < GRID_COLUMNS) {
        if (grid.cells[nx][ny].kind != WALL && !visited[nx][ny]) {
          visited[nx][ny] = true;
          q.push(createVector(nx, ny));
        }
      }
    }
  }
  return (visited[food.position.x][food.position.y]);
}

function runBFS() {
  console.log('Running BFS');
  initializeVisited();
  activeAlgorithm = 'BFS';
  queue = [];
  queue.push([player.position, 0]);
  dist[player.position.x][player.position.y] = 0;  
  entrypoint = false;
  visitingCells = true;
}

function runDFS() {
  console.log('Running DFS');
  initializeVisited();
  activeAlgorithm = 'DFS';
  queue = [];
  queue.push([player.position, 0]);
  entrypoint = false;
  visitingCells = true;
}

function runDijkstra() {
  console.log('Running Dijkstra');
  initializeVisited();
  activeAlgorithm = "Dijkstra";
  queue = [];
  queue.push([player.position, 0]);
  dist[player.position.x][player.position.y] = 0;
  entrypoint = false;
  visitingCells = true;
}

function runGuloso() {
  console.log('Running Guloso');
  initializeVisited();
  activeAlgorithm = "Guloso";
  queue = [];
  queue.push([player.position, dist2[player.position.x][player.position.y]]);
  entrypoint = false;
  visitingCells = true;
}

function runAStar() {
  console.log('Running A*');
  initializeVisited();
  activeAlgorithm = "A*";
  queue = [];
  queue.push([player.position, 0]);
  dist[player.position.x][player.position.y] = dist2[player.position.x][player.position.y];
  entrypoint = false;
  visitingCells = true;
}
