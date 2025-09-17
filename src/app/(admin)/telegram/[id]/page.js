'use client'
import { PreventProvider } from '@/context/PreventContext';
import TelegramDetails from '@/modules/(admin)/telegramDetails';
import { usePathname } from 'next/navigation';
import React from 'react'


export default function page() {
  const path = usePathname();
  const id = path.split('/').pop();

  return (
    <PreventProvider>
    <div>
      <TelegramDetails id={id}/>
    </div>
    </PreventProvider>
  )
}
