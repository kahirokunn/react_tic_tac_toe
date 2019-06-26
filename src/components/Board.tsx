import React from 'react';
import { Cell } from './Cell';

export type BoardProps = {
  board: string[]
  onClick: (i: number) => any
}

export const Board: React.SFC<BoardProps> = ({ board, onClick }) => (
  <div>
    <div className="board-row">
      <Cell value={board[0]} onClick={() => onClick(0)} />
      <Cell value={board[1]} onClick={() => onClick(1)} />
      <Cell value={board[2]} onClick={() => onClick(2)} />
    </div>
    <div className="board-row">
      <Cell value={board[3]} onClick={() => onClick(3)} />
      <Cell value={board[4]} onClick={() => onClick(4)} />
      <Cell value={board[5]} onClick={() => onClick(5)} />
    </div>
    <div className="board-row">
      <Cell value={board[6]} onClick={() => onClick(6)} />
      <Cell value={board[7]} onClick={() => onClick(7)} />
      <Cell value={board[8]} onClick={() => onClick(8)} />
    </div>
  </div>
)
