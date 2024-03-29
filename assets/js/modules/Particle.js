import * as PIXI from "pixi.js";

export class Particle {
    constructor(x, y, texture, size, radius) {

        this.x = x;
        this.y = y;

        this.sprite = new PIXI.Sprite(new PIXI.Texture(texture));
        this.sprite.texture.frame = new PIXI.Rectangle(x, y, size, size);

        this.sprite.x = x;
        this.sprite.y = y;

        this.speedX = 0;
        this.speedY = 0;

        this.radius = radius;

        this.friction = 0.9;

        this.gravity = 0.01 + Math.random()*0.4;

        this.maxGravity = 0.05;


        // window.addEventListener("scroll", (e) => {
        //     console.log(wheelDelta);
        // });
    }

    update(mouse, newRadius) {
        this.radius = newRadius;
        let distanceX = mouse.x - this.sprite.x;
        let distanceY = mouse.y - this.sprite.y;

        let distance = Math.sqrt(distanceX**2 + distanceY**2);

        let normalX = distanceX / distance;
        let normalY = distanceY / distance;


        //mouse interaction
        if(distance < this.radius) {
            //decrease gravity
            this.gravity *= this.friction;

            this.speedX -= normalX + 4*Math.random() - 2;
            this.speedY -= normalY + 4*Math.random() - 2;
        } else {
            //inertia formula
            //increase gravity
            this.gravity += 0.1*(this.maxGravity - this.gravity);
        }

        //back home
        let oDistX = this.x - this.sprite.x;
        let oDistY = this.y - this.sprite.y;


        this.speedX += oDistX * this.gravity;
        this.speedY += oDistY * this.gravity;


        this.speedX *= this.friction;
        this.speedY *= this.friction;

        this.sprite.x += this.speedX;
        this.sprite.y += this.speedY;
    }
}