'use client'

import React, { useCallback, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { Bounce, toast, ToastContainer } from 'react-toastify'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import { Button } from '../../../_components/Button'
import { Input } from '../../../_components/Input'
import { LoadingSpinner } from '../../../_components/LoadingSpinner'
import { Message } from '../../../_components/Message'

import 'react-toastify/dist/ReactToastify.css'

import classes from './index.module.scss'

type FormData = {
  name: string
  email: string
  password: string
  passwordConfirm: string
}

const CreateAccountForm: React.FC = () => {
  const searchParams = useSearchParams()
  const allParams = searchParams.toString() ? `?${searchParams.toString()}` : ''
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>()

  const password = useRef({})
  password.current = watch('password', '')

  const onSubmit = useCallback(
    async (data: FormData) => {
      setLoading(true) // Start loading

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          const message = await response.text()
          throw new Error(message || 'There was an error creating the account.')
        }

        setLoading(false)

        toast.success('Registration successful! Please check your email to verify your account.', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: 'dark',
          transition: Bounce,
          onClose: () => {
            router.push('/login')
          },
        })
      } catch (error) {
        console.error(error)
        setError(error.message)
        setLoading(false)
      }
    },
    [router],
  )

  const togglePasswordVisibility = () => setShowPassword(!showPassword)

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnHover={false}
        draggable
        theme="dark"
        transition={Bounce}
        className={classes.toastContainer}
      />
      <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
        <Message error={error} className={classes.message} />
        <Input
          name="name"
          label="Name"
          required
          register={register}
          error={errors.email}
          type="text"
          disabled={loading}
        />
        <Input
          name="email"
          label="Email Address"
          required
          register={register}
          error={errors.email}
          type="email"
          disabled={loading}
        />
        <div className={classes.passwordInput}>
          <Input
            name="password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            required
            register={register}
            error={errors.password}
            disabled={loading}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={classes.showHidePassword}
          >
            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
        </div>
        <div className={classes.confirmPasswordInput}>
          <Input
            name="passwordConfirm"
            type={showPassword ? 'text' : 'password'}
            label="Confirm Password"
            required
            register={register}
            validate={value => value === password.current || 'The passwords do not match'}
            error={errors.passwordConfirm}
            disabled={loading}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={classes.showHidePassword}
          >
            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
        </div>
        <div className={classes.buttonWrapper}>
          {loading ? (
            <div className={classes.loadingSpinnerContainer}>
              <LoadingSpinner />
            </div>
          ) : (
            <Button
              type="submit"
              appearance="primary"
              label="Create Account"
              disabled={loading}
              className={classes.submit}
            />
          )}
        </div>
        <div className={classes.loginLink}>
          {'Already have an account? '}
          <Link href={`/login${allParams}`}>Login</Link>
        </div>
      </form>
    </>
  )
}

export default CreateAccountForm
