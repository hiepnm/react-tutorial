import React, { Component } from 'react';
import './App.css'; 

/*
  Tictactoe: calculate winer algorithms
*/

var lines = [];
const ROWS = 20
const COLS = 20
const WIN = 5
//x asis O(n) --
for (let row = 0; row < ROWS; row++) {
  for (let col = 0; col < COLS - WIN + 1; col++) {
    let line = Array(WIN).fill(-1);
    for (let k = 0; k < WIN; k++) 
      line[k] = row * COLS + col + k;
    lines.push(line);
  }
}

//y axis O(n) |
for (let col = 0; col < COLS; col++) {
  for (let row = 0; row < ROWS - WIN + 1; row++) {
    let line = Array(WIN).fill(-1);
    for (let k = 0; k < WIN; k++) 
      line[k] = k * COLS + row * COLS + col;
    lines.push(line);
  }
}

//z  axis \
for (let row = 0; row < ROWS - WIN + 1; row++) {
  for (let col = 0; col < COLS - WIN + 1; col++) {
    let line = Array(WIN).fill(-1);
    for (let k = 0; k < WIN; k++) 
      line[k] = k * (COLS + 1) + row * COLS + col;
    lines.push(line);
  }
}

//z' axis /
for (var row = 0; row < ROWS - WIN + 1; row++) {
  for (var col = COLS - 1; col >= WIN - 1; col--) {
    var line = Array(WIN).fill(-1);
    for (var k = 0; k < WIN; k++) 
      line[k] = k * (COLS - 1) + row * COLS + col;
    lines.push(line);
  }
}

const Switch = (props) => (
  <label className="switch">
    <input type="checkbox" onClick={() => props.onClick()} />
    <div className="slider round"></div>
  </label>
);
//Square is stateless functional component
const Square = (props) => (
  <button className="square" style={{backgroundColor: props.win ? "yellow" : "white"}} onClick={() => props.onClick()}>
    {props.value}
  </button>
)

class Board extends Component {
  renderSquare(i) {
    return <Square value={this.props.squares[i]} win={this.props.winner.indexOf(i) !== -1} onClick={() => this.props.onClick(i)} />;
  }
  
  render() {
    let rows = Array(ROWS).fill(null);
    for (var row = 0; row < ROWS; row++) {
      let cols = Array(COLS).fill(null);
      for (var col = 0; col < COLS; col++) {
        cols[col] = (<span key={col}>{this.renderSquare(row * COLS + col)}</span>);
      }
      rows[row] = 
        (
          <div className="board-row" key={row}>
            {cols}
          </div>
        );
    }
    const board = rows.slice();
    return (
      <div>
        {board}
      </div>
    );
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      stepNumber: 0,
      history: [{
        squares: Array(ROWS * COLS).fill(null),
        currentPosition: -1
      }],
      xIsNext: true,
      ascending: true,
    };
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    const moves = history.map((step, move) => {
      const desc = move ? 'Move #' + this.coordinateStr(step.currentPosition) : 'Game start';
      return (
        <li key={move}><a href="#" onClick={() => this.jumpTo(move)} style={{fontWeight: move === this.state.stepNumber ? "bold":"normal"}}>{desc}</a></li>
      )
    });
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winner={winner || []}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <br />
          <Switch onClick={() => this.toggleClick()}/>Sort
          <ol reversed={!this.state.ascending}>{moves}</ol>
        </div>
      </div>
    );
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      stepNumber: history.length,
      history: history.concat([{
        squares: squares,
        currentPosition: i
      }]),
      xIsNext: !this.state.xIsNext,
    });
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true,
    });
  }
  coordinateStr(position) {
    const x = position % COLS + 1;
    const y = Math.floor(position / COLS + 1);
    return "(" + x + ", " + y + ")";
  }
  toggleClick() {
    this.setState({
      ascending: !this.state.ascending,
    });
  }
}

// ========================================




function calculateWinner(squares) {
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c, d, e] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d] && squares[a] === squares[e] ) {
      return squares[a];
    }
  }
  return null;
}

export default App;
