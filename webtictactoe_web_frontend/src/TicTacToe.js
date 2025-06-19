import React, { useState } from "react";
import "./TicTacToe.css";

/**
 * Square component for each cell in the Tic Tac Toe grid.
 * @param {Object} props The component props.
 */
// PUBLIC_INTERFACE
function Square({ value, onClick, highlight }) {
  return (
    <button
      className={`ttt-square${highlight ? " highlight" : ""}`}
      onClick={onClick}
      tabIndex={0}
      aria-label={value ? `Square with ${value}` : "Empty Square"}
    >
      {value}
    </button>
  );
}

/**
 * Game status bar for showing current player, winner, or draw.
 * @param {Object} props The component props.
 */
// PUBLIC_INTERFACE
function GameStatus({ status }) {
  return <div className="ttt-status">{status}</div>;
}

/**
 * Board component for 3x3 grid and managing rendering.
 * @param {Object} props The component props.
 */
// PUBLIC_INTERFACE
function Board({ squares, onSquareClick, winningLine }) {
  function renderSquare(i) {
    const highlight = winningLine && winningLine.includes(i);
    return (
      <Square
        key={i}
        value={squares[i]}
        onClick={() => onSquareClick(i)}
        highlight={highlight}
      />
    );
  }

  // 3x3 grid construction
  return (
    <div className="ttt-board">
      {[0, 1, 2].map(row =>
        <div className="ttt-board-row" key={row}>
          {[0, 1, 2].map(col => renderSquare(row * 3 + col))}
        </div>
      )}
    </div>
  );
}

/**
 * Main TicTacToe Game Container
 */
// PUBLIC_INTERFACE
function TicTacToe() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [isGameActive, setIsGameActive] = useState(true);

  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo ? winnerInfo.winner : null;
  const winningLine = winnerInfo ? winnerInfo.line : null;
  const isDraw = !winner && squares.every(Boolean);

  let status;
  if (winner) {
    status = (
      <>
        <span style={{ color: "var(--primary)" }}>
          Winner: {winner}
        </span>
      </>
    );
  } else if (isDraw) {
    status = <span style={{ color: "var(--accent)" }}>It's a Draw!</span>;
  } else {
    status = (
      <>
        Next Turn:{" "}
        <span style={{
          color: xIsNext ? "var(--primary)" : "var(--secondary)"
        }}>
          {xIsNext ? "X" : "O"}
        </span>
      </>
    );
  }

  function handleSquareClick(i) {
    if (!isGameActive || squares[i] || winner || isDraw) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    setSquares(nextSquares);

    if (!calculateWinner(nextSquares) && !nextSquares.every(Boolean)) {
      setXIsNext(!xIsNext);
    }
    if (calculateWinner(nextSquares) || nextSquares.every(Boolean)) {
      setIsGameActive(false);
    }
  }

  function handleRestart() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setIsGameActive(true);
  }

  return (
    <div className="ttt-container">
      <GameStatus status={status} />
      <Board
        squares={squares}
        onSquareClick={i => handleSquareClick(i)}
        winningLine={winningLine}
      />
      <button className="ttt-restart-btn" onClick={handleRestart}>
        Restart
      </button>
    </div>
  );
}

// PUBLIC_INTERFACE
/**
 * Returns winning info if there's a winner. Otherwise, returns null.
 * @param {array} squares 
 * @returns {{winner: string, line: array}|null}
 */
function calculateWinner(squares) {
  const lines = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // cols
    [0,4,8], [2,4,6]           // diag
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line };
    }
  }
  return null;
}

export default TicTacToe;
