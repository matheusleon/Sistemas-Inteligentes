PLAYER_SIZE = 20;

class Player {
  constructor(x, y) {
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(0, 0);
    this.position = createVector(0, 0);
    this.pixelPos = createVector(0, 0);
    this.maxspeed = 7;
    this.maxforce = 0.15;
  }
    
  run() {
    this.update();
    this.draw();
  }
    
  update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxspeed);
    
    this.pixelPos.add(this.velocity);
    this.acceleration.mult(0);
  }
  
  applyForce(force) {
    this.acceleration.add(force);
  }
  
  arrive(target) {
    let desired = p5.Vector.sub(target, this.pixelPos);
    let d = desired.mag();
    desired.normalize();
    
    if (d < 140) {
      let m = map(d, 0, 140, 0, this.maxspeed);
      desired.mult(m);
    } else { 
      desired.mult(this.maxspeed);
    }
    
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    this.applyForce(steer);
  }
 
  draw() {
    fill('red');
    ellipse(this.pixelPos.x, this.pixelPos.y, PLAYER_SIZE);
  }
  
  spawn() {
    while (true) {
      this.position.x = int(random(grid.rows));
      this.position.y = int(random(grid.columns));
      if (grid.cells[this.position.x][this.position.y].kind != WALL) {
        this.pixelPos = getCellPixelMapping(this.position);
        return 0;
      }
    }
  }
}
