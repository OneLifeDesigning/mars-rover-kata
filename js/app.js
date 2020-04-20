// 01 // VARIABLES, LOS OBJECTOS Y ARRAYS GERNERALES

// Objeto que contine el número de celdas en x e y.
let matrixGrid = {
    xCells: 10,
    yCells: 10
};

//  Variables que contienen los datos de ancho y alto de la ventana para renderizar objetos del DOM
let windowX = window.innerWidth;
let windowY = window.innerHeight;


// Creo una condición para hacer que el elemto padre de las celdas sea cuadrado 
let maxSize;

if (windowY > windowX) {
    maxSize = windowX; 
} else {
    maxSize = windowY;
}
// Limito el tamaño máxiomo para dejar espacio al header
// TODO: Queda pendiente tomar el tamaño real del header
maxSize = maxSize-50;

// Objeto con las propiedades base de las celdas
let cellProperties = { 
    // Ajusto el alto y ancho al al
    width: (maxSize/matrixGrid.xCells)-7,
    height: (maxSize/matrixGrid.yCells)-7,
    bgColor: "#eaeaea",
    borderColor: "#f5f5f5"
}

// Objeto con las propiedades base del rover
// TODO: Tendré que cambiarlo para hacer que puedan ser varios rover de forma simultanea
let rover = {
    name: "Serenity 1",
    sulg: "serenity-1",
    width: "20",
    height: "20",
    bgColor: "#F30",
    borderColor: "#f2f2f2",
    // Posicionamos el elemento
    top: ((maxSize/matrixGrid.yCells)-30)/2,
    right: ((maxSize/matrixGrid.yCells)-30)/2,
    bottom: ((maxSize/matrixGrid.yCells)-30)/2,
    left: ((maxSize/matrixGrid.yCells)-30)/2,
    // Valores inciales de dirección y posición
    direction: "N",
    position: {x: 0, y:0}
};

// Array con todas las direcciones posibles
let directions = ["N", "E", "S", "W"];

// 02 // MATRIZ

// Declaro el array matrix que contendrá la matriz bidimensional con los ejex x e y 
let matrix = [];

// Creo un doble bucle que recorre y almacena los valores matrixGrid.xCells y matrixGrid.yCells
for (let indexY = 0; indexY < matrixGrid.yCells; indexY++) {
    for (let indexX = 0; indexX < matrixGrid.xCells; indexX++) {
        // Incluyo en la matriz un array con los valores de los dos index
        matrix.push([indexX, indexY ]);
        // Pintamos en el DOM una celda por cada registro
        document.getElementById('matrix').innerHTML += '<div data-x='+indexX+' data-y='+indexY+' style="width:'+cellProperties.width+'px; height:'+cellProperties.height+'px; border-color:'+cellProperties.borderColor+'; background-color:'+cellProperties.bgColor+';"><h4>['+indexX+' - '+indexY+']</h4></div>';
    }
    // Renderizo el rover cunado se esté almacenado en la matriz y creado el objeto del DOM la última de las celdas 
    if (indexY === matrixGrid.xCells-1) {
        moveRoverDOM(rover);
    }
}

// 03 // MOVIMIENTO DEL ROVER
// Creo una función que recibe cuatro parámetros la dirección y posición del rover y las otras dos las acciones a realizar
function moveRover(currentDirection, currentPosition, actionDirection, actionPosition) {
    // Creo la condición para ejecutar el cambio de dirección
    // Si los valores recibidos en la acción de dirección son los correctos ejecuto la evalución
    if (actionDirection == 1 || actionDirection == 2) {
        // Utilizo el array de direcciones para saber cual es la direccion actual y según el caso que sea hago una acción u otra
        switch (directions.indexOf(currentDirection)) {
            case 0:
                if (actionDirection == 1) {
                    rover.direction = directions[directions.length - 1];
                } else {
                    rover.direction = directions[directions.indexOf(currentDirection)+1];
                }
                // Actualizamos los cambios del rover en el DOM
                moveRoverDOM(rover);
                // Mandamos los datos de cambio de dirección al registro
                logMove(rover.direction, "changeDirection");
                break;
            case 1:
            case 2:
                if (actionDirection == 1) {
                    rover.direction = directions[directions.indexOf(currentDirection)-1];
                } else {
                    rover.direction = directions[directions.indexOf(currentDirection)+1];
                }
                moveRoverDOM(rover);
                logMove(rover.direction, "changeDirection");
                break;
            case 3:
                if (actionDirection == 1) {
                    rover.direction = directions[directions.indexOf(currentDirection)-1];
                } else {
                    rover.direction = directions[0];
                }
                moveRoverDOM(rover);
                logMove(rover.direction, "changeDirection");
                break;
        }
    // Si los valores recibidos en la acción de posición son los correctos ejecuto la evalución
    } else if (actionPosition == 1 || actionPosition == 2)  {
        // Utilizo la direción actual del rover para saber que comando se va a ejecutar según la orden recibida
        switch (currentDirection) {
            // Cuando la dirección es Norte al recibir el valor 1 avanza (suma) y con el valor 2 retrocede (resta) en el eje Y
            case "N":
                // Cuando la dirección es Sur al recibir el valor 1 avanza (resta) y con el valor 2 retrocede (suma) en el eje Y
                if (actionPosition == 1) {
                    if (currentPosition.y-1 < 0) {
                        errorMove("ERROR BACKWARD ROVER go over the grid");
                    } else {
                        rover.position.y = currentPosition.y-1;
                        moveRoverDOM(rover);
                    }
                } else {
                    if (currentPosition.y+1 < matrixGrid.yCells) {
                        rover.position.y = currentPosition.y+1;
                        moveRoverDOM(rover);
                    } else {
                        errorMove("ROVER FORWARD go over the grid");
                    }
                }
                logMove(rover.position, "changePosition");
                break;                
            case "E":
                // Cuando la dirección es Este al recibir el valor 1 avanza (suma) y con el valor 2 retrocede (resta) en el eje X
                if (actionPosition == 1) {
                    if (currentPosition.x+1 < matrixGrid.xCells) {
                        rover.position.x = currentPosition.x+1;
                        moveRoverDOM(rover);
                    } else {
                        errorMove("ROVER FORWARD go over the grid");
                    }
                } else {                    
                    if (currentPosition.x-1 < 0) {
                        errorMove("ERROR BACKWARD ROVER go over the grid");
                    } else {
                        rover.position.x = currentPosition.x-1;
                        moveRoverDOM(rover);
                    }
                }
                logMove(rover.position, "changePosition");
                break;
            case "S":
                if (actionPosition == 1) {
                    // Creo condición para que al sumar no se pueda salir de la matriz calculando si el valor sumado es igual o menor que el total de celdas 
                    if (currentPosition.y+1 < matrixGrid.yCells) {
                        rover.position.y = currentPosition.y+1;
                        moveRoverDOM(rover);
                    } else {
                        errorMove("ROVER FORWARD go over the grid");
                    }
                } else {
                    if (currentPosition.y-1 < 0) {
                        errorMove("ERROR BACKWARD ROVER go over the grid");
                    } else {
                        rover.position.y = currentPosition.y-1;
                        moveRoverDOM(rover);
                    }
                }
                logMove(rover.position, "changePosition");
                break;
            case "W":
                // Cuando la dirección es Oeste al recibir el valor 1 avanza (resta) y con el valor 2 retrocede (suma) en el eje X
                if (actionPosition == 1) {
                    if (currentPosition.x-1 < 0) {
                        errorMove("ERROR BACKWARD ROVER go over the grid");
                    } else {
                        rover.position.x = currentPosition.x-1;
                        moveRoverDOM(rover);
                    }
                } else {
                    if (currentPosition.x+1 < matrixGrid.xCells) {
                        rover.position.x = currentPosition.x+1;
                        moveRoverDOM(rover);
                    } else {
                        errorMove("ROVER FORWARD go over the grid");
                    }
                }
                logMove(rover.position, "changePosition");
                break;
        
            default:
                break;
        }   
    } else {
        errorMove("Unknown Command");
    }
}

function moveRoverDOM(rover) {
    // Elimino el rover de donde está
    if(document.getElementById(rover.slug) != null) {
        document.getElementById(rover.slug).remove();
    }
    // Incluimos el rover en la nueva posición
    document.querySelector('[data-x="'+rover.position.x+'"][data-y="'+rover.position.y+'"]').innerHTML +=  '<div id="'+rover.slug+'" class="rover" style="width:'+rover.width+'px; height:'+rover.height+'px; border-color:'+rover.borderColor+'; background-color:'+rover.bgColor+'; bottom:'+rover.bottom+'px; top:'+rover.top+'px; left:'+rover.left+'px; right:'+rover.right+'px;"><span class="'+rover.direction.toLowerCase()+'">'+rover.direction+'</span></div>';
}
// 04 // ERRORES Y LOG
// MENSAJE EN CONSOLA CUANDO EL ROVER SALE FUERA DE LA MATRIZ O SE EJECUTA UNA ORDEN
function errorMove(msg) {
    console.log(msg);
}

// ALMACENA UN REGISTRO CON LOS MOVIMIENTOS QUE HACE EL ROVER
let travelLog = [];

function logMove(actionMove, typeMove) {
    if (typeMove === "changeDirection") {
        travelLog.push({ type: typeMove, data: actionMove});
    } else {
        travelLog.push({ type: typeMove, data: Object.entries(actionMove)});
    }  
}

// 05 // ACCIONES DE USUARIO

// CAPTURA LAS ACCIONES DEL USUARIO PRESIONANDO TECLAS DE DIRECCIÓN DEL TECLADO
window.addEventListener("keydown", function (event) {
  
    if (event.key !== undefined) {
      // Handle the event with KeyboardEvent.key and set handled true.
      switch (event.keyCode) {
          case 38:
              moveRover(rover.direction, rover.position, null, 1);
              break;
          case 40:
              moveRover(rover.direction, rover.position, null, 2);
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
  }, true);

// CARGO LA MATRIZ EN EL DOOM
function loadDOM() {
    document.getElementById('matrix').style.cssText = 'width:'+maxSize+'px; height:'+maxSize+'px';
}
window.onload = loadDOM();