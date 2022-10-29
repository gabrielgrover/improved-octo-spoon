import styles from "./navbar.module.css";
import { NavbarItemList } from "./NavbarItemList";

const tabname_route_tuples = [
  { tabname: "Home", route: "/" },
  { tabname: "About", route: "/about" },
  { tabname: "Thoughts", route: "/thoughts" },
];

export function Navbar() {
  return (
    <nav className={styles.MyNav}>
      <ul className={styles.NavbarItemContainer}>
        <NavbarItemList tabname_route_tuples={tabname_route_tuples} />
      </ul>
    </nav>
  );
}
