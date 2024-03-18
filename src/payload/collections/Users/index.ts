/* eslint-disable @typescript-eslint/no-implicit-any-catch */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { CollectionConfig } from 'payload/types'

// import { loginAfterCreate } from './hooks/loginAfterCreate'
import { admins } from '../../access/admins'
import { anyone } from '../../access/anyone'
import adminsAndUser from './access/adminsAndUser'
import { checkRole } from './checkRole'
import { customerProxy } from './endpoints/customer'
import { createStripeCustomer } from './hooks/createStripeCustomer'
import { ensureFirstUserIsAdmin } from './hooks/ensureFirstUserIsAdmin'
import { resolveDuplicatePurchases } from './hooks/resolveDuplicatePurchases'
import { CustomerSelect } from './ui/CustomerSelect'

const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email'],
  },
  access: {
    read: adminsAndUser,
    create: anyone,
    update: adminsAndUser,
    delete: admins,
    admin: ({ req: { user } }) => checkRole(['admin'], user),
  },
  hooks: {
    beforeChange: [createStripeCustomer],
    // afterChange: [loginAfterCreate],
  },
  auth: {
    tokenExpiration: 604800,
    verify: {
      generateEmailHTML: ({ token, user }) => {
        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/verify?token=${token}`

        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
          <style>
              body {
                  font-family: 'Jost', sans-serif;
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                  background-color: #F4F4F5;
                  color: #18181B;
              }
              .email-container {
                  max-width: 600px;
                  margin: 40px auto;
                  padding: 20px;
                  background-color: #FFFFFF;
                  border-radius: 8px;
                  text-align: center;
                  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
              }
              .email-header {
                  font-size: 28px;
                  color: #18181B;
                  margin-bottom: 20px;
              }
              .email-content {
                  font-size: 16px;
                  line-height: 1.5;
                  margin-bottom: 30px;
              }
              .pTags {
                color: #18181B;
              }
              .nylaTitle {
                text-transform: uppercase;
              }              
              @media (max-width: 600px) {
                  .email-header {
                      font-size: 24px;
                  }
                  .verify-button {
                      padding: 10px 20px;
                  }
              }
          </style>
        </head>
        <body>
            <div class="email-container">
                <h1 class="email-header">Welcome to <span class="nylaTitle">Nyla</span></h1>
                <div class="email-content">
                    <p class="pTags">Hi ${user.name},</p>
                    <p class="pTags">Thank you for signing up. Please verify your email address to complete your registration and start exploring Nyla.</p>
                    <a href="${url}" style="display: inline-block; background-color: #18181B; color: #F4F4F5 !important; padding: 15px 30px; font-size: 16px; border-radius: 10px; text-decoration: none; margin-top: 20px;" class="verify-button" target="_blank" rel="noopener noreferrer">Verify Email</a>
                    <p class="pTags" style="margin-top: 20px;">If you did not sign up for Nyla, you can ignore this email</p>
                </div>
            </div>
        </body>
        </html>
        `
      },
    },
    forgotPassword: {
      generateEmailHTML: ({ token, user }) => {
        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/reset-password?token=${token}`

        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
          <style>
              body {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                  background-color: #F4F4F5;
                  color: #18181B;
              }
              .email-container {
                  max-width: 600px;
                  margin: 40px auto;
                  padding: 20px;
                  background-color: #FFFFFF;
                  border-radius: 8px;
                  text-align: center;
                  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
              }
              .email-header {
                  font-size: 28px;
                  color: #18181B;
                  margin-bottom: 20px;
                  text-transform: uppercase;
              }
              .email-content {
                  font-size: 16px;
                  line-height: 1.5;
                  margin-bottom: 30px;
              }
              .pTags {
                color: #18181B;
              }
              @media (max-width: 600px) {
                  .email-header {
                      font-size: 24px;
                  }
                  .reset-password-button {
                      padding: 10px 20px;
                  }
              }
          </style>
        </head>
        <body>
            <div class="email-container">
                <h1 class="email-header">Nyla</h1>
                <div class="email-content">
                    <p class="pTags">Hi ${(user as { name: string }).name},</p>
                    <p class="pTags">Click the button below to begin resetting your password</p>
                    <a href="${url}" style="display: inline-block; background-color: #18181B; color: #F4F4F5 !important; padding: 15px 30px; font-size: 16px; border-radius: 10px; text-decoration: none; margin-top: 20px;" class="reset-password-button" target="_blank" rel="noopener noreferrer">Reset Password</a>
                    <p class="pTags" style="margin-top: 20px;">If you did not request this, you can ignore this email</p>
                </div>
            </div>
        </body>
        </html>
        `
      },
    },
    maxLoginAttempts: 5,
    lockTime: 600 * 1000,
  },
  endpoints: [
    {
      path: '/:teamID/customer',
      method: 'get',
      handler: customerProxy,
    },
    {
      path: '/:teamID/customer',
      method: 'patch',
      handler: customerProxy,
    },
  ],
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      defaultValue: ['customer'],
      options: [
        {
          label: 'admin',
          value: 'admin',
        },
        {
          label: 'customer',
          value: 'customer',
        },
      ],
      hooks: {
        beforeChange: [ensureFirstUserIsAdmin],
      },
      access: {
        read: admins,
        create: admins,
        update: admins,
      },
    },
    {
      name: 'purchases',
      label: 'Purchases',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      hooks: {
        beforeChange: [resolveDuplicatePurchases],
      },
    },
    {
      name: 'stripeCustomerID',
      label: 'Stripe Customer',
      type: 'text',
      access: {
        read: ({ req: { user } }) => checkRole(['admin'], user),
      },
      admin: {
        position: 'sidebar',
        components: {
          Field: CustomerSelect,
        },
      },
    },
    {
      label: 'Cart',
      name: 'cart',
      type: 'group',
      fields: [
        {
          name: 'items',
          label: 'Items',
          type: 'array',
          interfaceName: 'CartItems',
          fields: [
            {
              name: 'product',
              type: 'relationship',
              relationTo: 'products',
            },
            {
              name: 'quantity',
              type: 'number',
              min: 0,
              admin: {
                step: 1,
              },
            },
          ],
        },
        // If you wanted to maintain a 'created on'
        // or 'last modified' date for the cart
        // you could do so here:
        // {
        //   name: 'createdOn',
        //   label: 'Created On',
        //   type: 'date',
        //   admin: {
        //     readOnly: true
        //   }
        // },
        // {
        //   name: 'lastModified',
        //   label: 'Last Modified',
        //   type: 'date',
        //   admin: {
        //     readOnly: true
        //   }
        // },
      ],
    },
    {
      name: 'skipSync',
      label: 'Skip Sync',
      type: 'checkbox',
      admin: {
        position: 'sidebar',
        readOnly: true,
        hidden: true,
      },
    },
  ],
  timestamps: true,
}

export default Users
