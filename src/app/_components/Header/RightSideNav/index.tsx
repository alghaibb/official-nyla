import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { Header as HeaderType } from '../../../../payload/payload-types'
import { useAuth } from '../../../_providers/Auth'

import classes from './index.module.scss'

const RightSideNav: React.FC<{ header: HeaderType }> = ({ header }) => {
  const { user } = useAuth()

  return (
    <div className={classes.rightSideNav}>
      {user ? (
        <Link href="/account">
          <Image
            src="/assets/icons/profile.svg"
            alt="profile"
            width={24}
            height={24}
            className={classes.profileIcon}
          />
        </Link>
      ) : (
        <Link href="/login">
          <Image
            src="/assets/icons/user.svg"
            alt="login"
            width={24}
            height={24}
            className={classes.userIcon}
          />
        </Link>
      )}
      <Link href="/cart">
        <Image
          src="/assets/icons/shopping-bag.svg"
          alt="cart"
          width={22}
          height={22}
          className={classes.shoppingBagIcon}
        />
      </Link>
    </div>
  )
}

export default RightSideNav
