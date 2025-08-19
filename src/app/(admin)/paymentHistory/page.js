
import AdminHeader from '@/compoents/adminHeader'
import PaymenyHistory from '@/modules/(admin)/paymentHistory/paymentTable'
import React from 'react'

export default function page() {
    return (
        <div>
            <AdminHeader/>
            <PaymenyHistory />
        </div>
    )
}