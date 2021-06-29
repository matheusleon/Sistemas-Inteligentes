WALL = 0;
GROUND = 1;
SLOWGROUND = 2;
VERYSLOWGROUND = 3;
VISITED_CELL = 4;
PATH_CELL = 5;

CELL_SIZE = 35;

let Cell = function() {
  this.kind = int(random(4));
  this.cor = this.kind;
  this.visited = false;
};

Cell.prototype.getColor = function() {
  /*
    0 = WALL
    1 = GROUND
    2 = SLOW GROUND
    3 = VERY SLOW GROUND
    4 = VISITED CELL
    5 = PATH_CELL
    ----
    6 = VISITED GROUND
    7 = VISITED SLOW GROUND
    8 = VISITED VERY SLOW GROUND
  */
  let colors = ['gray', 'white', 'lightgreen', 'mediumseagreen', 'yellow', 'lightblue', 'khaki', 'gold', 'goldenrod'];
  return colors[this.cor];
};

function drawCell(cell, cellColor) {
  let pixelPos = getCellPixelMapping(cell);
  fill(cellColor);
  rectMode(CENTER);
  rect(pixelPos.x, pixelPos.y, CELL_SIZE, CELL_SIZE);
}

function fetchNextCells(cell) {
  let cells = [];
  if (activeAlgorithm == "BFS") {
    for (let i = 0; i < graph[cell.x][cell.y].length; ++i) {
      let nextCell = graph[cell.x][cell.y][i][0];
      if (!visited[nextCell.x][nextCell.y]) {
        beforeOnPath[nextCell.x][nextCell.y] = createVector(cell.x, cell.y);
        visited[nextCell.x][nextCell.y] = true;
        cells.push([nextCell, 0]);
      }
    }
  } else if (activeAlgorithm == 'Dijkstra') {
    for (let i = 0; i < graph[cell.x][cell.y].length; ++i) {
      let nextCell = graph[cell.x][cell.y][i][0];
      let weight = graph[cell.x][cell.y][i][1];
      if (dist[nextCell.x][nextCell.y] > dist[cell.x][cell.y] + weight) {
        beforeOnPath[nextCell.x][nextCell.y] = createVector(cell.x, cell.y);
        dist[nextCell.x][nextCell.y] = dist[cell.x][cell.y] + weight;
        cells.push([nextCell, dist[cell.x][cell.y] + weight]);
      }
    }
  } else if (activeAlgorithm == 'A*') {
    for (let i = 0; i < graph[cell.x][cell.y].length; ++i) {
      let nextCell = graph[cell.x][cell.y][i][0];
      let weight = graph[cell.x][cell.y][i][1];
      if (dist[nextCell.x][nextCell.y] > dist[cell.x][cell.y] + dist2[nextCell.x][nextCell.y] + weight) {
        let totalWeight = dist[cell.x][cell.y] + dist2[nextCell.x][nextCell.y] + weight;
        beforeOnPath[nextCell.x][nextCell.y] = createVector(cell.x, cell.y);
        dist[nextCell.x][nextCell.y] = totalWeight;
        cells.push([nextCell, totalWeight]);
      }
    }
  } else if (activeAlgorithm == 'DFS') {
    visited[cell.x][cell.y] = true;
    for (let i = 0; i < graph[cell.x][cell.y].length; ++i) {
      let nextCell = graph[cell.x][cell.y][i][0];
      if (!visited[nextCell.x][nextCell.y]) {
        beforeOnPath[nextCell.x][nextCell.y] = createVector(cell.x, cell.y);
        // visited[nextCell.x][nextCell.y] = true;
        cells.push([nextCell, 0]);
      }
    }
  }
  return cells;
}

function fetchNextToVisit() {
  if (activeAlgorithm == 'BFS') {
    let cell = queue[queueIndex][0];
    queueIndex += 1;
    return cell;
  } else if (activeAlgorithm == 'Dijkstra' || activeAlgorithm == 'A*') {
    let minDist = 123456789;
    let chosenCell = null;
    for (let i = 0; i < queue.length; ++i) {
      let cell = queue[i][0];
      let curDist = queue[i][1];
      if (curDist < minDist) {
        minDist = curDist;
        chosenCell = cell;
      }
    }
    let newQueue = [];
    for (let i = 0; i < queue.length; ++i) {
      let cell = queue[i][0];
      let weight = queue[i][1];
      if (cell.x != chosenCell.x || cell.y != chosenCell.y) {
        newQueue.push([cell, weight]);
      }
    }
    queue = newQueue;
    return chosenCell;
  } else if (activeAlgorithm == 'DFS') {
    let cell = queue.pop()[0];
    return cell;
  }
}

function getCellPixelMapping(cell) {
  let _x = GRID_OFFSET_X + (cell.x * CELL_SIZE);
  let _y = GRID_OFFSET_Y + (cell.y * CELL_SIZE);
  return createVector(_x, _y);
}

function buildPathToFood() {
  let path = [];
  let pos = food.position;
  while (pos != null && (pos.x != player.position.x || pos.y != player.position.y)) {
    path.push(pos);
    pos = beforeOnPath[pos.x][pos.y];
  }
  path.reverse();
  return path;
}

function equalPos(a, b) {
  return a.x == b.x && a.y == b.y;
}

function getVisitedCellColor(cell) {
  /*
    0 = WALL
    1 = GROUND
    2 = SLOW GROUND
    3 = VERY SLOW GROUND
    4 = VISITED CELL
    5 = PATH_CELL
  */
  let cellKind = grid.cells[cell.x][cell.y].kind;
  return cellKind + 5;
}
