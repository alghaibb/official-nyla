/* eslint-disable @typescript-eslint/no-implicit-any-catch */
import dotenv from 'dotenv'
import next from 'next'
import nextBuild from 'next/dist/build'
import nodemailer from 'nodemailer'
import path from 'path'

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
})

import express from 'express'
import payload from 'payload'

import { seed } from './payload/seed'

const app = express()
const PORT = process.env.PORT || 3000

const start = async (): Promise<void> => {
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.EMAIL_USER,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: process.env.ACCESS_TOKEN,
    },
  })

  await payload.init({
    email: {
      fromName: 'Nyla',
      fromAddress: process.env.EMAIL_USER,
      transport,
    },

    secret: process.env.PAYLOAD_SECRET || '',
    express: app,
    onInit: () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
    },
  })

  // Add a dynamic email verification endpoint
  app.get('/verify', async (req, res) => {
    // Extract the token from query parameters
    const { token } = req.query

    if (!token || typeof token !== 'string') {
      return res.status(400).send('Verification token is required.')
    }

    try {
      // Dynamically verify the email with the provided token
      await payload.verifyEmail({
        collection: 'users',
        token: token,
      })

      // Redirect to a success page on your frontend
      res.redirect(`${process.env.NEXT_PUBLIC_SERVER_URL}/verification-success`)
    } catch (error) {
      console.error('Verification error:', error)
      // Redirect to a failure page
      res.redirect(`${process.env.NEXT_PUBLIC_SERVER_URL}/verification-failed`)
    }
  })

  if (process.env.PAYLOAD_SEED === 'true') {
    await seed(payload)
    process.exit()
  }

  if (process.env.NEXT_BUILD) {
    app.listen(PORT, async () => {
      payload.logger.info(`Next.js is now building...`)
      // @ts-expect-error
      await nextBuild(path.join(__dirname, '../'))
      process.exit()
    })

    return
  }

  const nextApp = next({
    dev: process.env.NODE_ENV !== 'production',
  })

  const nextHandler = nextApp.getRequestHandler()

  app.use((req, res) => nextHandler(req, res))

  nextApp.prepare().then(() => {
    payload.logger.info('Starting Next.js...')

    app.listen(PORT, async () => {
      payload.logger.info(`Next.js App URL: ${process.env.PAYLOAD_PUBLIC_SERVER_URL}`)
    })
  })
}

start()
