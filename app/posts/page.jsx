import style from "./page.module.scss";

import Link from "next/link";

export default function page() {
  return (
    <div className={style.container}>
      Posts::::
      <div>
        <Link href="posts/88">my article 88</Link>
      </div>
    </div>
  );
}
