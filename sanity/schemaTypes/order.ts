// schemas/order.js
export default {
  name: 'order',
  title: 'Orders',
  type: 'document',
  fields: [
    {
      name: 'orderId',
      title: 'Order ID',
      type: 'string',
    },
    {
      name: 'customer',
      title: 'Customer',
      type: 'object',
      fields: [
        { name: 'name', type: 'string' },
        { name: 'email', type: 'string' },
        { name: 'phone', type: 'string' },
        { name: 'address', type: 'string' },
        { name: 'city', type: 'string' },
        { name: 'country', type: 'string' },
        { name: 'postalCode', type: 'string' },
        { name: 'paymentMethod', type: 'string' }
      ]
    },
    {
      name: 'items',
      title: 'Order Items',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'productId', type: 'string' },
          { name: 'title', type: 'string' },
          { name: 'quantity', type: 'number' },
          { name: 'price', type: 'number' }
        ]
      }]
    },
    {
      name: 'total',
      title: 'Total Amount',
      type: 'number'
    },
    {
      name: 'status',
      title: 'Order Status',
      type: 'string',
      options: {
        list: [
          'pending',
          'processing',
          'completed',
          'cancelled'
        ]
      }
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime'
    }
  ]
}