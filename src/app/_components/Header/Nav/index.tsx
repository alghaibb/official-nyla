'use client'

import React from 'react'

import { Header as HeaderType } from '../../../../payload/payload-types'
import { useAuth } from '../../../_providers/Auth'
import { CMSLink } from '../../Link'

import classes from './index.module.scss'

export const HeaderNav: React.FC<{ header: HeaderType }> = ({ header }) => {
  const navItems = header?.navItems || []
  const { user } = useAuth()

  return (
    <nav className={[classes.nav, user === undefined && classes.hide].filter(Boolean).join(' ')}>
      {navItems.map((navItem, i) => {
        const key = navItem.link.url || `nav-item-${i}`
        return (
          <div key={key} className={classes.navLinks}>
            <CMSLink {...navItem.link} />
          </div>
        )
      })}
    </nav>
  )
}
