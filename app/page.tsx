"use client";

import Link from "next/link";
import { GameOfLife } from "./GameOfLife/GameOfLife";
import styles from "./page.module.css";
import { PageHeading } from "./PageHeading";

export default function Home() {
  return (
    <div className={styles.container}>
      <PageHeading>
        <p>
          Enjoy the view from your friends at{" "}
          <Link href="https://www.youtube.com/watch?v=iXEVoBHRjTY&t=47s">
            Dial-a-view&trade;
          </Link>
        </p>
      </PageHeading>
      <GameOfLife />
    </div>
  );
}
