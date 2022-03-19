const X_CLASS = 'X'
const O_CLASS = 'O'
const cellElements = document.querySelectorAll('[data-cell]')
const board = document.getElementById('board')
const winningMessageElement = document.getElementById('winningMessage')
const restartButton = document.getElementById('restartButton')
const winningMessageTextElement = document.querySelector('[data-winning-message-text]')
let OsTurn

let ai = sessionStorage.getItem("first"), kind = sessionStorage.getItem("second")

function start() {
  if(ai == 'true') {
    startGame_CvP()
  } else {
    startGame_PvP()
  }
}

start()

restartButton.addEventListener('click', start)

function startGame_CvP() {
  OsTurn = false
  cellElements.forEach(cell => {
    cell.classList.remove(X_CLASS)
    cell.classList.remove(O_CLASS)
    cell.removeEventListener('click', handleClick2)
    cell.addEventListener('click', handleClick2, { once: true })
  })
  setBoardHoverClass()
  winningMessageElement.classList.remove('show')
}

function startGame_PvP() {
  OsTurn = false
  cellElements.forEach(cell => {
    cell.classList.remove(X_CLASS)
    cell.classList.remove(O_CLASS)
    cell.removeEventListener('click', handleClick1)
    cell.addEventListener('click', handleClick1, { once: true })
  })
  setBoardHoverClass()
  winningMessageElement.classList.remove('show')
}

function handleClick1(e) {
  const cell = e.target
  const currentClass = OsTurn ? O_CLASS : X_CLASS
  placeMark(cell, currentClass)
  if (checkWin(currentClass)) {
    endGame(false)
  } else if (isDraw()) {
    endGame(true)
  } else {
    swapTurns()
    setBoardHoverClass()
  }
}

function handleClick2(e) {
  const cell = e.target
  const currentClass = OsTurn ? O_CLASS : X_CLASS
  if(!OsTurn)
    placeMark(cell, X_CLASS)
  if (checkWin(currentClass)) {
    endGame(false)
  } else if (isDraw()) {
    endGame(true)
  } else {
    swapTurns()
    setBoardHoverClass()
    let place = false, skip = false, i = 0
    cellElements.forEach(cell => {
      if(skip)
        return
      if(!cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS)) {
        placeMark(cell, O_CLASS)
        if(checkWin(O_CLASS))
          endGame(false)
        else {
          if(kind == '3x3' ? i == 4 : ([5, 6, 9, 10].includes(i))) {
            place = true
            skip = true
            cell.removeEventListener('click', handleClick2)
            return
          }
          cell.classList.remove(O_CLASS)
          placeMark(cell, X_CLASS)          
          if(checkWin(X_CLASS)) {
            place = true
            cell.classList.remove(X_CLASS)
            placeMark(cell, O_CLASS)
            cell.removeEventListener('click', handleClick2)      
            skip = true
            return
          }
          cell.classList.remove(X_CLASS)
        }
        cell.classList.remove(O_CLASS)
      }
      i++
    })
    if(!place) {
      skip = false
      place = false
      i = 0
      arr1 = kind == '3x3' ? [0, 2, 4, 6, 8] : [0, 3, 5, 6, 9, 10, 12, 15]
      cellElements.forEach(cell => {
        if(skip)
          return
        if(arr1.includes(i)  && (!cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS))) {
          place = true
          placeMark(cell, O_CLASS)
          cell.removeEventListener('click', handleClick2)
          skip = true
        }
        i++
      })
      skip = false
      if(!place) {
        cellElements.forEach(cell => {
          if(skip)
            return
          if(!cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS)) {
            placeMark(cell, O_CLASS)
            cell.removeEventListener('click', handleClick2)
            skip = true
          }
        })
      }
    }    
    if (isDraw())
      endGame(true)
    swapTurns()
    setBoardHoverClass()
  }
}

function endGame(draw) {
  if (draw) {
    winningMessageTextElement.innerText = 'Draw!'
  } else {
    winningMessageTextElement.innerText = ai == 'true' ? `${OsTurn ? "GAME OVER" : "You Win!"}` : `${OsTurn ? "O" : "X"} Wins!`
  }
  winningMessageElement.classList.add('show')
}

function isDraw() {
  return [...cellElements].every(cell => {
    return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS)
  })
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass)
}

function swapTurns() {
  OsTurn = !OsTurn
}

function setBoardHoverClass() {
  board.classList.remove(X_CLASS)
  board.classList.remove(O_CLASS)
  if (OsTurn) {
    board.classList.add(O_CLASS)
  } else {
    board.classList.add(X_CLASS)
  }
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => {
      return cellElements[index].classList.contains(currentClass)
    })
  })
}