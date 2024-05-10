var snakeCanvas = document.querySelector("canvas#snake");
var snakeCtx = snakeCanvas.getContext("2d");

if (localStorage['maxScore'] == undefined || typeof localStorage['maxScore'] !== 'number') {
    localStorage.setItem('maxScore', ''+localStorage['maxScore'].toString());
}

snakeCtx.beginPath();

// for (let y = 0; y < 16; y += 1) {
//     for (let x = 0; x < 16; x += 1) {
//         snakeCtx.fillStyle = "rgb(" + y*16 + ", 0, " + x*16 + ")";
//         snakeCtx.fillRect(x-8, y-8, x, y);
//     }
//     snakeCtx.stroke();
// }

dotSize = 32;

areaWidth = 16;
areaHeight = 16;

function debugPrint(text) {
    // document.querySelector("debug").innerHTML += "<br>" + text;

}

snake_body = [[13, 8], [12, 8], [11, 8], [10, 8], [9, 8], [8, 8]];
apple_coords = [3, 3]
snakeNextVector = "none";
snakeVector = "left";

document.onkeydown = function (e) {
    e = e || window.event;
    // use e.keyCode
    // console.log(e);

    if (e.key == "ArrowUp" && snakeVector != "down") {
        snakeNextVector = "up";
    } 
    else if (e.key == "ArrowDown" && snakeVector != "up") {
        snakeNextVector = "down";
    } 
    else if (e.key == "ArrowLeft" && snakeVector != "right") {
        snakeNextVector = "left";
    } 
    else if (e.key == "ArrowRight" && snakeVector != "left") {
        snakeNextVector = "right";
    } 
};

function gameOver() {
    alert("Game over\nМи пожаліємо твої очі");
    let body = document.querySelector("body");
    // body.innerHTML = ""
    // setInterval(function() {
    //     body.style.background = "#f00";
    // }, 100);
    // setTimeout(function() {
    //     setInterval(function() {
    //         body.style.background = "#0f0";
    //     }, 100);
    // }, 50);
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }

function drawSnake() {
    snakeCtx.fillStyle = "rgb(255, 255, 255)";
    snakeCtx.fillRect(0, 0, areaWidth*dotSize, areaHeight*dotSize);
    snake_body.forEach((elem, index) => {
        snakeCtx.fillStyle = "rgb(0, 0, 0)";
        snakeCtx.fillRect(elem[0]*dotSize, elem[1]*dotSize, dotSize, dotSize);
        debugPrint(elem);
    });
    snakeCtx.fillStyle = "rgb(255, 0, 0)";
    snakeCtx.fillRect(apple_coords[0]*dotSize, apple_coords[1]*dotSize, dotSize, dotSize);
    snakeCtx.stroke();
}
drawSnake();

function updateSnake() {
    let new_x = 0;
    let new_y = 0;

    if (snakeNextVector != "none") {
        snakeVector = snakeNextVector;
        snakeNextVector = "none";
    }

    if (snakeVector == "left") {
        new_x = snake_body[snake_body.length-1][0]-1;
        new_y = snake_body[snake_body.length-1][1];
    }
    else if (snakeVector == "right") {
        new_x = snake_body[snake_body.length-1][0]+1;
        new_y = snake_body[snake_body.length-1][1];
    }
    else if (snakeVector == "up") {
        new_x = snake_body[snake_body.length-1][0];
        new_y = snake_body[snake_body.length-1][1]-1;
    }
    else if (snakeVector == "down") {
        new_x = snake_body[snake_body.length-1][0];
        new_y = snake_body[snake_body.length-1][1]+1;
    }

    if (new_x < 0) new_x += areaWidth;
    if (new_y < 0) new_y += areaHeight;
    if (new_x >= areaWidth) new_x = 0;
    if (new_y >= areaHeight) new_y = 0;
    if (new_x != apple_coords[0] ||
        new_y != apple_coords[1]) {
            snake_body.shift();
        }
    else {
        apple_coords[0] = randInt(0, areaWidth);
        apple_coords[1] = randInt(0, areaHeight);
    }

    let old_length = snake_body.length;
    let death_index = snake_body.findIndex(element => element[0] == new_x && element[1] == new_y);
    if (death_index >= 0) {
        // gameOver();
        snake_body = snake_body.slice(-snake_body.length+death_index+1);

        document.querySelector("alert").innerHTML += `
        <div class="alert alert-danger" role="alert">
            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <strong>You cut urself!</strong> -${old_length - snake_body.length} of score!
        </div>`
        window.setTimeout(function() {
            $(".alert").fadeTo(500, 0).slideUp(500, function(){
                $(this).remove(); 
            });
        }, 2500);
    }
    snake_body.push([new_x, new_y]);
    debugPrint("sss");

    drawSnake();

    if (snake_body.length > localStorage.maxScore) {
        console.log(localStorage['maxScore'])
        console.log("rewrite")
        localStorage.setItem('maxScore', '' + snake_body.length);
    }

    document.querySelector("#score").innerHTML = snake_body.length;
    document.querySelector("#max-score").innerHTML = `Max score: ${localStorage.maxScore}`


}

setInterval(function() {
    updateSnake();
}, 150);

// document.querySelector("body").style.background = "#f0f";