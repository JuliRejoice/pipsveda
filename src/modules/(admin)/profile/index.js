'use client'
import React, { useEffect, useState } from 'react'
import styles from './profile.module.scss';
import Breadcumbs from '../breadcumbs';
import Input from '@/compoents/input';
import Button from '@/compoents/button';
import { getCookie, setCookie } from '../../../../cookie';
import { editProfile } from '@/compoents/api/auth';
import toast from 'react-hot-toast';

const RightIcon = '/assets/icons/right.svg';
export default function Profile() {
    const [user , setUser] = useState(null);
    useEffect(() => {
        const userData = getCookie("user");
        setUser(JSON.parse(userData));
    }, []);

    const validateUser = () => {
        if (!user.name || !user.phone || !user.address || !user.location) {
            return false;
        }
        return true;
    }
    const handleEditProfile = async () => {
        if (validateUser()) {
          const res = await editProfile(user._id,user);
          if(res.success){
            setCookie("user", JSON.stringify(res.payload));
            toast.success("Profile updated successfully");
          }
        } else {
           toast.error("Please fill in all fields");
        }
    }
    return (
        <div className={styles.profilePageAlignment}>
            <Breadcumbs />
            <div className={styles.profileBox}>
                <div className={styles.cardHeader}>
                    <h2>
                        Edit Profile
                    </h2>
                    <p>
                    Update your personal information, contact details, and preferences to keep your profile up to date.
                    </p>
                </div>
                <div className={styles.subbox}>
                    <div className={styles.grid}>
                        <Input type="text" name="name" label='First Name' placeholder='Enter your first name' value={user?.name} onChange={(e)=>setUser({...user, name: e.target.value})} />
                        <Input type="text" name="phone" label='Phone' placeholder='Enter your number' value={user?.phone} onChange={(e)=>setUser({...user, phone: e.target.value})} />
                        {/* <Input type="text" name="address" label='Address' placeholder='Enter your address' value={user?.address} onChange={(e)=>setUser({...user, address: e.target.value})} /> */}
                        <Input type="text" name="location" label='Location' placeholder='Enter your location' value={user?.location} onChange={(e)=>setUser({...user, location: e.target.value})} />
                    </div>
                    <Button text="Save" icon={RightIcon} onClick={()=>handleEditProfile()}/>
                </div>
            </div>
        </div>
    )
}
