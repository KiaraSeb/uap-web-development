"use client";
import dynamic from "next/dynamic";
import React from "react";

const Chat = dynamic(() => import("../components/Chat"), { ssr: false });

export default function Page() {
  return (
    <section>
      <Chat />
    </section>
  );
}
