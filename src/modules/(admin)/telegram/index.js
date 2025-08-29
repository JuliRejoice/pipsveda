"use client"; 
import React, { useState } from 'react'
import AdminHeader from '@/compoents/adminHeader';
import Marketplace from './marketplace';
import TelegramChannels from './telegramChannels';
export default function Telegram() {
  const [searchQuery, setSearchQuery] = useState('');
  const [channels,setChannels] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState(null);
  const [selectedChannel,setSelectedChannel] = useState(null);
  return (
    <div>
      <AdminHeader/>
      <Marketplace searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <TelegramChannels channels={channels} setChannels={setChannels} searchQuery={searchQuery} setSearchQuery={setSearchQuery} loading={loading} setLoading={setLoading} error={error} setError={setError} selectedChannel={selectedChannel} setSelectedChannel={setSelectedChannel}/>
    </div>
  )
}
