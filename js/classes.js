class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Circle {

    drawColor = "#ff0000";

    constructor(pos, radius) {
        this.pos = pos;
        this.radius = radius;
    }

    draw() {
        ctx.beginPath();
        ctx.strokeStyle = this.drawColor;
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.stroke();
        ctx.strokeStyle = "#000000";
    }

}

class Line {

}

class Triangle {

    color = "#ff0000";
    circumcenter = new Vector2(0, 0);
    circumcircle = 0;

    /**
     * @param {Vector2} pointA
     * @param {Vector2} pointB 
     * @param {Vector2} pointC 
     */
    constructor(pointA, pointB, pointC) {
        this.pointA = pointA;
        this.pointB = pointB;
        this.pointC = pointC;


        ctx.beginPath();
        ctx.moveTo(pointA.x, 0);
        ctx.lineTo(pointA.x, 100000);
        ctx.closePath();
        ctx.stroke();
        ctx.strokeStyle = "#000000";

        // y = -(1/s_AB) * x - m_AB.x


    }

    draw() {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.moveTo(this.pointA.x, this.pointA.y);
        ctx.lineTo(this.pointB.x, this.pointB.y);
        ctx.lineTo(this.pointC.x, this.pointC.y);
        ctx.closePath();
        ctx.stroke();
        ctx.strokeStyle = "#000000";
    }

}

class Rectangle {

    /**
     * @param {Vector2} pos Position (x,y).
     * @param {Number} height Height.
     * @param {Number} width Width.
     */
    constructor(pos, height, width) {
        this.pos = pos;
        this.height = height;
        this.width = width;
    }
    
    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
        ctx.closePath();
        ctx.beginPath();
        ctx.strokeStyle = "#000000";
        ctx.rect(this.pos.x, this.pos.y, this.width, this.height);
        ctx.closePath();
        ctx.stroke();


        ctx.fillStyle = "#000000";
    }

}



class Room extends Rectangle{

    type = "NormalRoom";
    color = "#3C6A6E";
    center = undefined;
    isSleeping = true;

    /**
     * @param {Vector2} pos Position (x,y).
     * @param {Number} height Height.
     * @param {Number} width Width.
     */
    constructor(pos, height, width) {

        super(pos, height, width);

        this.pos.x = (Math.round(this.pos.x / 10)) * 10;
        this.pos.y = (Math.round(this.pos.y / 10)) * 10;
        this.center = new Vector2((this.pos.x + (this.width / 2)), (this.pos.y + (this.height / 2)));
    }

    update() {
        if (this.type == "NormalRoom") {
            this.color = "#3C6A6E";
        } else if (this.type == "MainRoom") {
            this.color = "#3BBC6F";
        }

        this.pos.x = (Math.round(this.pos.x / 10)) * 10;
        this.pos.y = (Math.round(this.pos.y / 10)) * 10;
        this.center.x = (this.pos.x + (this.width) / 2);
        this.center.y = (this.pos.y + (this.height) / 2);



        //Dåligt men fungerande implementation av kollisions koll.
        if (STATE == "STEP1") {
            
            rooms.forEach(room => {
                //Flagga så att jag inte kollar mot samma rektangel...
                if (this == room) {
                    return;
                }

                //Simpel kollision koll mellan två rektanglar.
                if (
                    ((this.pos.x + this.width) > room.pos.x && this.pos.x < (room.pos.x + room.width)) &&
                    ((this.pos.y + this.height) > room.pos.y && this.pos.y < (room.pos.y + room.height))
                ) {
                    //Rektanglarna kolliderar, skicka till collisionResolution() för att lösa kollisionen.
                    resolveCollision(this, room);

                    //Visuell idikator för objekten som kolliderar.
                    this.color = "#ff0000";
                    room.color = "#ff0000";
                    this.isSleeping = false;
                    room.isSleeping = false;
                } else {
                    this.isSleeping = true;
                }
            });
        }
    }

}

class Point {
    constructor(pos) {
        this.pos = pos;
    }

    draw() {
        ctx.beginPath();
        ctx.fillRect(this.pos.x - 2, this.pos.y - 2, 4, 4);
        ctx.closePath();
        ctx.stroke();
    }
}