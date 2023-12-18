"use client"

import { usePathname } from "next/navigation";
import Link from "next/link";
import classes from "./navLink.module.css";

export default function NavLink({ href, children }) {
    const path = usePathname();

    return (
      <Link
        href={href}
        className={`${classes.link} ${path.startsWith(href) ? classes.active : undefined}`}
      >
        {children}
      </Link>
    );
}