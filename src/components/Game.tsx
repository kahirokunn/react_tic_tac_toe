import React, { Component } from 'react';
import { Board } from './Board';
import { Board as IBoard } from '@k-okina/minimax_ttt';

type GameState = {
  stepNumber: number,
  history: { board: IBoard }[],
  xIsNext: boolean,
}

export class Game extends Component<{}, GameState> {
  state = {
    stepNumber: 0,
    history: [{
      board: Array(9).fill(0)
    }],
    xIsNext: true
  } as GameState

  handleClick(i: number) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const board = history[this.state.stepNumber].board.slice() as IBoard;
    if (calculateWinner(board) || board[i]) {
      return;
    }
    board[i] = this.state.xIsNext ? 2 : 1;
    this.setState({
      stepNumber: history.length,
      history: history.concat([{
        board: board
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
      return board[a];
    }
  }
  return null;
}
