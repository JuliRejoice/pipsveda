import AdminHeader from '@/compoents/adminHeader'
import AdminTabHeader from '@/compoents/adminTabHeader'
import Sidebar from '@/compoents/sidebar'
import React from 'react'

export default function layout({ children }) {
    return (
        <div className='admin-layout'>
            <div className='admin-layout-sidebar'>
                <Sidebar/>
            </div>
            <AdminTabHeader/>
            <div className='admin-layout-children'>
                {children}
            </div>
        </div>
    )
}
