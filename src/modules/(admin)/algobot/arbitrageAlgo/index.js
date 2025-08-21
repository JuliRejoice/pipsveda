'use client'
import React, { useEffect, useState } from 'react'
import styles from './arbitrageAlgo.module.scss';
import OutlineButton from '@/compoents/outlineButton';
import Pagination from '@/compoents/pagination';
import { getAlgobot } from '@/compoents/api/algobot';
import { useRouter } from 'next/navigation';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const RightBlackIcon = '/assets/icons/right-black.svg';
const CardImage = '/assets/images/crypto.png';

// Skeleton component to match the card layout
const CardSkeleton = () => (
    <div className={styles.griditems}>
        <div className={styles.image}>
            <Skeleton height={200} style={{ borderRadius: '12px' }} />
        </div>
        <div className={styles.details}>
            <Skeleton width={200} height={24} />
            <Skeleton />
            <div className={styles.twoColgrid}>
                {[...Array(2)].map((_, i) => (
                    <div key={i} className={styles.items}>
                        <Skeleton width={100} height={20} />
                        <Skeleton width={80} height={24} />
                        <Skeleton width={100} height={20} />
                        <Skeleton width={80} height={24} />
                    </div>
                ))}
            </div>
            <Skeleton height={40} width={100} />
        </div>
    </div>
);

// Empty state component
const EmptyState = () => (
    <div className={styles.emptyState}>
        <img
            src="/assets/icons/no-course.svg"
            alt="No algobots"
            className={styles.emptyImage}
        />
        <h3>No AlgoBots Available</h3>
        <p>
            There are no AlgoBots to display at the moment.
            Please check back later or try a different search.
        </p>
    </div>
);

export default function ArbitrageAlgo({ bot, setBot, searchQuery, setSearchQuery, loading, setLoading, error, setError, selectedBot, setSelectedBot }) {

    const router = useRouter();
    console.log("bot", searchQuery)
    useEffect(() => {
        const fetchAlgobotData = async () => {
            try {
                setLoading(true);
                const response = await getAlgobot('', searchQuery);
                setBot(response.payload.data);
            } catch (error) {
                console.error('Error fetching algobot data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAlgobotData();
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

    // Show empty state if no bots are found
    if (!loading && (!bot || bot.length === 0)) {
        return (
            <div className={styles.arbitrageAlgoAlignment}>
                <div className={styles.title}>
                    <h2>Arbitrage Algo</h2>
                </div>
                <EmptyState />
            </div>
        );
    }

    return (
        <div className={styles.arbitrageAlgoAlignment}>
            <div className={styles.algotabsmain}>
                <div className={styles.algotabs}>
                    <button type='button' className={`${styles.algotabs} ${styles.active}`}>
                        <span>Arbitrage Algo</span>
                    </button>
                    {/* <button type='button' className={styles.algotabs}>
                        <span>Arbitrage Algo</span>
                    </button>
                    <button type='button' className={styles.algotabs}>
                        <span>Arbitrage Algo</span>
                    </button> */}
                </div>
            </div>
            <div className={styles.grid}>
                {bot?.map((item) => (
                    <div className={styles.griditems} key={item._id}>
                        <div className={styles.image}>
                            <img
                                src={item.imageUrl || CardImage}
                                alt={item.title}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = CardImage;
                                }}
                            />
                        </div>
                        <div className={styles.details}>
                            <h3>{item.title}</h3>
                            <p>{item.shortDescription}</p>
                            <div className={styles.twoColgrid}>
                                {item.strategyPlan?.map((plan, index) => (
                                    <div className={styles.items} key={index}>
                                        <div className={styles.contentAlignment}>
                                            <span>{plan.planType}:</span>
                                            <h4>${plan.price}</h4>
                                        </div>
                                        <div className={styles.contentAlignment}>
                                            <span>M.R.P:</span>
                                            <h5>${plan.initialPrice}</h5>
                                        </div>
                                        <div className={styles.contentAlignment}>
                                            <span>Discount:</span>
                                            <h5 className={styles.dangerText}>
                                                {plan.discount > 0 ? `-${plan.discount}%` : '0%'}
                                            </h5>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <OutlineButton
                                text="Buy Now"
                                icon={RightBlackIcon}
                                onClick={() => router.push(`/algobot/${item._id}`)}
                            />
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}
