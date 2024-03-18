import type { CollectionConfig } from 'payload/types'

import { admins } from '../../access/admins'
import { adminsOrLoggedIn } from '../../access/adminsOrLoggedIn'
import { adminsOrOrderedBy } from './access/adminsOrOrderedBy'
import { clearUserCart } from './hooks/clearUserCart'
import { populateOrderedBy } from './hooks/populateOrderedBy'
import { updateUserPurchases } from './hooks/updateUserPurchases'
import { LinkToPaymentIntent } from './ui/LinkToPaymentIntent'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'createdAt',
    defaultColumns: ['createdAt', 'orderedBy'],
    preview: doc => `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/orders/${doc.id}`,
  },
  hooks: {
    afterChange: [
      updateUserPurchases,
      clearUserCart,
      ({ doc, operation, req }) => {
        const { customerEmail, items, total, id: orderId } = doc
        if (operation === 'create') {
          req.payload.sendEmail({
            from: process.env.EMAIL_USER,
            to: customerEmail,
            subject: 'Order Confirmation',
            html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
                }
                .email-content {
                  font-size: 16px;
                  line-height: 1.5;
                  margin-bottom: 30px;
                }
                ul {
                  text-align: left;
                  list-style-type: none;
                  padding: 0;
                }
                li {
                  margin: 10px 0;
                }
                @media (max-width: 600px) {
                  .email-header {
                    font-size: 24px;
                  }
                }
              </style>
            </head>
            <body>
              <div class="email-container">
                <h1 class="email-header">NYLA Order Confirmation - Order ID: ${orderId}</h1>
                <div class="email-content">
                  <p>Hi,</p>
                  <p>Thank you for your order. Here is your order summary:</p>
                  <ul>
                    ${items
                      .map(
                        (item: { name: string; quantity: number; price: number }) =>
                          `<li>${item.name} - ${item.quantity} x $${item.price}</li>`,
                      )
                      .join('')}
                  </ul>
                  <p><strong>Total: $${total}</strong></p>
                  <p>If you have any questions or need to make changes to your order, please contact us.</p>
                </div>
              </div>
            </body>
            </html>
          `,
          })
        }
      },
    ],
  },
  access: {
    read: adminsOrOrderedBy,
    update: admins,
    create: adminsOrLoggedIn,
    delete: admins,
  },
  fields: [
    {
      name: 'orderedBy',
      type: 'relationship',
      relationTo: 'users',
      hooks: {
        beforeChange: [populateOrderedBy],
      },
    },
    {
      name: 'stripePaymentIntentID',
      label: 'Stripe Payment Intent ID',
      type: 'text',
      admin: {
        position: 'sidebar',
        components: {
          Field: LinkToPaymentIntent,
        },
      },
    },
    {
      name: 'total',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'price',
          type: 'number',
          min: 0,
        },
        {
          name: 'quantity',
          type: 'number',
          min: 0,
        },
      ],
    },
  ],
}
