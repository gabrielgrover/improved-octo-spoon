import { GameOfLife } from "./GameOfLife";
import styles from "./page.module.css";
import { PageHeading } from "./PageHeading";

export default function Home() {
  return (
    <div className={styles.container}>
      <PageHeading text="Enjoy the view" />
      <GameOfLife />
    </div>
  );
}
