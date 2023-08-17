import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1>Main</h1>
      <Link href="/auth">
        Go to Auth
      </Link>
    </>
  );
}
