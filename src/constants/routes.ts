export const ROUTES = {
  home: '/',
  product: (id: string) => `/product/${id}`,
  checkout: '/checkout',
  orderSuccess: (id: string) => `/checkout/success?orderId=${id}`,
  admin: {
    root: '/admin',
    newProduct: '/admin/products/new',
    editProduct: (id: string) => `/admin/products/${id}/edit`,
  },
} as const
