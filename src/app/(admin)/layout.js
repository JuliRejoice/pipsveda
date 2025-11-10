'use client'
import AdminTabHeader from '@/compoents/adminTabHeader'
import Sidebar from '@/compoents/sidebar'
import React, { useEffect, useState } from 'react'
import { getSocket } from '@/utils/webSocket'

export default function layout({ children }) {
  const [toogle, setToogle] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const socket = getSocket();
  const handleCheckNotification = (data) => {
    setUnreadCount(data?.data ? data?.data : data?.unreadNotification);
  };

  useEffect(() => {

    if (socket) {
      const handleConnect = () => {
        socket.emit("check-notification", {});
      };

      socket.on("connect", handleConnect);
      socket.on("check-notification", handleCheckNotification);

      if (socket.connected) {
        handleConnect();
      }
      return () => {
        socket.off("connect", handleConnect);
        socket.off("check-notification", handleCheckNotification);
      };
    } else {
      console.error("Socket not available");
    }
  }, [socket?.id]);

  console.log(unreadCount);
  return (
    <div className='admin-layout'>
      <div className='admin-layout-sidebar'>
        <Sidebar toogle={toogle} setToogle={setToogle} unreadCount={unreadCount} />
      </div>
      <AdminTabHeader />
      <div className='admin-layout-children'>
        {children}
      </div>
    </div>
  )
}
