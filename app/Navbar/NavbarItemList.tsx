"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./navbar.module.css";

type TabnameRouteTuple = {
  tabname: string;
  route: string;
};

export function NavbarItemList(props: {
  tabname_route_tuples: TabnameRouteTuple[];
}) {
  const pathname = usePathname();

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
    </>
  );
}
