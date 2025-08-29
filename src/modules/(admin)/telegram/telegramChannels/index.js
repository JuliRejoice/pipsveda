'use client'
import React, { useEffect, useState } from 'react'
import styles from './telegramChannels.module.scss';
import OutlineButton from '@/compoents/outlineButton';
import Pagination from '@/compoents/pagination';
import { getAlgobot } from '@/compoents/api/algobot';
import { useRouter } from 'next/navigation';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { getTelegramChannels } from '@/compoents/api/dashboard';

const RightBlackIcon = '/assets/icons/right-black.svg';
const CardImage = '/assets/images/crypto.png';

// Skeleton component to match the card layout
const CardSkeleton = () => (
    <div className={styles.griditemsloader}>
        <div className={styles.image}>
            <Skeleton height={200} style={{ borderRadius: '12px' }} />
        </div>
        <div className={styles.details}>
            <Skeleton width={200} height={24} />
            <Skeleton count={2} />
            <div className={styles.twoColgrid}>
                <div className={styles.items}>
                    <Skeleton width="100%" height="95px" />
                </div>
                <div className={styles.items}>
                    <Skeleton width="100%" height="95px" />
                </div>
            </div>
            <Skeleton height={46} width={155} />
        </div>
    </div>
);

// Empty state component
const EmptyState = () => (
    <div className={styles.emptyState}>
        <img
            src="/assets/icons/no-course.svg"
            alt="No channels"
            className={styles.emptyImage}
        />
        <h3>No Telegram Channels Available</h3>
        <p>
            There are no Telegram channels to display at the moment.
            Please check back later or try a different search.
        </p>
    </div>
);

export default function TelegramChannels({ channels, setChannels, searchQuery, setSearchQuery, loading, setLoading, error, setError, selectedChannel, setSelectedChannel }) {
    const router = useRouter();

    useEffect(() => {
        const fetchTelegramChannelsData = async () => {
            try {
                setLoading(true);
                const response = await getTelegramChannels('',searchQuery);
                setChannels(response?.payload?.data || []);
            } catch (error) {
                console.error('Error fetching Telegram channels:', error);
                setError('Failed to load Telegram channels');
            } finally {
                setLoading(false);
            }
        };
        fetchTelegramChannelsData();
    }, [searchQuery]);

    // Show skeleton loading while data is being fetched
    if (loading) {
        return (
            <div className={styles.arbitrageAlgoAlignment}>
                <div className={styles.title}>
                    <Skeleton width={200} height={32} />
                </div>
                <div className={styles.grid}>
                    {[...Array(3)].map((_, index) => (
                        <CardSkeleton key={index} />
                    ))}
                </div>
            </div>
        );
    }

    // Show empty state if no channels are found
    if (!loading && (!channels || channels.length === 0)) {
        return (
            <div className={styles.arbitrageAlgoAlignment}>
                <div className={styles.title}>
                    <h2>Telegram Channels</h2>
                </div>
                <EmptyState />
            </div>
        );
    }

    return (
        <div className={styles.arbitrageAlgoAlignment}>
            <div className={styles.algotabsmain}>
                <div className={styles.title}>
                    <h2>Telegram Channels</h2>
                </div>
            </div>
            <div className={styles.grid}>
                {channels?.map((channel) => (
                    <div className={styles.griditems} key={channel._id}>
                        {/* <div className={styles.image}>
                            <img
                                src={channel.imageUrl || '/assets/images/crypto.png'}
                                alt={channel.channelName}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/assets/images/crypto.png';
                                }}
                            />
                        </div> */}
                        <div className={styles.details}>
                            <h3>{channel.channelName}</h3>
                            <p>{channel.description}</p>
                            <div className={styles.planslider}>
                                <div className={styles.twoColgrid}>
                                    {channel.telegramPlan?.map((plan, index) => (
                                        <div className={styles.items} key={plan._id || index}>
                                            <div className={styles.contentAlignment}>
                                                <span>Plan:</span>
                                                <h4>{plan.planType}</h4>
                                            </div>
                                            <div className={styles.contentAlignment}>
                                                <span>Price:</span>
                                                <h4>${plan.price}</h4>
                                            </div>
                                            <div className={styles.contentAlignment}>
                                                <span>M.R.P:</span>
                                                <h5>${plan.initialPrice}</h5>
                                            </div>

                                            <div className={styles.contentAlignment}>
                                                <span>Discount:</span>
                                                <h5 className={styles.dangerText}>
                                                    -{plan.discount || "0"}%
                                                </h5>
                                            </div>

                                        </div>
                                    ))}
                                </div>
                            </div>
                            <OutlineButton
                                text="Join Channel"
                                icon={RightBlackIcon}
                                onClick={() => router.push(`/telegram/${channel._id}`)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
