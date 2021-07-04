from Vehicle import Vehicle
from Food import Food

d = 50
foodCounter = 0

def setup():
    global v
    global f
    
    size(640, 360)
    v = Vehicle(width / 2, height / 2)
    f = Food(random(d * 2, width - d * 2), random(d * 2, height - d * 2))

def updateCounter():
    texto = "Food: " + str(foodCounter)
    textSize(32);
    text(texto, d / 2, d); 

def draw():
    global foodCounter
    background(255)
    
    stroke(175)
    noFill()
    rectMode(CENTER)
    rect(width / 2, height / 2, width - d, height - d)

    v.arrive(f.position)
    
    if v.position.dist(f.position) < 15:
        f.updatePosition(random(d * 2, width - d * 2), random(d * 2, height - d * 2))
        foodCounter = foodCounter + 1
    
    updateCounter()
    f.run()
    v.run()
