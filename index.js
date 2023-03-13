let started = false;
let burst = false;

class Canvas {
  constructor(selector) {
    this.el = document.querySelector(selector);
    this.context = this.el.getContext('2d');
    this.el.width = document.body.clientWidth;
    this.el.height = document.body.clientHeight;
  }
}

class Particle {
  static MAX_SIZE = 35;
  static COLORS = ['#000', '#abc', '#dbe', '#eff', '#aff'];
  
  direction = [1, 1];
  
  constructor(canvas, x, y) {
    this.canvas = canvas;
    this.context = canvas.context;
    this.context.strokeStyle = ''
    if (!x && !y) {
      this.x = Math.abs(Math.random() * this.canvas.el.width);
      this.y = Math.abs(Math.random() * this.canvas.el.height);
    } else {
      this.x = x;
      this.y = y;
    }
    this.color = Particle.COLORS[Math.floor(Math.random() * Particle.COLORS.length)];
    this.size = Math.abs(Math.random() * Particle.MAX_SIZE);
    this.direction[0] = Math.random() > 0.5 ? 1 : -1;
    this.direction[1] = Math.random() > 0.5 ? 1 : -1;
    this.speedThrottle = Math.random();
  }
  
  move() {
    if (!started) {
      return;
    }
    
    this.x += this.direction[0] * this.speedThrottle;
    
    if (this.x + this.size >= this.canvas.el.width || this.x - this.size <= 0) {
      this.direction[0] = -1 * this.direction[0];
    }
    
    this.y += this.direction[1] * this.speedThrottle;

    if (this.y + this.size >= this.canvas.el.height || this.y - this.size <= 0) {
      this.direction[1] = -1 * this.direction[1];
    }
  }
  
  draw() {
    this.context.beginPath();
    this.context.strokeStyle = this.color;
    this.context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    this.context.stroke();
  }
}

class Audio {
  plays = false;
  
  start() {
    if (this.plays) {
      return;
    }
    const audio = document.querySelector('audio');
    audio.volume = 0.2;
    audio.play();
  }
}

function render(canvas, particles) {
  canvas.context.fillRect(0, 0, canvas.el.width, canvas.el.height);
  
  particles.forEach(p => {
    p.move();
    p.draw();
  })
  
  window.requestAnimationFrame(() => render(canvas, particles));
}

function main() {
  const canvas = new Canvas('canvas');
  const particles = (new Array(50)).fill(null).map(() => new Particle(canvas));
  
  render(canvas, particles);
  
  const audio = new Audio();
  
  document.querySelector('body').addEventListener('click', () => {
    started = true;
    canvas.el.classList.remove('resized');
    document.querySelector('h1').hidden = true;
    audio.start();
  });

  document.querySelector('body').addEventListener('mousedown', (e) => {
    if (particles.length < 2000) {
      particles.push(...(new Array(5).fill(null).map(() => new Particle(canvas, e.clientX, e.clientY))));
    }
    burst = true;
  });

  document.querySelector('body').addEventListener('mouseup', () => {
    burst = false;
  });

  document.querySelector('body').addEventListener('mousemove', (e) => {
    if (!burst) {
      return;
    }

    if (particles.length < 1000) {
      particles.push(...(new Array(2).fill(null).map(() => new Particle(canvas, e.clientX, e.clientY))));
    } else {
      if (particles.length < 1750) {
        particles.push(new Particle(canvas, e.clientX, e.clientY));
      }
    }
  });
  
  window.setInterval(() => console.log(particles.length), 2000)
}

main();
