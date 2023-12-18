import Link from "next/link";
import Image from "next/image";
import logoImg from "@/assets/logo.png";
import classes from "./header.module.css";
import MainHeaderBackground from "./MainHeaderBackground";

export default function Header() {
    return (
        <>
        <MainHeaderBackground/>
        <header className={classes.header}>
            <Link href="/" className={classes.logo}>
                <Image src={logoImg} alt="A plate with food on it" width={70} height={70}/>
                NextLevel Food
            </Link>

            <nav className={classes.nav}>
                <ul>
                    <li><Link href="/meals">Browse Meals</Link></li>
                    <li><Link href="/community">Foodies Connunity</Link></li>
                </ul>
            </nav>
        </header>
        </>
    );
}