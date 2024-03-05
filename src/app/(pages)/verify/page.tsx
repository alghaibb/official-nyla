import React from 'react'
import { Metadata } from 'next'

import { RenderParams } from '../../_components/RenderParams'
import { mergeOpenGraph } from '../../_utilities/mergeOpenGraph'
import VerifyPage from './VerifyPage'

import classes from './index.module.scss'

export default async function Verify() {
  return (
    <section className={classes.verify}>
      <RenderParams className={classes.params} />
      <VerifyPage />
    </section>
  )
}

export const metadata: Metadata = {
  title: 'Verify',
  description: 'Verify your account.',
  openGraph: mergeOpenGraph({
    title: 'Verify',
    url: '/verify',
  }),
}
