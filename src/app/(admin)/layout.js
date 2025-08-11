'use client'
import AdminHeader from '@/compoents/adminHeader'
import AdminTabHeader from '@/compoents/adminTabHeader'
import Sidebar from '@/compoents/sidebar'
import React, { useState } from 'react'

export default function layout({ children }) {
    const [toogle, setToogle] = useState(false);
    return (
        <div className='admin-layout'>
            <div className='admin-layout-sidebar'>
                <Sidebar toogle={toogle} setToogle={setToogle}/>
            </div>
            <AdminTabHeader/>
            <div className='admin-layout-children'>
                {children}
            </div>
        </div>
    )
}
