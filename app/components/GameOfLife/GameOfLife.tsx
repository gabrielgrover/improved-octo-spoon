"use client";

import React from "react";
import produce from "immer";
import { exists } from "../../../utils/exists";

import styles from "./gameoflife.module.css";

/*This code was shamelessly based off of work done by Ben Awad.  The void thanks you Ben!!!*/

const NUM_COLS_CSS_VAR = "--numCols";
const NUM_ROWS_CSS_VAR = "--numRows";

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

export const GameOfLife: React.FC = () => {
  const [grid, setGrid] = React.useState<number[][]>([]);
  const [num_of_cols, set_num_of_cols] = React.useState<number>(0);
  const [num_of_rows, set_num_of_rows] = React.useState<number>(0);

  const ref = React.createRef<HTMLDivElement>();
  const sim_gate_ref = React.useRef<boolean>(true);
  const run_count_ref = React.useRef(0);

  const lock_sim = () => {
    sim_gate_ref.current = false;
  };

  const unlock_sim = () => {
    sim_gate_ref.current = true;
  };

  const [extinct, set_extinct] = React.useState(false);

  const runSimulation = React.useCallback(() => {
    if (!num_of_rows || !num_of_cols || !sim_gate_ref.current) {
      return;
    }

    setGrid((g) => {
      let all_dead = true;

      const new_grid = produce(g, (gridCopy) => {
        for (let i = 0; i < num_of_rows; i++) {
          for (let k = 0; k < num_of_cols; k++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (
                newI >= 0 &&
                newI < num_of_rows &&
                newK >= 0 &&
                newK < num_of_cols
              ) {
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
  }, [num_of_cols, num_of_rows]);

  React.useEffect(() => {
    if (num_of_cols && num_of_rows) {
      setGrid(rand_pop(num_of_rows, num_of_cols));
    }
  }, [num_of_cols, num_of_rows]);

  React.useEffect(() => {
    const first_run = run_count_ref.current === 0;

    if (grid.length && first_run) {
      run_count_ref.current += 1;
      unlock_sim();
      runSimulation?.();
    }
  }, [grid.length]);

  React.useEffect(() => {
    let observer: ResizeObserver | undefined;

    const div = ref.current;

    if (exists(div)) {
      observer = new ResizeObserver(() => {
        const cols = Number(
          getComputedStyle(div).getPropertyValue(NUM_COLS_CSS_VAR)
        );
        const rows = Number(
          getComputedStyle(div).getPropertyValue(NUM_ROWS_CSS_VAR)
        );

        lock_sim();

        set_num_of_cols(cols);
        set_num_of_rows(rows);
      });
      observer.observe(div, { box: "content-box" });
    }

    return () => observer?.disconnect();
  }, [ref.current]);

  return (
    <div ref={ref} className={styles.container} id={styles.container}>
      <div className={styles.game_of_life_grid}>
        {grid.map((rows, i) =>
          rows.map((_col, k) => (
            <div
              className={styles.square}
              key={`${i}-${k}`}
              onClick={() => {
                const newGrid = extinct
                  ? rand_pop(num_of_rows, num_of_cols)
                  : produce(grid, (gridCopy) => {
                      gridCopy[i][k] = grid[i][k] ? 0 : 1;
                    });

                if (extinct) {
                  set_extinct(false);
                }

                setGrid(newGrid);

                if (!sim_gate_ref.current) {
                  unlock_sim();
                  runSimulation();
                }
              }}
              style={{
                backgroundColor: grid[i][k] ? "pink" : undefined,
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
    </div>
  );
};

function rand_pop(num_of_rows: number, num_of_cols: number) {
  const rows = [];
  for (let i = 0; i < num_of_rows; i++) {
    rows.push(
      Array.from(Array(num_of_cols), () => (Math.random() > 0.7 ? 1 : 0))
    );
  }

  return rows;
}
