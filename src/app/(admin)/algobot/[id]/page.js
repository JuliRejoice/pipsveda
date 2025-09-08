import React from 'react'
import AlgobotDetails from '../../algobotDetails'
import { PreventProvider } from '@/context/PreventContext';

export default async function page({ params }) {
  const id = await params.id;

  return (
    <PreventProvider>
    <div>
      <AlgobotDetails id={id}/>
    </div>
    </PreventProvider>
  )
}
