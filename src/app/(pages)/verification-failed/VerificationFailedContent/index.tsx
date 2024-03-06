'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '../../../_components/Button'
import { Input } from '../../../_components/Input'
import { LoadingSpinner } from '../../../_components/LoadingSpinner'
import { Message } from '../../../_components/Message'

import classes from './index.module.scss'

type FormData = {
  email: string
}

const VerificationFailedContent = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email }),
      })

      if (!response.ok) {
        throw new Error('Failed to resend verification email. Please try again later.')
      }

      setEmailSent(true)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={classes.verificationFailedContent}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <p className={classes.verificationFailedContentText}>
          We were unable to verify your email address. Please enter your email to resend the
          verification link.
        </p>
        <Message error={error} className={classes.message} />
        <div className={classes.resendEmailInput}>
          <Input
            name="email"
            type="email"
            register={register}
            required
            error={errors.email}
            label="Your Email"
          />
        </div>
        <div className={classes.resendWrapper}>
          {isLoading ? (
            <div className={classes.loadingSpinnerContainer}>
              <LoadingSpinner />
            </div>
          ) : emailSent ? (
            <p className={classes.verificationFailedContentText}>Email resent successfully.</p>
          ) : (
            <Button
              className={classes.resendVerificationButton}
              appearance="primary"
              label="Resend Verification Email"
              type="submit"
            />
          )}
        </div>
      </form>
    </div>
  )
}

export default VerificationFailedContent
