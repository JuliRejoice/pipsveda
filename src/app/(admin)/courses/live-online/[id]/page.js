import Chapters from "@/modules/(admin)/chapter";
import React from "react";

export default async function LiveOnlineDetailPage({ params }) {
  const id = await params.id;

  return <Chapters params={id} />;
}
