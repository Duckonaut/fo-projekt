const DRAG = 0.97;

class Vertex {
  constructor(x, y, unmovable = false) {
    this.lastX = x;
    this.lastY = y;
    this.x = x;
    this.y = y;
    this.unmovable = unmovable;
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
  constructor(vertexA, vertexB, segmentLength) {
    this.vertexA = vertexA;
    this.vertexB = vertexB;
    this.segmentLength = segmentLength;
  }

  draw(graphics) {
    graphics.moveTo(this.vertexA.x, this.vertexA.y);
    graphics.lineTo(this.vertexB.x, this.vertexB.y);
  }
}

class Rope {
  constructor(world, numSegments, segmentLength, x, y, steps, gravity) {
    this.world = world;
    this.numSegments = numSegments;
    this.segmentLength = segmentLength;

    this.x = x;
    this.y = y;

    this.steps = steps;

    this.gravity = gravity

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
      const constraint = new Constraint(this.vertices[i], this.vertices[i + 1], this.segmentLength);
      this.constraints.push(constraint);
    }
  }

  satisfyConstraints() {
    this.world.colliders.forEach((collider) => {
      this.vertices.forEach((vertex) => {
        if (collider.contains(new Vector2(vertex.x, vertex.y))) {
          const surfacePoint = collider.getClosestSurfacePoint(new Vector2(vertex.x, vertex.y));
          vertex.x = surfacePoint.x;
          vertex.y = surfacePoint.y;
        }
      });
    });

    this.constraints.forEach((constraint) => {
      if (constraint.vertexA.unmovable && constraint.vertexB.unmovable) {
        return;
      }
      let dx = constraint.vertexB.x - constraint.vertexA.x;
      let dy = constraint.vertexB.y - constraint.vertexA.y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance === 0) {
        distance = 0.001;
        dx = (Math.random() - 0.5) * 0.001;
        dy = (Math.random() - 0.5) * 0.001;
      }

      const fraction = ((constraint.segmentLength - distance) / distance) / 2;
      const offsetX = dx * fraction;
      const offsetY = dy * fraction;
      if (constraint.vertexA.unmovable) {
        constraint.vertexB.x = constraint.vertexB.x + offsetX * 2;
        constraint.vertexB.y = constraint.vertexB.y + offsetY * 2;
      }
      else if (constraint.vertexB.unmovable) {
        constraint.vertexA.x = constraint.vertexA.x - offsetX * 2;
        constraint.vertexA.y = constraint.vertexA.y - offsetY * 2;
      }
      else {
        constraint.vertexA.x = constraint.vertexA.x - offsetX;
        constraint.vertexA.y = constraint.vertexA.y - offsetY;
        constraint.vertexB.x = constraint.vertexB.x + offsetX;
        constraint.vertexB.y = constraint.vertexB.y + offsetY;
      }
    });
  }

  update(input) {
    this.vertices[0].setPosition(input.x, input.y);

    this.vertices.forEach((vertex) => {
      if (vertex.unmovable) {
        return;
      }
      const dx = vertex.x - vertex.lastX;
      const dy = vertex.y - vertex.lastY;

      vertex.lastY = vertex.y;
      vertex.lastX = vertex.x;

      vertex.x += dx;
      vertex.y += dy;
      vertex.y += this.gravity;
    });
    for (let i = 0; i < this.steps; i++) {
      this.satisfyConstraints();
    }
  }

  totalLength() {
    let total_length = 0;
    this.constraints.forEach((constraint) => {
      const dx = constraint.vertexB.x - constraint.vertexA.x;
      const dy = constraint.vertexB.y - constraint.vertexA.y;
      total_length += Math.sqrt(dx * dx + dy * dy);
    });
    return total_length;
  }

  maxStretch() {
    let maxStretch = 0;
    this.constraints.forEach((constraint) => {
      const dx = constraint.vertexB.x - constraint.vertexA.x;
      const dy = constraint.vertexB.y - constraint.vertexA.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const stretch = distance / constraint.segmentLength;
      if (stretch > maxStretch) {
        maxStretch = stretch;
      }
    });
    return maxStretch;
  }

  minStretch() {
    let minStretch = Number.MAX_VALUE;
    this.constraints.forEach((constraint) => {
      const dx = constraint.vertexB.x - constraint.vertexA.x;
      const dy = constraint.vertexB.y - constraint.vertexA.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const stretch = distance / constraint.segmentLength;
      if (stretch < minStretch) {
        minStretch = stretch;
      }
    });
    return minStretch;
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

  setPinnedDownState(state)
  {
    if(state)
    {
      this.vertices[this.numSegments-1].unmovable = true;
    }
    else
    {
      this.vertices[this.numSegments-1].unmovable = false;
    }
  }
}
