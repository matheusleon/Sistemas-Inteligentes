const d = 50;

var v;

function setup() {
  createCanvas(500, 500);
  v = new Vehicle(50, 50);
}


function draw() {
  
  background(255);
    
  stroke(175);
  noFill();
  rectMode(CENTER);
  rect(width / 2, height / 2, width - d, height - d);
  
  ellipse(400, 400, 10, 10);

  
  v.arrive(createVector(400, 400));
  
  v.run();
}
