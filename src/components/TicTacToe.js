import React from "react";

function Square(props) {
  return (
    <button
      style={{ width: 50, height: 50 }}
      className="square"
      className={"square " + (props.isWinner ? "winner" : "")}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        isWinner={
          this.props.winningSquares &&
          this.props.winningSquares.indexOf(i) != -1
        }
      />
    );
  }

  render() {
    return (
      <div>
        {[0, 1, 2].map((outerVal, rowIndex) => {
          return (
            <div className="board-row">
              {[0, 1, 2].map((val, colIndex) => {
                return this.renderSquare(3 * rowIndex + colIndex);
              })}
            </div>
          );
        })}
      </div>
    );
  }
}

export class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          stepNumber: 0,
        },
      ],
      xIsNext: true,
      stepNumber: 0,
      movesSort: "asc",
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const latestHistory = history[history.length - 1];
    if (latestHistory.squares[i] || calculateWinner(latestHistory.squares)[0]) {
      return;
    }
    const squares = latestHistory.squares.slice();
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          move: [squares[i], parseInt(i / 3), i % 3],
          stepNumber: latestHistory.stepNumber + 1,
        },
      ]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }

  jumpTo(move) {
    this.setState({
      stepNumber: move,
      xIsNext: !(move % 2),
    });
  }

  reverseMoves() {
    let movesSort = this.state.movesSort;
    if (movesSort === "asc") {
      movesSort = "desc";
    } else {
      movesSort = "asc";
    }
    this.setState({ movesSort: movesSort });
  }

  render() {
    const history = this.state.history.slice();
    const latestStquare = history[this.state.stepNumber];
    const [winner, winningSquares] = calculateWinner(latestStquare.squares);
    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else if (history.length === 10) {
      status = "ITS A DRAW!!";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
    if (this.state.movesSort === "desc") {
      history.reverse();
    }

    const moves = history.map((step, move) => {
      const desc = step.move
        ? "Go to move #" +
          step.stepNumber +
          " - " +
          step.move[0] +
          " placed at " +
          step.move[1] +
          "," +
          step.move[2]
        : "Go to game start";
      return (
        <li>
          <button
            onClick={() => this.jumpTo(step.stepNumber)}
            className={
              this.state.stepNumber === step.stepNumber ? "active" : ""
            }
          >
            {desc}
          </button>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={latestStquare.squares}
            winningSquares={winningSquares}
            onClick={(i) => {
              this.handleClick(i);
            }}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol className="moves-history">{moves}</ol>
        </div>
        <button
          onClick={() => {
            this.reverseMoves();
          }}
        >
          {this.state.movesSort === "asc" ? "desc" : "asc"}
        </button>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return [null, null];
}
