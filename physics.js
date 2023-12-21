class Physics {
  constructor(parent) {
    this.parent = parent;
    this.stats = document.createElement('div');
    this.stats.style.position = 'relative';
    this.stats.style.width = '640px';
    this.stats.style.height = '200px';
    this.stats.style.marginTop = '8px';
    this.stats.style.marginLeft = 'auto';
    this.stats.style.marginRight = 'auto';

    this.stats.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    this.stats.style.color = 'white';
    this.stats.style.fontFamily = 'monospace';
    this.stats.style.fontSize = '12px';
    this.stats.style.padding = '4px';
    this.stats.style.overflow = 'hidden';
    this.stats.style.textOverflow = 'ellipsis';
    this.stats.style.whiteSpace = 'nowrap';

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

    this.world.colliders.push(new CircleCollider(new Vector2(420, 240), 64));
    this.world.colliders.push(new CircleCollider(new Vector2(220, 240), 40));
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
    this.parent.appendChild(this.stats);
  }

  update(input) {
    this.rope.update(input);
    const stats = [
      `fps: ${this.app.ticker.FPS.toFixed(2)}`,
      `mouse: ${input.x.toFixed(2)}, ${input.y.toFixed(2)}`,
      `numSegments: ${this.rope.numSegments}`,
      `length: ${this.rope.totalLength().toFixed(2)}`,
      `targetLength: ${(this.rope.numSegments * this.rope.length).toFixed(2)}`,
      `maxStretch: ${this.rope.maxStretch().toFixed(2)}`,
      `minStretch: ${this.rope.minStretch().toFixed(2)}`,
    ];
    this.stats.innerHTML = `${stats.join('<br>')}`;
  }

  draw(graphics) {
    graphics.clear();
    for (let i = 0; i < this.world.colliders.length; i++) {
      this.world.colliders[i].draw(graphics);
    }
    this.rope.draw(graphics);
  }
}
