import React from 'react'
import styles from './algobot.module.scss';
import AdminHeader from '@/compoents/adminHeader';
import Marketplace from './marketplace';
import ArbitrageAlgo from './arbitrageAlgo';
export default function Algobot() {
  return (
    <div>
      <AdminHeader/>
      <Marketplace/>
      <ArbitrageAlgo/>
    </div>
  )
}
