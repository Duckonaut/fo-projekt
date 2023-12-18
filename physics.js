class Physics {
  constructor(parent) {
    this.parent = parent;
    this.app = new PIXI.Application({
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

    this.rope = new Rope(20, 4, 100, 100, 10);
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
    this.rope.draw(graphics);
  }
}
