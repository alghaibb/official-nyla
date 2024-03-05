'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { useAuth } from '../../../_providers/Auth'

import classes from './index.module.scss'

const VerifyPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState('Verifying...')
  const [error, setError] = useState('')

  const { Verify } = useAuth()

  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      Verify({ token })
        .then(() => {
          setStatus('Account verified. Redirecting...')
          setTimeout(() => {
            router.push('/')
          }, 2000)
        })
        .catch(err => {
          setError(err.message)
        })
    } else {
      setError('No token provided.')
    }
  }, [searchParams, Verify, router])

  return (
    <div>
      {status && <p>{status}</p>}
      {error && <p>Error: {error}</p>}
    </div>
  )
}

export default VerifyPage
