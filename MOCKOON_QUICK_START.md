# Quick Start: Surplus Posts API in Mockoon

## Step 1: Create Endpoints in Mockoon

### Endpoint 1: GET /api/surplus-posts

1. **Create Route:**
   - Click "Add Route" in Mockoon
   - Method: `GET`
   - Path: `/api/surplus-posts`

2. **Add Response:**
   - Status: `200`
   - Headers: `Content-Type: application/json`
   - Body (copy this JSON):

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
    },
    {
      "id": 3,
      "foodName": "wd",
      "quantity": "22",
      "status": "Available",
      "preparedTime": "2024-12-06T08:00:00Z",
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
      "createdAt": "2024-12-06T09:18:00Z",
      "updatedAt": "2024-12-06T09:18:00Z"
    }
  ],
  "count": 3
}
```

---

### Endpoint 2: GET /api/surplus-posts/available

1. **Create Route:**
   - Method: `GET`
   - Path: `/api/surplus-posts/available`

2. **Add Response:**
   - Status: `200`
   - Body:

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
    },
    {
      "id": 3,
      "foodName": "wd",
      "quantity": "22",
      "status": "Available",
      "canteen": "Green Leaf Canteen",
      "distance": "1.2 km",
      "deadline": "Today, 8:30 PM",
      "createdAt": "2024-12-06T09:18:00Z"
    }
  ],
  "count": 2
}
```

---

### Endpoint 3: POST /api/surplus-posts

1. **Create Route:**
   - Method: `POST`
   - Path: `/api/surplus-posts`

2. **Add Response (Success):**
   - Status: `201`
   - Body:

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

3. **Add Response (Error):**
   - Status: `400`
   - Body:

```json
{
  "success": false,
  "error": "Validation error",
  "message": "foodName, quantity, preparedTime, and vegType are required"
}
```

---

### Endpoint 4: PATCH /api/surplus-posts/:id/status

1. **Create Route:**
   - Method: `PATCH`
   - Path: `/api/surplus-posts/:id/status`
   - Path Parameter: `id` (number)

2. **Add Response (Success):**
   - Status: `200`
   - Body:

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

3. **Add Response (Error):**
   - Status: `404`
   - Body:

```json
{
  "success": false,
  "error": "Not found",
  "message": "Surplus post with id 999 not found"
}
```

---

## Step 2: Configure Environment

1. **Set Port:** Make sure Mockoon is running on port `3000` (or update `.env` file)

2. **Update `.env` file:**
```env
VITE_API_BASE_URL=http://localhost:3000
```

---

## Step 3: Test the APIs

### Test GET /api/surplus-posts
```bash
curl http://localhost:3000/api/surplus-posts
```

### Test GET /api/surplus-posts/available
```bash
curl http://localhost:3000/api/surplus-posts/available
```

### Test POST /api/surplus-posts
```bash
curl -X POST http://localhost:3000/api/surplus-posts \
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
curl -X PATCH http://localhost:3000/api/surplus-posts/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "NGO Assigned"}'
```

---

## Step 4: Verify Integration

1. Start your React app: `npm run dev`
2. Start Mockoon with the endpoints configured
3. Navigate to Canteen Dashboard
4. Check browser console for API calls
5. Verify data is coming from Mockoon API

---

## Notes

- The code automatically falls back to localStorage if API fails
- All API calls include error handling
- Check browser console for any API errors
- Make sure Mockoon port matches your `.env` configuration

