import { Metadata } from 'next'
import Link from 'next/link'

import { mergeOpenGraph } from '../../_utilities/mergeOpenGraph'

import classes from './index.module.scss'

export default async function VerificationSuccess() {
  return (
    <div className={classes.verificationSuccess}>
      <h1 className={classes.verificationPageTitle}>Verification Success</h1>
      <p className={classes.verificationPageDescription}>
        Your email has been verified, you can now <Link href="/login">login</Link> to your account
      </p>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Verification Success',
  description: 'Create an account or log in to your existing account.',
  openGraph: mergeOpenGraph({
    title: 'Verification Success',
    url: '/verification-success',
  }),
}
