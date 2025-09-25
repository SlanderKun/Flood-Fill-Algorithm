const a = [
    [1, 2, 3],
    [2, 2, 1],
    [2, 1, 1],
]
 const colorMapper = {
    [1]: "#3244CAFF",
     [2]: "#10cc9a",
     [3]: "#a88d1f",
 }
const floodFillAlgorithm = (x, y, newColor, oldColor) => {
    if (!(x > 0 && x < a.length && y > 0 && y < a[0].length)) {
        return
    }



    floodFillAlgorithm(x++, y++, newColor, oldColor)

}

const createTable = (x) => {
    return x.map((row) => {
        const rowTable = document.createElement("div")
        row.map((cell) => {
            const a = document.createElement("div")
            a.style.backgroundColor = colorMapper[cell]
            a.classList.add("displaySection__col")
            rowTable.appendChild(a)
            // a.appendChild(document.getElementsByClassName("displaySection")[0])
        })
        document.getElementsByClassName("displaySection")[0].appendChild(rowTable)
    })
}

const hideHeader = () => {
    const header = document.getElementsByClassName('header__wrapper')[0]
    const headerHideButton = document.getElementsByClassName('headerHideButton')[0]
    headerHideButton.classList.toggle('_hidden')
    header.classList.toggle("_hidden")
}

document.addEventListener("DOMContentLoaded", (event) => {
    const hideButton = document.getElementsByClassName("headerHideButton")[0]
    const activateButton = document.getElementsByClassName("headerHideButton")[0]
    hideButton.addEventListener("click", hideHeader)
    console.log(createTable(a))
})