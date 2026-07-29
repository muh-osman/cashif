"use client";
import style from "./page.module.scss";
import Image from "next/image";
import Link from "next/link";

// import localImage from "./image.jpg"; // or ../public/image.jpg

export default function page() {
  const test = () => {
    console.log("test");
  };

  return (
    <div className={style.container}>
      <h1 className="text-green-600">page</h1>
      <h1>page</h1>
      <h1>page</h1>
      <h1>page</h1>

      <Link href="/">Go</Link>

      <button onClick={test}>fgggg</button>
      <Image src="/images/hero.jpg" alt="logo" width={100} height={100} />
    </div>
  );
}
