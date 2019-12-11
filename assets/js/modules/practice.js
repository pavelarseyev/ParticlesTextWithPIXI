import * as PIXI from "pixi.js";
import * as dat from 'dat.gui';

import {Particle} from "./Particle";

function wrapText(context, text, x, y, maxWidth, lineHeight) {
    let words = text.split(' ');
    let line = '';

    for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        let metrics = context.measureText(testLine);
        let testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        }
        else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
}

let text = "SOME TEXT FOR ANIMATION";

function drawCanvasWithSomeText(text, fz, lh, mWidth, xPos, yPos) {
    let hiddenCanvasText = document.createElement("canvas");
    hiddenCanvasText.width = window.innerWidth;
    hiddenCanvasText.height = window.innerHeight;
    let ctx = hiddenCanvasText.getContext("2d");
    let maxWidth = mWidth;
    let lineHeight = lh;
    let x = xPos;
    let y = yPos;
    ctx.font = fz +"px Arial";
    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0,hiddenCanvasText.width, hiddenCanvasText.width);
    ctx.fillStyle = "#ffffff";
    wrapText(ctx, text, x, y, maxWidth, lineHeight);

    return hiddenCanvasText.toDataURL("image/png");
}

let imageURL = drawCanvasWithSomeText(text, 75, 80, (window.innerWidth - 100), 10, Math.floor(window.innerHeight/2 - 40));

export function practice() {

    const gui = new dat.GUI();

    function resize(app) {

        app.renderer.resize(window.innerWidth, window.innerHeight);
    }

    class ParticleText {
        constructor() {
            this.app = new PIXI.Application({
                autoResize: true
            });
            document.querySelector(".main").appendChild(this.app.view);

            this.particleSize = 3;
            this.rows = Math.floor(window.innerHeight / this.particleSize);
            // this.rows = 100;
            this.cols = Math.floor(window.innerWidth / this.particleSize);
            this.particles = [];
            // this.mouse = {x:0,y:0};
            this.radius = 50;


            this.container = new PIXI.ParticleContainer(600000);
            this.app.stage.addChild(this.container);

            this.addObjects();

            resize(this.app);

            window.addEventListener('resize', () => {
                resize(this.app);
            });

            window.addEventListener('mousewheel', (e) => {
                if(e.wheelDelta > 0) {
                    this.radius += 20;
                }
            });

            this.animate();
        }

        addObjects() {
            this.app.loader.add('bunny', imageURL).load((loader, resources) => {

                let canvas = document.createElement("canvas");
                let ctx = canvas.getContext("2d");
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;

                ctx.drawImage(resources.bunny.data, 0, 0);

                function hasFill(x, y, size) {
                    for (let i = 0; i < size; i++) {
                        for (let j = 0; j < size; j++) {
                            if(ctx.getImageData(x+i, y+i, 1, 1).data[2] > 0) return true;
                        }
                    }
                    return false;
                }


                for (let i = 0; i < this.cols; i++) {
                    for (let j = 0; j < this.rows; j++) {
                        let x = i * this.particleSize;
                        let y = j * this.particleSize;

                        if(hasFill(x, y, this.particleSize)) {
                            let p = new Particle(x, y, resources.bunny.texture, this.particleSize, this.radius);

                            this.particles.push(p);
                            this.container.addChild(p.sprite);
                        }
                    }
                }
            });
        }

        animate() {
            this.app.ticker.add(() => {
                this.mouse = this.app.renderer.plugins.interaction.mouse.global;

                this.particles.forEach(p => {
                    p.update(this.mouse, this.radius);
                });
            });
        }
    }

    let PT = new ParticleText();

    gui.add(PT, "radius", 10, 500);
}