"use client";

import React from "react";
import produce from "immer";

import styles from "./gameoflife.module.css";

/*Most of this code was shamelessly ripped off from Ben Awad.  The void thanks you Ben!!!*/

const numRows = 25;
const numCols = 25;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }

  return rows;
};

export const GameOfLife: React.FC = () => {
  const [grid, setGrid] = React.useState(() => {
    return generateEmptyGrid();
  });

  const [extinct, set_extinct] = React.useState(false);

  const runSimulation = React.useCallback(() => {
    setGrid((g) => {
      let all_dead = true;

      const new_grid = produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }

            if (gridCopy[i][k] === 1) {
              all_dead = false;
            }
          }
        }
      });

      if (all_dead) {
        set_extinct(true);
      }

      return new_grid;
    });

    setTimeout(runSimulation, 100);
  }, []);

  React.useEffect(() => {
    if (setGrid) {
      setGrid(rand_pop());
    }
  }, [setGrid]);

  React.useEffect(() => {
    if (grid.length) {
      runSimulation?.();
    }
  }, [grid.length, runSimulation]);

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
        }}
      >
        {grid.map((rows, i) =>
          rows.map((_col, k) => (
            <div
              key={`${i}-${k}`}
              onClick={() => {
                const newGrid = extinct
                  ? rand_pop()
                  : produce(grid, (gridCopy) => {
                      gridCopy[i][k] = grid[i][k] ? 0 : 1;
                    });

                if (extinct) {
                  set_extinct(false);
                }

                setGrid(newGrid);
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][k] ? "pink" : undefined,
                border: "solid 1px black",
              }}
            />
          ))
        )}
      </div>
      {extinct && (
        <div className={styles.cta_text}>
          A mass extinction event has occurred. Experiment complete. Use grid
          for Dial-a-view&trade;
        </div>
      )}
    </>
  );
};

function rand_pop() {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => (Math.random() > 0.7 ? 1 : 0)));
  }

  return rows;
}
