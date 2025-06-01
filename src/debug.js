/*global p5*/
export default class Debug {
    constructor() {
        this.visisble = false;
    }

    toggleVisibility() {
        this.visisble = !this.visisble;
    }

    drawDebugInfo() {
        push();
        textSize(16);
        fill(255);
        text(
            `x: ${mouseX} y: ${mouseY} pos: (${
                mouseOver ? mouseOver.x + ',' + mouseOver.y : null
            }), zoom: ${zoom} cam x: ${camPos.x}, cam y: ${camPos.y}`,
            20,
            20,
            200,
            200
        );
        pop();
    }

    drawDebug() {
        push();
        // Grid
        stroke(0);
        for (let i = 0; i < width; i += 100) {
            line(i, 0, i, height);
        }
        for (let i = 0; i < height; i += 100) {
            line(0, i, width, i);
        }
        // Camera position
        noStroke();
        fill('yellow');
        translate(camPos.x, camPos.y);
        ellipse(0, 0, 10);
        pop();
    }
}
