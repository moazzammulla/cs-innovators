# Mockoon Setup for Surplus Posts API

## Quick Setup Guide

### Step 1: Import into Mockoon

1. Open Mockoon
2. Create a new environment or use existing
3. Import the endpoints from `mockoon-surplus-posts-api.json` OR manually create them using the specs below

### Step 2: Configure Endpoints

## Endpoint 1: GET /api/surplus-posts

**Method:** GET  
**Path:** `/api/surplus-posts`

**Query Parameters (Optional):**
- `canteenId` (number)
- `status` (string: Available, NGO Assigned, Picked Up, Delivered)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "foodName": "Veg Pulao",
      "quantity": "25 portions",
      "status": "Available",
      "preparedTime": "2024-12-06T10:00:00Z",
      "vegType": "veg",
      "image": "",
      "safetyChecklist": {
        "storedProperly": true,
        "withinSafeTime": true,
        "labelled": true
      },
      "canteen": "Green Leaf Canteen",
      "canteenId": 1,
      "distance": "1.2 km",
      "deadline": "Today, 8:30 PM",
      "createdAt": "2024-12-06T10:30:00Z",
      "updatedAt": "2024-12-06T10:30:00Z"
    },
    {
      "id": 2,
      "foodName": "TAZA Rice",
      "quantity": "22 kg",
      "status": "Delivered",
      "preparedTime": "2024-12-06T09:00:00Z",
      "vegType": "veg",
      "image": "",
      "safetyChecklist": {
        "storedProperly": true,
        "withinSafeTime": true,
        "labelled": true
      },
      "canteen": "Green Leaf Canteen",
      "canteenId": 1,
      "distance": "1.2 km",
      "deadline": "Today, 8:30 PM",
      "createdAt": "2024-12-06T09:24:00Z",
      "updatedAt": "2024-12-06T10:55:00Z"
    }
  ],
  "count": 2
}
```

---

## Endpoint 2: GET /api/surplus-posts/available

**Method:** GET  
**Path:** `/api/surplus-posts/available`

**Query Parameters (Optional):**
- `pincode` (string)
- `limit` (number, default: 50)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "foodName": "Veg Pulao",
      "quantity": "25 portions",
      "status": "Available",
      "canteen": "Green Leaf Canteen",
      "distance": "1.2 km",
      "deadline": "Today, 8:30 PM",
      "createdAt": "2024-12-06T10:30:00Z"
    }
  ],
  "count": 1
}
```

---

## Endpoint 3: POST /api/surplus-posts

**Method:** POST  
**Path:** `/api/surplus-posts`  
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "foodName": "Dal & Rice",
  "quantity": "30 portions",
  "preparedTime": "2024-12-06T12:00:00Z",
  "vegType": "veg",
  "image": "",
  "safetyChecklist": {
    "storedProperly": true,
    "withinSafeTime": true,
    "labelled": true
  },
  "canteenId": 1
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 4,
    "foodName": "Dal & Rice",
    "quantity": "30 portions",
    "status": "Available",
    "preparedTime": "2024-12-06T12:00:00Z",
    "vegType": "veg",
    "image": "",
    "safetyChecklist": {
      "storedProperly": true,
      "withinSafeTime": true,
      "labelled": true
    },
    "canteen": "Green Leaf Canteen",
    "canteenId": 1,
    "distance": "1.2 km",
    "deadline": "Today, 8:30 PM",
    "createdAt": "2024-12-06T12:30:00Z",
    "updatedAt": "2024-12-06T12:30:00Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Validation error",
  "message": "foodName, quantity, preparedTime, and vegType are required"
}
```

---

## Endpoint 4: PATCH /api/surplus-posts/:id/status

**Method:** PATCH  
**Path:** `/api/surplus-posts/:id/status`  
**Path Parameter:** `id` (number) - Surplus post ID

**Request Body:**
```json
{
  "status": "NGO Assigned"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "NGO Assigned",
    "updatedAt": "2024-12-06T13:00:00Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Not found",
  "message": "Surplus post with id 999 not found"
}
```

---

## Mockoon Configuration Tips

### 1. Create Rules for Dynamic Responses

For **GET /api/surplus-posts**, you can create rules:

**Rule 1:** If `status` equals `Available`
- Return only posts with status "Available"

**Rule 2:** If `status` equals `Delivered`
- Return only posts with status "Delivered"

### 2. Use Data Buckets

Create a data bucket called "surplusPosts" with sample data:
```json
[
  {
    "id": 1,
    "foodName": "Veg Pulao",
    "quantity": "25 portions",
    "status": "Available",
    ...
  },
  {
    "id": 2,
    "foodName": "TAZA Rice",
    "quantity": "22 kg",
    "status": "Delivered",
    ...
  }
]
```

Then reference it in responses using: `{{dataBucket.surplusPosts}}`

### 3. Add Response Delays

Set delay to 200-500ms to simulate real API:
- In Mockoon, go to route settings
- Add delay: 300ms

### 4. Create Multiple Responses

For **POST /api/surplus-posts**, create multiple responses:
- **Success (201):** Valid request body
- **Error (400):** Missing required fields
- **Error (500):** Server error

Use rules to trigger different responses based on request body.

---

## Testing the APIs

### Test GET /api/surplus-posts
```bash
curl "http://localhost:3001/api/surplus-posts"
```

### Test GET with filters
```bash
curl "http://localhost:3001/api/surplus-posts?status=Available"
curl "http://localhost:3001/api/surplus-posts?canteenId=1"
```

### Test GET /api/surplus-posts/available
```bash
curl "http://localhost:3001/api/surplus-posts/available"
```

### Test POST /api/surplus-posts
```bash
curl -X POST "http://localhost:3001/api/surplus-posts" \
  -H "Content-Type: application/json" \
  -d '{
    "foodName": "Dal & Rice",
    "quantity": "30 portions",
    "preparedTime": "2024-12-06T12:00:00Z",
    "vegType": "veg",
    "safetyChecklist": {
      "storedProperly": true,
      "withinSafeTime": true,
      "labelled": true
    }
  }'
```

### Test PATCH /api/surplus-posts/:id/status
```bash
curl -X PATCH "http://localhost:3001/api/surplus-posts/1/status" \
  -H "Content-Type: application/json" \
  -d '{"status": "NGO Assigned"}'
```

---

## Environment Variable

Make sure your `.env` file has:
```env
VITE_API_BASE_URL=http://localhost:3000
```

Or update the default in `src/utils/api.js` if using a different port.

