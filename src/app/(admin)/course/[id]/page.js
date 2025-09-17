import { PreventProvider } from "@/context/PreventContext";
import Chapters from "@/modules/(admin)/chapter";
import React from "react";

export default async function PreRecordedDetailPage({ params }) {
  const id = await params.id;

  return(
    <PreventProvider>
    <div>
      <Chapters params={id}/>
    </div>
    </PreventProvider>
  )
}
