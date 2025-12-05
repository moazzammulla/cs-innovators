# Mockoon API Endpoint - Find NGOs by Pincode

This document provides the endpoint configuration for Mockoon to fetch NGOs based on pincode.

## Endpoint Configuration

### Request
- **Method**: `GET`
- **URL**: `/api/ngos`
- **Query Parameter**: `pincode` (string, required)

### Example Request
```
GET http://localhost:3001/api/ngos?pincode=560001
```

## Response Format

### Success Response (200 OK)

```json
{
  "success": true,
  "ngos": [
    {
      "id": 1,
      "name": "HopeForAll Foundation",
      "pincode": "560001",
      "address": "123 Main Street, Bangalore, Karnataka 560001",
      "contactPerson": "Rajesh Kumar",
      "phone": "+91 98765 43210",
      "email": "contact@hopeforall.org",
      "distance": "1.2 km",
      "capacity": "50 kg/day",
      "specialties": [
        "Food Distribution",
        "Community Meals"
      ]
    },
    {
      "id": 2,
      "name": "HungerFree India",
      "pincode": "560001",
      "address": "456 Park Avenue, Bangalore, Karnataka 560001",
      "contactPerson": "Priya Sharma",
      "phone": "+91 98765 43211",
      "email": "info@hungerfree.in",
      "distance": "2.5 km",
      "capacity": "75 kg/day",
      "specialties": [
        "Emergency Food",
        "Daily Meals"
      ]
    },
    {
      "id": 3,
      "name": "MealsOnWheels NGO",
      "pincode": "560001",
      "address": "789 MG Road, Bangalore, Karnataka 560001",
      "contactPerson": "Amit Patel",
      "phone": "+91 98765 43212",
      "email": "contact@mealsonwheels.org",
      "distance": "3.1 km",
      "capacity": "100 kg/day",
      "specialties": [
        "Mobile Distribution",
        "Senior Care"
      ]
    }
  ],
  "count": 3
}
```

### No Results Response (200 OK)

```json
{
  "success": true,
  "ngos": [],
  "count": 0,
  "message": "No NGOs found for the given pincode"
}
```

### Error Response (400 Bad Request)

```json
{
  "success": false,
  "error": "Pincode is required",
  "message": "Please provide a valid pincode"
}
```

## Mockoon Setup Instructions

1. **Create a new route in Mockoon:**
   - Route name: `Get NGOs by Pincode`
   - Method: `GET`
   - Path: `/api/ngos`

2. **Add Query Parameter:**
   - Parameter name: `pincode`
   - Type: `string`
   - Required: `true`

3. **Response Configuration:**
   - Status: `200`
   - Content-Type: `application/json`
   - Body: Use the JSON response format provided above

4. **Optional: Add Multiple Responses:**
   - You can create different responses for different pincodes
   - Use rules to match specific pincode values
   - Example: If `pincode` equals `560001`, return Bangalore NGOs
   - Example: If `pincode` equals `110001`, return Delhi NGOs

## Sample Data for Different Pincodes

### Pincode: 560001 (Bangalore)
Use the response format shown above with 3 NGOs.

### Pincode: 110001 (Delhi)
```json
{
  "success": true,
  "ngos": [
    {
      "id": 4,
      "name": "Delhi Food Bank",
      "pincode": "110001",
      "address": "123 Connaught Place, New Delhi 110001",
      "contactPerson": "Suresh Mehta",
      "phone": "+91 98765 43213",
      "email": "info@delhifoodbank.org",
      "distance": "0.8 km",
      "capacity": "120 kg/day",
      "specialties": [
        "Food Bank",
        "Distribution Center"
      ]
    }
  ],
  "count": 1
}
```

### Pincode: 400001 (Mumbai)
```json
{
  "success": true,
  "ngos": [
    {
      "id": 5,
      "name": "Mumbai Meals",
      "pincode": "400001",
      "address": "456 Marine Drive, Mumbai 400001",
      "contactPerson": "Ravi Desai",
      "phone": "+91 98765 43214",
      "email": "contact@mumbaimerals.org",
      "distance": "1.5 km",
      "capacity": "90 kg/day",
      "specialties": [
        "Daily Meals",
        "Street Food Distribution"
      ]
    }
  ],
  "count": 1
}
```

## Field Descriptions

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `id` | number | Unique identifier for the NGO | Yes |
| `name` | string | Name of the NGO | Yes |
| `pincode` | string | Pincode of the NGO location | Yes |
| `address` | string | Full address of the NGO | Yes |
| `contactPerson` | string | Name of the contact person | Yes |
| `phone` | string | Contact phone number (with country code) | Yes |
| `email` | string | Contact email address | Yes |
| `distance` | string | Distance from the search location | No |
| `capacity` | string | Daily capacity of the NGO | No |
| `specialties` | array | Array of specialty services | No |

## Environment Variable

Make sure to set the API base URL in your `.env` file:

```env
VITE_API_BASE_URL=http://localhost:3001
```

Or update the default in `src/utils/api.js` if you're using a different port.

## Testing

You can test the endpoint using curl:

```bash
curl "http://localhost:3001/api/ngos?pincode=560001"
```

Or using a REST client like Postman or Insomnia.

