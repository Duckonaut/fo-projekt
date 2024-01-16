class Vector2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  add(vector) {
    this.x += vector.x;
    this.y += vector.y;
  }
  subtract(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
  }
  multiply(scalar) {
    this.x *= scalar;
    this.y *= scalar;
  }
  divide(scalar) {
    this.x /= scalar;
    this.y /= scalar;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  normalize() {
    const length = this.length();
    if (length > 0) {
      this.divide(length);
    }
  }
  normalized() {
    const vector = new Vector2(this.x, this.y);
    vector.normalize();
    return vector;
  }
  setMagnitude(magnitude) {
    this.normalize();
    this.multiply(magnitude);
  }
  distanceTo(vector) {
    const dx = this.x - vector.x;
    const dy = this.y - vector.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  static add(vectorA, vectorB) {
    return new Vector2(vectorA.x + vectorB.x, vectorA.y + vectorB.y);
  }
  static subtract(vectorA, vectorB) {
    return new Vector2(vectorA.x - vectorB.x, vectorA.y - vectorB.y);
  }
  static multiply(vector, scalar) {
    return new Vector2(vector.x * scalar, vector.y * scalar);
  }
  static divide(vector, scalar) {
    return new Vector2(vector.x / scalar, vector.y / scalar);
  }
}

// Base class for all colliders
// provide a basic interface for all colliders:
//  - check if a point is inside the collider
//  - get the closest point on the collider surface to a point
//  - draw the collider
class Collider {
  constructor(position) {
    this.position = position;
  }

  contains(point) {
    return false;
  }

  getClosestSurfacePoint(point) {
    return new Vector2(0, 0);
  }

  draw(graphics) {
    graphics.beginFill(0x4CBB17);
    graphics.drawCircle(this.position.x, this.position.y, 2);
    graphics.endFill();
  }
}

// Circle collider
class CircleCollider extends Collider {
  constructor(position, radius) {
    super(position);
    this.radius = radius;
  }

  contains(point) {
    return this.position.distanceTo(point) <= this.radius;
  }

  getClosestSurfacePoint(point) {
    const separationVector = Vector2.subtract(this.position, point);
    separationVector.setMagnitude(this.radius);
    return Vector2.subtract(this.position, separationVector);
  }

  draw(graphics) {
    graphics.beginFill(0x4CBB17);
    graphics.drawCircle(this.position.x, this.position.y, this.radius);
    graphics.endFill();
  }
}

// AABB collider
class AABBCollider extends Collider {
  constructor(position, size) {
    super(position);
    this.width = size.x;
    this.height = size.y;
  }

  contains(point) {
    return point.x >= this.position.x - this.width / 2 &&
           point.x <= this.position.x + this.width / 2 &&
           point.y >= this.position.y - this.height / 2 &&
           point.y <= this.position.y + this.height / 2;
  }

  // get the closest point on the collider surface to a point inside the collider
  getClosestSurfacePoint(point) {
    const closestPoint = new Vector2(point.x, point.y);
    if (closestPoint.x < this.position.x - this.width / 2) {
      closestPoint.x = this.position.x - this.width / 2;
    } else if (closestPoint.x > this.position.x + this.width / 2) {
      closestPoint.x = this.position.x + this.width / 2;
    } else {
      // if the point is inside the collider, then the closest point is on the edge
      if (closestPoint.y < this.position.y) {
        closestPoint.y = this.position.y - this.height / 2;
      } else {
        closestPoint.y = this.position.y + this.height / 2;
      }
      return closestPoint;
    }
    if (closestPoint.y < this.position.y - this.height / 2) {
      closestPoint.y = this.position.y - this.height / 2;
    } else if (closestPoint.y > this.position.y + this.height / 2) {
      closestPoint.y = this.position.y + this.height / 2;
    } else {
      // if the point is inside the collider, then the closest point is on the edge
      if (closestPoint.x < this.position.x) {
        closestPoint.x = this.position.x - this.width / 2;
      } else {
        closestPoint.x = this.position.x + this.width / 2;
      }
      return closestPoint;
    }
    return closestPoint;
  }

  draw(graphics) {
    graphics.beginFill(0x4CBB17);
    graphics.drawRect(this.position.x - this.width / 2, this.position.y - this.height / 2, this.width, this.height);
    graphics.endFill();
  }
}
