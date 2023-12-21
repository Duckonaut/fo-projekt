class Physics {
  constructor(parent) {
    this.parent = parent;
    this.app = new PIXI.Application({
      width: 640,
      height: 480,
      antialias: true,
      eventMode: 'passive',
    });

    this.container = new PIXI.Container();
    this.container.eventMode = 'static';
    this.container.input = {
      x: 0,
      y: 0,
      isDown: false,
    };
    this.container.on('pointerdown', (event) => {
      this.container.input.isDown = true;
    });
    this.container.on('pointerup', (event) => {
      this.container.input.isDown = false;
    });
    this.container.on('globalpointermove', (event) => {
      this.container.input.x = event.data.global.x;
      this.container.input.y = event.data.global.y;
    });
    this.app.stage.addChild(this.container);

    this.world = {
      colliders: [],
    };

    this.world.colliders.push(new CircleCollider(new Vector2(320, 240), 64));
    this.world.colliders.push(new AABBCollider(new Vector2(320, 640), new Vector2(1000, 400)));

    this.rope = new Rope(this.world, 32, 16, 100, 100, 16);
    this.graphics = new PIXI.Graphics();
    this.container.addChild(this.graphics);

    this.app.ticker.add(() => {
      this.update(this.container.input);
      this.draw(this.graphics);
    });
  }

  start() {
    this.parent.appendChild(this.app.view);
  }

  update(input) {
    this.rope.update(input);
  }

  draw(graphics) {
    graphics.clear();
    for (let i = 0; i < this.world.colliders.length; i++) {
      this.world.colliders[i].draw(graphics);
    }
    this.rope.draw(graphics);
  }
}
