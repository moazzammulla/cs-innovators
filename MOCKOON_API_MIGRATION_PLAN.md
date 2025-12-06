# Mockoon API Migration Plan

This document outlines the migration plan for moving from localStorage/mock data to Mockoon APIs, prioritized by importance and dependencies.

## Current Data Sources

1. **Surplus Posts** - `surplusDataManager.js` (localStorage)
2. **Pickups** - `surplusDataManager.js` (localStorage)
3. **User Profiles** - `profileManager.js` (localStorage)
4. **NGOs by Pincode** - Already using API (with fallback)
5. **Analytics Data** - Calculated from surplus posts and pickups
6. **Today's Predicted Surplus** - Static mock data

---

## Migration Priority Order

### Phase 1: Core Surplus Management (High Priority)
These are the most critical APIs that power the main workflow.

#### 1.1 GET `/api/surplus-posts` - Get All Surplus Posts
**Priority:** ⭐⭐⭐⭐⭐  
**Dependencies:** None  
**Current Usage:** `getAllSurplusPosts()`, `fetchCanteenSurplusPosts()`

#### 1.2 POST `/api/surplus-posts` - Create Surplus Post
**Priority:** ⭐⭐⭐⭐⭐  
**Dependencies:** None  
**Current Usage:** `createSurplusPost()`

#### 1.3 GET `/api/surplus-posts/available` - Get Available Surplus Posts
**Priority:** ⭐⭐⭐⭐⭐  
**Dependencies:** None  
**Current Usage:** `getAvailableSurplusPosts()`, `fetchNgoNearbySurplus()`

#### 1.4 PATCH `/api/surplus-posts/:id/status` - Update Surplus Post Status
**Priority:** ⭐⭐⭐⭐  
**Dependencies:** 1.1, 1.2  
**Current Usage:** `updateSurplusPostStatus()`

---

### Phase 2: Pickup Management (High Priority)
These APIs handle the pickup workflow.

#### 2.1 POST `/api/pickups` - Create Pickup
**Priority:** ⭐⭐⭐⭐⭐  
**Dependencies:** 1.3  
**Current Usage:** `createPickup()`

#### 2.2 GET `/api/pickups` - Get All Pickups
**Priority:** ⭐⭐⭐⭐  
**Dependencies:** None  
**Current Usage:** `getAllPickups()`

#### 2.3 GET `/api/pickups/active` - Get Active Pickups
**Priority:** ⭐⭐⭐⭐  
**Dependencies:** None  
**Current Usage:** `getActivePickups()`

#### 2.4 PATCH `/api/pickups/:id/status` - Update Pickup Status
**Priority:** ⭐⭐⭐⭐⭐  
**Dependencies:** 2.1  
**Current Usage:** `updatePickupStatus()`

#### 2.5 GET `/api/pickups/:id` - Get Pickup by ID
**Priority:** ⭐⭐⭐  
**Dependencies:** None  
**Current Usage:** `getPickupById()`

---

### Phase 3: User Profiles (Medium Priority)
These APIs manage user profile data.

#### 3.1 GET `/api/profiles/canteen/:email` - Get Canteen Profile
**Priority:** ⭐⭐⭐  
**Dependencies:** None  
**Current Usage:** `getCanteenProfile()`

#### 3.2 PUT `/api/profiles/canteen/:email` - Update Canteen Profile
**Priority:** ⭐⭐⭐  
**Dependencies:** 3.1  
**Current Usage:** `updateCanteenProfile()`

#### 3.3 GET `/api/profiles/ngo/:email` - Get NGO Profile
**Priority:** ⭐⭐⭐  
**Dependencies:** None  
**Current Usage:** `getNgoProfile()`

#### 3.4 PUT `/api/profiles/ngo/:email` - Update NGO Profile
**Priority:** ⭐⭐⭐  
**Dependencies:** 3.3  
**Current Usage:** `updateNgoProfile()`

---

### Phase 4: Analytics & Predictions (Medium Priority)
These APIs provide analytics and predictions.

#### 4.1 GET `/api/analytics` - Get Analytics Data
**Priority:** ⭐⭐⭐  
**Dependencies:** 1.1, 2.2  
**Current Usage:** `getAnalyticsData()`, `fetchAnalytics()`

#### 4.2 GET `/api/predictions/today-surplus` - Get Today's Predicted Surplus
**Priority:** ⭐⭐  
**Dependencies:** None  
**Current Usage:** `fetchTodaysSurplus()`

---

### Phase 5: Already Implemented
✅ **GET `/api/ngos?pincode={pincode}`** - Get NGOs by Pincode (Already using API)

---

## Detailed API Specifications

### Phase 1: Surplus Posts APIs

#### 1.1 GET `/api/surplus-posts`
**Description:** Get all surplus posts for a canteen

**Query Parameters:**
- `canteenId` (optional, number) - Filter by canteen ID
- `status` (optional, string) - Filter by status: 'Available', 'NGO Assigned', 'Picked Up', 'Delivered'

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
      "preparedTime": "2024-01-15T12:00:00Z",
      "vegType": "veg",
      "image": "https://example.com/image.jpg",
      "safetyChecklist": {
        "storedProperly": true,
        "withinSafeTime": true,
        "labelled": true
      },
      "canteen": "Green Leaf Canteen",
      "canteenId": 1,
      "distance": "1.2 km",
      "deadline": "Today, 8:30 PM",
      "createdAt": "2024-01-15T12:30:00Z",
      "updatedAt": "2024-01-15T12:30:00Z"
    }
  ],
  "count": 1
}
```

#### 1.2 POST `/api/surplus-posts`
**Description:** Create a new surplus post

**Request Body:**
```json
{
  "foodName": "Veg Pulao",
  "quantity": "25 portions",
  "preparedTime": "2024-01-15T12:00:00Z",
  "vegType": "veg",
  "image": "https://example.com/image.jpg",
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
    "id": 1,
    "foodName": "Veg Pulao",
    "quantity": "25 portions",
    "status": "Available",
    "preparedTime": "2024-01-15T12:00:00Z",
    "vegType": "veg",
    "image": "https://example.com/image.jpg",
    "safetyChecklist": {
      "storedProperly": true,
      "withinSafeTime": true,
      "labelled": true
    },
    "canteen": "Green Leaf Canteen",
    "canteenId": 1,
    "distance": "1.2 km",
    "deadline": "Today, 8:30 PM",
    "createdAt": "2024-01-15T12:30:00Z",
    "updatedAt": "2024-01-15T12:30:00Z"
  }
}
```

#### 1.3 GET `/api/surplus-posts/available`
**Description:** Get all available surplus posts (status: 'Available')

**Query Parameters:**
- `pincode` (optional, string) - Filter by pincode area
- `limit` (optional, number) - Limit results (default: 50)

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
      "createdAt": "2024-01-15T12:30:00Z"
    }
  ],
  "count": 1
}
```

#### 1.4 PATCH `/api/surplus-posts/:id/status`
**Description:** Update surplus post status

**URL Parameters:**
- `id` (number) - Surplus post ID

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
    "updatedAt": "2024-01-15T13:00:00Z"
  }
}
```

---

### Phase 2: Pickup APIs

#### 2.1 POST `/api/pickups`
**Description:** Create a new pickup record

**Request Body:**
```json
{
  "surplusId": 1,
  "ngoId": 1,
  "ngoName": "HopeForAll Foundation"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 101,
    "surplusId": 1,
    "ngoId": 1,
    "ngoName": "HopeForAll Foundation",
    "foodName": "Veg Pulao",
    "quantity": "25 portions",
    "canteen": "Green Leaf Canteen",
    "status": "NGO Assigned",
    "statusTimeline": [
      {
        "status": "Posted",
        "at": "2024-01-15T12:30:00Z",
        "description": "Posted by Green Leaf Canteen"
      },
      {
        "status": "NGO Assigned",
        "at": "2024-01-15T13:00:00Z",
        "description": "Assigned to HopeForAll Foundation"
      }
    ],
    "createdAt": "2024-01-15T13:00:00Z",
    "updatedAt": "2024-01-15T13:00:00Z"
  }
}
```

#### 2.2 GET `/api/pickups`
**Description:** Get all pickups

**Query Parameters:**
- `ngoId` (optional, number) - Filter by NGO ID
- `canteenId` (optional, number) - Filter by canteen ID
- `status` (optional, string) - Filter by status

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 101,
      "surplusId": 1,
      "ngoId": 1,
      "ngoName": "HopeForAll Foundation",
      "foodName": "Veg Pulao",
      "quantity": "25 portions",
      "canteen": "Green Leaf Canteen",
      "status": "NGO Assigned",
      "statusTimeline": [...],
      "createdAt": "2024-01-15T13:00:00Z",
      "updatedAt": "2024-01-15T13:00:00Z"
    }
  ],
  "count": 1
}
```

#### 2.3 GET `/api/pickups/active`
**Description:** Get active pickups (status != 'Delivered')

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 101,
      "surplusId": 1,
      "ngoId": 1,
      "ngoName": "HopeForAll Foundation",
      "foodName": "Veg Pulao",
      "quantity": "25 portions",
      "canteen": "Green Leaf Canteen",
      "status": "NGO Assigned",
      "statusTimeline": [...],
      "createdAt": "2024-01-15T13:00:00Z",
      "updatedAt": "2024-01-15T13:00:00Z"
    }
  ],
  "count": 1
}
```

#### 2.4 PATCH `/api/pickups/:id/status`
**Description:** Update pickup status

**URL Parameters:**
- `id` (number) - Pickup ID

**Request Body:**
```json
{
  "status": "Picked Up"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 101,
    "status": "Picked Up",
    "statusTimeline": [
      {
        "status": "Picked Up",
        "at": "2024-01-15T14:00:00Z",
        "description": "Food picked up from canteen"
      }
    ],
    "updatedAt": "2024-01-15T14:00:00Z"
  }
}
```

#### 2.5 GET `/api/pickups/:id`
**Description:** Get pickup by ID

**URL Parameters:**
- `id` (number) - Pickup ID

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 101,
    "surplusId": 1,
    "ngoId": 1,
    "ngoName": "HopeForAll Foundation",
    "foodName": "Veg Pulao",
    "quantity": "25 portions",
    "canteen": "Green Leaf Canteen",
    "status": "NGO Assigned",
    "statusTimeline": [...],
    "createdAt": "2024-01-15T13:00:00Z",
    "updatedAt": "2024-01-15T13:00:00Z"
  }
}
```

---

### Phase 3: Profile APIs

#### 3.1 GET `/api/profiles/canteen/:email`
**Description:** Get canteen profile by email

**URL Parameters:**
- `email` (string) - Canteen email address

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "email": "canteen@example.com",
    "canteenName": "Green Leaf Canteen",
    "location": "Bangalore, Karnataka",
    "contactNumber": "+91 98765 43210",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T12:00:00Z"
  }
}
```

#### 3.2 PUT `/api/profiles/canteen/:email`
**Description:** Update canteen profile

**URL Parameters:**
- `email` (string) - Canteen email address

**Request Body:**
```json
{
  "canteenName": "Green Leaf Canteen",
  "location": "Bangalore, Karnataka",
  "contactNumber": "+91 98765 43210"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "email": "canteen@example.com",
    "canteenName": "Green Leaf Canteen",
    "location": "Bangalore, Karnataka",
    "contactNumber": "+91 98765 43210",
    "updatedAt": "2024-01-15T12:00:00Z"
  }
}
```

#### 3.3 GET `/api/profiles/ngo/:email`
**Description:** Get NGO profile by email

**URL Parameters:**
- `email` (string) - NGO email address

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "email": "ngo@example.com",
    "ngoName": "HopeForAll Foundation",
    "location": "Bangalore, Karnataka",
    "contactNumber": "+91 98765 43210",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T12:00:00Z"
  }
}
```

#### 3.4 PUT `/api/profiles/ngo/:email`
**Description:** Update NGO profile

**URL Parameters:**
- `email` (string) - NGO email address

**Request Body:**
```json
{
  "ngoName": "HopeForAll Foundation",
  "location": "Bangalore, Karnataka",
  "contactNumber": "+91 98765 43210"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "email": "ngo@example.com",
    "ngoName": "HopeForAll Foundation",
    "location": "Bangalore, Karnataka",
    "contactNumber": "+91 98765 43210",
    "updatedAt": "2024-01-15T12:00:00Z"
  }
}
```

---

### Phase 4: Analytics & Predictions APIs

#### 4.1 GET `/api/analytics`
**Description:** Get analytics data (weekly surplus, food saved/wasted, pickup history)

**Query Parameters:**
- `canteenId` (optional, number) - Filter by canteen
- `ngoId` (optional, number) - Filter by NGO
- `startDate` (optional, string) - Start date (ISO format)
- `endDate` (optional, string) - End date (ISO format)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "weeklySurplusData": [
      { "name": "Mon", "value": 32 },
      { "name": "Tue", "value": 45 },
      { "name": "Wed", "value": 28 },
      { "name": "Thu", "value": 50 },
      { "name": "Fri", "value": 40 },
      { "name": "Sat", "value": 60 },
      { "name": "Sun", "value": 35 }
    ],
    "foodSavedData": [
      { "name": "Saved", "value": 72 },
      { "name": "Wasted", "value": 28 }
    ],
    "pickupHistory": [
      {
        "id": 101,
        "date": "Dec 1, 2024",
        "foodName": "Veg Pulao",
        "ngo": "HopeForAll",
        "quantity": "20 portions",
        "status": "Delivered"
      }
    ]
  }
}
```

#### 4.2 GET `/api/predictions/today-surplus`
**Description:** Get today's AI-predicted surplus in kg

**Query Parameters:**
- `canteenId` (optional, number) - Canteen ID

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "predictedQuantity": 48,
    "unit": "kg",
    "date": "2024-01-15",
    "confidence": "medium",
    "reasoning": "Based on historical patterns and current conditions"
  }
}
```

---

## Migration Strategy

### Step-by-Step Migration Process

1. **Start with Phase 1 (Surplus Posts)**
   - Create all 4 surplus post APIs in Mockoon
   - Update `api.js` to use APIs instead of localStorage
   - Test thoroughly
   - Keep localStorage as fallback initially

2. **Move to Phase 2 (Pickups)**
   - Create all 5 pickup APIs in Mockoon
   - Update `api.js` to use APIs
   - Test pickup workflow end-to-end

3. **Add Phase 3 (Profiles)**
   - Create profile APIs
   - Update profile components to use APIs
   - Test profile updates

4. **Complete with Phase 4 (Analytics)**
   - Create analytics API
   - Update analytics page
   - Test data accuracy

### Testing Strategy

1. **For each API:**
   - Test successful responses
   - Test error responses (404, 400, 500)
   - Test with empty data
   - Test with invalid inputs

2. **Integration Testing:**
   - Test complete workflows (create post → accept pickup → update status)
   - Test data consistency across APIs
   - Test real-time updates

3. **Fallback Strategy:**
   - Keep localStorage functions as fallback
   - Log API errors for debugging
   - Show user-friendly error messages

---

## Mockoon Configuration Tips

1. **Use Rules for Dynamic Responses:**
   - Create rules based on query parameters
   - Use different responses for different pincodes
   - Simulate different status codes

2. **Use Data Buckets:**
   - Store sample data in buckets
   - Reuse data across endpoints
   - Maintain data consistency

3. **Add Delays:**
   - Simulate network latency (200-500ms)
   - Test loading states in UI

4. **Error Scenarios:**
   - Create endpoints that return 500 errors
   - Test error handling in frontend
   - Simulate network failures

---

## Environment Variables

Update your `.env` file:
```env
VITE_API_BASE_URL=http://localhost:3001
```

Or update in `src/utils/api.js`:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
```

---

## Next Steps

1. ✅ Start with **Phase 1.1** - GET `/api/surplus-posts`
2. Create the endpoint in Mockoon
3. Update `api.js` to call the API
4. Test and verify
5. Move to next endpoint

Repeat for each endpoint in priority order!

