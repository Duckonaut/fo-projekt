class Physics {
  constructor(parent) {
    this.parent = parent;
    this.stats = document.createElement('div');
    this.stats.style.position = 'relative';
    this.stats.style.width = '640px';
    // this.stats.style.height = '200px';
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

    this.number_of_segments = 15;
    this.segment_length = 30;

    this.slider_1 = document.createElement('input');
    this.slider_1.type = 'range';
    this.slider_1.min = '1';
    this.slider_1.max = '100';
    this.slider_1.value = this.number_of_segments;
    this.slider_1.style.display = 'block';
    this.slider_1.style.width = '540px';
    this.slider_1.style.marginTop = '8px';
    this.slider_1.style.marginLeft = 'auto';
    this.slider_1.style.marginRight = 'auto';
    this.slider_1.addEventListener('input', (event) => {
      const slider_value = parseInt(event.target.value);
      this.number_of_segments = slider_value;
      this.slider_1_label.innerHTML = 'Number of segments: ' + this.number_of_segments;
      this.rope = new Rope(this.world, this.number_of_segments, this.segment_length, 100, 100, 16);
    });

    this.slider_1_label = document.createElement('label');
    this.slider_1_label.innerHTML = 'Number of segments: ' + this.slider_1.value;
    this.slider_1_label.style.display = 'block';
    this.slider_1_label.style.textAlign = 'center';

    this.slider_2 = document.createElement('input');
    this.slider_2.type = 'range';
    this.slider_2.min = '1';
    this.slider_2.max = '100';
    this.slider_2.value = this.segment_length;
    this.slider_2.style.display = 'block';
    this.slider_2.style.width = '540px';
    this.slider_2.style.marginTop = '8px';
    this.slider_2.style.marginLeft = 'auto';
    this.slider_2.style.marginRight = 'auto';
    this.slider_2.addEventListener('input', (event) => {
      const slider_value = parseInt(event.target.value);
      this.segment_length = slider_value;
      this.slider_2_label.innerHTML = 'Segment length: ' + this.segment_length;
      this.rope = new Rope(this.world, this.number_of_segments, this.segment_length, 100, 100, 16);
    });

    this.slider_2_label = document.createElement('label');
    this.slider_2_label.innerHTML = 'Segment length: ' + this.slider_2.value;
    this.slider_2_label.style.display = 'block';
    this.slider_2_label.style.textAlign = 'center';
  
    this.width = 640
    this.height = 480

    this.app = new PIXI.Application({
      width: this.width,
      height: this.height,
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

    this.rope = new Rope(this.world, this.number_of_segments, this.segment_length, 100, 100, 16);
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
    this.parent.appendChild(this.slider_1);
    this.parent.appendChild(this.slider_1_label);
    this.parent.appendChild(this.slider_2);
    this.parent.appendChild(this.slider_2_label);
  }

  update(input) {
    if (input.x < 0 || input.x > this.width)
    {
      return
    }
    if (input.y < 0 || input.y > this.height - 40)
    {
      return
    }

    this.rope.update(input);
    const stats = [
      `fps: ${this.app.ticker.FPS.toFixed(2)}`,
      `mouse: ${input.x.toFixed(2)}, ${input.y.toFixed(2)}`,
      `segments: ${this.rope.numSegments}`,
      `total length: ${this.rope.totalLength().toFixed(2)}`,
      `target length: ${(this.rope.numSegments * this.rope.length).toFixed(2)}`,
      `max stretch: ${this.rope.maxStretch().toFixed(2)}`,
      `min stretch: ${this.rope.minStretch().toFixed(2)}`,
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
