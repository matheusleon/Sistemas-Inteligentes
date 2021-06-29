GRID_OFFSET_X = 100;
GRID_OFFSET_Y = 100;

let Grid = function(rows, columns) {
  this.rows = rows;
  this.columns = columns;
  this.OFFSET_X = 100;
  this.OFFSET_Y = 100;
};

Grid.prototype.generate = function() {
  this.cells = [];
  for (let i = 0; i < this.rows; ++i) {
    let row = [];
    for (let j = 0 ; j < this.columns; ++j) {
      row.push(new Cell());
    }
    this.cells.push(row);
  }
};

Grid.prototype.draw = function() {
  for (let i = 0; i < this.rows; ++i) {
    for (let j = 0; j < this.columns; ++j) {
      drawCell(createVector(i, j), this.cells[i][j].getColor());
    }
  }
};
