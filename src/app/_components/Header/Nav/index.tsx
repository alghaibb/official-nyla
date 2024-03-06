'use client'

import React from 'react'
import Link from 'next/link'

import { Header as HeaderType } from '../../../../payload/payload-types'
import { useAuth } from '../../../_providers/Auth'

import classes from './index.module.scss'

export const HeaderNav: React.FC<{ header: HeaderType }> = ({ header }) => {
  const navItems = header?.navItems || []
  const { user } = useAuth()

  const desktopNavLinks = [
    { title: 'Shop', link: '/products' },
    { title: 'New Arrivals', link: '/new-arrivals' },
    { title: 'Hijabs', link: '/hijabs' },
    { title: 'Abayas', link: '/abayas' },
    { title: 'Accessories', link: '/accessories' },
  ]

  return (
    <nav className={[classes.nav, user === undefined && classes.hide].filter(Boolean).join(' ')}>
      <ul className={classes.navLinks}>
        {desktopNavLinks.map(navItem => (
          <li key={navItem.title} className={classes.navItem}>
            <Link href={navItem.link}>
              <span className={classes.navLink}>{navItem.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
