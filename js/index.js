// Made by SlanderKun

let isPaused = false
let pauseStart = 0
let accumulatedPauseTime = 0
let inProcess = false
let isNewFlood = true

const sounds = {
    iGotThisSound: new Audio("./assets/sound/i-got-this.mp3"),
    helicopterSound: new Audio("./assets/sound/Heli.mp3"),
    stoneMovingSound: new Audio("./assets/sound/moving-stone.mp3"),
    surpriseSound: new Audio("./assets/sound/surprise-sound.mp3"),
    pipeSound: new Audio("./assets/sound/pipeSound.mp3"),
    agnesSound: new Audio("./assets/sound/agnesSinging.mp3"),
    pocoSound: new Audio("./assets/sound/poco-sound.mp3"),
    applepaySound: new Audio("./assets/sound/applepay.mp3"),
    rickRollSound: new Audio("./assets/sound/rickroll.mp3"),
}

const uiElements = {
    submitButton: document.getElementsByClassName("buttonContainer__submitButtonContainer")[0],
    invincibleBlock: document.getElementsByClassName("invincibleBlock")[0],
    headerWrapper: document.getElementsByClassName("header__wrapper")[0],
    header: document.getElementById("header"),
    agnes: document.getElementsByClassName("agnesTachyon")[0],
    anvil: document.getElementsByClassName("anvil")[0],
    paymentContainer: document.getElementsByClassName("paymentContainer")[0],
    skipButton: document.getElementsByClassName("skipButton")[0],
}

const adjustedDelay = async(ms) => {
    let start = performance.now()
    let remaining = ms

    while (remaining > 0) {
        await new Promise(resolve => setTimeout(resolve, remaining))
        if (isPaused) {
            await new Promise(resolve => {
                document.addEventListener('visibilitychange', function handler() {
                    if (document.visibilityState === 'visible') {
                        resolve()
                        document.removeEventListener('visibilitychange', handler)
                    }
                });
            });
            accumulatedPauseTime += performance.now() - pauseStart
        }
        remaining = ms - (performance.now() - start - accumulatedPauseTime)
        if (remaining < 0) break
    }
    accumulatedPauseTime = 0
}

const animationPauser = (flag) => {
    Object.values(uiElements).forEach((el) => {
        el.style.animationPlayState = flag ? 'paused' : 'running'
    })
}

const colorMapper = {
    [0]: "#9047d9",
    [1]: "#3244CAFF",
    [2]: "#10cc9a",
    [3]: "#a88d1f",
    [4]: "#4da81f",
    [5]: "#238de3",
    [6]: "#ef407e",
    [7]: "#f37e53",
    [8]: "#ec40ca",
    [9]: "#f1da41",
}

const numberInputValid = () => {
    const inputX = document.getElementById("x")
    const inputY = document.getElementById("y")

    inputX.oninput = (e) => {
        if (e.target.value.length > 2) {
            e.target.value = e.target.value.slice(0, 2)
        }
    }
    inputX.onchange = (e) => {
        if (e.target.value <= 0) {
            e.target.value = "2"
        }
    }
    inputY.oninput = (e) => {
        if (e.target.value.length > 2) {
            e.target.value = e.target.value.slice(0, 2)
        }
    }
    inputY.onchange = (e) => {
        if (e.target.value <= 0) {
            e.target.value = "2"
        }
    }
}

const randomArray = (xSize, ySize) => {
    return Array.from({length: xSize}, () =>
        Array.from({length: ySize}, () => Math.floor(Math.random() * 9))
    )
}

const isCellValid = () => {
    return (row < 0 || row >= rows || col < 0 || col >= cols || oldColor === newColor)
}

const floodOne = async (grid, row, col, newColor) => {
    const queue = [[row, col]]
    const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]]
    const oldColor = grid[row][col]

    const rows = grid.length
    const cols = grid[0].length

    while (queue.length > 0) {
        const [currentRow, currentCol] = queue.shift()
        if (
            currentRow < 0 ||
            currentRow >= rows ||
            currentCol < 0 ||
            currentCol >= cols ||
            grid[currentRow][currentCol] !== oldColor
        ) {
            continue;
        }

        grid[currentRow][currentCol] = newColor%10
        const cell = document.getElementById(`cell-${currentRow}-${currentCol}`)
        if (cell) {
            cell.firstChild.style.backgroundColor = colorMapper[newColor%10]
            cell.firstChild.style.width = "50px"
            cell.firstChild.style.height = "50px"
            await new Promise(resolve => setTimeout(resolve, 100))
            cell.firstChild.style.width = "45px"
            cell.firstChild.style.height = "45px"
        }

        for (const [dr, dc] of directions) {
            queue.push([currentRow + dr, currentCol + dc])
        }
    }
}

const floodTwo = async (grid, row, col, newColor) => {
    let currentQueue = [[row, col]]
    let newQueue = []
    const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]]
    const oldColor = grid[row][col]

    const rows = grid.length
    const cols = grid[0].length

    while (currentQueue.length > 0) {
        newQueue = []
        for (let i = 0; i < currentQueue.length; i++) {
            const [currentRow, currentCol] = currentQueue[i]

            if (
                currentRow < 0 ||
                currentRow >= rows ||
                currentCol < 0 ||
                currentCol >= cols ||
                grid[currentRow][currentCol] !== oldColor
            ) {
                continue;
            }

            for (const [dr, dc] of directions) {
                newQueue.push([currentRow + dr, currentCol + dc])
            }

            grid[currentRow][currentCol] = newColor%10

            const cell = document.getElementById(`cell-${currentRow}-${currentCol}`)
            if (cell) {
                cell.firstChild.style.backgroundColor = colorMapper[newColor%10]
                cell.firstChild.style.width = "50px"
                cell.firstChild.style.height = "50px"
                setTimeout(() => {
                    cell.firstChild.style.width = "45px"
                    cell.firstChild.style.height = "45px"
                }, 100)
            }
        }
        console.log("work")
        await new Promise(resolve => setTimeout(resolve, 100))
        currentQueue = newQueue
    }
}

const floodFill = async (grid, row, col, newColor) => {
    if (inProcess) {
        return
    }

    inProcess = true

    const rows = grid.length
    const cols = grid[0].length
    const oldColor = grid[row][col]

    if (row < 0 || row >= rows || col < 0 || col >= cols || oldColor === newColor) {
        return
    }

    const queue = [[row, col]]
    const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]]

    if (isNewFlood) {
        await floodTwo(grid, row, col, newColor)
    } else {
        await floodOne(grid, row, col, newColor)
    }

    inProcess = false
}

const initFloodField = (xSize, ySize) => {

    const field = randomArray(xSize, ySize)

    const container = document.getElementsByClassName("displaySection")[0]
    container.style.gridTemplateColumns = `repeat(${ySize}, 50px)`
    container.style.gridTemplateRows = `repeat(${xSize}, 50px)`

    field.forEach((row, rowIndex) => {
        row.forEach((value, colIndex) => {
            const cellDiv = document.createElement('div')
            const cellContent = document.createElement("div")

            cellDiv.id = `cell-${rowIndex}-${colIndex}`
            cellDiv.classList.add('displaySection__element')
            cellDiv.appendChild(cellContent)

            cellContent.style.backgroundColor = colorMapper[value]
            cellContent.classList.add("displaySection__element__content")

            cellDiv.addEventListener('click', () => {
                floodFill(field, rowIndex, colIndex, field[rowIndex][colIndex] + 1)
            })
            container.appendChild(cellDiv)
        })
    })
}

const skipButtonStart = async (xSize, ySize) => {
    initFloodField(xSize, ySize)
    uiElements.header.style.display = "none"
}

const startGeneratedFloodField = async (xSize, ySize) => {
    initFloodField(xSize, ySize)

    uiElements.submitButton.classList.toggle("active")
    sounds.iGotThisSound.play()
    await adjustedDelay(1000)
    uiElements.submitButton.classList.toggle("move")
    sounds.helicopterSound.play()
    await adjustedDelay(1000)
    uiElements.submitButton.style.display = "none"
    uiElements.invincibleBlock.style.display = "flex"
    uiElements.headerWrapper.classList.add("active")
    sounds.stoneMovingSound.play()
    await adjustedDelay(3000)
    uiElements.header.style.backgroundImage = `url(assets/img/solidsnake.jpg)`
    sounds.surpriseSound.play()
    await adjustedDelay(100)
    uiElements.header.style.backgroundImage = ""
    uiElements.agnes.classList.toggle("active")
    await adjustedDelay(2000)
    sounds.agnesSound.volume = 0.2
    sounds.agnesSound.play()
    uiElements.agnes.classList.toggle("danceActive")
    await adjustedDelay(5000)
    uiElements.anvil.classList.toggle("fall")
    await adjustedDelay(200)
    sounds.agnesSound.pause()
    sounds.pipeSound.play()
    uiElements.agnes.classList.toggle("danceActive")
    uiElements.agnes.style.height = "300px"
    uiElements.anvil.classList.toggle("flip")
    await adjustedDelay(1000)
    uiElements.agnes.classList.toggle("center")
    await adjustedDelay(2000)
    uiElements.header.style.backgroundImage = `url(assets/img/explosion-explode.gif)`
    uiElements.agnes.style.display = "none"
    sounds.pocoSound.play()
    await adjustedDelay(4000)
    uiElements.header.style.backgroundImage = ""
    sounds.applepaySound.play()
    uiElements.paymentContainer.style.display = "flex"
    await adjustedDelay(15000)
    sounds.rickRollSound.play()
    uiElements.header.style.backgroundImage = "url(assets/img/dance-vibing.gif)"
    uiElements.paymentContainer.style.display = "none"
    await adjustedDelay(10000)
    uiElements.header.style.display = "none"
}

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        animationPauser(true)
        isPaused = true
        pauseStart = performance.now()
    } else {
        animationPauser(false)
        isPaused = false
    }
});

const main = () => {
    const xInput = document.getElementById("x")
    const yInput = document.getElementById("y")

    numberInputValid()


    uiElements.submitButton.addEventListener("click", async ()=> {
        await startGeneratedFloodField(xInput.value, yInput.value)
    })

    uiElements.skipButton.addEventListener("click", async ()=> {
        await skipButtonStart(xInput.value, yInput.value)
    })

}

main()
