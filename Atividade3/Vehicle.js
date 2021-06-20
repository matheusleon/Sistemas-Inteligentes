class Vehicle {
  constructor(x, y) {
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(3, -2);
    this.position = createVector(x, y);
    this.r = 6;
    this.maxspeed = 3;
    this.maxforce = 0.15;
  }
    
  run() {
    this.update();
    this.display();
  }
    
  update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxspeed);
    
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }
  
  applyForce(force) {
    this.acceleration.add(force);
  }
  
  arrive(target) {
    let desired = createVector(target.x, target.y);
    desired.sub(this.position);
    let d = mag(desired);
    
    if (d < 100){
      let m = map(d, 0, 100, 0, this.maxspeed);
      desired.setMag(m);
    }
    else {
      desired.setMag(this.maxspeed);
    }
    let aux = desired.sub(self.velocity);
    let steer = createVector(aux.x, aux.y);
    steer.limit(this.maxforce);
    
    console.log(desired);
    console.log(this.velocity);

    this.applyForce(steer);
  }
 
  display() {
    let theta = this.velocity.heading() + PI / 2;
    fill(155);
    stroke(200);
    strokeWeight(1);
    
    push();
    
    translate(this.position.x, this.position.y);
    rotate(theta);
    beginShape();
    vertex(0, -this.r * 2);
    vertex(-this.r, this.r * 2);
    vertex(this.r, this.r * 2);
    endShape(CLOSE);
  }
}
