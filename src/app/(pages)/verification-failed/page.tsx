import { Metadata } from 'next'

import { Gutter } from '../../_components/Gutter'
import { mergeOpenGraph } from '../../_utilities/mergeOpenGraph'
import VerificationFailedContent from './VerificationFailedContent'

import classes from './index.module.scss'

export default async function VerificationFailed() {
  return (
    <Gutter className={classes.verificationFailed}>
      <h1 className={classes.verificationFailedPageTitle}>Verification Failed</h1>
      <VerificationFailedContent />
    </Gutter>
  )
}

export const metadata: Metadata = {
  title: 'Verification Failed',
  description: 'Create an account or log in to your existing account.',
  openGraph: mergeOpenGraph({
    title: 'Verification Failed',
    url: '/verification-failed',
  }),
}
