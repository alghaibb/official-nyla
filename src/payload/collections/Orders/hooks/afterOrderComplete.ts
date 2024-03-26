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

  const formattedItems = doc.items
    .map(item => {
      const productName =
        typeof item.product === 'object' ? item.product.title : 'Product name not found'
      const price = (item.price / 100).toFixed(2)
      const quantity = item.quantity
      return `<div>${productName} x ${quantity} - $${price}</div>`
    })
    .join('')

  const formattedTotal = (doc.total / 100).toFixed(2)

  await payload.sendEmail({
    to: recipientEmail,
    from: 'Nyla',
    subject: 'Your Order Confirmation - Order #' + doc.id,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      background-color: #f2f2f2;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      font-size: 24px;
      margin-bottom: 20px;
    }
    .item {
      border-bottom: 1px solid #eeeeee;
      padding: 10px 0;
    }
    .footer {
      margin-top: 20px;
      font-size: 12px;
      color: #777;
    }
    .button {
      display: inline-block;
      background-color: #18181B;
      color: #F4F4F5;
      padding: 10px 20px;
      margin: 20px 0;
      border-radius: 5px;
      text-decoration: none;
    }
    .contact {
      color: #777;
      text-decoration: underline;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">Thank you for your order <br>Order #${doc.id}!</div>
    <p>We're excited to let you know that we've received your order. Here are the details:</p>
    <div>
      ${formattedItems}
      <div>Total: $${formattedTotal}</div>
    </div>
    <a href="${process.env.PAYLOAD_PUBLIC_SERVER_URL}/account/orders/${doc.id}" class="button">View Your Order</a>
    <div class="footer">
      If you have any questions, you can reply to this email or <a href="${process.env.PAYLOAD_PUBLIC_SERVER_URL}/contact" class="contact">contact us</a>.
    </div>
  </div>
</body>
</html>
    `,
  })

  return
}
