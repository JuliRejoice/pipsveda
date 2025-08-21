import React from 'react'
import AboutBanner from './aboutBanner'
import Whypips from '../home/whypips'
import AboutPipsVeda from './aboutPipsVeda'
import Insights from '../home/insights'
import Havequestions from '../home/havequestions'

export default function About() {
    return (
        <div>
            <AboutBanner />
            <Whypips />
            <AboutPipsVeda />
            <Insights />
            <Havequestions />
        </div>
    )
}
