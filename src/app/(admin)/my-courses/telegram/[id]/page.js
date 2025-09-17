import { PreventProvider } from "@/context/PreventContext";
import TelegramDetails from "@/modules/(admin)/myCourses/telegramDetails";

import React from "react";

export default async function page({ params }) {
  const id = await params.id;

  return(
    <PreventProvider>
    <div>
      <TelegramDetails id={id}/>
    </div>
    </PreventProvider>
  )
}
