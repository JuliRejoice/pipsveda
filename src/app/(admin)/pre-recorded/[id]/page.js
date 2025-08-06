import PreRecorded from "@/modules/(admin)/preRecorded";
import React from "react";

export default async function PreRecordedDetailPage({ params }) {
  const id = await params.id;

  return <PreRecorded params={id} />;
}
