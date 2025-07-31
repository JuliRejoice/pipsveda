import PreRecorded from '@/modules/(admin)/preRecorded'
import React, { Suspense } from 'react'

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PreRecorded />
        </Suspense>
    )
}
