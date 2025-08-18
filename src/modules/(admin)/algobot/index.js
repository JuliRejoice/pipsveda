
"use client"; 
import React, { useState } from 'react'
import styles from './algobot.module.scss';
import AdminHeader from '@/compoents/adminHeader';
import Marketplace from './marketplace';
import ArbitrageAlgo from './arbitrageAlgo';
export default function Algobot() {
  const [searchQuery, setSearchQuery] = useState('');
  const [bot,setBot] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState(null);
  const [selectedBot,setSelectedBot] = useState(null);
  return (
    <div>
      <AdminHeader/>
      <Marketplace  searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <ArbitrageAlgo bot={bot} setBot={setBot} searchQuery={searchQuery} setSearchQuery={setSearchQuery} loading={loading} setLoading={setLoading} error={error} setError={setError} selectedBot={selectedBot} setSelectedBot={setSelectedBot}/>
    </div>
  )
}
