import React from 'react'
import AlgobotDetails from '../../algobotDetails'

export default async function page({ params }) {
  const id = await params.id;

  return (
    <div>
      <AlgobotDetails id={id}/>
    </div>
  )
}
