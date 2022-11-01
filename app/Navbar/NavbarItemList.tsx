"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ThemeContext } from "../../Providers";
import styles from "./navbar.module.css";

type TabnameRouteTuple = {
  tabname: string;
  route: string;
};

const useTheme = () => React.useContext(ThemeContext);

export function NavbarItemList(props: {
  tabname_route_tuples: TabnameRouteTuple[];
}) {
  const pathname = usePathname();
  const { toggle_theme } = useTheme();

  return (
    <>
      {props.tabname_route_tuples.map(({ tabname, route }, idx) => (
        <li className={styles.NavbarItem} key={idx}>
          <Link href={route}>
            <div className={pathname === route ? styles.underline : ""}>
              {tabname}
            </div>
          </Link>
        </li>
      ))}
      <li onClick={toggle_theme} className={styles.switch}>
        Switch
      </li>
    </>
  );
}
