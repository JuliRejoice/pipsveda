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


const PaymenyHistory = () => {
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [filteredPayments, setFilteredPayments] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPayment, setCurrentPayment] = useState(null);
    const [metaAccounts, setMetaAccounts] = useState(['']);
    const [isViewMode, setIsViewMode] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPaymentHistory = async () => {
            try {
                setIsLoading(true);
                const response = await getpaymentHistory();
                setPaymentHistory(response.payload.data || []);
                setFilteredPayments(response.payload.data || []);
            } catch (error) {
                console.error('Error fetching payment history:', error);
                toast.error('Failed to load payment history');
            } finally {
                setIsLoading(false);
            }
        };
        fetchPaymentHistory();
    }, []);

    // Filter payments based on active tab
    useEffect(() => {
        if (activeTab === 'all') {
            setFilteredPayments(paymentHistory);
        } else if (activeTab === 'course') {
            setFilteredPayments(paymentHistory.filter(payment => payment.courseId));
        } else if (activeTab === 'bot') {
            setFilteredPayments(paymentHistory.filter(payment => payment.botId));
        } else if (activeTab === 'telegram') {
            setFilteredPayments(paymentHistory.filter(payment => payment.telegramId));
        }
    }, [activeTab, paymentHistory]);

    // Loading state skeleton
    if (isLoading) {
        return (
            <div className={styles.paymenyhistorymain}>
                <h2>Payment History</h2>
                <p>View a detailed record of all your past transactions, including payment dates, amounts, methods, and statuses.</p>
                <div className={styles.tabs}>
                    <button 
                        className={`${styles.tab} ${styles.active}`}
                    >
                        All
                    </button>
                    <button 
                        className={styles.tab}
                    >
                        Course
                    </button>
                    <button 
                        className={styles.tab}
                    >
                        Bot
                    </button>
                    <button 
                        className={styles.tab}
                    >
                        Telegram
                    </button>
                </div>
                <div className={styles.paymenyhistorytable}>
                <table >
                    <thead>
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
                    </thead>
                    <tbody>
                        {[...Array(5)].map((_, index) => (
                            <tr key={index}>
                                <td><Skeleton height={24} width={48}/></td>
                                <td><Skeleton height={24} width={120}/></td>
                                <td><Skeleton height={24} width={120}/></td>
                                <td><Skeleton height={24} width={120}/></td>
                                <td><Skeleton height={24} width={120}/></td>
                                <td><Skeleton height={24} width={120}/></td>
                                <td><Skeleton height={24} width={120}/></td>
                                <td><Skeleton height={24} width={120}/></td>
                                <td>
                                   <Skeleton height={24} width={24} className={styles.viewmorebutton}/>
                                </td>
                                <td>
                                    <Skeleton height={24} width={24} className={styles.paidbutton}/>
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
                <div className={styles.tabs}>
                    <button 
                        className={`${styles.tab} ${styles.active}`}
                    >
                        All
                    </button>
                    <button 
                        className={styles.tab}
                    >
                        Course
                    </button>
                    <button 
                        className={styles.tab}
                    >
                        Bot
                    </button>
                    <button 
                        className={styles.tab}
                    >
                        Telegram
                    </button>
                </div>
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


    const courseType =(type)=>{
        if(type === 'recorded'){
            return 'Pre-Recorded'
        }else if(type === 'live'){
            return 'Live-Online'
        }else if(type === 'physical'){
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
                    onClick={() => setActiveTab('all')}
                >
                    All
                </button>
                <button 
                    className={`${styles.tab} ${activeTab === 'course' ? styles.active : ''}`}
                    onClick={() => setActiveTab('course')}
                >
                    Course
                </button>
                <button 
                    className={`${styles.tab} ${activeTab === 'bot' ? styles.active : ''}`}
                    onClick={() => setActiveTab('bot')}
                >
                    Bot
                </button>
                <button 
                    className={`${styles.tab} ${activeTab === 'telegram' ? styles.active : ''}`}
                    onClick={() => setActiveTab('telegram')}
                >
                    Telegram
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
                            {activeTab === 'course' && <th>Course Name</th>}
                            {activeTab === 'bot' && <th>Strategy Name</th>}
                            {activeTab === 'telegram' && <th>Telegram Channel</th>}
                            {(activeTab === 'all' || activeTab === 'course') && <th>Course Type</th>}
                            {activeTab !== 'course' && <th>Plan</th>}
                            <th>Amount</th>
                            <th>Transaction ID</th>
                            {activeTab !== 'course' && activeTab !== 'telegram' && <th>Meta Account No.</th>}
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPayments.map((payment, index) => (
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
                                {activeTab === 'course' && <td>{payment.courseId?.CourseName || '-'}</td>}
                                {activeTab === 'bot' && <td>{payment.botId?.strategyId?.title || '-'}</td>}
                                {activeTab === 'telegram' && <td>{payment?.telegramId?.telegramId?.channelName || '-'}</td>}
                                
                                {(activeTab === 'all' || activeTab === 'course') && <td>{courseType(payment.courseId?.courseType) || '-'}</td>}
                                {activeTab !== 'course' && <td>{payment.planType}</td>}
                                <td>${payment.price}</td>
                                <td>{payment.orderId}</td>
                                {activeTab !== 'course' && activeTab !== 'telegram' && (
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