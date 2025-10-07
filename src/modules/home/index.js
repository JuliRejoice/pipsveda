import React from 'react'
import Herobanner from './herobanner'
import ExploreDifferent from './exploreDifferent'
import FinancialFreedom from './financialFreedom'
import TelegramCommunities from './telegramCommunities'
import HowitWorks from './howitWorks'
import AutomateTrades from './automateTrades'
import Whypips from './whypips'
import OurStudents from './ourStudents'
import AnimationLine from './animationLine'
import JourneySection from '../journeySection'
import GetCertified from './getCertified'
import Insights from './insights'
import Havequestions from './havequestions'
import Categories from './categories'

export default function HomePage() {
  return (
    <div>
      <Herobanner />
      <Categories />
      <ExploreDifferent />
      <FinancialFreedom />
      <TelegramCommunities />
      <HowitWorks />
      <AutomateTrades />
      <Whypips />
      <OurStudents />
      <AnimationLine />
      <JourneySection />
      <GetCertified />
      <Insights />
      <Havequestions />
    </div>
  )
}
