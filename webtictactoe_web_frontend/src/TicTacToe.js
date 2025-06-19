import React, { useState } from "react";
import "./TicTacToe.css";

/**
 * Square component for each cell in the Tic Tac Toe grid.
 * @param {Object} props The component props.
 */
/**
 * Renders a circle SVG if value is 'O', else renders nothing.
 */
function renderCircleIfO(value) {
  if (value === 'O') {
    return (
      <svg width="45" height="45" viewBox="0 0 45 45">
        <circle
          cx="22.5"
          cy="22.5"
          r="16"
          stroke="var(--primary)"
          strokeWidth="4"
          fill="none"
        />
      </svg>
    );
  }
  return null;
}

// PUBLIC_INTERFACE
function Square({ value, onClick, highlight }) {
  return (
    <button
      className={`ttt-square${highlight ? " highlight" : ""}`}
      onClick={onClick}
      tabIndex={0}
      aria-label={value ? `Square with O` : "Empty Square"}
      style={{ padding: 0, lineHeight: 0 }} // tighter for svg
    >
      {renderCircleIfO(value)}
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
/**
 * Edited: Main TicTacToe Game Container (now only allows/cycles O for all moves and winner)
 */
// PUBLIC_INTERFACE
function TicTacToe() {
  // Only O's are ever used anywhere, so 'xIsNext' is always false and 'O' always placed.
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isGameActive, setIsGameActive] = useState(true);

  const winnerInfo = calculateWinner(squares, "O");
  const winner = winnerInfo ? winnerInfo.winner : null;
  const winningLine = winnerInfo ? winnerInfo.line : null;
  const isDraw = !winner && squares.every(Boolean);

  let status;
  if (winner) {
    status = (
      <>
        <span style={{ color: "var(--primary)", display: "flex", alignItems: "center", gap: 8 }}>
          Winner:{" "}
          <svg width="30" height="30" style={{ verticalAlign: "middle" }}>
            <circle cx="15" cy="15" r="10" stroke="var(--primary)" strokeWidth="3" fill="none" />
          </svg>
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
          color: "var(--secondary)",
          display: "inline-flex", alignItems: "center", verticalAlign: "middle"
        }}>
          <svg width="24" height="24">
            <circle cx="12" cy="12" r="8" stroke="var(--primary)" strokeWidth="2.5" fill="none" />
          </svg>
        </span>
      </>
    );
  }

  function handleSquareClick(i) {
    if (!isGameActive || squares[i] || winner || isDraw) return;
    const nextSquares = squares.slice();
    nextSquares[i] = "O"; // Always O
    setSquares(nextSquares);

    if (calculateWinner(nextSquares, "O") || nextSquares.every(Boolean)) {
      setIsGameActive(false);
    }
  }

  function handleRestart() {
    setSquares(Array(9).fill(null));
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

/**
 * Returns winning info if there's a winner "O". Otherwise, returns null.
 * @param {array} squares 
 * @param {string} who - only "O"
 * @returns {{winner: string, line: array}|null}
 */
function calculateWinner(squares, who = "O") {
  const lines = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // cols
    [0,4,8], [2,4,6]           // diag
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] === who && squares[b] === who && squares[c] === who) {
      return { winner: who, line };
    }
  }
  return null;
}

export default TicTacToe;
