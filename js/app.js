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
    bgAccess: "green",
    bgNoAccess: "red",
    bgObstacle: "#999",
    borderColor: "#f5f5f5"
}

let terrainDificulty = {
    hard: 60,
    medium: 40,
    easy: 15
}

let terrainTypeDOM = 'medium';

// Objeto con las propiedades base del rover
let rovers = [
    serenityOne = {
        name: "Serenity 1",
        slug: "serenity-1",
        width: 25,
        height: 25,
        bgColor: "#444",
        borderColor: "#4444",
        // Posicionamos el elemento
        top: ((maxSize/matrixGrid.yCells)-20)/2,
        right: ((maxSize/matrixGrid.yCells)-30)/2,
        bottom: ((maxSize/matrixGrid.yCells)-30)/2,
        left: ((maxSize/matrixGrid.yCells)-30)/2,
        // Valores inciales de dirección y posición
        direction: "E",
        position: {x: 0, y:0},
        // Valor inicial de su estado activo o deasactivado
        active: 1
    },
    serenityTwo = {
        name: "Serenity 2",
        slug: "serenity-2",
        width: 25,
        height: 25,
        bgColor: "#777",
        borderColor: "#777",
        // Posicionamos el elemento
        top: ((maxSize/matrixGrid.yCells)-20)/2,
        right: ((maxSize/matrixGrid.yCells)-30)/2,
        bottom: ((maxSize/matrixGrid.yCells)-30)/2,
        left: ((maxSize/matrixGrid.yCells)-30)/2,
        // Valores inciales de dirección y posición
        direction: "E",
        position: {x: 0, y:0},
        active: 0
    },
    serenityThree = {
        name: "Serenity 3",
        slug: "serenity-3",
        width: 25,
        height: 25,
        bgColor: "#000",
        borderColor: "#000",
        // Posicionamos el elemento
        top: ((maxSize/matrixGrid.yCells)-20)/2,
        right: ((maxSize/matrixGrid.yCells)-30)/2,
        bottom: ((maxSize/matrixGrid.yCells)-30)/2,
        left: ((maxSize/matrixGrid.yCells)-30)/2,
        // Valores inciales de dirección y posición
        direction: "E",
        position: {x: 0, y:0},
        active: 0
    }
];

// Declaro el la variable active rover que contiene el rover en uso no, por ahora no más de uno simultaneamente 
let activeRover;

// Array con todas las direcciones posibles
let directions = ["N", "E", "S", "W"];

// 02 // MATRIZ

// Declaro el array matrix que contendrá la matriz bidimensional con los ejes x e y 
let matrix = [];

function getValueByKey(object, value) { 
    for (var prop in object) { 
        if (prop === value) { 
            return object[prop]; 
        } 
    } 
} 

function loadMatrix(terrainType) {
    // Creo un doble bucle que recorre y almacena los valores matrixGrid.xCells y matrixGrid.yCells
    for (let indexY = 0; indexY < matrixGrid.yCells; indexY++) {
        for (let indexX = 0; indexX < matrixGrid.xCells; indexX++) {
            // BONUS: Para los obstaculos creo la variable access que almacenara si se puede o no acceder y tambien el color que tendra en el DOM cada celda dependiendo de su estado de acceso
            let ocupped, access, bgCell;
            
            // BONUS: Para los rovers creo un bucle forEach que recoree el arrray de objetos y obtiene el rover que esté activo
            rovers.forEach(roverElemt => {
                if (roverElemt.active == 1) {
                    activeRover = roverElemt;
                }  
            });

            if (activeRover.position.x == indexX && activeRover.position.y == indexX ) {
                ocupped = 1;
            } else {
                ocupped = 0;
            }
            // Aquí creo un random de la cantidad de celdas que hay en total
            let rand = Math.floor(Math.random() * matrixGrid.xCells*matrixGrid.yCells);
            
            // Aquí comparamos el rand con el tipo de terreno que es lo que nos devuelve el objeto terrainDificulty el cual molaria seleccionarlo aleatoriamente al cargar. Y tambien decimos que no sea ni el eje X0 ni Y0 para poder mover el activeRover. Nota: Esto se puede evitar creando una función que al cargar el rover por primera vez vea la celda en la que va a cargar y si no es accesible ninguna accesible a su alrededor ejecute un bucle for desplazandolo hasta que encuentre una accesible pero tampoco garantizaría que el rover pudiera moverse ya que el random podría crear un punto accesible rodeado de no accesibles y digo yo que los señores de la NASA no lo mandarían aterrizar en un crater si no tiene forma de ir más allá en todo caso, si se podría dar la situación y la missión hubiera sido un fracaso total XD.
        
          
            terrrainSelect = getValueByKey(terrainDificulty, terrainType); 
            
            if (rand <=  terrrainSelect &&  indexY != 0 && indexX != 0) {
                access = 0;
                bgCell = cellProperties.bgObstacle;
            } else {
                access = 1;
                bgCell = cellProperties.bgColor;
            }

            // Incluyo en la matriz un array con los valores de los dos index
            matrix.push([indexX, indexY, access, ocupped ]);

            // Cargamos en el DOM una celda por cada registro
            document.getElementById('matrix').innerHTML += '<div data-ocupped='+ocupped+' data-access='+access+' data-x='+indexX+' data-y='+indexY+' style="width:'+cellProperties.width+'px; height:'+cellProperties.height+'px; border-color:'+cellProperties.borderColor+';'+'background-color:'+bgCell+';"><h4>['+indexX+' - '+indexY+']</h4></div>';
        }
    }
}


// 03 // MOVIMIENTO DEL ROVER
// Creo una función que recibe cuatro parámetros la dirección y posición del rover y las otras dos las acciones a realizar
function moveRover(currentDirection, currentPosition, changeDirection, changePosition) {
    // Creo la condición para ejecutar el cambio de dirección
    // Si los valores recibidos en la acción de dirección son los correctos ejecuto la evalución
    if (changeDirection == 1 || changeDirection == 2) {
        // Utilizo el array de direcciones para saber cual es la direccion actual y según el caso que sea hago una acción u otra
        switch (directions.indexOf(currentDirection)) {
            case 0:
                if (changeDirection == 1) {
                    activeRover.direction = directions[directions.length - 1];
                } else {
                    activeRover.direction = directions[directions.indexOf(currentDirection)+1];
                }
                // Actualizamos los cambios del rover en el DOM
                updateRoverDOM(activeRover, 0);
                // Mandamos los datos de cambio de dirección al registro
                logMove(activeRover.name, activeRover.direction, "changeDirection");
            break;
            case 1:
            case 2:
                if (changeDirection == 1) {
                    activeRover.direction = directions[directions.indexOf(currentDirection)-1];
                } else {
                    activeRover.direction = directions[directions.indexOf(currentDirection)+1];
                }
                updateRoverDOM(activeRover, 0);
                logMove(activeRover.name, activeRover.direction, "changeDirection");
            break;
            case 3:
                if (changeDirection == 1) {
                    activeRover.direction = directions[directions.indexOf(currentDirection)-1];
                } else {
                    activeRover.direction = directions[0];
                }
                updateRoverDOM(activeRover, 0);
                logMove(activeRover.name, activeRover.direction, "changeDirection");
            break;
        }
    // Si los valores recibidos en la acción de posición son los correctos ejecuto la evalución
    } else if (changePosition == 1 || changePosition == 2)  {          
        // Utilizo la direción actual del rover para saber que comando se va a ejecutar según la orden recibida
        switch (currentDirection) {
            // Cuando la dirección es Norte al recibir el valor 1 avanza (suma) y con el valor 2 retrocede (resta) en el eje Y
            case "N":
                if (nextCellForward != null && nextCellForward.getAttribute('data-ocupped') == 0 && nextCellForward.getAttribute('data-access') == 1 && changePosition == 1) {
                    if (currentPosition.y-1 < 0) {
                        errorMove("ERROR BACKWARD ROVER go over the grid");
                    } else {
                        activeRover.position.y = currentPosition.y-1;
                        updateRoverDOM(activeRover, 0);
                    }
                } else if (changePosition == 2 && nextCellBackward != null && nextCellBackward.getAttribute('data-access') == 1 && nextCellBackward.getAttribute('data-ocupped') == 0){
                    if (currentPosition.y+1 < matrixGrid.yCells) {
                        activeRover.position.y = currentPosition.y+1;
                        updateRoverDOM(activeRover, 0);
                    } else {
                        errorMove("ROVER FORWARD go over the grid");
                    }
                } else {
                    updateRoverDOM(activeRover, 1);
                }
                logMove(activeRover.name, activeRover.position, "changePosition");
            break;                
            case "E":
                // Cuando la dirección es Este al recibir el valor 1 avanza (suma) y con el valor 2 retrocede (resta) en el eje X
                if (nextCellForward != null && nextCellForward.getAttribute('data-ocupped') == 0 && nextCellForward.getAttribute('data-access') == 1 && changePosition == 1) {
                    if (currentPosition.x+1 < matrixGrid.xCells) {
                        activeRover.position.x = currentPosition.x+1;
                        updateRoverDOM(activeRover, 0);
                    } else {
                        errorMove("ROVER FORWARD go over the grid");
                    }
                } else if (changePosition == 2 && nextCellBackward != null && nextCellBackward.getAttribute('data-access') == 1 && nextCellBackward.getAttribute('data-ocupped') == 0){
                    if (currentPosition.x-1 < 0) {
                        errorMove("ERROR BACKWARD ROVER go over the grid");
                    } else {
                        activeRover.position.x = currentPosition.x-1;
                        updateRoverDOM(activeRover, 0);
                    }
                } else {
                    updateRoverDOM(activeRover, 1);
                }
                logMove(activeRover.name, activeRover.position, "changePosition");
            break;
            case "S":
                // Cuando la dirección es Sur al recibir el valor 1 avanza (resta) y con el valor 2 retrocede (suma) en el eje Y
                if (nextCellForward != null && nextCellForward.getAttribute('data-ocupped') == 0 && nextCellForward.getAttribute('data-access') == 1 && changePosition == 1) {
                    // Creo condición para que al sumar no se pueda salir de la matriz calculando si el valor sumado es igual o menor que el total de celdas 
                    if (currentPosition.y+1 < matrixGrid.yCells) {
                        activeRover.position.y = currentPosition.y+1;
                        updateRoverDOM(activeRover, 0);
                    } else {
                        errorMove("ROVER FORWARD go over the grid");
                    }
                } else if (changePosition == 2 && nextCellBackward != null && nextCellBackward.getAttribute('data-access') == 1 && nextCellBackward.getAttribute('data-ocupped') == 0){
                    // Creo condición para que al sumar no se pueda salir de la matriz calculando si el valor sumado es igual o menor que el total de celdas 
                    if (currentPosition.y-1 < 0) {
                        errorMove("ERROR BACKWARD ROVER go over the grid");
                    } else {
                        activeRover.position.y = currentPosition.y-1;
                        updateRoverDOM(activeRover, 0);
                    }
                } else {
                    updateRoverDOM(activeRover, 1);
                }
                logMove(activeRover.name, activeRover.position, "changePosition");
            break;
            case "W":
                // Cuando la dirección es Oeste al recibir el valor 1 avanza (resta) y con el valor 2 retrocede (suma) en el eje X
                if (nextCellForward != null && nextCellForward.getAttribute('data-ocupped') == 0 && nextCellForward.getAttribute('data-access') == 1 && changePosition == 1) {
                    if (currentPosition.x-1 < 0) {
                        errorMove("ERROR BACKWARD ROVER go over the grid");
                    } else {
                        activeRover.position.x = currentPosition.x-1;
                        updateRoverDOM(activeRover, 0);
                    }
                } else if (changePosition == 2 && nextCellBackward != null && nextCellBackward.getAttribute('data-access') == 1 && nextCellBackward.getAttribute('data-ocupped') == 0){
                    if (currentPosition.x+1 < matrixGrid.xCells) {
                        activeRover.position.x = currentPosition.x+1;
                        updateRoverDOM(activeRover, 0);
                    } else {
                        errorMove("ROVER FORWARD go over the grid");
                    }
                } else {
                    updateRoverDOM(activeRover, 1);
                }
                logMove(activeRover.name, activeRover.position, "changePosition");
            break;
        
            default:
            break;
        }   
    } else {
        errorMove("Unknown Command");
    }
}

function updateRoverDOM(activeRover, error) {
    let activeRoverDOM = document.getElementById(activeRover.slug);
    if (error == 1) {
        // Quitamos y ponemos la clase error
        activeRoverDOM.classList.add('error');
        setTimeout(() => {
            activeRoverDOM.classList.remove('error');
        }, 1000);
    } else {
        // Elimino el rover de donde está para actualizarlo con los nuevos datos.
        //  Creo una condición para que si es diferente de nulo lo borre, nulo sera la primera vez que se inicia 
        if(activeRoverDOM != null) {
            activeRoverDOM.remove();
            ocuppedCell.setAttribute('data-ocupped', 0);
            ocuppedCell = null;
        }
        ocuppedCell = document.querySelector('[data-x="'+(activeRover.position.x)+'"][data-y="'+(activeRover.position.y)+'"]');
        ocuppedCell.setAttribute('data-ocupped', 1);
        
        // Incluimos el rover en la nueva posición
        ocuppedCell.innerHTML += '<div id="'+activeRover.slug+'" class="rover" style="width:'+activeRover.width+'px; height:'+activeRover.height+'px; border-color:'+activeRover.borderColor+'; background-color:'+activeRover.bgColor+'; bottom:'+activeRover.bottom+'px; top:'+activeRover.top+'px; left:'+activeRover.left+'px; right:'+activeRover.right+'px;"><span class="'+activeRover.direction.toLowerCase()+'">'+activeRover.direction+'</span></div>';

        // Actualizamos la marca de las celdas siguientes donde se va a mover el rover
        selectCellsDOM(activeRover);
    }
}
// Cargar terreno 
function loadTerrainSelector(terrainTypeDOM) {
    let terrainDOM = document.getElementById('terrainForm');
    let terrainValues = Object.values(terrainDificulty);
    let terrainKeys = Object.keys(terrainDificulty);
    
    for (let index = 0; index < terrainValues.length; index++) {
        if (terrainKeys[index] === terrainTypeDOM) {
            terrainDOM.innerHTML += '<div class="radio"><input checked id="'+terrainKeys[index]+'" name="terrainSelect" type="radio" value="'+terrainValues[index]+'"><label for='+terrainKeys[index]+'>'+terrainKeys[index]+'</label></div>';
        } else {
            terrainDOM.innerHTML += '<div class="radio"><input id="'+terrainKeys[index]+'" name="terrainSelect" type="radio" value="'+terrainValues[index]+'"><label for='+terrainKeys[index]+'>'+terrainKeys[index]+'</label></div>';
        }
    }
}
function loadRoversSelector(roverActiveDOM) {
    let roversSelectDOM = document.getElementById('roversSelectorForm');
    for (let index = 0; index < rovers.length; index++) {
        if (rovers[index].slug === roverActiveDOM.slug) {
            roversSelectDOM.innerHTML += '<div class="radio"><input checked id="select'+rovers[index].slug+'" name="roverSelect" type="radio" value="select'+rovers[index].slug+'"><label for='+rovers[index].slug+'>'+rovers[index].name+'</label></div>';
        } else {
            roversSelectDOM.innerHTML += '<div class="radio"><input id="select'+rovers[index].slug+'" name="roverSelect" type="radio" value="select'+rovers[index].slug+'"><label for='+rovers[index].slug+'>'+rovers[index].name+'</label></div>';
        } 
    }
}

// Defino la variable oldCellForward y oldCellBackward de forma global en el alcance para que almacene el valor de la anterior posición activa y la actualize cuando haya una nueva celda si avanza o retrocede el rover 
let oldCellForward;
let oldCellBackward;

// Defino la variable para la celda siguien te se moverá el rover
let nextCellForward;
let nextCellBackward;

// Función para actualizar celda siguiente que moverá el rover en la matriz
function selectCellsDOM(currentRover) {
    // Creo la condiciondiciones en las que se basará el movimiento    
    switch (currentRover.direction) {
        case "N":
            nextCellForward = document.querySelector('[data-x="'+(currentRover.position.x)+'"][data-y="'+(currentRover.position.y-1)+'"]');
            nextCellBackward = document.querySelector('[data-x="'+(currentRover.position.x)+'"][data-y="'+(currentRover.position.y+1)+'"]');
            changeValuesCellsDOM(nextCellForward, nextCellBackward);
            break;
        case "E":            
            nextCellForward = document.querySelector('[data-x="'+(currentRover.position.x+1)+'"][data-y="'+currentRover.position.y+'"]');
            nextCellBackward = document.querySelector('[data-x="'+(currentRover.position.x-1)+'"][data-y="'+currentRover.position.y+'"]');
            changeValuesCellsDOM(nextCellForward, nextCellBackward);
            break;
        case "S":
            nextCellForward = document.querySelector('[data-x="'+currentRover.position.x+'"][data-y="'+(currentRover.position.y+1)+'"]');
            nextCellBackward = document.querySelector('[data-x="'+currentRover.position.x+'"][data-y="'+(currentRover.position.y-1)+'"]');
            changeValuesCellsDOM(nextCellForward, nextCellBackward);
            break;
        case "W":
            nextCellForward = document.querySelector('[data-x="'+(currentRover.position.x-1)+'"][data-y="'+currentRover.position.y+'"]');
            nextCellBackward = document.querySelector('[data-x="'+(currentRover.position.x+1)+'"][data-y="'+currentRover.position.y+'"]');
            changeValuesCellsDOM(nextCellForward, nextCellBackward);
            break;
        default:
            break;
    }
}
function changeValuesCellsDOM(nextCellForward, nextCellBackward) {
    // Si ya se ha movido el rover la celda anterior debe volver a su anterior estado
    if (oldCellForward != null) {
        if (oldCellForward.getAttribute('data-access') == 1) {
            oldCellForward.style.backgroundColor = cellProperties.bgColor;
        } else {
            oldCellForward.style.backgroundColor = cellProperties.bgObstacle;
        }
    }
    // Si ya se ha movido el rover la celda anterior debe volver a su anterior estado
    if (oldCellForward != null) {
        if (oldCellForward.getAttribute('data-access') == 1) {
            oldCellForward.style.backgroundColor = cellProperties.bgColor;
        } else {
            oldCellForward.style.backgroundColor = cellProperties.bgObstacle;
        }
    }
    // Si ya se ha movido el rover la celda anterior debe volver a su anterior estado
    if (oldCellBackward != null) {
        if (oldCellBackward.getAttribute('data-access') == 1) {
            oldCellBackward.style.backgroundColor = cellProperties.bgColor;
        } else {
            oldCellBackward.style.backgroundColor = cellProperties.bgObstacle; 
        }
    }
    // Cambiamos el elemento del DOM para ver si se puede mover o no
    if (nextCellForward != null) {
        if (nextCellForward.getAttribute('data-access') == 1) {
            nextCellForward.style.backgroundColor = cellProperties.bgAccess;
        } else {
            nextCellForward.style.backgroundColor = cellProperties.bgNoAccess; 
        } 
        oldCellForward = nextCellForward;
    }
    // Cambiamos el elemento del DOM para ver si se puede mover o no
    if (nextCellBackward != null) {
        if (nextCellBackward.getAttribute('data-access') == 1) {
            nextCellBackward.style.backgroundColor = cellProperties.bgAccess;
        } else {
            nextCellBackward.style.backgroundColor = cellProperties.bgNoAccess; 
        }
        oldCellBackward = nextCellBackward;
    }

}

// 04 // ERRORES Y LOG
// MENSAJE EN CONSOLA CUANDO EL ROVER SALE FUERA DE LA MATRIZ O SE EJECUTA UNA ORDEN
function errorMove(msg) {
    updateRoverDOM(activeRover, 1);
    console.log(msg);
}

// ALMACENA UN REGISTRO CON LOS MOVIMIENTOS QUE HACE EL ROVER
let travelLog = [];

function logMove(nameRover, actionMove, typeMove) {
    if (typeMove === "changeDirection") {
        travelLog.push({ rover: nameRover, type: typeMove, data: actionMove});
    } else {
        travelLog.push({ rover: nameRover, type: typeMove, data: Object.entries(actionMove)});
    }  
}

// 05 // ACCIONES DE USUARIO

// CAPTURA LA ACCIÓN DEL FORMULARIO DE INSTRUCCIONES
document.getElementById('instructionsForm').addEventListener("submit", function () {
    let instructions = document.getElementById('instructions').value;
    for (let index = 0; index < instructions.length; index++) {
        switch (instructions[index].toUpperCase()) {
            case "F":
                moveRover(activeRover.direction, activeRover.position, null, 1);
            break;
            case "R":
                moveRover(activeRover.direction, null, 2, null);
            break;
            case "B":
                moveRover(activeRover.direction, activeRover.position, null, 2);
            break;
            case "L":
                moveRover(activeRover.direction, null, 1, null);
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
              moveRover(activeRover.direction, activeRover.position, null, 1);
              break;
          case 40:
              moveRover(activeRover.direction, activeRover.position, null, 2);
              break;
          case 37:
              moveRover(activeRover.direction, null, 1, null);
              break;
          case 39:
              moveRover(activeRover.direction, null, 2, null);
              break;
          default:
              break;
      }
    }
  }, true);

// Cargo los elementos del DOM
function loadDOM() {
    // Buscamos el id del padre para la matriz
    document.getElementById('matrix').style.cssText = 'width:'+maxSize+'px; height:'+maxSize+'px';
    // Buscamos lanzamos la carga de la matriz
    loadMatrix(terrainTypeDOM);
    // Buscamos lanzamos los elementos al DOM de selección de terreno
    // loadTerrainSelector(terrainTypeDOM);
    // Buscamos lanzamos los elementos al DOM de selección rovers
    // loadRoversSelector(activeRover);
    // Buscamos lanzamos los rovers al DOM
    // loadRovers(rovers);

    // Llamamos la función para cargar el rover
    updateRoverDOM(activeRover, 0);
}
window.onload = loadDOM();