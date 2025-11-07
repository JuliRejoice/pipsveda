'use client'
import React, { useState, useEffect } from 'react'
import styles from "./paymenyhistory.module.scss"
import Modal from '@/compoents/modal/Modal';
import Input from '@/compoents/input';
import { addmetaAccountNo, downloadInvoice, getpaymentHistory } from '@/compoents/api/payment';
import Button from '@/compoents/button';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import EmptyState from '../../chapter/recentCourse/EmptyState';
import Pagination from '@/compoents/pagination';
import DownloadIcon from '@/icons/downloadIcon';
const ITEMS_PER_PAGE = 7;

const PaymentHistory = () => {
    const [paymentHistory, setPaymentHistory] = useState({});
    const [filteredPayments, setFilteredPayments] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPayment, setCurrentPayment] = useState(null);
    const [metaAccounts, setMetaAccounts] = useState(['']);
    const [isViewMode, setIsViewMode] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingInvoices, setLoadingInvoices] = useState({});
    const [submittedAccounts, setSubmittedAccounts] = useState({});

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
            // Fill existing accounts and add empty slots for remaining bots
            const existingAccounts = payment.metaAccountNo || [];
            const remainingSlots = Math.max(0, (payment.noOfBots || 1) - existingAccounts.length);
            const emptyAccounts = Array(remainingSlots).fill('');
            setMetaAccounts([...existingAccounts, ...emptyAccounts]);
        }

        setIsModalOpen(true);
    };

    // const handleAccountChange = (index, e) => {
    //     const newAccounts = [...metaAccounts];
    //     newAccounts[index] = e.target.value;
    //     setMetaAccounts(newAccounts);
    // };
    //         const existingAccounts = payment.metaAccountNo || [];
    //         const remainingSlots = Math.max(0, (payment.noOfBots || 1) - existingAccounts.length);
    //         const emptyAccounts = Array(remainingSlots).fill('');
    //         setMetaAccounts([...existingAccounts, ...emptyAccounts]);
    //     }

    //     setIsModalOpen(true);
    // };

    const handleAccountChange = (index, e) => {
        const newAccounts = [...metaAccounts];
        newAccounts[index] = e.target.value;
        setMetaAccounts(newAccounts);
    };

    const handleSaveAccount = async (index) => {
        if (isSaving || !metaAccounts[index]?.trim()) return;

        try {
            setIsSaving(true);
            const accountToSave = metaAccounts[index].trim();
            const existingAccounts = currentPayment.metaAccountNo || [];
            const updatedAccounts = [...existingAccounts];
            
            // Add or update the account at the specified index
            if (index < updatedAccounts.length) {
                updatedAccounts[index] = accountToSave;
            } else {
                updatedAccounts.push(accountToSave);
            }

            // Save to API
            const response = await addmetaAccountNo(currentPayment._id, updatedAccounts);
            
            if (response.success) {
                // Update local state
                const updatedPayments = paymentHistory.map(payment =>
                    payment._id === currentPayment._id
                        ? { ...payment, metaAccountNo: updatedAccounts }
                        : payment
                );

                setPaymentHistory(updatedPayments);
                setCurrentPayment(prev => ({ ...prev, metaAccountNo: updatedAccounts }));
                toast.success('Account number saved successfully');
                
                // If all accounts are filled, close the modal
                if (updatedAccounts.length >= (currentPayment.noOfBots || 1)) {
                    setIsModalOpen(false);
                }
            } else {
                throw new Error(response.message || 'Failed to save account');
            }
        } catch (error) {
            console.error('Error saving account:', error);
            toast.error(error.message || 'Failed to save account. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveAllAccounts = async () => {
        if (isSaving) return;

        try {
            setIsSaving(true);
            const validAccounts = metaAccounts
                .map(acc => acc?.trim())
                .filter(acc => acc);

            if (validAccounts.length === 0) {
                toast.error('Please enter at least one valid account number');
                return;
            }

            const response = await addmetaAccountNo(currentPayment._id, validAccounts);
            
            if (response.success) {
                // Update local state
                const updatedPayments = paymentHistory.map(payment =>
                    payment._id === currentPayment._id
                        ? { ...payment, metaAccountNo: validAccounts }
                        : payment
                );

                setPaymentHistory(updatedPayments);
                setCurrentPayment(prev => ({ ...prev, metaAccountNo: validAccounts }));
                setIsModalOpen(false);
                toast.success('All account numbers saved successfully');
            } else {
                throw new Error(response.message || 'Failed to save accounts');
            }
        } catch (error) {
            console.error('Error saving accounts:', error);
            toast.error(error.message || 'Failed to save accounts. Please try again.');
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

    const calculateExpiryDate = (purchaseDate, planDuration) => {
        if (!planDuration || planDuration === 'N/A') return null;
    
        const purchase = new Date(purchaseDate);
        const duration = parseInt(planDuration);
     
        if (planDuration.includes('Month')) {
            purchase.setMonth(purchase.getMonth() + duration);
        } else if (planDuration.includes('year')) {
            purchase.setFullYear(purchase.getFullYear() + duration);
        }
        return purchase.toLocaleDateString("en-US");
    };


    const handleDownloadInvoice = async (payment) => {
        console.log(payment)
        try {
            setLoadingInvoices(prev => ({ ...prev, [payment._id]: true }));
            const expiryDate = payment.planExpiry || 
                             calculateExpiryDate(payment.createdAt, payment.planType); 
            
            // Handle date safely
            let purchaseDate = 'N/A';
            if (payment.createdAt) {
                const date = new Date(payment.createdAt);
                purchaseDate = !isNaN(date.getTime()) ? date.toLocaleDateString("en-US") : 'Invalid date';
            }

            const invoicePayload = {
                transactionId: payment.orderId,
                purchaseDate: purchaseDate,
                expiryDate: expiryDate,
                items: [
                    {
                        planName:
                            payment.telegramId?.telegramId?.channelName ||
                            payment.botId?.strategyId?.title ||
                            payment.courseId?.CourseName ||
                            "N/A",
                        planDuration: payment.planType || "N/A",
                        metaNo: payment.telegramAccountNo || payment.metaAccountNo?.[0] || "N/A",
                        qty: payment.noOfBots || 1,
                        amount: parseFloat(payment.price) || 0,
                    },
                ],
                couponDiscount: payment.couponDiscount > 0 ? `-${payment.couponDiscount}` : "0",
                planDiscount: payment.discount > 0 ? `-${(payment.price*payment.discount/100).toFixed(2)}` : "0",
                totalValue: parseFloat((payment.initialPrice * payment.noOfBots) || payment.price) || 0,
                total: parseFloat(payment.price) || 0,
            };

            const response = await downloadInvoice(invoicePayload);

            if (response.success && response.payload) {

                const pdfRes = await fetch(response.payload);
                const blob = await pdfRes.blob();

                const url = window.URL.createObjectURL(blob);

                const link = document.createElement("a");
                link.href = url;
                link.download = `invoice-${payment.orderId || Date.now()}.pdf`;

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                window.URL.revokeObjectURL(url);

                toast.success("Invoice downloaded successfully!");
            } else {
                throw new Error("Failed to generate invoice");
            }
        } catch (error) {
            console.error("Error generating invoice:", error);
            toast.error(error.message || "Failed to generate invoice");
        } finally {
            setLoadingInvoices(prev => ({ ...prev, [payment._id]: false }));
        }
    };

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
                            <th>Invoice</th>
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
                                        {payment.status.charAt(0).toUpperCase() + payment?.status?.slice(1)}
                                    </button>
                                </td>
                                <td>
                                    <button
                                        onClick={() => handleDownloadInvoice(payment)}
                                        disabled={loadingInvoices[payment._id]}
                                        className={styles.downloadButton}
                                        title={
                                            loadingInvoices[payment._id]
                                                ? "Generating invoice..."
                                                : "Download Invoice"
                                        }
                                    >
                                        {loadingInvoices[payment._id] ? (
                                            <span className={styles.downloadAnimation}>
                                                <DownloadIcon />
                                            </span>
                                        ) : (
                                            <DownloadIcon />
                                        )}
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

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isViewMode ? 'Meta Account Numbers' : 'Add Meta Account Numbers'}>
                <div className={styles.modalContainer}>

                

                    <div className={styles.modalBody}>
                        {/* {isViewMode ? (
                    <div className={styles.accountsList}>
                        {metaAccounts.map((account, index) => (
                            <div key={index} className={`${styles.accountItem} ${styles.accountCard}`}>
                                <div className={styles.accountHeader}>
                                    <span className={styles.accountLabel}>Account {index + 1} : {account || 'N/A'}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : ( */}
                        <div className={styles.accountInputs}>
                            {metaAccounts.map((account, index) => (
                                <div
                                    key={index}
                                    className={`${styles.inputCard} ${submittedAccounts[index] ? styles.submitted : ''}`}
                                >
                                    <div className={styles.inputHeader}>
                                        <label>Account {index + 1}</label>
                                        {submittedAccounts[index] && (
                                            <span className={`${styles.statusBadge} ${styles.success}`}>
                                                Saved
                                            </span>
                                        )}
                                    </div>
                                    <div className={styles.inputRow}>
                                        <input
                                            type="text"
                                            value={account}
                                            disabled={submittedAccounts[index]}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                
                                                // Allow any number of digits, but validate on save
                                                if (value === '' || /^\d*$/.test(value)) {
                                                    const newAccounts = [...metaAccounts];
                                                    newAccounts[index] = value;
                                                    setMetaAccounts(newAccounts);

                                                    if (submittedAccounts[index]) {
                                                        setSubmittedAccounts(prev => ({
                                                            ...prev,
                                                            [index]: false
                                                        }));
                                                    }
                                                }
                                            }}
                                            minLength={6}
                                            maxLength={12}
                                            placeholder="Enter at least 6 digits"
                                            className={`${styles.accountInput} ${account.length > 0 && account.length < 6 ? styles.errorInput : ''} ${submittedAccounts[index] ? styles.submittedInput : ''}`}
                                        />
                                        <Button
                                            className={`${styles.saveButton} ${
                                                !account || 
                                                account.length !== 6 || 
                                                submittedAccounts[index] ||
                                                metaAccounts.every(acc => acc.trim().length >= 6)
                                                    ? styles.disabled : ''
                                            }`}
                                            onClick={() => handleSaveAccount(index)}
                                            disabled={
                                                isSaving ||
                                                !account ||
                                                account.length !== 6 ||
                                                submittedAccounts[index] ||
                                                metaAccounts.every(acc => acc.trim().length >= 6)
                                            }
                                            text={isSaving ? 'Saving...' : submittedAccounts[index] ? 'Saved' : 'Save'}
                                        />
                                       
                                    </div>
                                    {account.length > 0 && account.length < 6 && (
                                        <span className={styles.errorText}>Must be at least 6 digits</span>
                                    )}
                                </div>
                            ))}
                        </div>
                        {/* )} */}
                    </div>

                    {/* {!isViewMode && ( */}
                    <div className={styles.modalActions}>
                        <Button
                            className={`${styles.cancelButton} ${styles.secondaryButton}`}
                            onClick={() => setIsModalOpen(false)}
                            text="Close"
                        />
                        <Button
                            className={`${styles.saveButton} ${
                                metaAccounts.every(acc => acc.trim().length >= 6) ? '' : styles.disabled
                            }`}
                            onClick={handleSaveAllAccounts}
                            disabled={
                                isSaving ||
                                !metaAccounts.every(acc => acc.trim().length >= 6)
                            }
                            text={isSaving ? 'Saving...' : 'Save All'}
                        />
                    </div>
                    {/* )} */}
                </div>
            </Modal>
            </div>
      
    );
}

export default PaymentHistory;

