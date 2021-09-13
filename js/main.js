/*
    Detta projektet är inspirerat av konceptet som är beskrivet i denna artikeln: https://www.gamedeveloper.com/programming/procedural-dungeon-generation-algorithm

    All kod är min egen förutom vissa funktioner som är tagna från sidor såsom stackoverflow etc. 
    Vid dessa funktionerna så refererar jag också till författaren/sidan från där koden är tagen.

    Eric Locher 2021-08-31
*/

/* ↓Globala variabler↓ */

var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

let WIDTH = 1600;
let HEIGHT = 900;


/** 
 * PAUSED - TICK IS PAUSED
 * STEP1 - COLLISION
 * STEP2 - TRIANGULATION STEP 1
 * STEP3 - TRIANGULATION STEP 2
 */
let STATE = "PAUSED";
let TIME = new Date();
let FRAMES = 0;
let FPS = 0;
let currentStep = 0;

/* ↑Globala variabler↑ */

//Settings för canvas.
c.height = HEIGHT;
c.width = WIDTH;
c.style.width = WIDTH + "px";
c.style.height = HEIGHT + "px";



var superCircle = new Circle(new Vector2((WIDTH / 2), (HEIGHT / 2)), 100);

//Skapar en array där jag lagrar alla rektanglar.
var rooms = [];

generateRooms();

function generateRooms() {

    //Array för alla generarade punkter
    let points = [];
    //Antalet punkter
    let numberOfPoints = 65;
    //Loopar igenom alla punkter
    for (let i = 0; i < numberOfPoints; i++) {
        let x, y;

        while (true) {
            /**
             * Skapar ett x,y värde för punkten med använding av Math.random()
             * Math.random() ger dig alltid ett uniformt random värde. T.ex. om du generar 100 nummer mellan 1 - 10 så kommer det i genomsnitt vara lika många 1:or som 2:or & 3:or etc.
             */
            x = Math.round(randomInt(superCircle.pos.x - superCircle.radius, superCircle.pos.x + superCircle.radius));
            y = Math.round(randomInt(superCircle.pos.y - superCircle.radius, superCircle.pos.y + superCircle.radius));

            //Ser till så att punkten ligger innuti cirkeln.
            if ((((x - superCircle.pos.x) ** 2) + ((y - superCircle.pos.y) ** 2)) < (superCircle.radius ** 2)) {
                //Lägger till punkten i arrayen.
                points.push(point = new Point(new Vector2(x, y)));
                break;
            }
        }
    }

    // Två variabler för att ta reda på snitt storleken på rektanglarna efter dem har genererats.
    let meanHeight = 0, meanWidth = 0;

    points.forEach(point => {
        /*
            Nu skapar jag random rektangle för varje punkt. aka random längd o bredd.
            Men i detta fallet vill jag inte att datan ska vara uniform, jag vill istället använda mig an en "normal distribution".
            Kort sagt så kommer denna utspridningen göra så att dem flesta rektanglarna är ca samma storlek. Med vissa som devierar från detta.

            Syftet med detta är att få en standard storlek för rektanglarna medans det fortfarande finns ett par som avviker från detta.
        */
        let rectWidth = Math.round(generateGaussian(15, 60, 20));
        let rectHeight = Math.round(generateGaussian(15, 60, 20));

        rectWidth = (Math.round(rectWidth / 10)) * 10;
        rectHeight = (Math.round(rectHeight / 10)) * 10;

        let rectPos = new Vector2((point.pos.x - (rectWidth / 2)), point.pos.y - (rectHeight / 2));
        //Lägger till rektangeln i "rooms" arryen.
        rooms.push(new Room(rectPos, rectHeight, rectWidth));

        meanHeight += rectHeight;
        meanWidth += rectWidth;
    });

    meanHeight = meanHeight / rooms.length;
    meanWidth = meanWidth / rooms.length;

    //Här väljer jag "main rooms", meningen med detta syns senare i programmet.
    rooms.forEach(room => {
        //Jag tar meanHeight och meanWidth x något värde för att hitta dem rummen som ligger något över snittet, alltså dem största rummen.
        if (room.width > (meanWidth * 1.2) && room.height > (meanHeight * 1.2)) {
            room.type = "MainRoom";
        }
    });

    //Pausar renderingen och uppdateringen.
    STATE = "PAUSED";
    render();
    superCircle.draw();
}


function triangulateRooms() {

    STATE = "PAUSED";

    let xMin = WIDTH / 2,
        xMax = WIDTH / 2;
    let yMin = HEIGHT / 2,
        yMax = HEIGHT / 2;

    let mainRooms = [];

    rooms.forEach(room => {
        if (room.type == "MainRoom") {
            mainRooms.push(room);

            if (room.center.x <= xMin) { xMin = room.center.x }
            if (room.center.x >= xMax) { xMax = room.center.x }

            if (room.center.y <= yMin) { yMin = room.center.y }
            if (room.center.y >= yMax) { yMax = room.center.y }

        }
    });

    
    let superRectangle = new Rectangle(new Vector2(xMin, yMin), (yMax - yMin), (xMax - xMin));

    //Skapar en "supertriangle" som innhåller alla punkter som skall trianguleras. Alltså alla main rums mittpunkter.
    let superTriangle = new Triangle(
        new Vector2(superRectangle.pos.x + (superRectangle.width/2), superRectangle.pos.y - superRectangle.height * 1.25),
        new Vector2(superRectangle.pos.x + superRectangle.width*2.25, superRectangle.pos.y + superRectangle.height * 1.25),
        new Vector2(superRectangle.pos.x - superRectangle.width*1.25, superRectangle.pos.y + superRectangle.height * 1.25)
    );

    superTriangle.draw();

    mainRooms.forEach(room => {
        ctx.beginPath();
        ctx.fillStyle = "#000000";
        ctx.fillRect(room.center.x - 2, room.center.y - 2, 4, 4);
        ctx.closePath();
        ctx.stroke();
    });


}



//TESTING

/*for (let i = 0; i < 30; i++) {
    let x = randomInt(500, 600);
    let y = randomInt(500, 600);

    rooms.push(new Room(pos = new Vector2(x, y), 100, 100, 1));
}*/


/*rooms.push(new Room(pos = new Vector2(130, 150), 100, 100, 1));
rooms.push(new Room(pos = new Vector2(130, 100), 100, 100, 2));*/


//TESTING

/* */

//Loop som körs vajre 33ms, ca 30FPS.
setInterval(tick, 50);

function tick() {
    if (STATE != "PAUSED") {
        update();
        render();

        //Fult kodat men ett fungerade sätt att fu fram FPS.
        if ((new Date() - TIME) / 1000 >= 1) {
            TIME = new Date();
            FPS = FRAMES;
            FRAMES = 0;
        }
        FRAMES++;
    }
}

function update() {

    rooms.forEach(room => {
        room.update();
    });

    if (STATE == "STEP1") {
        let sleepCheck = true;
        rooms.forEach(room => {
            if (!room.isSleeping)
                sleepCheck = false;
        });
        if (sleepCheck) {
            STATE = "WAITING";
            setTimeout(function () {
                STATE = "PAUSED";
                console.log("STEP 1 DONE!");
            }, 1500);
        }
    } else if (STATE == "STEP2") {

    }

}

//Rendera alla objekten + fps.
function render() {
    ctx.font = "20px Arial";
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    //superCircle.draw();

    rooms.forEach(room => {
        room.draw();
    });

    if (STATE != "PAUSED" && FPS > 0)
        ctx.fillText(FPS + "FPS", 10, 25);

    /*ctx.beginPath();
    ctx.strokeStyle = "#00FF00";
    ctx.rect(WIDTH / 2, -100, 1, HEIGHT + 100);
    ctx.rect(-100, HEIGHT / 2, WIDTH + 100, 1);
    ctx.stroke();*/
}

function forward() {
    currentStep++;
    STATE = "STEP" + currentStep;
    console.log(STATE);

    if (STATE == "STEP2") {
        triangulateRooms();
    }

}