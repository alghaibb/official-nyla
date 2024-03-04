import React from 'react'
import { Metadata } from 'next'

import { RenderParams } from '../../_components/RenderParams'
import { mergeOpenGraph } from '../../_utilities/mergeOpenGraph'
import ContactForm from './ContactForm'

import classes from './index.module.scss'

export default async function Contact() {
  return (
    <section className={classes.contact}>
      <div className={classes.formWrapper}>
        <div className={classes.formContainer}>
          <RenderParams className={classes.params} />
          <div className={classes.formTitle}>
            <h3>Contact Us</h3>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  )
}

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact us for support or to ask questions.',
  openGraph: mergeOpenGraph({
    title: 'Contact',
    url: '/contact',
  }),
}
