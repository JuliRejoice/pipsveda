'use client'
import React from 'react'
import BlogDetailsBanner from './blogDetailsBanner'
import BlogContentList from './blogContentList'

export default function BlogDetails({blogDetail}) {
   
    return (
        <div>
            <BlogDetailsBanner title={blogDetail?.title}/>
            <BlogContentList blog={blogDetail}/>
        </div>
    )
}
