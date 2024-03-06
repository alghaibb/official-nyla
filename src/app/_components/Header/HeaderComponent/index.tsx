'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Header } from '../../../../payload/payload-types'
import { noHeaderFooterUrls } from '../../../constants'
import { Gutter } from '../../Gutter'
import { HeaderNav } from '../Nav'
import RightSideNav from '../RightSideNav'

import classes from './index.module.scss'

const HeaderComponent = ({ header }: { header: Header }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // Disable scrolling when the menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [isMenuOpen])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (isMenuOpen && !(e.target as HTMLElement).closest(`.${classes.mobileNav}`)) {
        setIsMenuOpen(false)
      }
    }

    // Add event listener to handle clicks outside the menu
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [isMenuOpen])

  // Mobile menu links
  const mobileMenuLinks = [
    { title: 'Shop', link: '/products' },
    { title: 'New Arrivals', link: '/new-arrivals' },
    { title: 'Hijabs', link: '/products/hijabs' },
    { title: 'Abayas', link: '/products/abayas' },
    { title: 'Accessories', link: '/products/accessories' },
  ]

  return (
    <>
      {isMenuOpen && <div className={classes.backdrop} onClick={toggleMenu}></div>}
      <nav
        className={[classes.header, noHeaderFooterUrls.includes(pathname) && classes.hide]
          .filter(Boolean)
          .join(' ')}
      >
        <Gutter className={classes.wrap}>
          <button onClick={toggleMenu} className={classes.hamburger}>
            <div className={classes.hamburgerIcon}></div>
          </button>

          <Link href="/">
            <h1 className={classes.shopName}>Nyla</h1>
          </Link>

          <HeaderNav header={header} />
          <RightSideNav header={header} />
          <div className={`${classes.mobileNav} ${isMenuOpen ? classes.mobileNavOpen : ''}`}>
            <button onClick={toggleMenu} className={classes.closeContainer}>
              <svg
                className={classes.closeIcon}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18 18 6m0 12L6 6"
                />
              </svg>
            </button>

            {/* Mobile Menu Nav Links */}
            <ul className={classes.mobileNavList}>
              {mobileMenuLinks.map(link => (
                <li key={link.title}>
                  <Link href={link.link} onClick={toggleMenu}>
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social Medias */}
            <div className={classes.menuFooterContainer}>
              <div className={classes.menuFooterLinks}>
                <Link href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                  Instagram
                </Link>
                <Link href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer">
                  Tiktok
                </Link>
                <Link href="/contact" onClick={toggleMenu}>
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </Gutter>
      </nav>
    </>
  )
}

export default HeaderComponent
