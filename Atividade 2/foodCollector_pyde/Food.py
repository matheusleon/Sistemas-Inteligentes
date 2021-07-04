class Food():

    def __init__(self, x, y):
        self.position = PVector(x, y)
        self.r = 7
        
    def run(self):
        self.display()
    
    def updatePosition(self, x, y):
        self.position = PVector(x, y)

    def display(self):
        fill(127)
        rect(self.position.x, self.position.y, self.r, self.r)
