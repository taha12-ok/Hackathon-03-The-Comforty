import { defineType } from "sanity";

export const productSchema = defineType({
  name: "products",
  title: "Products",
  type: "document",
  fields: [
    {
      name: 'product',
      title: 'Product',
      type: 'document',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string'
        },
        {
          name: 'price',
          title: 'Price',
          type: 'number'
        },
        {
          name: 'image',
          title: 'Image',
          type: 'image',
          options: {
            hotspot: true
          }
        },
        {
          name: 'badge',
          title: 'Badge',
          type: 'string'
        },
        {
          name: 'inventory',
          title: 'Inventory',
          type: 'number'
        },
        {
          name: 'priceWithoutDiscount',
          title: 'Price Without Discount',
          type: 'number'
        }
      ]
    },
    {
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Featured", value: "featured" },
          {
            title: "Follow products and discounts on Instagram",
            value: "instagram",
          },
          { title: "Gallery", value: "gallery" },
        ],
      },
    },
  ],
});