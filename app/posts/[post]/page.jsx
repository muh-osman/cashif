import style from "./page.module.scss";

import Link from "next/link";

export default async function page({ params }) {
  const { post } = await params;

  console.log(post);

  return (
    <div className={style.container}>
      Post: {post}
      <div>
        <Link href={`${post}/comment`}>show comment this article</Link>
      </div>
    </div>
  );
}
