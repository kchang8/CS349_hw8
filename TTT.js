//gets the user inputs for the number of rows and columns for the grid
var numRows = window.prompt("Enter the number of rows: ");
var numCols = window.prompt("Enter the number of cols: ");

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    let win = false;
    for (var k = 0; k < this.props.winningSquares.length; k++) {
      if (this.props.winningSquares[k] === i) {
        win = true;
      }
    }
    let winRow = this.props.squares[i];
    if (win) {
      winRow = <div className="win">{this.props.squares[i]}</div>;
    } else {
      winRow = this.props.squares[i];
    }
    
    return (
      <Square 
        key={i} //each square has their own unique key
        value={winRow} 
        onClick={() => this.props.onClick(i)} 
      />
    );
  }

  render() {
    /*
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );*/

    //**using two for loops to generate the grid
    const row = []; //makes an empty array for storing the rows
    let k = 0; //keeps track of the current square
    for(let i = 0; i < numRows; i++) {
      const col = []; //makes an empty array for storing the cols
      for(let j = 0; j < numCols; j++) {
        col.push(this.renderSquare(numRows*i+j));
        k++;
      }
      row.push(<div key={k} className="board-row">{col}</div>);
    }

    return(
      <div>
        {row}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reverseHistory: false,
      history: [
        {
          squares: Array(numRows*numCols).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleReverseHistoryClick() {
    this.setState({
      reverseHistory: !this.state.reverseHistory
    });
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (this.calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }

  lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  calculateWinner(squares) {
    for (let i = 0; i < this.lines.length; i++) {
      const [a, b, c] = this.lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return [squares[a], i];
      }
    }
    return null;
  }

  currentMove(step, move) {
    if (move === 0) {
      return "";
    }
    const previous = this.state.history[move - 1];
    const currentSquares = step.squares;
    let diff;
    for (var i = 0; i < previous.squares.length; i++) {
      if (previous.squares[i] !== currentSquares[i]) {
        diff = i;
        break;
      }
      diff = null;
    }
    if (diff === null) {
      return "";
    }
    const position = diff + 1;
    return "" + currentSquares[diff] + "->" + position;
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = this.calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const bold = move === this.state.stepNumber; //checks if it is at the current step
      const desc = move
        ? "Go to move " + this.currentMove(step, move)
        : "Go to game start";
      const isBold = bold ? <b>{desc}</b> : desc; //bolds step if it is at the current step
      return (
        <li value={move + 1} key={move}>
          <button onClick={() => this.jumpTo(move)}>{isBold}</button>
        </li>
      );
    });

    const reverseButtonDesc = this.state.reverseHistory
      ? "Change to descending history"
      : "Change to ascending history";
    const reverseButton = (
      <button onClick={() => this.handleReverseHistoryClick()}>
        {reverseButtonDesc}
      </button>
    );
    if (!this.state.reverseHistory) {
      moves.reverse();
    }

    let draw = true;
    for (var k = 0; k < current.squares.length; k++) {
      if (current.squares[k] === null || winner) {
        draw = false;
      }
    }

    let status;
    let winningSquares;
    if (winner) {
      status = "Winner: " + winner[0];
      winningSquares = this.lines[winner[1]];
    } else {
      if (draw) {
        status = "It's a draw!";
      } else {
        status = "Next player: " + (this.state.xIsNext ? "X" : "O");
      }
      winningSquares = [];
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winningSquares={winningSquares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
          <div>{reverseButton}</div>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));