// schemas/order.ts

export const orderSchema = {
  name: 'order',
  title: 'Order',
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
        { name: 'paymentMethod', type: 'string' },
      ],
    },
    {
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [{
        type: 'object',
        name: 'orderItem',
        fields: [
          { name: 'productId', type: 'string' },
          { name: 'title', type: 'string' },
          { name: 'quantity', type: 'number' },
          { name: 'price', type: 'number' },
        ],
      }],
    },
    {
      name: 'total',
      title: 'Total',
      type: 'number',
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: ['pending', 'processing', 'completed', 'cancelled'],
      },
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
    },
  ],
}
