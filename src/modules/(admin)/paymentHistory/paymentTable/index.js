'use client'
import React, { useState, useEffect } from 'react'
import styles from "./paymenyhistory.module.scss"
import Modal from '@/compoents/modal/Modal';
import Input from '@/compoents/input';
import { addmetaAccountNo, getpaymentHistory } from '@/compoents/api/payment';
import Button from '@/compoents/button';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import EmptyState from '../../chapter/recentCourse/EmptyState';
import Pagination from '@/compoents/pagination';
const ITEMS_PER_PAGE = 7;

const PaymenyHistory = () => {
    const [paymentHistory, setPaymentHistory] = useState({});
    const [filteredPayments, setFilteredPayments] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPayment, setCurrentPayment] = useState(null);
    const [metaAccounts, setMetaAccounts] = useState(['']);
    const [isViewMode, setIsViewMode] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalItems: 0,
        itemsPerPage: ITEMS_PER_PAGE
    });

    const fetchPaymentHistory = async (page = 1) => {
        try {
            setIsLoading(true);

            let response;
            if (activeTab === "all") {
                response = await getpaymentHistory('', { page, limit: ITEMS_PER_PAGE });
            } else {
                response = await getpaymentHistory(activeTab, { page, limit: ITEMS_PER_PAGE });
            }


            setPaymentHistory(response.payload.data || {});
            setPagination((prev) => ({
                ...prev,
                currentPage: page,  // update state correctly
                totalItems: response.payload.count || 0,
            }));
        } catch (error) {
            console.error("Error fetching payment history:", error);
            toast.error("Failed to load payment history");
        } finally {
            setIsLoading(false);
        }
    };

    const handleTabChange = async (tab) => {
        setActiveTab(tab);
    };

    useEffect(() => {
        fetchPaymentHistory(1);
    }, [activeTab]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= Math.ceil(pagination.totalItems / pagination.itemsPerPage)) {
            fetchPaymentHistory(newPage);
            // Optional: Scroll to top when changing pages
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (isLoading) {
        return (
            <div className={styles.paymenyhistorymain}>
                <h2>Payment History</h2>
                <p>View a detailed record of all your past transactions, including payment dates, amounts, methods, and statuses.</p>
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'all' ? styles.active : ''}`}
                    >
                        All
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'Course' ? styles.active : ''}`}
                    >
                        Courses
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'Bot' ? styles.active : ''}`}
                    >
                        Bots
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'Telegram' ? styles.active : ''}`}
                    >
                        Telegram Channels
                    </button>
                </div>

                <div className={styles.paymenyhistorytable}>
                    <table >
                        {/* <thead>
                            <tr>
                                <th>No</th>
                                <th>Purchased Date</th>
                                <th>Course Name</th>
                                <th>Strategy Name</th>
                                <th>Telegram Channel</th>
                                <th>Plan</th>
                                <th>Amount</th>
                                <th>Transaction ID</th>
                                <th>Meta Account No.</th>
                                <th>Status</th>
                            </tr>
                        </thead> */}
                        <tbody>
                            {[...Array(5)].map((_, index) => (
                                <tr key={index}>
                                    <td><Skeleton height={24} width={48} /></td>
                                    <td><Skeleton height={24} width={120} /></td>
                                    <td><Skeleton height={24} width={120} /></td>
                                    <td><Skeleton height={24} width={120} /></td>
                                    <td><Skeleton height={24} width={120} /></td>
                                    <td><Skeleton height={24} width={120} /></td>
                                    <td><Skeleton height={24} width={120} /></td>
                                    <td><Skeleton height={24} width={120} /></td>
                                    <td>
                                        <Skeleton height={24} width={24} className={styles.viewmorebutton} />
                                    </td>
                                    <td>
                                        <Skeleton height={24} width={24} className={styles.paidbutton} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    // Empty state
    if (!isLoading && paymentHistory.length === 0) {
        return (
            <div className={styles.paymenyhistorymain}>
                <h2>Payment History</h2>
                <p>View a detailed record of all your past transactions, including payment dates, amounts, methods, and statuses.</p>

                <div className={styles.emptyState}>
                    <EmptyState
                        title="No Payment History Found"
                        description="You don't have any payment history yet. Your transactions will appear here once you make a payment."
                        buttonText="Refresh"
                        onButtonClick={() => window.location.reload()}
                    />
                </div>
            </div>
        );
    }

    const handleOpenModal = (payment, viewMode = false) => {
        setCurrentPayment(payment);
        setIsViewMode(viewMode);

        if (viewMode) {
            // If viewing existing accounts
            setMetaAccounts(payment.metaAccountNo || []);
        } else {
            // If adding new accounts, create empty inputs based on noOfBots
            const initialAccounts = Array(payment.noOfBots || 1).fill('');
            setMetaAccounts(initialAccounts);
        }

        setIsModalOpen(true);
    };

    const handleAccountChange = (index, e) => {
        const newAccounts = [...metaAccounts];
        newAccounts[index] = e.target.value;
        setMetaAccounts(newAccounts);
    };

    const handleSaveAccounts = async () => {
        if (isSaving) return;

        try {
            setIsSaving(true);
            // Filter out empty account numbers
            const validAccounts = metaAccounts.filter(account => account.trim() !== '');

            if (validAccounts.length === 0) {
                toast.error('Please enter at least one valid account number');
                return;
            }

            const response = await addmetaAccountNo(currentPayment._id, validAccounts);
            // TODO: Call your API to save the meta accounts
            // await saveMetaAccounts(currentPayment._id, validAccounts);

            // Update the local state to reflect the changes
            const updatedPayments = paymentHistory.map(payment =>
                payment._id === currentPayment._id
                    ? { ...payment, metaAccountNo: validAccounts }
                    : payment
            );

            setPaymentHistory(updatedPayments);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving meta accounts:', error);
            toast.error('Failed to save accounts. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };


    const courseType = (type) => {
        if (type === 'recorded') {
            return 'Pre-Recorded'
        } else if (type === 'live') {
            return 'Live-Online'
        } else if (type === 'physical') {
            return 'In-person'
        }
    }

    return (
        <div className={styles.paymenyhistorymain}>
            <h2>Payment History</h2>
            <p>View a detailed record of all your past transactions, including payment dates, amounts, methods, and statuses.</p>

            {/* Tabs */}
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'all' ? styles.active : ''}`}
                    onClick={() => handleTabChange('all')}
                >
                    All
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'Course' ? styles.active : ''}`}
                    onClick={() => handleTabChange('Course')}
                >
                    Courses
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'Bot' ? styles.active : ''}`}
                    onClick={() => handleTabChange('Bot')}
                >
                    Bots
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'Telegram' ? styles.active : ''}`}
                    onClick={() => handleTabChange('Telegram')}
                >
                    Telegram Channels
                </button>
            </div>

            <div className={styles.paymenyhistorytable}>
                <table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Purchased Date</th>
                            {activeTab === 'all' && (
                                <>
                                    <th>Course Name</th>
                                    <th>Strategy Name</th>
                                    <th>Telegram Channel</th>
                                </>
                            )}
                            {activeTab === 'Course' && <th>Course Name</th>}
                            {activeTab === 'Bot' && <th>Strategy Name</th>}
                            {activeTab === 'Telegram' && <th>Telegram Channel</th>}
                            {(activeTab === 'all' || activeTab === 'Course') && <th>Course Type</th>}
                            {activeTab !== 'Course' && <th>Plan</th>}
                            <th>Amount</th>
                            <th>Transaction ID</th>
                            {activeTab !== 'Course' && activeTab !== 'Telegram' && <th>Meta Account No.</th>}
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paymentHistory?.map((payment, index) => (
                            <tr key={payment._id}>
                                <td>{index + 1}</td>
                                <td>{new Date(payment.createdAt).toLocaleString('en-GB')}</td>

                                {activeTab === 'all' && (
                                    <>
                                        <td>{payment.courseId?.CourseName || '-'}</td>
                                        <td>{payment.botId?.strategyId?.title || '-'}</td>
                                        <td>{payment?.telegramId?.telegramId?.channelName || '-'}</td>
                                    </>
                                )}
                                {activeTab === 'Course' && <td>{payment.courseId?.CourseName || '-'}</td>}
                                {activeTab === 'Bot' && <td>{payment.botId?.strategyId?.title || '-'}</td>}
                                {activeTab === 'Telegram' && <td>{payment?.telegramId?.telegramId?.channelName || '-'}</td>}

                                {(activeTab === 'all' || activeTab === 'Course') && <td>{courseType(payment.courseId?.courseType) || '-'}</td>}
                                {activeTab !== 'Course' && <td>{payment.planType}</td>}
                                <td>${payment.price}</td>
                                <td>{payment.orderId}</td>
                                {activeTab !== 'Course' && activeTab !== 'Telegram' && (
                                    <td>
                                        {payment.botId ? (
                                            payment.metaAccountNo?.length > 0 ? (
                                                <button
                                                    className={styles.viewmorebutton}
                                                    onClick={() => handleOpenModal(payment, true)}
                                                >
                                                    View More
                                                </button>
                                            ) : (
                                                <button
                                                    className={styles.viewmorebutton}
                                                    onClick={() => handleOpenModal(payment, false)}
                                                >
                                                    Add
                                                </button>
                                            )
                                        ) : "-"}
                                    </td>
                                )}
                                <td>
                                    <button className={payment.status === 'paid' ? styles.paidbutton : styles.pendingbutton}>
                                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className={styles.pagination}>
                <Pagination
                    currentPage={pagination.currentPage}
                    totalItems={pagination.totalItems}
                    itemsPerPage={pagination.itemsPerPage}
                    onPageChange={handlePageChange}
                />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => !isSaving && setIsModalOpen(false)}
                title={isViewMode ? 'Meta Account Numbers' : 'Add Meta Account Numbers'}
            >
                <div className={styles.modalContent}>
                    {isViewMode ? (
                        <div className={styles.accountsList}>
                            {metaAccounts.map((account, index) => (
                                <div key={index} className={styles.accountItem}>
                                    {account}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.metaAccountInputs}>
                            {metaAccounts.map((account, index) => (
                                <Input
                                    key={index}
                                    type="text"
                                    name={`metaAccount-${index}`}

                                    value={account}
                                    onChange={(e) => handleAccountChange(index, e)}
                                    placeholder={`Enter account #${index + 1}`}
                                />
                            ))}
                        </div>
                    )}

                    <div className={styles.modalActions}>
                        <Button
                            text="Close"
                            className={styles.cancelButton}
                            onClick={() => !isSaving && setIsModalOpen(false)}
                            disabled={isSaving}
                        />


                        {!isViewMode && (
                            <Button
                                text={isSaving ? 'Saving...' : 'Save Accounts'}
                                onClick={handleSaveAccounts}
                                disabled={isSaving}
                            />
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default PaymenyHistory;