'use client'
import React, { useEffect, useState } from 'react'
import styles from './recentBots.module.scss';
import OutlineButton from '@/compoents/outlineButton';
import Pagination from '@/compoents/pagination';
import { getAlgobot } from '@/compoents/api/algobot';
import { usePathname, useRouter } from 'next/navigation';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { getBots } from '@/compoents/api/dashboard';
import Slider from 'react-slick/lib/slider';
import Arrowicon from '@/icons/arrowicon';

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

export default function RecentBots({ id, category }) {
    const [bot, setBot] = useState([]);
    const [allBots, setAllBots] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();
    const currentBotId = pathname.split('/').pop();

    useEffect(() => {
        const fetchAlgobotData = async () => {
            try {
                setLoading(true);

                let response;
                let bots = [];

                if (pathname.split("/")[1] === "algobot") {
                    response = await getAlgobot(category);
                    bots = response?.payload?.result || [];
                } else {
                    response = await getBots();
                    bots = response?.payload?.data || [];
                }

                setAllBots(bots);
                const filteredBots = bots.filter((item) => item._id !== id);

                setBot(filteredBots);
            } catch (error) {
                console.error("Error fetching algobot data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAlgobotData();
    }, [currentBotId, id, category, pathname]);


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
                    <h2>Similar AlgoBots</h2>
                </div>
                <EmptyState />
            </div>
        );
    }

    function SampleNextArrow(props) {
        const { onClick } = props;
        return (
            <div
                className={styles.nextarrow}
                onClick={onClick}
            >
                <div className={styles.arrow}>
                    <Arrowicon />
                </div>
            </div>
        );
    }

    function SamplePrevArrow(props) {
        const { onClick } = props;
        return (
            <div
                className={styles.prevarrow}
                onClick={onClick}
            >
                <div className={styles.arrow}>
                    <Arrowicon />
                </div>
            </div>
        );
    }

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        responsive: [
            {
                breakpoint: 1300,
                settings: {
                    slidesToShow: 1.5,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            },
        ]
    };

    return (
        <div>
            <div className={styles.arbitrageAlgoAlignment}>
                <div className={styles.title}>
                    <h2>Similar AlgoBots</h2>
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
                                    {/* {item.strategyPlan?.map((plan, index) => (
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
                                        ))} */}
                                    {item.strategyPlan?.length > 1 ? (
                                        <Slider {...settings}>
                                            {item.strategyPlan.map((plan, index) => (
                                                <div key={plan._id || index}>
                                                    <div className={styles.items}>
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
                                                </div>
                                            ))}
                                        </Slider>
                                    ) : item.strategyPlan?.length === 1 ? (
                                        <div className={styles.twoColgrid}>
                                            <div className={styles.items}>
                                                <div className={styles.contentAlignment}>
                                                    <span>{item.strategyPlan[0].planType}:</span>
                                                    <h4>${item.strategyPlan[0].price}</h4>
                                                </div>
                                                <div className={styles.contentAlignment}>
                                                    <span>M.R.P:</span>
                                                    <h5>${item.strategyPlan[0].initialPrice}</h5>
                                                </div>
                                                <div className={styles.contentAlignment}>
                                                    <span>Discount:</span>
                                                    <h5 className={styles.dangerText}>
                                                        {item.strategyPlan[0].discount > 0
                                                            ? `-${item.strategyPlan[0].discount}%`
                                                            : '0%'
                                                        }
                                                    </h5>
                                                </div>
                                            </div>
                                        </div>
                                    ) : null}
                                </div>

                                <OutlineButton
                                    text="Buy Now"
                                    icon={RightBlackIcon}
                                    onClick={() => { pathname.split('/')[1] === 'algobot' ? router.push(`/algobot/${item._id}`) : router.push(`/algobot-details?id=${item._id}`) }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}
