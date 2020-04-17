// TODO: THE GRID MUST HAVE ALL ACCESSIBLE POSITIONS
// TODO: THE ROVER MUST ROTATE OVERSIMISM
// TODO: THE ROVER MUST MOVE FORWARD

// GLOBAL VARIABLES
// Define the Object groundGrid with lenght for axis x and y
let groundGrid = {
    horizontalLength: 4,
    verticalLength: 4
};

// Define the Object rover with all properties
let rover = {
    direction: "N",
    position: {x: 0, y:0}
};
// Define the Array directions with all possibilities
let directions = ["N", "E", "S", "W"];


// ACTIONS
// Define the Object groundGridCells with all values for axis x and y

let groundGridCells = [];

for (let indexH = 0; indexH < groundGrid.horizontalLength; indexH++) {
    for (let indexV = 0; indexV < groundGrid.verticalLength; indexV++) {
        groundGridCells.push({ x: indexH, y: indexV });   
    }
}


function moveRover(currentDirection, currentPosition, actionDirection, actionPosition) {
    if (actionDirection == 1 || actionDirection == 2) {
        // TODO: I have created the function using a switch but it does not convince me, since in this case I know the number of addresses and their peculiarities compared to the index array but I think I can debug it in a way that is more efficient for movement in general.
        switch (directions.indexOf(currentDirection)) {
            case 0:
                if (actionDirection == 1) {
                    console.log(actionDirection);
                    rover.direction = directions[directions.length - 1];
                } else {
                    rover.direction = directions[directions.indexOf(currentDirection)+1];
                }
                console.log(rover.direction);
                break;
            case 1:
            case 2:
                if (actionDirection == 1) {
                    console.log(actionDirection);
                    rover.direction = directions[directions.indexOf(currentDirection)-1];
                } else {
                    rover.direction = directions[directions.indexOf(currentDirection)+1];
                }
                console.log(rover.direction);
                break;
            case 3:
                if (actionDirection == 1) {
                    console.log(actionDirection);
                    rover.direction = directions[directions.indexOf(currentDirection)-1];
                } else {
                    rover.direction = directions[0];
                }
                console.log(rover.direction);
                break;
        }
    }
}
// KEY BORAD ACTTIONS
document.onkeydown = checkKey;

function checkKey(e) {
    let event = window.event ? window.event : e;
    // console.log(event.keyCode);
    
    switch (event.keyCode) {
        case 38:
            moveRover(null, rover.position, null, 1);
            break;
        case 40:
            moveRover(null, rover.position, null, 2);
            break;
        case 37:
            moveRover(rover.direction, null, 1, null);
            break;
        case 39:
            moveRover(rover.direction, null, 2, null);
            break;
        default:
            break;
    }
}




