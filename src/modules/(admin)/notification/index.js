'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './notification.module.scss';
import AdminHeader from '@/compoents/adminHeader';
import Button from '@/compoents/button';
import ClockGreyIcon from '@/icons/clockGreyIcon';
import { getNotification, updateNotification } from '@/compoents/api/notification';
import { formatDistanceToNow } from 'date-fns';
import { getSocket } from '@/utils/webSocket';

export default function Notification() {
    const [notifications, setNotifications] = useState([]);
    const router = useRouter();

    const fetchNotifications = async () => {
        try {
            const response = await getNotification();
            if (response?.payload?.data) {
                setNotifications(response.payload.data);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const handleNotificationClick = async (notification) => {
        try {
            // Mark as read if not already read
            if (!notification.isRead) {
                await updateNotification(notification._id, true);
                // Update local state to reflect read status
                setNotifications(prev => prev.map(n => 
                    n._id === notification._id ? { ...n, isRead: true } : n
                ));
            }
            
            // Navigate based on notification type or link
            if (notification.link) {
                router.push(notification.link);
            }
        } catch (error) {
            console.error('Error updating notification status:', error);
        }
    };

    const getTimeAgo = (dateString) => {
        if (!dateString) return '';
        return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleMarkAsRead = async (notificationId) => {
        try {
            await updateNotification(notificationId, true);
            // Update local state to reflect read status
            setNotifications(prev => prev.map(n => 
                n._id === notificationId ? { ...n, isRead: true } : n
            ));
            
            // Emit check-notification event to update unread count
            const socket = getSocket();
            if (socket) {
                socket.emit('check-notification', {});
            }
        } catch (error) {
            console.error('Error updating notification status:', error);
        }
    };

    return (
        <div>
            <AdminHeader />
            <div className={styles.notificationBox}>
                <div className={styles.title}>
                    <h2>Notifications</h2>
                    <p>Your recent notifications and alerts</p>
                </div>
                <div className={styles.allBoxAlignment}>
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div 
                                key={notification._id} 
                                className={`${styles.box} ${!notification.isRead ? styles.unread : ''}`}
                                onClick={() => handleNotificationClick(notification)}
                            >
                                <div className={styles.leftContentAlignment}>
                                    {/* <Button 
                                        text={notification.priority || 'Info'} 
                                        className={notification.priority === 'high' ? styles.highPriority : ''}
                                    /> */}
                                    <div className={styles.content}>
                                        <h3>{notification.title}</h3>
                                        <p>{notification.description}</p>
                                    </div>
                                </div>
                                <div className={styles.rightContentAlignment}>
                                    <div className={styles.clock}>
                                        <ClockGreyIcon />
                                        <span>{getTimeAgo(notification.createdAt)}</span>
                                    </div>
                                    {!notification.isRead && (
                                        <button 
                                            className={styles.actionButton}
                                            onClick={() => handleMarkAsRead(notification._id)}
                                        >
                                            <span>Mark as Read</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.noNotifications}>
                            <p>No notifications to display</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
