const DRAG = 0.97;

class Vertex {
  constructor(x, y) {
    this.lastX = x;
    this.lastY = y;
    this.x = x;
    this.y = y;
  }

  draw(graphics) {
    graphics.beginFill(0xffffff);
    graphics.drawCircle(this.x, this.y, 2);
    graphics.endFill();
  }

  setPosition(x, y) {
    this.lastX = this.x;
    this.lastY = this.y;
    this.x = x;
    this.y = y;
  }
}

class Constraint {
  constructor(vertexA, vertexB, length) {
    this.vertexA = vertexA;
    this.vertexB = vertexB;
    this.length = length;
  }

  draw(graphics) {
    graphics.moveTo(this.vertexA.x, this.vertexA.y);
    graphics.lineTo(this.vertexB.x, this.vertexB.y);
  }
}

class Rope {
  constructor(numSegments, length, x, y, steps) {
    this.numSegments = numSegments;
    this.length = length;

    this.x = x;
    this.y = y;

    this.steps = steps;

    this.vertices = [];
    this.constraints = [];

    this.createVertices();
    this.createConstraints();
  }

  createVertices() {
    for (let i = 0; i < this.numSegments; i++) {
      const vertex = new Vertex(this.x, this.y);
      this.vertices.push(vertex);
    }
  }

  createConstraints() {
    for (let i = 0; i < this.numSegments - 1; i++) {
      const constraint = new Constraint(this.vertices[i], this.vertices[i + 1], this.length);
      this.constraints.push(constraint);
    }
  }

  satisfyConstraints() {
    this.vertices.forEach((vertex) => {
      if (vertex.y > 500) {
        const dx = (vertex.x - vertex.lastX) * DRAG;
        const dy = (vertex.y - vertex.lastY) * DRAG;

        const speed = Math.sqrt(dx * dx + dy * dy);
        vertex.y = 500;
        vertex.lastX = vertex.lastX + (dy / speed) * dx, 500 + dy * 0.1;
      }
    });

    this.constraints.forEach((constraint) => {
      let dx = constraint.vertexB.x - constraint.vertexA.x;
      let dy = constraint.vertexB.y - constraint.vertexA.y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance === 0) {
        distance = 0.001;
        dx = (Math.random() - 0.5) * 0.001;
        dy = (Math.random() - 0.5) * 0.001;
      }

      const fraction = ((constraint.length - distance) / distance) / 2;
      const offsetX = dx * fraction;
      const offsetY = dy * fraction;

      constraint.vertexA.setPosition(constraint.vertexA.x - offsetX, constraint.vertexA.y - offsetY);
      constraint.vertexB.setPosition(constraint.vertexB.x + offsetX, constraint.vertexB.y + offsetY);
    });
  }

  update(input) {
    // Apply gravity
    this.vertices.forEach((vertex) => {
      const dx = vertex.x - vertex.lastX;
      const dy = vertex.y - vertex.lastY;

      vertex.lastY = vertex.y;
      vertex.lastX = vertex.x;

      vertex.x += dx;
      vertex.y += dy;
      vertex.y += 1.0;
    });

    this.vertices[0].setPosition(input.x, input.y);
    // apply constraints
    for (let i = 0; i < this.steps; i++) {
      this.satisfyConstraints();
    }
  }

  draw(graphics) {
    graphics.lineStyle(2, 0xffffff, 1);

    this.constraints.forEach((constraint) => {
      constraint.draw(graphics);
    });

    this.vertices.forEach((vertex) => {
      vertex.draw(graphics);
    });
  }
}
