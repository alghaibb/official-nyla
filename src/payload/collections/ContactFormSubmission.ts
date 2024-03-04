import type { CollectionConfig } from 'payload/types'

export const ContactFormSubmission: CollectionConfig = {
  slug: 'contact-form-submission',
  fields: [
    {
      type: 'text',
      name: 'orderId',
      label: 'Order ID',
      admin: {
        readOnly: true,
      },
    },
    {
      type: 'text',
      name: 'name',
      label: 'Name',
      admin: {
        readOnly: true,
      },
    },
    {
      type: 'text',
      name: 'email',
      label: 'From Email',
      admin: {
        readOnly: true,
      },
    },
    {
      type: 'text',
      name: 'subject',
      label: 'Subject',
      admin: {
        readOnly: true,
      },
    },
    {
      type: 'textarea',
      name: 'message',
      label: 'Message',
      admin: {
        readOnly: true,
      },
    },
    {
      type: 'text',
      name: 'source',
      label: 'Source',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
}
