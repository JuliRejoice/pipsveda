'use client'
import React, { useState, useEffect } from 'react'
import styles from './referAndEarn.module.scss';
import AdminHeader from '@/compoents/adminHeader';
import Modal from '@/compoents/modal/Modal';
import Button from '@/compoents/button';
import toast from 'react-hot-toast';
import { getUserWithdrawalDash, addWithdrawalRequest, getWithdrawalHistory } from '@/compoents/api/referAndEarn';

import 'react-toastify/dist/ReactToastify.css';
import TotalEarningIcon from '../../../../public/assets/icons/totalEarningIcon';
import WithdrawalIcon from '../../../../public/assets/icons/totalWithdrawalIcon';
import PendingWithdrawalIcon from '../../../../public/assets/icons/pendingWithdrawalIcon';
import { getCookie } from '../../../../cookie';
import { getProfile } from '@/compoents/api/auth';

const copyIcon = '/assets/images/copyCode.png';
const copiedIcon = '/assets/images/copiedCode.png';
const ShareIcon = '/assets/images/shareLink.png';


export default function ReferAndEarn() {
    const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
    const [withdrawalType, setWithdrawalType] = useState('');
    const [activeTab, setActiveTab] = useState('wallet');
    const [copied, setCopied] = useState(false);
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [isWithdrawalRequestModalOpen, setIsWithdrawalRequestModalOpen] = useState(false);
    const [withdrawalAmount, setWithdrawalAmount] = useState('');
    const [withdrawalAmountError, setWithdrawalAmountError] = useState('');
    const [walletId, setWalletId] = useState('');
    const [chain, setChain] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [ifscCode, setIfscCode] = useState('');
    const [ifscCodeError, setIfscCodeError] = useState('');
    const [accountHolderName, setAccountHolderName] = useState('');
    const [isSubmittingWithdrawal, setIsSubmittingWithdrawal] = useState(false);

    // Table data states
    const [walletData, setWalletData] = useState([]);
    const [withdrawalData, setWithdrawalData] = useState([]);
    const [tableLoading, setTableLoading] = useState(false);

    // Form validation errors
    const [walletIdError, setWalletIdError] = useState('');
    const [chainError, setChainError] = useState('');
    const [accountHolderNameError, setAccountHolderNameError] = useState('');
    const [accountNumberError, setAccountNumberError] = useState('');
    // const [ifscCodeError, setIfscCodeError] = useState('');

    // Check if form has any validation errors based on withdrawal type
    const hasFormErrors = withdrawalType === 'crypto'
        ? (walletIdError || chainError)
        : (accountHolderNameError || accountNumberError || ifscCodeError);

    const referralCode = 'REF2025PIPS';
    const referralLink = 'https://pipsveda.com/ref/REF2025PIPS';

    useEffect(() => {
        fetchDashboardData();
    }, []);

    useEffect(() => {
        fetchTableData();
    }, [activeTab]);

    const fetchTableData = async () => {
        try {
            setTableLoading(true);
            const type = activeTab === 'wallet' ? 'User Payments' : 'Total Withdrawal';
            const data = await getWithdrawalHistory(type);

            console.log(data,"=====data");
            
            
            if (activeTab === 'wallet') {
                setWalletData(data?.payload?.userPayment || []);
            } else {
                setWithdrawalData(data?.payload?.findTotalWithdrawal || []);
            }
        } catch (error) {
            console.error('Failed to fetch table data:', error);
            toast.error('Failed to load table data');
        } finally {
            setTableLoading(false);
        }
    };

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const data = await getUserWithdrawalDash();

            setDashboardData(data.payload);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleCopyReferralCode = () => {
        navigator.clipboard.writeText(user?.referralCode);
        setCopied(true);
        toast.success('Referral code copied!');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShareReferralCode = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Join me on Pipsveda!',
                text: `Use my referral code: ${user?.referralCode}`,
                url: referralLink
            });
        } else {
            // Fallback - copy to clipboard
            navigator.clipboard.writeText(referralLink);
            toast.success('Referral link copied!');
        }
    };

    const handleCopyReferralLink = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        toast.success('Referral link copied!');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleWithdrawalRequest = () => {
        setIsWithdrawalModalOpen(true);
    };

    const handleWithdrawalTypeSelect = (type) => {
        setWithdrawalType(type);
    };

    const handleCloseModal = () => {
        setIsWithdrawalModalOpen(false);
        setWithdrawalType('');
        // Reset form fields
        setWalletId('');
        setChain('');
        setAccountNumber('');
        setIfscCode('');
        setAccountHolderName('');
        // Clear errors
        setWalletIdError('');
        setChainError('');
        setAccountHolderNameError('');
        setAccountNumberError('');
        setIfscCodeError('');
    };

    const handleWithdrawalRequestClick = () => {
        setIsWithdrawalRequestModalOpen(true);
    };

    const handleCloseWithdrawalRequestModal = () => {
        setIsWithdrawalRequestModalOpen(false);
        setWithdrawalAmount('');
        setWithdrawalAmountError('');
        // Reset form fields
        setWalletId('');
        setChain('');
        setAccountNumber('');
        setIfscCode('');
        setAccountHolderName('');
        // Clear errors
        setWalletIdError('');
        setChainError('');
        setAccountHolderNameError('');
        setAccountNumberError('');
        setIfscCodeError('');
    };

    const handleSubmitWithdrawalRequest = async (e) => {
        e.preventDefault();

        // Clear previous error
        setWithdrawalAmountError('');

        // Validation
        if (!withdrawalAmount || withdrawalAmount.trim() === '') {
            setWithdrawalAmountError('Amount is required.');
            return;
        }

        const amount = parseFloat(withdrawalAmount);

        if (isNaN(amount) || amount <= 0) {
            setWithdrawalAmountError('Please enter a valid amount.');
            return;
        }

        if (dashboardData && amount > dashboardData.pendingWithdrawal) {
            setWithdrawalAmountError(`Amount cannot exceed $${dashboardData.pendingWithdrawal?.toFixed(2) || '0.00'}`);
            return;
        }

        // Open withdrawal method selection modal
        setIsWithdrawalModalOpen(true);
    };

    const handleWithdrawalSubmission = async () => {
        try {
            setIsSubmittingWithdrawal(true);

            // Clear all previous errors
            setWalletIdError('');
            setChainError('');
            setAccountHolderNameError('');
            setAccountNumberError('');
            setIfscCodeError('');

            let hasErrors = false;

            // Validation based on withdrawal type
            if (withdrawalType === 'crypto') {
                if (!walletId || walletId.trim() === '') {
                    setWalletIdError('Wallet ID is required');
                    hasErrors = true;
                }
                if (!chain || chain.trim() === '') {
                    setChainError('Chain is required');
                    hasErrors = true;
                }
            } else if (withdrawalType === 'bank') {
                if (!accountHolderName || accountHolderName.trim() === '') {
                    setAccountHolderNameError('Account holder name is required');
                    hasErrors = true;
                }
                if (!accountNumber || accountNumber.trim() === '') {
                    setAccountNumberError('Account number is required');
                    hasErrors = true;
                }
                if (!ifscCode || ifscCode.trim() === '') {
                    setIfscCodeError('IFSC code is required');
                    hasErrors = true;
                } else {
                    // IFSC code validation (should be 11 characters alphanumeric)
                    if (ifscCode.length !== 11 || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode.toUpperCase())) {
                        setIfscCodeError('Please enter a valid IFSC code (e.g., SBIN0001234)');
                        hasErrors = true;
                    }
                }
                if (accountNumber && accountNumber.trim() !== '') {
                    // Account number validation (should be numeric and between 9-18 digits)
                    if (!/^\d{9,18}$/.test(accountNumber)) {
                        setAccountNumberError('Account number should be 9-18 digits');
                        hasErrors = true;
                    }
                }
            }

            // If there are validation errors, don't proceed
            if (hasErrors) {
                return;
            }

            // Prepare the payload based on withdrawal type
            const withdrawalData = {
                name: user?.name || 'User',
                email: user?.email || 'user@example.com',
                phone: user?.phone || '0000000000',
                amount: withdrawalAmount,
                walletId: withdrawalType === 'crypto' ? walletId : '',
                chain: withdrawalType === 'crypto' ? chain : '',
                accountNumber: withdrawalType === 'bank' ? accountNumber : '',
                ifscCode: withdrawalType === 'bank' ? ifscCode : '',
                accountHolderName: withdrawalType === 'bank' ? accountHolderName : ''
            };

            // Call the API
            const response = await addWithdrawalRequest(withdrawalData);

            // Show success message
            toast.success('Withdrawal request submitted successfully!');

            // Close modal and reset form
            handleCloseModal();
            handleCloseWithdrawalRequestModal();

            // Refresh dashboard data
            fetchDashboardData();

        } catch (error) {
            console.error('Error submitting withdrawal request:', error);
            toast.error(error.response?.data?.message || 'Failed to submit withdrawal request');
        } finally {
            setIsSubmittingWithdrawal(false);
        }
    };

    const mockWalletBalance = [
        { id: 1, date: '2024-01-15', type: 'Referral Bonus', amount: 50, status: 'Available' },
        { id: 2, date: '2024-01-10', type: 'Commission', amount: 25, status: 'Available' },
        { id: 3, date: '2024-01-05', type: 'Referral Bonus', amount: 75, status: 'Pending' },
    ];

    const mockWithdrawals = [
        { id: 1, date: '2024-01-12', amount: 100, method: 'Bank Transfer', status: 'Completed' },
        { id: 2, date: '2024-01-08', amount: 50, method: 'Crypto Wallet', status: 'Processing' },
        { id: 3, date: '2024-01-03', amount: 25, method: 'Bank Transfer', status: 'Completed' },
    ];

    console.log(dashboardData, "dashboardData");


    const cardData = [
        {
            title: 'Referral Code',
            value: referralCode,
            icon: <TotalEarningIcon />,
            isReferral: true,
            id: 1,
            colSpan: 2
        },
        {
            title: 'Wallet Balance',
            amount: dashboardData ? dashboardData.totalEarning?.toFixed(2) || "0.00" : "0.00",
            icon: <PendingWithdrawalIcon />,
            isReferral: false,
            id: 2
        },
        {
            title: 'Withdrawal Request',
            amount: dashboardData ? dashboardData.pendingWithdrawal?.toFixed(2) || "0.00" : "0.00",
            icon: <WithdrawalIcon />,
            isReferral: false,
            id: 3,
            onClick: handleWithdrawalRequestClick
        },
    ];



    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userData = getCookie("user");
                const parsedUser = JSON.parse(userData)._id;
                const response = await getProfile(parsedUser);
                const user = response.payload.data[0];

                setUser(user);

            } catch (error) {
                console.error('Error fetching profile:', error);
                toast.error('Failed to load profile data');
            }
        };

        fetchProfile();
    }, []);

    return (
        <div>
            <AdminHeader />
            <div className={styles.contactUsPage}>
                <div className={styles.textstyle}>
                    <h2>Refer And Earn</h2>
                    <p>Connect with us to start referring and earning effortlessly!</p>
                </div>

                <div className={styles.statsSection}>
                    <div className={styles.statsGrid}>
                        {loading ? (
                            // Loading skeleton
                            <>
                                <div className={`${styles.statCard} ${styles.colSpan2}`}>
                                    <div className={styles.cardContent}>
                                        <div className={`${styles.statIcon} ${styles.skeleton}`}></div>
                                        <div className={styles.cardInfo}>
                                            <h4 className={styles.skeleton}>Loading...</h4>
                                            <div className={`${styles.referralCodeDisplay} ${styles.skeleton}`}>Loading...</div>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.statCard}>
                                    <div className={styles.cardContent}>
                                        <div className={`${styles.statIcon} ${styles.skeleton}`}></div>
                                        <div className={styles.cardInfo}>
                                            <h4 className={styles.skeleton}>Loading...</h4>
                                            <div className={styles.cardAmount}>
                                                <p className={styles.skeleton}>$0.00</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.statCard}>
                                    <div className={styles.cardContent}>
                                        <div className={`${styles.statIcon} ${styles.skeleton}`}></div>
                                        <div className={styles.cardInfo}>
                                            <h4 className={styles.skeleton}>Loading...</h4>
                                            <div className={styles.cardAmount}>
                                                <p className={styles.skeleton}>$0.00</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            // Actual data
                            cardData.map((card, index) => (
                                <div
                                    className={`${styles.statCard} ${card.colSpan ? styles.colSpan2 : ''} ${card.onClick ? styles.clickable : ''}`}
                                    key={card.id}
                                    onClick={card.onClick}
                                >
                                    <div className={styles.cardContent}>
                                        <div className={styles.statIcon}>
                                            {card.icon}
                                        </div>
                                        <div className={styles.cardInfo}>
                                            <h4>{card.title}</h4>
                                            {card.isReferral ? (
                                                <div className={styles.referralCodeDisplay}>
                                                    <span>
                                                        {user?.referralCode}
                                                        <div className={styles.buttonGroup}>
                                                            <button
                                                                className={styles.copyButton}
                                                                onClick={handleCopyReferralCode}
                                                            >
                                                                <img
                                                                    src={copied ? copiedIcon : copyIcon}
                                                                    alt={copied ? "Copied" : "Copy"}
                                                                    className={styles.copyIcon}
                                                                />
                                                            </button>
                                                            <button
                                                                className={styles.shareButton}
                                                                onClick={handleShareReferralCode}
                                                            >
                                                                <img
                                                                    src={ShareIcon}
                                                                    alt="Share"
                                                                    className={styles.copyIcon}
                                                                />
                                                            </button>
                                                        </div>
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className={styles.cardAmount}>
                                                    <p>${card.amount}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className={styles.tabsSection}>
                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tab} ${activeTab === 'wallet' ? styles.active : ''}`}
                            onClick={() => setActiveTab('wallet')}
                        >
                            Total Earnings
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'withdrawal' ? styles.active : ''}`}
                            onClick={() => setActiveTab('withdrawal')}
                        >
                            Total Withdrawal
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'withdrawalRequest' ? styles.active : ''}`}
                            onClick={() => setActiveTab('withdrawalRequest')}
                        >
                            Withdrawal Request
                        </button>
                    </div>

                    <div className={styles.tableContainer}>
                        {activeTab === 'wallet' ? (
                            <div className={styles.walletTable}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Purchase Amount</th>
                                            <th>My Commission</th>
                                            <th>Commission Amount</th>
                                            <th>Purchase Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tableLoading ? (
                                            <tr>
                                                <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                                                    Loading...
                                                </td>
                                            </tr>
                                        ) : walletData.length > 0 ? (
                                            walletData.map((item, index) => (                                                
                                                <tr key={item.id || index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item?.user?.name || 'N/A'}</td>
                                                    <td>{item?.user?.email || 'N/A'}</td>
                                                    <td>${item?.price || '0.00'}</td>
                                                    <td>{item?.referredByPercentage || '0'}%</td>
                                                    <td>${item?.commission || '0.00'}</td>
                                                    <td>{item?.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : 'N/A'}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                                                    No data available
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ) : activeTab === 'withdrawal' ? (
                            <div className={styles.withdrawalTable}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Sr. No</th>
                                            <th>Withdrawal Status</th>
                                            <th>Requested Amount</th>
                                            <th>Transaction Id</th>
                                            <th>Requested Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tableLoading ? (
                                            <tr>
                                                <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                                                    Loading...
                                                </td>
                                            </tr>
                                        ) : withdrawalData.length > 0 ? (
                                            withdrawalData.map((item, index) => (
                                                <tr key={item.id || index}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <span className={`${styles.status} ${styles[item.status?.toLowerCase()]}`}>
                                                            {item.status || 'N/A'}
                                                        </span>
                                                    </td>
                                                    <td>${item.amount || '0.00'}</td>
                                                    <td>{item.transactionId || 'N/A'}</td>
                                                    <td>{item?.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : 'N/A'}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                                                    No data available
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ) : activeTab === 'withdrawalRequest' ? (
                            <div className={styles.withdrawalRequestFormContainer}>
                                <form onSubmit={handleSubmitWithdrawalRequest} className={styles.form}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="withdrawalAmount">Withdrawal Amount ($)</label>
                                        <input
                                            type="number"
                                            id="withdrawalAmount"
                                            className={`${styles.input} ${withdrawalAmountError ? styles.inputError : ''}`}
                                            placeholder="Enter amount"
                                            value={withdrawalAmount}
                                            onChange={(e) => {
                                                setWithdrawalAmount(e.target.value);
                                                setWithdrawalAmountError('');
                                            }}
                                            min="0.01"
                                            step="0.01"
                                        />
                                        {withdrawalAmountError && (
                                            <div className={styles.errorMessage}>
                                                {withdrawalAmountError}
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.formActions}>
                                        <button type="submit" className={styles.submitButton}>Submit Request</button>
                                    </div>
                                </form>
                            </div>
                        ) : null}
                    </div>
                </div>

                {isWithdrawalModalOpen && (
                    <div className={styles.customModalOverlay} onClick={handleCloseModal}>
                        <div className={`${styles.customModalContent} ${styles.withdrawalModal}`} onClick={(e) => e.stopPropagation()}>
                            <div className={styles.customModalHeader}>
                                <h2 className={styles.customModalTitle}>Request Withdrawal</h2>
                                <div className={styles.customCloseButton} onClick={handleCloseModal}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </div>
                            </div>
                            <div className={styles.customModalBody}>
                                {!withdrawalType ? (
                                    <div className={styles.withdrawalOptions}>
                                        <h3>Select Withdrawal Method</h3>
                                        <div className={styles.optionsContainer}>
                                            <button
                                                className={styles.optionCard}
                                                onClick={() => handleWithdrawalTypeSelect('crypto')}
                                            >
                                                <div className={styles.optionIcon}>
                                                    <img src="/assets/images/bitcoin.png" alt="Crypto" />
                                                </div>
                                                <div className={styles.optionContent}>
                                                    <h4>Crypto Wallet</h4>
                                                    <p>Withdraw to cryptocurrency wallet</p>
                                                </div>
                                            </button>
                                            <button
                                                className={styles.optionCard}
                                                onClick={() => handleWithdrawalTypeSelect('bank')}
                                            >
                                                <div className={styles.optionIcon}>
                                                    <img src="/assets/images/bank.png" alt="Bank" />
                                                </div>
                                                <div className={styles.optionContent}>
                                                    <h4>Bank Transfer</h4>
                                                    <p>Withdraw to your bank account</p>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={styles.withdrawalForm}>

                                        <h3>
                                            {withdrawalType === 'crypto' ? 'Crypto Wallet Withdrawal' : 'Bank Transfer Withdrawal'}
                                        </h3>
                                        <form className={styles.form}>
                                            {withdrawalType === 'crypto' ? (
                                                <>
                                                    <div className={styles.formGroup}>
                                                        <label>Wallet Id</label>
                                                        <input
                                                            type="text"
                                                            className={`${styles.input} ${walletIdError ? styles.inputError : ''}`}
                                                            placeholder="Enter your crypto wallet id"
                                                            value={walletId}
                                                            onChange={(e) => {
                                                                const trimmedValue = e.target.value.trim();
                                                                setWalletId(trimmedValue);
                                                                setWalletIdError(''); // Clear error on input change
                                                            }}
                                                        />
                                                        {walletIdError && (
                                                            <div className={styles.errorMessage}>
                                                                {walletIdError}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className={styles.formGroup}>
                                                        <label>Network</label>
                                                        <select 
                                                            className={`${styles.input} ${chainError ? styles.inputError : ''}`}
                                                            value={chain}
                                                            onChange={(e) => {
                                                                setChain(e.target.value);
                                                                setChainError(''); // Clear error on input change
                                                            }}
                                                        >
                                                            <option value="">Select Network</option>
                                                            <option value="TRON (TRC20)">TRON (TRC20)</option>
                                                            <option value="BNB Smart Chain (BEP20)">BNB Smart Chain (BEP20)</option>
                                                        </select>
                                                        {chainError && (
                                                            <div className={styles.errorMessage}>
                                                                {chainError}
                                                            </div>
                                                        )}
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className={styles.formGroup}>
                                                        <label>Account Holder Name</label>
                                                        <input
                                                            type="text"
                                                            className={`${styles.input} ${accountHolderNameError ? styles.inputError : ''}`}
                                                            placeholder="Enter account holder name"
                                                            value={accountHolderName}
                                                            onChange={(e) => {
                                                                const trimmedValue = e.target.value.replace(/^\s+|\s+$/g, ''); // Only trim start and end
                                                                setAccountHolderName(trimmedValue);
                                                                setAccountHolderNameError(''); // Clear error on input change
                                                            }}
                                                        />
                                                        {accountHolderNameError && (
                                                            <div className={styles.errorMessage}>
                                                                {accountHolderNameError}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className={styles.formGroup}>
                                                        <label>Account Number</label>
                                                        <input
                                                            type="number"
                                                            className={`${styles.input} ${accountNumberError ? styles.inputError : ''}`}
                                                            placeholder="Enter account number"
                                                            value={accountNumber}
                                                            onChange={(e) => {
                                                                const trimmedValue = e.target.value.trim();
                                                                setAccountNumber(trimmedValue);
                                                                setAccountNumberError(''); // Clear error on input change
                                                            }}
                                                        />
                                                        {accountNumberError && (
                                                            <div className={styles.errorMessage}>
                                                                {accountNumberError}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className={styles.formGroup}>
                                                        <label>IFSC Code</label>
                                                        <input
                                                            type="text"
                                                            className={`${styles.input} ${ifscCodeError ? styles.inputError : ''}`}
                                                            placeholder="Enter IFSC code"
                                                            value={ifscCode}
                                                            onChange={(e) => {
                                                                const trimmedValue = e.target.value.trim();
                                                                setIfscCode(trimmedValue);
                                                                setIfscCodeError(''); // Clear error on input change
                                                            }}
                                                        />
                                                        {ifscCodeError && (
                                                            <div className={styles.errorMessage}>
                                                                {ifscCodeError}
                                                            </div>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                            <div className={styles.formActions}>
                                                {/* <Button
                                                    className={styles.cancelButton}
                                                    onClick={handleCloseModal}
                                                    text="Cancel"
                                                /> */}
                                                <button className={styles.backButton} onClick={() => setWithdrawalType('')}>
                                                    ← Back
                                                </button>
                                                <Button
                                                    className={styles.submitButton}
                                                    onClick={handleWithdrawalSubmission}
                                                    disabled={isSubmittingWithdrawal || hasFormErrors}
                                                    text={isSubmittingWithdrawal ? "Submitting..." : "Submit Request"}
                                                />
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
