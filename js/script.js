const X_CLASS = 'X'
const O_CLASS = 'O'
const cellElements = document.querySelectorAll('[data-cell]')
const board = document.getElementById('board')
const winningMessageElement = document.getElementById('winningMessage')
const restartButton = document.getElementById('restartButton')
const winningMessageTextElement = document.querySelector('[data-winning-message-text]')
let OsTurn

let ai = sessionStorage.getItem("first"), kind = sessionStorage.getItem("second")

start()

restartButton.addEventListener('click', start)

function start() {
  OsTurn = false
  cellElements.forEach(cell => {
    cell.classList.remove(X_CLASS)
    cell.classList.remove(O_CLASS)
    cell.removeEventListener('click', ai == 'true' ? handleClick2 : handleClick1)
    cell.addEventListener('click', ai == 'true' ? handleClick2 : handleClick1, { once: true })
  })
  setBoardHoverClass()
  winningMessageElement.classList.remove('show')
}

function handleClick1(e) {
  const cell = e.target
  const currentClass = OsTurn ? O_CLASS : X_CLASS
  cell.classList.add(currentClass)
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
  if(!OsTurn)
    cell.classList.add(X_CLASS)
  if (checkWin(X_CLASS)) {
    endGame(false)
  } else if (isDraw()) {
    endGame(true)
  } else {
    swapTurns()
    let place = false, skip = false, i = 0, draw = true
    cellElements.forEach(cell => {
      if(skip)
        return
      if(!cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS)) {
        cell.classList.add(O_CLASS)
        if(checkWin(O_CLASS)) {
          endGame(false)
          skip = true
          draw = false
          return
        } else {
          if(kind == '3x3' ? i == 4 : ([5, 6, 9, 10].includes(i))) {
            place = true
            skip = true
            cell.removeEventListener('click', handleClick2)
            return
          }
          cell.classList.remove(O_CLASS)
          cell.classList.add(X_CLASS)          
          if(checkWin(X_CLASS)) {
            place = true
            cell.classList.remove(X_CLASS)
            cell.classList.add(O_CLASS)
            cell.removeEventListener('click', handleClick2)      
            skip = true
            return
          }
          cell.classList.remove(X_CLASS)
        }        
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
          cell.classList.add(O_CLASS)
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
            cell.classList.add(O_CLASS)
            cell.removeEventListener('click', handleClick2)
            skip = true
          }
        })
      }
    }    
    if (isDraw() && draw)
      endGame(true)
    swapTurns()
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