import { useState } from "react"
import confetti from "canvas-confetti"
import { Square } from "./components/Square"
import { TURNS} from "./constants"
import { checkWinnerFrom, checkEndGame } from "./logic/board"
import { WinnerModal } from "./components/WinnerModal"
import { saveGameToStorage, resetGameStorage } from "./logic/storage"


function App() {
  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')

    return turnFromStorage ?? TURNS.X
    
  })

  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board')
   
    return boardFromStorage ? JSON.parse(boardFromStorage) : Array(9).fill(null)
  })

  // null: no hay ganador, false: emplate, true: hay ganador
  const [winner, setWinner] = useState(null) 

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)

    resetGameStorage()

   
  }
  
  const updateBoard = (index) => {
    // No actualizamos esta posicion si tienes valor
    if (board[index] || winner) return
    // Actualizamos el tablero
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)
    // Cambiamos de turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)
    // guardar partida 

    saveGameToStorage({
      board: newBoard,
      turn: newTurn
    }) 

    const newWinner = checkWinnerFrom(newBoard)

    if (newWinner) {
      setWinner(newWinner)
      confetti()
    } else if (checkEndGame(newBoard)) {
      setWinner(false)
    }

  }

  return (
    <main className="board">
      <h1>Tic tac toe</h1>
      <button onClick={resetGame}>Reset del juego</button>
      <section className="game">
        {
          board.map((_, index) => {
            return (
              <Square
                key={index}
                index={index}
                updateBoard={updateBoard}
                >
                  {board[index]}
              </Square>
            )
          })
        }
      </section>

      <section className="turn">
        <Square isSelected={turn === TURNS.X}>
          {TURNS.X}
        </Square>
        <Square isSelected={turn === TURNS.O}>
          {TURNS.O}
        </Square>
      </section>

      <WinnerModal resetGame={resetGame} winner={winner} />

    </main>
  )
}

export default App
