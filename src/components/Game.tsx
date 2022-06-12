import React, { Component } from 'react';
import { Board } from './Board';
import { Board as IBoard } from 'minimax_ttt';

class PromiseMe {
  private _initialized = false
  queue = [] as (() => any)[]

  setInitialized() {
    this._initialized = true
    this.queue.forEach(func => func());
    this.queue = []
  }

  pushJob(func: () => any) {
    this.queue.push(func);
    if (this._initialized) {
      this.queue.forEach(func => func());
      this.queue = []
    }
  }
}

let is_already_asked = false
const promiseMe = new PromiseMe()

let get_next_best_board: (js_objects: IBoard) => IBoard
import('minimax_ttt')
  .then(js => {
    get_next_best_board = js.get_next_best_board;
    promiseMe.setInitialized()
  })

type GameState = {
  isStartByCpu: boolean,
  stepNumber: number,
  history: { board: IBoard }[],
  xIsNext: boolean,
}

const initialState = () => ({
  stepNumber: 0,
  history: [{
    board: Array(9).fill(0)
  }],
  xIsNext: true
} as GameState)

export class Game extends Component<{}, GameState> {
  state = initialState()

  componentDidMount() {
    setTimeout(() => promiseMe.pushJob(() => !window.confirm('Do you want get first hand?') && this.inputByCpu()))
  }

  getLatestHistory() {
    return this.state.history.slice(0, this.state.stepNumber + 1)
  }

  getLatestBoard(): IBoard {
    return this.getLatestHistory()[this.state.stepNumber].board.slice() as IBoard
  }

  componentDidUpdate() {
    if (!is_already_asked && calculateWinner(this.getLatestBoard())) {
      is_already_asked = true
      setTimeout(() => {
        if (window.confirm('Do you want to play again?')) {
          is_already_asked = false
          this.setState(initialState());
          if (!window.confirm('Do you want get first hand?')) {
            this.inputByCpu()
          }
        }
      }, 1000)
    }
  }

  handleClick(i: number) {
    const history = this.getLatestHistory();
    const board = this.getLatestBoard();
    if (calculateWinner(board) || board[i]) {
      return;
    }
    board[i] = this.state.xIsNext ? 1 : 2;
    this.setState({
      stepNumber: history.length,
      history: history.concat([{
        board: board
      }]),
      xIsNext: !this.state.xIsNext,
    });
    setTimeout(() => this.inputByCpu())
  }

  inputByCpu() {
    const history = this.getLatestHistory();
    this.setState({
      stepNumber: history.length,
      history: history.concat([{
        board: get_next_best_board(this.getLatestBoard())
      }]),
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step: number) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.board);

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    const moves = history.map((_, move) => {
      const desc = move ? 'Move #' + move : 'Game start';
      return (
        <li key={move}>
          <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board
            board={current.board.map(cell => cell === 0 ? '' : cell === 1 ? 'O' : 'X')}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(board: IBoard) {
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
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a] === 1 ? 'O' : 'X';
    }
  }
  if (board.find(cell => cell === 0) === undefined) {
    return 'Nothing'
  }
  return null;
}
