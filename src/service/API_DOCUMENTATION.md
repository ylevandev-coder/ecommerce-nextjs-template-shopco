# Strapi E-Commerce Plugin - Customer API Documentation

This document describes the API endpoints available for customer-facing applications to interact with the Strapi E-Commerce plugin.

## Base URL

All API endpoints are prefixed with:
```
/api/strapi-ecommerce
```

## Authentication

Most endpoints are public and don't require authentication. However, if you need to associate carts with users, you can pass a `userId` query parameter where applicable.

---

## 📦 Products

### Get All Products

Retrieve a list of products with optional filtering, sorting, and pagination.

**Endpoint:** `GET /api/strapi-ecommerce/products`

**Query Parameters:**
- `filters` (object): Filter products (e.g., `filters[category][$eq]=1`, `filters[status][$eq]=published`)
- `sort` (string): Sort order (e.g., `sort=name:asc`, `sort=price:desc`)
- `pagination[page]` (number): Page number (default: 1)
- `pagination[pageSize]` (number): Items per page (default: 25)
- `populate` (string): Relations to populate (e.g., `populate=category`, `populate=*`)

**Example Request:**
```bash
GET /api/strapi-ecommerce/products?filters[status][$eq]=published&sort=createdAt:desc&pagination[page]=1&pagination[pageSize]=20&populate=category
```

**Example Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Product Name",
      "description": "Product description",
      "sku": "PROD-001",
      "regularPrice": "29.99",
      "salePrice": null,
      "price": "29.99",
      "stock": 100,
      "status": "published",
      "category": {
        "id": 1,
        "name": "Category Name"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "pageCount": 5,
      "total": 100
    }
  }
}
```

### Get Single Product

Retrieve details of a specific product.

**Endpoint:** `GET /api/strapi-ecommerce/products/:id`

**Query Parameters:**
- `populate` (string): Relations to populate (e.g., `populate=category`, `populate=*`)

**Example Request:**
```bash
GET /api/strapi-ecommerce/products/1?populate=category
```

**Example Response:**
```json
{
  "data": {
    "id": 1,
    "name": "Product Name",
    "description": "Product description",
    "sku": "PROD-001",
    "regularPrice": "29.99",
    "salePrice": null,
    "price": "29.99",
    "stock": 100,
    "status": "published",
    "category": {
      "id": 1,
      "name": "Category Name"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 📁 Product Categories

### Get All Categories

Retrieve a list of product categories.

**Endpoint:** `GET /api/strapi-ecommerce/product-categories`

**Query Parameters:**
- `filters` (object): Filter categories
- `sort` (string): Sort order (e.g., `sort=name:asc`)
- `pagination[page]` (number): Page number
- `pagination[pageSize]` (number): Items per page
- `populate` (string): Relations to populate

**Example Request:**
```bash
GET /api/strapi-ecommerce/product-categories?sort=name:asc&populate=*
```

**Example Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Electronics",
      "slug": "electronics",
      "description": "Electronic products",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 1
    }
  }
}
```

### Get Single Category

Retrieve details of a specific category.

**Endpoint:** `GET /api/strapi-ecommerce/product-categories/:id`

**Query Parameters:**
- `populate` (string): Relations to populate

**Example Request:**
```bash
GET /api/strapi-ecommerce/product-categories/1?populate=*
```

---

## 🛒 Shopping Cart

### Get or Create Cart

Get an existing cart by session ID or user ID, or create a new one if it doesn't exist.

**Endpoint:** `GET /api/strapi-ecommerce/carts`

**Query Parameters:**
- `sessionId` (string, required): Unique session identifier (e.g., UUID from frontend)
- `userId` (number, optional): User ID if customer is logged in

**Example Request:**
```bash
GET /api/strapi-ecommerce/carts?sessionId=abc123-def456-ghi789
```

**Example Response:**
```json
{
  "id": 1,
  "sessionId": "abc123-def456-ghi789",
  "subtotal": "0.00",
  "taxAmount": "0.00",
  "discountAmount": "0.00",
  "shippingCost": "0.00",
  "total": "0.00",
  "currency": "USD",
  "items": [],
  "expiresAt": "2024-02-01T00:00:00.000Z",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Get Cart by ID

Retrieve a specific cart with all items populated.

**Endpoint:** `GET /api/strapi-ecommerce/carts/:id`

**Example Request:**
```bash
GET /api/strapi-ecommerce/carts/1
```

**Example Response:**
```json
{
  "id": 1,
  "sessionId": "abc123-def456-ghi789",
  "subtotal": "59.98",
  "taxAmount": "0.00",
  "discountAmount": "0.00",
  "shippingCost": "5.00",
  "total": "64.98",
  "currency": "USD",
  "items": [
    {
      "id": 1,
      "name": "Product Name",
      "sku": "PROD-001",
      "quantity": 2,
      "price": "29.99",
      "subtotal": "59.98",
      "total": "59.98",
      "product": {
        "id": 1,
        "name": "Product Name",
        "sku": "PROD-001"
      }
    }
  ],
  "expiresAt": "2024-02-01T00:00:00.000Z",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Add Item to Cart

Add a product to the cart. If the product already exists in the cart, the quantity will be increased.

**Endpoint:** `POST /api/strapi-ecommerce/carts/:cartId/items`

**Path Parameters:**
- `cartId` (number): Cart ID

**Request Body:**
```json
{
  "productId": 1,
  "quantity": 2,
  "meta": {
    "customOption": "value"
  }
}
```

**Request Fields:**
- `productId` (number, required): Product ID to add
- `quantity` (number, optional): Quantity to add (default: 1)
- `meta` (object, optional): Additional metadata for the cart item

**Example Request:**
```bash
POST /api/strapi-ecommerce/carts/1/items
Content-Type: application/json

{
  "productId": 1,
  "quantity": 2
}
```

**Example Response:**
```json
{
  "item": {
    "id": 1,
    "name": "Product Name",
    "sku": "PROD-001",
    "quantity": 2,
    "price": "29.99",
    "subtotal": "59.98",
    "total": "59.98",
    "product": {
      "id": 1,
      "name": "Product Name"
    }
  },
  "cart": {
    "id": 1,
    "subtotal": "59.98",
    "total": "59.98",
    "items": [...]
  }
}
```

### Update Cart Item Quantity

Update the quantity of an item in the cart.

**Endpoint:** `PUT /api/strapi-ecommerce/carts/items/:itemId`

**Path Parameters:**
- `itemId` (number): Cart item ID

**Request Body:**
```json
{
  "quantity": 5
}
```

**Request Fields:**
- `quantity` (number, required): New quantity (must be > 0). If set to 0, the item will be removed.

**Example Request:**
```bash
PUT /api/strapi-ecommerce/carts/items/1
Content-Type: application/json

{
  "quantity": 5
}
```

**Example Response:**
```json
{
  "id": 1,
  "name": "Product Name",
  "sku": "PROD-001",
  "quantity": 5,
  "price": "29.99",
  "subtotal": "149.95",
  "total": "149.95",
  "product": {
    "id": 1,
    "name": "Product Name"
  }
}
```

### Remove Item from Cart

Remove an item from the cart.

**Endpoint:** `DELETE /api/strapi-ecommerce/carts/items/:itemId`

**Path Parameters:**
- `itemId` (number): Cart item ID

**Example Request:**
```bash
DELETE /api/strapi-ecommerce/carts/items/1
```

**Example Response:**
```json
{
  "success": true
}
```

### Clear Cart

Remove all items from the cart.

**Endpoint:** `DELETE /api/strapi-ecommerce/carts/:id/clear`

**Path Parameters:**
- `id` (number): Cart ID

**Example Request:**
```bash
DELETE /api/strapi-ecommerce/carts/1/clear
```

**Example Response:**
```json
{
  "success": true
}
```

---

## 💳 Checkout & Orders

### Validate Checkout Data

Validate checkout data before processing the order.

**Endpoint:** `POST /api/strapi-ecommerce/checkout/validate`

**Request Body:**
```json
{
  "billingEmail": "customer@example.com",
  "billingFirstName": "John",
  "billingLastName": "Doe",
  "billingAddress1": "123 Main St",
  "billingCity": "New York",
  "billingPostcode": "10001",
  "billingCountry": "US",
  "billingPhone": "+1234567890",
  "shippingFirstName": "John",
  "shippingLastName": "Doe",
  "shippingAddress1": "123 Main St",
  "shippingCity": "New York",
  "shippingPostcode": "10001",
  "shippingCountry": "US",
  "paymentMethod": "credit_card",
  "shippingMethod": "standard"
}
```

**Required Fields:**
- `billingEmail` (or `email`)
- `billingFirstName` (or `firstName`)
- `billingLastName` (or `lastName`)
- `billingAddress1` (or `address1`)
- `billingCity` (or `city`)
- `billingPostcode` (or `postcode`/`zip`)
- `billingCountry` (or `country`)

**Example Request:**
```bash
POST /api/strapi-ecommerce/checkout/validate
Content-Type: application/json

{
  "billingEmail": "customer@example.com",
  "billingFirstName": "John",
  "billingLastName": "Doe",
  "billingAddress1": "123 Main St",
  "billingCity": "New York",
  "billingPostcode": "10001",
  "billingCountry": "US"
}
```

**Example Response:**
```json
{
  "valid": true,
  "message": "Checkout data is valid"
}
```

**Error Response:**
```json
{
  "valid": false,
  "error": "Missing required field: billingEmail"
}
```

### Process Checkout

Create an order from a cart and clear the cart.

**Endpoint:** `POST /api/strapi-ecommerce/checkout/:cartId`

**Path Parameters:**
- `cartId` (number): Cart ID to checkout

**Request Body:**
```json
{
  "billingEmail": "customer@example.com",
  "billingFirstName": "John",
  "billingLastName": "Doe",
  "billingCompany": "Company Inc",
  "billingAddress1": "123 Main St",
  "billingAddress2": "Apt 4B",
  "billingCity": "New York",
  "billingState": "NY",
  "billingPostcode": "10001",
  "billingCountry": "US",
  "billingPhone": "+1234567890",
  "shippingFirstName": "John",
  "shippingLastName": "Doe",
  "shippingAddress1": "123 Main St",
  "shippingCity": "New York",
  "shippingPostcode": "10001",
  "shippingCountry": "US",
  "customerNotes": "Please leave at front door",
  "paymentMethod": "credit_card",
  "paymentMethodTitle": "Credit Card",
  "shippingMethod": "standard",
  "shippingMethodTitle": "Standard Shipping",
  "shippingCost": 5.00
}
```

**Required Fields:**
- `billingEmail` (or `email`)
- `billingFirstName` (or `firstName`)
- `billingLastName` (or `lastName`)
- `billingAddress1` (or `address1`)
- `billingCity` (or `city`)
- `billingPostcode` (or `postcode`/`zip`)
- `billingCountry` (or `country`)

**Optional Fields:**
- `billingPhone` (or `phone`)
- `billingCompany`
- `billingAddress2` (or `address2`)
- `billingState` (or `state`)
- `shippingFirstName`, `shippingLastName`, etc. (if different from billing)
- `customerNotes`
- `paymentMethod` (default: "unknown")
- `paymentMethodTitle`
- `transactionId`
- `shippingMethod`
- `shippingMethodTitle`
- `shippingCost` (will use cart's shippingCost if not provided)

**Example Request:**
```bash
POST /api/strapi-ecommerce/checkout/1
Content-Type: application/json

{
  "billingEmail": "customer@example.com",
  "billingFirstName": "John",
  "billingLastName": "Doe",
  "billingAddress1": "123 Main St",
  "billingCity": "New York",
  "billingPostcode": "10001",
  "billingCountry": "US",
  "paymentMethod": "credit_card",
  "shippingCost": 5.00
}
```

**Example Response:**
```json
{
  "success": true,
  "order": {
    "id": 1,
    "orderNumber": "ORD-20240101-000001",
    "status": "pending",
    "orderDate": "2024-01-01T12:00:00.000Z",
    "subtotal": "59.98",
    "shippingCost": "5.00",
    "taxAmount": "0.00",
    "discountAmount": "0.00",
    "total": "64.98",
    "currency": "USD",
    "customerEmail": "customer@example.com",
    "billingFirstName": "John",
    "billingLastName": "Doe",
    "paymentStatus": "pending",
    "items": [
      {
        "id": 1,
        "name": "Product Name",
        "sku": "PROD-001",
        "quantity": 2,
        "price": "29.99",
        "subtotal": "59.98",
        "total": "59.98"
      }
    ],
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Order created successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Cart is empty"
}
```

### Get All Orders

Retrieve a list of orders (typically filtered by customer email or user ID).

**Endpoint:** `GET /api/strapi-ecommerce/orders`

**Query Parameters:**
- `filters` (object): Filter orders (e.g., `filters[customerEmail][$eq]=customer@example.com`)
- `sort` (string): Sort order (e.g., `sort=orderDate:desc`)
- `pagination[page]` (number): Page number
- `pagination[pageSize]` (number): Items per page
- `populate` (string): Relations to populate (e.g., `populate=items,items.product`)

**Example Request:**
```bash
GET /api/strapi-ecommerce/orders?filters[customerEmail][$eq]=customer@example.com&sort=orderDate:desc&populate=items,items.product
```

**Example Response:**
```json
{
  "data": [
    {
      "id": 1,
      "orderNumber": "ORD-20240101-000001",
      "status": "completed",
      "orderDate": "2024-01-01T12:00:00.000Z",
      "total": "64.98",
      "currency": "USD",
      "customerEmail": "customer@example.com",
      "items": [
        {
          "id": 1,
          "name": "Product Name",
          "quantity": 2,
          "price": "29.99",
          "total": "59.98"
        }
      ]
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 1
    }
  }
}
```

### Get Single Order

Retrieve details of a specific order.

**Endpoint:** `GET /api/strapi-ecommerce/orders/:id`

**Query Parameters:**
- `populate` (string): Relations to populate

**Example Request:**
```bash
GET /api/strapi-ecommerce/orders/1?populate=items,items.product
```

**Example Response:**
```json
{
  "data": {
    "id": 1,
    "orderNumber": "ORD-20240101-000001",
    "status": "completed",
    "orderDate": "2024-01-01T12:00:00.000Z",
    "subtotal": "59.98",
    "shippingCost": "5.00",
    "taxAmount": "0.00",
    "discountAmount": "0.00",
    "total": "64.98",
    "currency": "USD",
    "customerEmail": "customer@example.com",
    "billingFirstName": "John",
    "billingLastName": "Doe",
    "billingAddress1": "123 Main St",
    "billingCity": "New York",
    "billingPostcode": "10001",
    "billingCountry": "US",
    "paymentStatus": "paid",
    "items": [
      {
        "id": 1,
        "name": "Product Name",
        "sku": "PROD-001",
        "quantity": 2,
        "price": "29.99",
        "subtotal": "59.98",
        "total": "59.98",
        "product": {
          "id": 1,
          "name": "Product Name"
        }
      }
    ],
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

---

## 🔄 Complete Shopping Flow Example

Here's a complete example of a typical shopping flow:

### 1. Get Products
```bash
GET /api/strapi-ecommerce/products?filters[status][$eq]=published&sort=createdAt:desc
```

### 2. Get or Create Cart
```bash
GET /api/strapi-ecommerce/carts?sessionId=abc123-def456-ghi789
```

### 3. Add Products to Cart
```bash
POST /api/strapi-ecommerce/carts/1/items
Content-Type: application/json

{
  "productId": 1,
  "quantity": 2
}
```

```bash
POST /api/strapi-ecommerce/carts/1/items
Content-Type: application/json

{
  "productId": 2,
  "quantity": 1
}
```

### 4. Get Cart with Items
```bash
GET /api/strapi-ecommerce/carts/1
```

### 5. Update Item Quantity (Optional)
```bash
PUT /api/strapi-ecommerce/carts/items/1
Content-Type: application/json

{
  "quantity": 3
}
```

### 6. Validate Checkout Data
```bash
POST /api/strapi-ecommerce/checkout/validate
Content-Type: application/json

{
  "billingEmail": "customer@example.com",
  "billingFirstName": "John",
  "billingLastName": "Doe",
  "billingAddress1": "123 Main St",
  "billingCity": "New York",
  "billingPostcode": "10001",
  "billingCountry": "US"
}
```

### 7. Process Checkout
```bash
POST /api/strapi-ecommerce/checkout/1
Content-Type: application/json

{
  "billingEmail": "customer@example.com",
  "billingFirstName": "John",
  "billingLastName": "Doe",
  "billingAddress1": "123 Main St",
  "billingCity": "New York",
  "billingPostcode": "10001",
  "billingCountry": "US",
  "paymentMethod": "credit_card",
  "shippingCost": 5.00
}
```

### 8. Get Order Details
```bash
GET /api/strapi-ecommerce/orders/1?populate=items,items.product
```

---

## 📝 Notes

### Session Management

- Use a unique `sessionId` (e.g., UUID) generated on the frontend to track carts
- Store the `sessionId` in localStorage or cookies
- Pass the same `sessionId` for all cart operations
- Optionally pass `userId` if the customer is logged in

### Error Handling

All endpoints return standard HTTP status codes:
- `200` - Success
- `400` - Bad Request (validation errors, missing fields)
- `404` - Not Found
- `500` - Server Error

Error responses follow this format:
```json
{
  "error": "Error message here",
  "data": null
}
```

### Currency

All prices are stored as strings to maintain precision. The `currency` field defaults to "USD" but can be customized per cart/order.

### Order Numbers

Order numbers are automatically generated in the format: `ORD-YYYYMMDD-XXXXXX` (e.g., `ORD-20240101-000001`). They are unique and sequential per day.

### Cart Expiration

Carts automatically expire after 30 days. The `expiresAt` field indicates when the cart will expire.

---

## 🔐 Security Considerations

1. **Session IDs**: Generate secure, unique session IDs (UUIDs) on the frontend
2. **Input Validation**: Always validate user input on the frontend before sending requests
3. **HTTPS**: Use HTTPS in production to protect sensitive data
4. **Rate Limiting**: Consider implementing rate limiting for cart and checkout endpoints
5. **CORS**: Configure CORS properly to allow requests only from your frontend domain

---

## 📚 Additional Resources

- [Strapi REST API Documentation](https://docs.strapi.io/dev-docs/api/rest)
- [Strapi Query Parameters](https://docs.strapi.io/dev-docs/api/rest/filters-locale-publication)
