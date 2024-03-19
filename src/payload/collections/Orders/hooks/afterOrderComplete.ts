import type { AfterChangeHook } from 'payload/dist/collections/config/types'

import type { Order } from '../../../payload-types'

export const sendOrderConfirmation: AfterChangeHook<Order> = async ({ req, doc }) => {
  const { payload } = req

  let recipientEmail = ''

  if (typeof doc.orderedBy === 'object' && doc.orderedBy !== null && 'email' in doc.orderedBy) {
    recipientEmail = doc.orderedBy.email
  } else if (typeof doc.orderedBy === 'string') {
    recipientEmail = doc.orderedBy
  }

  if (!recipientEmail) {
    console.error('No recipient email found for order confirmation email')
    return
  }

  const formatedItems = doc.items
    .map(item => {
      const productName =
        typeof item.product === 'object' ? item.product.title : 'Product name not found'
      const price = (item.price / 100).toFixed(2)
      const quantity = item.quantity
      return `<div class="order-item">${productName} x ${quantity} <span style="float:right;">$${price}</span></div>`
    })
    .join('')

  const formattedTotal = (doc.total / 100).toFixed(2)

  await payload.sendEmail({
    to: recipientEmail,
    from: 'Nyla',
    subject: 'Order Confirmation',
    html: `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
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
            color: #18181B;
          }
          a.button {
            background-color: #18181b; 
            color: #f4f4f5;
            padding: 15px 30px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            border-radius: 15px;
            margin-top: 20px;
          }
          .order-summary {
            text-align: left;
            background-color: #f8f8f8;
            padding: 15px;
            border-radius: 4px;
          }
          .order-item {
            border-bottom: 1px solid #ddd;
            padding: 10px 0;
            margin: 10px 0;
          }
          .total-price {
            font-weight: bold;
            font-size: 18px;
            margin-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
        <h1>Your Order Confirmation</h1>
        <p>Thank you for your purchase!</p>
        <p>We're getting your order ready to be shipped. We will notify you when it has been sent.</p>
    
        <div class="order-summary">
          <h3>Order #${doc.id} Summary</h3>
          ${formatedItems}
          <div class="total-price">
            Total: $${formattedTotal}
          </div>
        </div>
    
        <a href="${process.env.PAYLOAD_PUBLIC_SERVER_URL}/orders/${doc.id}" class="button" rel="noopener noreferrer" target="_blank">View Your Order</a>
      </div>
    </body>
    </html>
      `,
  })

  return
}
