
document.addEventListener('DOMContentLoaded', () => {
    // Tamaño del Grid
    const GRID_WIDTH = 10
    const GRID_HEIGHT = 20
    const GRID_SIZE = GRID_WIDTH * GRID_HEIGHT

    // Crea el grid
    const grid = createGrid();

    // Crea los TETROMINOS
    let squares = Array.from(grid.querySelectorAll('div'))

    // Boton de las reglas
    const startBtn = document.querySelector('.button')
    const reglasBtn = document.querySelector('.toggler')
    const menu = document.querySelector('.menu')
    const span = document.getElementsByClassName('close')[0]

    // Informacion de la partida
    const scoreDisplay = document.querySelector('.score-display')
    const linesDisplay = document.querySelector('.lines-score')
    
    let currentIndex = 0
    let nowRotation = 0
    const WIDTH_SQUARE = 10
    let score = 0
    let lines = 0
    let timerId
    let nextRandom = 0

    //Piezas del tetromino
    const lTetromino = [
        [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, 2],
        [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 2],
        [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2],
        [GRID_WIDTH, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2 + 2]
    ]

    const zTetromino = [
        [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
        [GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1],
        [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
        [GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1]
    ]

    const tTetromino = [
        [1, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2],
        [1, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 1],
        [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 1],
        [1, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1]
    ]

    const oTetromino = [
        [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
        [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
        [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
        [0, 1, GRID_WIDTH, GRID_WIDTH + 1]
    ]

    const iTetromino = [
        [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1],
        [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3],
        [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1],
        [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3]
    ]

    // Array de los TETROMINOS
    const TETROMINOS = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

    // Rotar tetromino
    let random = Math.floor(Math.random() * TETROMINOS.length)
    let current = TETROMINOS[random][nowRotation]
    let currentPosition = 4

    // colores de los TETROMINOS
    const colors = [
        'url(img/blue_block.png)',
        'url(img/green_block.png)',
        'url(img/navy_block.png)',
        'url(img/pink_block.png)',
        'url(img/purple_block.png)',
        'url(img/peach_block.png)',
        'url(img/yellow_block.png)'
    ]


    // Crea el tablero de juego
    function createGrid() {
        // forma del tablero
        let grid = document.querySelector(".grid")
        for (let i = 0; i < GRID_SIZE; i++) {
            let gridElement = document.createElement("div")
            grid.appendChild(gridElement)
        }

        // rellena el tablero
        for (let i = 0; i < GRID_WIDTH; i++) {
            let gridElement = document.createElement("div")
            gridElement.setAttribute("class", "block3")
            grid.appendChild(gridElement)
        }

        let previousGrid = document.querySelector(".previous-grid")
        // crea el tablero de la siguiente pieza
        // 16 es el máximo de una pieza
        for (let i = 0; i < 16; i++) {
            let gridElement = document.createElement("div")
            previousGrid.appendChild(gridElement);
        }
        return grid;
    }

    //dibuja el tetromino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('block')
            squares[currentPosition + index].style.backgroundImage = colors[random]
        })
    }

    //borra el tetromino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('block')
            squares[currentPosition + index].style.backgroundImage = 'none'
        })
    }

    // Movimiento de los TETROMINOS
    function control(e) {
        if (e.keyCode === 39)
            moveright()
        else if (e.keyCode === 38)
            rotate()
        else if (e.keyCode === 37)
            moveleft()
        else if (e.keyCode === 40)
            moveDown()
    }

    // Controla que la pieza baje cuando se presiona la tecla abajo
    document.addEventListener('keydown', control)

    //mueve la pieza para abajo
    function moveDown() {
        undraw()
        currentPosition = currentPosition += WIDTH_SQUARE
        draw()
        freeze()
    }

    // boton de Inicio y Pausa
    startBtn.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId)
            timerId = null
        }
        else {
            draw()
            timerId = setInterval(moveDown, 1000)
            nextRandom = Math.floor(Math.random() * TETROMINOS.length)
            nextTetromino()
        }
    })

    // Mover tetromino a la derecha
    function moveright() {
        undraw()
        const isEdge = current.some(index => (currentPosition + index) % WIDTH_SQUARE === WIDTH_SQUARE - 1)
        if (!isEdge) currentPosition += 1
        if (current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
            currentPosition -= 1
        }
        draw()
    }

    // Mover tetromino a la izquierda
    function moveleft() {
        undraw()
        const isEdge = current.some(index => (currentPosition + index) % WIDTH_SQUARE === 0)
        if (!isEdge) currentPosition -= 1
        if (current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
            currentPosition +=1
        }
        draw()
    }

    // Bloquea el tetromino
    function freeze() {
        // si el tetromino toca el fondo o otro tetromino
        if (current.some(index => squares[currentPosition + index + WIDTH_SQUARE].classList.contains('block3') || squares[currentPosition + index + WIDTH_SQUARE].classList.contains('block2'))) {
            // se agrega la clase block2 al tetromino
            current.forEach(index => squares[index + currentPosition].classList.add('block2'))

            // nuevo tetromino
            random = nextRandom
            nextRandom = Math.floor(Math.random() * TETROMINOS.length)
            current = TETROMINOS[random][nowRotation]
            currentPosition = 4
            draw()
            nextTetromino()
            addScore()
            gameOver()
        }
    }
    freeze()

    //rotar Tetromino
    function rotate() {
        undraw()
        nowRotation++
        if (nowRotation === current.length) {
            nowRotation = 0
        }
        // controla que no se salga del grid y no se divida el tetromino
        if (current.some(index => (currentPosition + index) % WIDTH_SQUARE === 0)) {
            currentPosition += 1
        }
        if (current.some(index => (currentPosition + index) % WIDTH_SQUARE === WIDTH_SQUARE - 1)) {
            currentPosition -= 1
        }
        current = TETROMINOS[random][nowRotation]
        draw()
    }

    // Game Over
    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
            scoreDisplay.innerHTML = 'end'
            console.log(score)
            addUserName()
            clearInterval(timerId)
        }
    }

    // añadir nombre de usuario y puntuación a la base de datos
    function addUserName(){
        let name = prompt('Game Over, ingrese su nombre para guardar la partida')
        console.log(name)

        // Añadir el usuario y el puntaje a la base de datos
        const URL = 'http://localhost:3000/users'
        
        fetch( URL, {
            method: 'POST',
            body: JSON.stringify({
                user: name,
                score: score,
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
            .then(json => console.log(json))
    }

    // mostrar tetromino anterior 
    const displayWidth = 4
    const displaySquares = document.querySelectorAll('.previous-grid div')
    let displayIndex = 0

    const smallTetrominoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], /* lTetromino */
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], /* zTetromino */
        [1, displayWidth, displayWidth + 1, displayWidth + 2], /* tTetromino */
        [0, 1, displayWidth, displayWidth + 1], /* oTetromino */
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] /* iTetromino */
    ]

    // tetromino siguiente
    function nextTetromino() {
        displaySquares.forEach(square => {
            square.classList.remove('block')
            square.style.backgroundImage = 'none'
        })
        smallTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('block')
            displaySquares[displayIndex + index].style.backgroundImage = colors[nextRandom]
        })
    }

    // Añadir puntuación y lineas
    function addScore() {
        for (currentIndex = 0; currentIndex < GRID_SIZE; currentIndex += GRID_WIDTH) {
            const row = [currentIndex, currentIndex + 1, currentIndex + 2, currentIndex + 3, currentIndex + 4, currentIndex + 5, currentIndex + 6, currentIndex + 7, currentIndex + 8, currentIndex + 9]
            if (row.every(index => squares[index].classList.contains('block2'))) {
                score += 10
                lines += 1
                scoreDisplay.innerHTML = score
                linesDisplay.innerHTML = lines
                row.forEach(index => {
                    squares[index].style.backgroundImage = 'none'
                    squares[index].classList.remove('block2') || squares[index].classList.remove('block')
                })
                //splice array
                const squaresRemoved = squares.splice(currentIndex, WIDTH_SQUARE)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

    // Visibilidad del menu
    reglasBtn.addEventListener('click', () => {
        menu.style.display = 'flex'
    })
    span.addEventListener('click', () => {
        menu.style.display = 'none'
    })

},


)
