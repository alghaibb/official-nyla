'use client'

import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast, ToastContainer } from 'react-toastify'

import { Button } from '../../../_components/Button'
import { Input } from '../../../_components/Input'
import { LoadingSpinner } from '../../../_components/LoadingSpinner'
import { Message } from '../../../_components/Message'
import { Textarea } from '../../../_components/Textarea'

import 'react-toastify/dist/ReactToastify.css'

import classes from './index.module.scss'

type FormData = {
  orderId?: string
  name: string
  email: string
  subject: string
  message: string
}

const ContactForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit = useCallback(
    async (data: FormData) => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/contact-form-submission', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })

        if (!response.ok) throw new Error('Network response was not ok.')

        setTimeout(() => {
          reset()
          setIsLoading(false)
          setIsSubmitted(true)
        }, 2000)
      } catch (error: any) {
        setTimeout(() => {
          toast.error('Failed to send message. Please try again later.')
          console.error('Contact form submission error:', error)
          setIsLoading(false)
        }, 2000)
      }
    },
    [reset],
  )

  const handleNewMessage = () => {
    setIsSubmitted(false)
  }

  return (
    <>
      {isSubmitted ? (
        <div className={classes.successMessage}>
          <p>Your message has been sent. We'll get back to you as soon as possible.</p>
          <Button
            appearance="primary"
            label="Send Another Message"
            onClick={handleNewMessage}
            className={classes.submit}
          />
        </div>
      ) : (
        // Display the form if the message hasn't been submitted yet
        <form onSubmit={handleSubmit(onSubmit)} className={classes.contactForm}>
          <Message className={classes.message} />
          <Input
            name="orderId"
            label="Order ID"
            register={register}
            error={errors.orderId?.message}
            type="text"
            disabled={isLoading}
          />
          <div className={classes.contactInputRow}>
            <Input
              name="name"
              label="Name"
              register={register}
              error={errors.name?.message}
              type="text"
              disabled={isLoading}
              required
            />
            <Input
              name="email"
              label="Email"
              register={register}
              error={errors.email?.message}
              type="email"
              disabled={isLoading}
              required
            />
          </div>
          <Input
            name="subject"
            label="Subject"
            register={register}
            error={errors.subject?.message}
            type="text"
            disabled={isLoading}
            required
          />
          <Textarea
            name="message"
            label="Message"
            register={register}
            error={errors.message?.message}
            required
            disabled={isLoading}
          />
          <div className={classes.buttonWrapper}>
            {isLoading ? (
              <div className={classes.loadingSpinnerContainer}>
                <LoadingSpinner />
              </div>
            ) : (
              <Button
                type="submit"
                appearance="primary"
                label="Send Message"
                disabled={isLoading}
                className={classes.submit}
              />
            )}
          </div>
        </form>
      )}
    </>
  )
}

export default ContactForm
