'use client'
import React, { useEffect, useState } from 'react'
import styles from './allalgobots.module.scss';
import OutlineButton from '@/compoents/outlineButton';
import Pagination from '@/compoents/pagination';
import { getAlgobot } from '@/compoents/api/algobot';
import { useRouter } from 'next/navigation';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Slider from 'react-slick/lib/slider';
import Arrowicon from '@/icons/arrowicon';

const RightBlackIcon = '/assets/icons/right-black.svg';
const CardImage = '/assets/images/crypto.png';

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

export default function AllAlgobots() {
    const [bot, setBot] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        const fetchAlgobotData = async () => {
            try {
                setLoading(true);
                const response = await getAlgobot('');
                setBot(response.payload);
            } catch (error) {
                console.error('Error fetching algobot data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAlgobotData();

    }, []);

    useEffect(() => {
        setSelectedCategory(bot?.[0]?.categoryName);
    }, [bot]);

    // Show skeleton loading while data is being fetched
    if (loading) {
        return (
            <div className='container'>

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
        <div className='container'>
            <div className={styles.arbitrageAlgoAlignment}>
                <div className={styles.algotabsmain}>
                    <div className={styles.algotabs}>
                        {bot.map((bots, i) => (
                            <button
                                key={i}
                                type="button"
                                className={`${styles.algotabs} ${selectedCategory === bots.categoryName ? styles.active : ''}`}
                                onClick={() => setSelectedCategory(bots.categoryName)}
                            >
                                <span>{bots.categoryName}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div className={styles.grid}>
                    {bot
                        ?.filter(item => selectedCategory === item.categoryName)
                        ?.map((item) => {
                            return item.strategies?.map((strategy) => (
                                <div className={styles.griditems} key={strategy._id || strategy.id}>
                                    <div className={styles.image}>
                                        <img
                                            src={strategy.imageUrl || CardImage}
                                            alt={strategy.title}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = CardImage;
                                            }}
                                        />
                                    </div>
                                    <div className={styles.details}>
                                        <h3>{strategy.title}</h3>
                                        <p>{strategy.shortDescription}</p>
                                        {/* <div className={styles.planslidermain}>
                                <div className={styles.planslider}>
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
                                </div>
                            </div> */}
                                        {strategy.strategyPlan?.length > 1 && (
                                            <Slider {...settings}>
                                                {strategy.strategyPlan?.map((plan, index) => (
                                                    <div key={index}>
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
                                        )}
                                        {strategy.strategyPlan?.length === 1 && (
                                            <div className={styles.twoColgrid}>
                                                <div className={styles.items}>
                                                    <div className={styles.contentAlignment}>
                                                        <span>{strategy.strategyPlan[0].planType}:</span>
                                                        <h4>${strategy.strategyPlan[0].price}</h4>
                                                    </div>
                                                    <div className={styles.contentAlignment}>
                                                        <span>M.R.P:</span>
                                                        <h5>${item.strategyPlan[0].initialPrice}</h5>
                                                    </div>
                                                    <div className={styles.contentAlignment}>
                                                        <span>Discount:</span>
                                                        <h5 className={styles.dangerText}>
                                                            {item.strategyPlan[0].discount > 0 ? `-${item.strategyPlan[0].discount}%` : '0%'}
                                                        </h5>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <OutlineButton
                                            text="Buy Now"
                                            icon={RightBlackIcon}
                                            onClick={() => router.push(`/algobot-details?id=${strategy._id}`)}
                                        />
                                    </div>
                                </div>
                            ));
                        })}
                </div>

            </div>
        </div>
    )
}
