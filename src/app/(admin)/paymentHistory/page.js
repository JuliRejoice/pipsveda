
import AdminHeader from '@/compoents/adminHeader'
import PaymentHistory from '@/modules/(admin)/paymentHistory/paymentTable'
import React from 'react'

export default function page() {
    return (
        <div>
            <AdminHeader/>
            <PaymentHistory />
        </div>
    )
}