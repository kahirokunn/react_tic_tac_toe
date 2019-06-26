import React from 'react';

export type CellProps = {
  value: any,
  onClick: () => any
}

export const Cell: React.SFC<CellProps> = ({ value, onClick }) => (
  <button className="cell" onClick={() => onClick()}>
    {value}
  </button>
)
