'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { FaFacebook, FaInstagram, FaTiktok, FaTwitter } from 'react-icons/fa'
import { MdArrowRightAlt } from 'react-icons/md'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Footer } from '../../../../payload/payload-types'
import { inclusions, noHeaderFooterUrls } from '../../../constants'
import { Button } from '../../Button'
import { Gutter } from '../../Gutter'
import { HR } from '../../HR'
import { Input } from '../../Input'

import classes from './index.module.scss'

const FooterComponent = ({ footer }: { footer: Footer }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const pathname = usePathname()

  const onSubmit = data => {
    console.log(data)
  }

  return (
    <footer className={noHeaderFooterUrls.includes(pathname) ? classes.hide : ''}>
      <Gutter>
        <ul className={classes.inclusions}>
          {inclusions.map((inclusion, index) => (
            <li key={inclusion.title}>
              <Image
                key={index}
                src={inclusion.icon}
                alt={inclusion.title}
                width={36}
                height={36}
                className={classes.inclusionIcon}
              />
              <h5 className={classes.inclusionTitle}>{inclusion.title}</h5>
              <p>{inclusion.description}</p>
            </li>
          ))}
        </ul>
      </Gutter>

      <div className={classes.footer}>
        <Gutter>
          <div className={classes.wrap}>
            {/* Footer - Title & Shory Story Section */}
            <div className={classes.footerLeft}>
              <Link href="/" className={classes.shopNameLink}>
                <h1 className={classes.shopName}>Nyla</h1>
              </Link>
              <p className={classes.shortStory}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum, eligendi iste? Optio
                dolore earum voluptatum illum non a, ipsa exercitationem. Molestias rerum animi
                perspiciatis dicta repellendus ad vel quam mollitia.
              </p>
            </div>

            {/* Footer - About Us Section */}
            <div className={classes.footerMiddle}>
              <h5 className={classes.footerMiddleTitle}>About Us</h5>
              <Link href="/our-story">Our Story</Link>
              <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="/refund-policy">Refund Policy</Link>
              <Link href="/shipping-policy">Shipping Policy</Link>
              <Link href="/terms-of-service">Terms of Service</Link>
              <Link href="/contact">Contact Us</Link>
            </div>

            {/* Footer - Socials & Newsletter Subscription */}
            <div className={classes.footerRight}>
              <h5 className={classes.footerRightTitle}>Follow Us</h5>
              <div className={classes.socials}>
                <Link href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                  <FaFacebook width={24} height={24} className={classes.socialIcon} />
                </Link>
                <Link href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                  <FaInstagram width={24} height={24} className={classes.socialIcon} />
                </Link>
                <Link href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer">
                  <FaTiktok width={24} height={24} className={classes.socialIcon} />
                </Link>
                <Link href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                  <FaTwitter width={24} height={24} className={classes.socialIcon} />
                </Link>
              </div>
            </div>
            <div className={classes.newsletter}>
              <h5>Lets keep in touch</h5>
              <Input
                name="email"
                type="email"
                label="Subscribe to our newsletter to keep up with the latest updates on products and promotions"
                placeholder="Email Address"
                register={register}
              />
              <button
                type="submit"
                onClick={handleSubmit(onSubmit)}
                className={classes.subscribeBtn}
              >
                <p className={classes.subscribeText}>Subscribe</p>
              </button>
            </div>
          </div>
        </Gutter>
        <HR className={classes.footerDivider} />

        {/* Footer - End */}
        <div className={classes.footerEnd}>
          <p className={classes.nylaAllRights}>© 2024 Nyla. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default FooterComponent
