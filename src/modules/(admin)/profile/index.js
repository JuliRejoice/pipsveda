import React from 'react'
import styles from './profile.module.scss';
import Breadcumbs from '../breadcumbs';
import Input from '@/compoents/input';
import Button from '@/compoents/button';
const RightIcon = '/assets/icons/right.svg';
export default function Profile() {
    return (
        <div className={styles.profilePageAlignment}>
            <Breadcumbs />
            <div className={styles.profileBox}>
                <div className={styles.cardHeader}>
                    <h2>
                        Edit Profile
                    </h2>
                    <p>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                    </p>
                </div>
                <div className={styles.subbox}>
                    <div className={styles.grid}>
                        <Input label='First Name' placeholder='Enter your first name' />
                        <Input label='Phone' placeholder='Enter your number' />
                        <Input label='Address' placeholder='Enter your address' />
                        <Input label='Location' placeholder='Enter your location' />
                    </div>
                    <Button text="Save" icon={RightIcon} />
                </div>
            </div>
        </div>
    )
}
