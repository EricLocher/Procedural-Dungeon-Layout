//Funktion som returnerar en random uniformt integer som faller mellan två givna nummer.
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

/**
 *  generateGaussian() funktionen är tagen från https://discourse.psychopy.org/t/javascript-gaussian-function/17724/2 
 *  Jag har ändrat på den lite för att få ett värde mellan två givna nummer.
 */

/**
 * Returnerar ett Gaussian nummer som faller mellan två givna nummer. Standard Deviation anger hur "bred" fördelningen skall vara.
 * 
 * @param {Number} min Min Value.
 * @param {Number} max Max Value.
 * @param {Number} std Standard deviation.
 * @returns Gaussian number.
 */
function generateGaussian(min, max, std) {
    while (true) {
        let mean = (min + max) / 2
        var _2PI = Math.PI * 2;
        var u1 = Math.random();
        var u2 = Math.random();

        var z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(_2PI * u2);
        var z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(_2PI * u2);

        var retVal = z0 * std + mean;
        if (retVal > min && retVal < max) {
            return retVal;
        }
    }
}

/**
 * Funktion är för att lösa en kollision mellan två **rektanglar**.            
 * **OBS!** Denna funktionen invålverar inte velocitet.
 * 
 * @param {Rectangle} rect1 One of the colliding rectangles.
 * @param {Rectangle} rect2 The other colliding rectangles.
 */
function resolveCollision(rect1, rect2) {

    let xDiff, yDiff;
    xDiff = Math.abs(rect1.center.x - rect2.center.x);
    yDiff = Math.abs(rect1.center.y - rect2.center.y);

    if (xDiff > yDiff) {
        if (rect1.center.x < rect2.center.x) {
            rect1.pos.x -= 10;
            rect2.pos.x += 10;
        } else {
            rect1.pos.x += 10;
            rect2.pos.x -= 10;
        }
    } else {
        if (rect1.center.y < rect2.center.y) {
            rect1.pos.y -= 10;
            rect2.pos.y += 10;
        } else {
            rect1.pos.y += 10;
            rect2.pos.y -= 10;
        }
    }

}


