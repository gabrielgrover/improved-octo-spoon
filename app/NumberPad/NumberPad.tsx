"use client";

import React from "react";
import styles from "./numberpad.module.css";
import { range, range_iter } from "../../utils";

export function NumberPad() {
  const iterate_1_through_10 = React.useCallback(
    () => range_iter(range(1, 11)),
    []
  );

  return (
    <div className={styles.container}>
      {iterate_1_through_10().map((n) => (
        <div className={styles.number} key={n}>
          {n % 10}
        </div>
      ))}
    </div>
  );
}
