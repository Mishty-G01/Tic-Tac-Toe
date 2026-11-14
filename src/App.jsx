import { useState } from "react";
import "./App.css";

const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function calculateWinner(squares) {
  for (const [a, b, c] of WINNING_LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

function Square({ value, onClick, highlight }) {
  return (
    <button
      className={`square ${highlight ? "highlight" : ""} ${value ? value.toLowerCase() : ""}`}
      onClick={onClick}
    >
      {value}
    </button>
  );
}

function Board({ squares, onPlay }) {
  const result = calculateWinner(squares);
  const winningLine = result?.line ?? [];

  function handleClick(i) {
    if (squares[i] || result) return;
    const next = squares.slice();
    const xIsNext = squares.filter(Boolean).length % 2 === 0;
    next[i] = xIsNext ? "X" : "O";
    onPlay(next);
  }

  return (
    <div className="board">
      {squares.map((val, i) => (
        <Square
          key={i}
          value={val}
          onClick={() => handleClick(i)}
          highlight={winningLine.includes(i)}
        />
      ))}
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [step, setStep] = useState(0);

  const current = history[step];
  const result = calculateWinner(current);
  const xIsNext = current.filter(Boolean).length % 2 === 0;
  const isDraw = !result && current.every(Boolean);

  let status;
  if (result) {
    status = `🏆 Player ${result.winner} wins!`;
  } else if (isDraw) {
    status = "It's a draw!";
  } else {
    status = `Player ${xIsNext ? "X" : "O"}'s turn`;
  }

  function handlePlay(next) {
    const newHistory = history.slice(0, step + 1).concat([next]);
    setHistory(newHistory);
    setStep(newHistory.length - 1);
  }

  function handleRestart() {
    setHistory([Array(9).fill(null)]);
    setStep(0);
  }

  function jumpTo(move) {
    setStep(move);
  }

  return (
    <div className="game">
      <h1>Tic Tac Toe</h1>
      <div className="status">{status}</div>
      <Board squares={current} onPlay={handlePlay} />
      <button className="restart-btn" onClick={handleRestart}>
        Restart
      </button>
      {history.length > 1 && (
        <details className="history">
          <summary>Move History ({history.length - 1} moves)</summary>
          <ul>
            {history.map((_, move) => (
              <li key={move}>
                <button onClick={() => jumpTo(move)} className={step === move ? "active-move" : ""}>
                  {move === 0 ? "Game start" : `Move #${move}`}
                </button>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
