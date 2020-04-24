// 01 // VARIABLES, LOS OBJECTOS Y ARRAYS GERNERALES

// Objeto que contine el número de celdas en x e y.
let matrixGrid = {
    xCells: 10,
    yCells: 10
};

//  Variables que contienen los datos de ancho y alto de la ventana para renderizar objetos del DOM
let windowX = window.innerWidth;
let windowY = window.innerHeight;

// Creo una condición con las medidas para obtener la menor y asegurarme la matriz cabe en la pantalla
let maxSize;

if (windowY > windowX) {
    maxSize = windowX; 
} else {
    maxSize = windowY;
}

//  Para obtener el máximo posible de espacio de matriz resto el espacio que ocupa el header
let header = document.getElementsByTagName("header");

let headerH = header[0].offsetHeight;

maxSize = (maxSize-headerH)-10;

// TODO: Si hubiera más objetos ocupando espacio tendríamos que añadirlos dependiendo las los tamaños de pantalla.

// Objeto con las propiedades base de las celdas
let cellProperties = { 
    // Ajusto el alto y ancho de las celdas de la matriz tomando el máximo posible dividiendolo entre el número de celdas y le resto unos píxeles para dejar márgenes entre ellas
    width: (maxSize/matrixGrid.xCells)-6,
    height: (maxSize/matrixGrid.yCells)-6,
    bgColor: "#eaeaea",
    bgNoAccess: "#999",
    borderColor: "#f5f5f5"
}

let terrain = {
    hard: 60,
    medium: 40,
    easy: 15
}


// Objeto con las propiedades base del rover
// TODO: Tendré que cambiarlo para hacer que puedan ser varios rover de forma simultanea
let rover = {
    name: "Serenity 1",
    slug: "serenity-1",
    width: 25,
    height: 25,
    bgColor: "#F30",
    borderColor: "#f2f2f2",
    // Posicionamos el elemento
    top: ((maxSize/matrixGrid.yCells)-20)/2,
    right: ((maxSize/matrixGrid.yCells)-30)/2,
    bottom: ((maxSize/matrixGrid.yCells)-30)/2,
    left: ((maxSize/matrixGrid.yCells)-30)/2,
    // Valores inciales de dirección y posición
    direction: "E",
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
        // BONUS: Para los obstaculos creo la variable access que almacenara si se puede o no acceder y tambien el color que tendra en el DOM cada celda dependiendo de su estado de acceso
        let access, bgCell;
        
        // Aquí creo un random de la cantidad de celdas que hay en total
        let rand = Math.floor(Math.random() * matrixGrid.xCells*matrixGrid.yCells);
        
        // Aquí comparamos el rand con eltipo de terreno que es lo que nos devuelve el objeto terrain el cual molaria seleccionarlo aleatoriamente al cargar. Y tambien decimos que no sea ni el eje X0 ni Y0 para poder mover el rover. Nota: Esto se puede evitar creando una función que al cargar el rover por primera vez vea la celda en la que va a cargar y si no es accesible ninguna accesible a su alrededor ejecute un bucle for desplazandolo hasta que encuentre una accesible pero tampoco garantizaría que el rover pudiera moverse ya que el random podría crear un punto accesible rodeado de no accesibles y digo yo que los señores de la NASA no lo mandarían aterrizar en un crater si no tiene forma de ir más allá en todo caso, si se podría dar la situación y la missión hubiera sido un fracaso total XD.
        
        if (rand <= terrain.medium && indexY != 0 && indexX != 0) {
            access = 0;
            bgCell = cellProperties.bgNoAccess;
        } else {
            access = 1;
            bgCell = cellProperties.bgColor;
        }

        // Incluyo en la matriz un array con los valores de los dos index
        matrix.push([indexX, indexY, access ]);

        // Cargamos en el DOM una celda por cada registro
        document.getElementById('matrix').innerHTML += '<div data-access='+access+' data-x='+indexX+' data-y='+indexY+' style="width:'+cellProperties.width+'px; height:'+cellProperties.height+'px; border-color:'+cellProperties.borderColor+';'+'background-color:'+bgCell+';"><h4>['+indexX+' - '+indexY+']</h4></div>';
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
                updateRoverDOM(rover, 0);
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
                updateRoverDOM(rover, 0);
                logMove(rover.direction, "changeDirection");
                break;
            case 3:
                if (actionDirection == 1) {
                    rover.direction = directions[directions.indexOf(currentDirection)-1];
                } else {
                    rover.direction = directions[0];
                }
                updateRoverDOM(rover, 0);
                logMove(rover.direction, "changeDirection");
                break;
        }
    // Si los valores recibidos en la acción de posición son los correctos ejecuto la evalución
    } else if (actionPosition == 1 || actionPosition == 2)  {
        // Antes de mover el rover deberiamos saber si la siguiente celda es accesible obtenemos su destino chequeo que se pueda mover y ejecuto las acciones
        if (nextCell != null && nextCell.getAttribute('data-access') == 1) {
            // Utilizo la direción actual del rover para saber que comando se va a ejecutar según la orden recibida
            switch (currentDirection) {
                // Cuando la dirección es Norte al recibir el valor 1 avanza (suma) y con el valor 2 retrocede (resta) en el eje Y
                case "N":
                    if (actionPosition == 1) {
                        if (currentPosition.y-1 < 0) {
                            errorMove("ERROR BACKWARD ROVER go over the grid");
                        } else {
                            rover.position.y = currentPosition.y-1;
                            updateRoverDOM(rover, 0);
                        }
                    } else {
                        if (currentPosition.y+1 < matrixGrid.yCells) {
                            rover.position.y = currentPosition.y+1;
                            updateRoverDOM(rover, 0);
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
                            updateRoverDOM(rover, 0);
                        } else {
                            errorMove("ROVER FORWARD go over the grid");
                        }
                    } else {                    
                        if (currentPosition.x-1 < 0) {
                            errorMove("ERROR BACKWARD ROVER go over the grid");
                        } else {
                            rover.position.x = currentPosition.x-1;
                            updateRoverDOM(rover, 0);
                        }
                    }
                    logMove(rover.position, "changePosition");
                    break;
                case "S":
                    // Cuando la dirección es Sur al recibir el valor 1 avanza (resta) y con el valor 2 retrocede (suma) en el eje Y
                    if (actionPosition == 1) {
                        // Creo condición para que al sumar no se pueda salir de la matriz calculando si el valor sumado es igual o menor que el total de celdas 
                        if (currentPosition.y+1 < matrixGrid.yCells) {
                            rover.position.y = currentPosition.y+1;
                            updateRoverDOM(rover, 0);
                        } else {
                            errorMove("ROVER FORWARD go over the grid");
                        }
                    } else {
                        // Creo condición para que al sumar no se pueda salir de la matriz calculando si el valor sumado es igual o menor que el total de celdas 
                        if (currentPosition.y-1 < 0) {
                            errorMove("ERROR BACKWARD ROVER go over the grid");
                        } else {
                            rover.position.y = currentPosition.y-1;
                            updateRoverDOM(rover, 0);
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
                            updateRoverDOM(rover, 0);
                        }
                    } else {
                        if (currentPosition.x+1 < matrixGrid.xCells) {
                            rover.position.x = currentPosition.x+1;
                            updateRoverDOM(rover, 0);
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
            updateRoverDOM(rover, 1);
        }
    } else {
        errorMove("Unknown Command");
    }
}

function updateRoverDOM(rover, error) {
    let roverSeleted = document.getElementById(rover.slug);
    if (error == 1) {
        // Quitamos y ponemos la clase error
        roverSeleted.classList.add('error');
        setTimeout(() => {
            roverSeleted.classList.remove('error');
        }, 1000);
    } else {
        // Elimino el rover de donde está para actualizarlo con los nuevos datos.
        //  Creo una condición para que si es diferente de nulo lo borre, nulo sera la primera vez que se inicia 
        if(roverSeleted != null) {
            roverSeleted.remove();
        }
        // Actualizamos la marca de las celdas siguientes donde se va a mover el rover
        nextCellDOM(rover);
        // Incluimos el rover en la nueva posición
        document.querySelector('[data-x="'+rover.position.x+'"][data-y="'+rover.position.y+'"]').innerHTML +=  '<div id="'+rover.slug+'" class="rover" style="width:'+rover.width+'px; height:'+rover.height+'px; border-color:'+rover.borderColor+'; background-color:'+rover.bgColor+'; bottom:'+rover.bottom+'px; top:'+rover.top+'px; left:'+rover.left+'px; right:'+rover.right+'px;"><span class="'+rover.direction.toLowerCase()+'">'+rover.direction+'</span></div>';
    }
}

// Actualizar celda siguiente que moverá el rover en la matriz

// Defino la variable oldCell de forma global en el alcance para que almacene el valor de la anterior posición activa y la actualize cuando haya una nueva celda 
let oldCell;

// Defino la variable para la celda siguien te se moverá el rover
let nextCell;
function nextCellDOM(currentRover) {
    // Creo la condiciondiciones en las que se vasará el movimiento
    switch (currentRover.direction) {
        case "N":
            nextCell = document.querySelector('[data-x="'+(currentRover.position.x)+'"][data-y="'+(currentRover.position.y-1)+'"]');
            break;
        case "E":            
            nextCell = document.querySelector('[data-x="'+(currentRover.position.x+1)+'"][data-y="'+currentRover.position.y+'"]');
            break;
        case "S":
            nextCell = document.querySelector('[data-x="'+currentRover.position.x+'"][data-y="'+(currentRover.position.y+1)+'"]');
            break;
        case "W":
            nextCell = document.querySelector('[data-x="'+(currentRover.position.x-1)+'"][data-y="'+currentRover.position.y+'"]');
            break;
        default:
            break;
    }
    // Si ya se ha movido el rover la celda anterior debe volver a su anterior estado
    if (oldCell != null) {
        if (oldCell.getAttribute('data-access') == 1) {
            oldCell.style.backgroundColor = cellProperties.bgColor;
        } else {
            oldCell.style.backgroundColor = cellProperties.bgNoAccess;    
        }
    }
    // Cambiamos el elemento del DOM para ver si se puede mover o no
    if (nextCell != null) {
        if (nextCell.getAttribute('data-access') == 1) {
            nextCell.style.backgroundColor = 'green';
        } else {
            nextCell.style.backgroundColor = 'red';    
        }
        oldCell = nextCell;    
    }

}

// 04 // ERRORES Y LOG
// MENSAJE EN CONSOLA CUANDO EL ROVER SALE FUERA DE LA MATRIZ O SE EJECUTA UNA ORDEN
function errorMove(msg) {
    updateRoverDOM(rover, 1);
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

// CAPTURA LA ACCIÓN DEL FORMULARIO DE INSTRUCCIONES
document.getElementById('formInstructions').addEventListener("submit", function () {
    let instructionsMove = document.getElementById('instructions').value;
    
    for (let index = 0; index < instructionsMove.length; index++) {
        let instruction = instructionsMove[index].toUpperCase();
        switch (instruction) {
            case "F":
                moveRover(rover.direction, rover.position, null, 1);
            break;
            
            case "R":
                moveRover(rover.direction, null, 2, null);
                break;
                
            case "B":
                moveRover(rover.direction, rover.position, null, 2);
                break;

            case "L":
                moveRover(rover.direction, null, 1, null);
                break;
        
            default:
                console.log(instruction+": Are Unknown Instrusction");            
                break;
        }
    }
}, true);


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

// Cargo los elementos del DOM
function loadDOM() {
    // Buscamos el id del padre 
    document.getElementById('matrix').style.cssText = 'width:'+maxSize+'px; height:'+maxSize+'px';
    
    // Llamamos la función para cargar el rover
    updateRoverDOM(rover, 0);
}
window.onload = loadDOM();