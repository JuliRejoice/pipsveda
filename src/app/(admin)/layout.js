import AdminHeader from '@/compoents/adminHeader'
import Sidebar from '@/compoents/sidebar'
import React from 'react'

export default function layout({ children }) {
    return (
        <div className='admin-layout'>
            <div className='admin-layout-sidebar'>
                <Sidebar/>
            </div>
            <div className='admin-layout-children'>
                <AdminHeader/>
                {children}
            </div>
        </div>
    )
}
