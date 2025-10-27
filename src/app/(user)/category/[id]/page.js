import React from 'react'
import CategoryCourses from '@/modules/category/categoryCourses'


export default function Category({ params }) {
  const { id } = params;
  return (
    <div>
      <CategoryCourses course={id} />
    </div>
  )
}
