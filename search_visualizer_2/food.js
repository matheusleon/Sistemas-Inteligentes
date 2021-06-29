FOOD_SIZE = 20;

class Food {
  constructor() {
    this.position = createVector(0, 0);
  }

  spawn() {
    while (true) {
      this.position.x = int(random(grid.rows));
      this.position.y = int(random(grid.columns));
      if (grid.cells[this.position.x][this.position.y].kind != WALL) {
        if (this.position.x != player.position.x || this.position.y != player.position.y) {
          return 0;
        }
      }
    }
  }

  draw() {
    fill('blue');
    let pixelPos = getCellPixelMapping(this.position);
    ellipse(pixelPos.x, pixelPos.y, FOOD_SIZE);
  }
  
  getPos() {
    return getCellPixelMapping(this.position);
  }
}
