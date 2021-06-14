class Vehicle():

    def __init__(self, x, y):
        self.acceleration = PVector(0, 0)
        self.velocity = PVector(3, -2)
        self.position = PVector(x, y)
        self.r = 6
        self.maxspeed = 3
        self.maxforce = 0.15

    def run(self):
        self.update()
        self.display()

    # Method to update location
    def update(self):
        # Update velocity
        self.velocity.add(self.acceleration)
        # Limit speed
        self.velocity.limit(self.maxspeed)
        self.position.add(self.velocity)
        # Reset accelerationelertion to 0 each cycle
        self.acceleration.mult(0)

    def applyForce(self, force):
        # We could add mass here if we want A = F / M
        self.acceleration.add(force)

    # A method that calculates a steering force towards a target
    # STEER = DESIRED MINUS VELOCITY
    def boundaries(self, d):

        desired = None

        if self.position.x < d:
            desired = PVector(self.maxspeed, self.velocity.y)
        elif self.position.x > width - d:
            desired = PVector(-self.maxspeed, self.velocity.y)

        if self.position.y < d:
            desired = PVector(self.velocity.x, self.maxspeed)
        elif self.position.y > height - d:
            desired = PVector(self.velocity.x, -self.maxspeed)

        if desired:
            desired.normalize()
            desired.mult(self.maxspeed)
            steer = desired - self.velocity
            steer.limit(self.maxforce)
            self.applyForce(steer)
            
    # A method that calculates a steering force towards a target
    # STEER = DESIRED MINUS VELOCITY
    def seek(self, target):

        # A vector pointing from the location to the target
        desired = target - self.position

        # Scale to maximum speed
        desired.setMag(self.maxspeed)

        steer = desired - self.velocity
        steer.limit(self.maxforce)  # Limit to maximum steering forceo       
        self.applyForce(steer)
        
    # A method that calculates a steering force towards a target
    # STEER = DESIRED MINUS VELOCITY
    def arrive(self, target):

        # A vector pointing from the location to the target
        desired = target - self.position
        d = desired.mag()

        # Scale with arbitrary damping within 100 pixels
        if (d < 100):
            m = map(d, 0, 100, 0, self.maxspeed)
            desired.setMag(m)
        else:
            desired.setMag(self.maxspeed)

        # Steering = Desired minus velocity
        steer = desired - self.velocity
        steer.limit(self.maxforce)  # Limit to maximum steering force

        self.applyForce(steer)

    def display(self):
        # Draw a triangle rotated in the direction of velocity
        theta = self.velocity.heading() + PI / 2
        fill(127)
        stroke(200)
        strokeWeight(1)
        with pushMatrix():
            translate(self.position.x, self.position.y)
            rotate(theta)
            beginShape()
            vertex(0, -self.r * 2)
            vertex(-self.r, self.r * 2)
            vertex(self.r, self.r * 2)
            endShape(CLOSE)
