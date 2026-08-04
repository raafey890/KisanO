# KisanO MongoDB Database Architecture Blueprint

This document outlines the complete production-ready MongoDB schema design for the KisanO platform. It follows the Modular Monolith architecture and utilizes MongoDB Atlas.

## Core Schema Principles
- **Audit Fields**: Every collection includes `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `isDeleted`, and `status`.
- **Relational Integrity**: While MongoDB is NoSQL, references between collections are strictly enforced using `ObjectId` references.
- **Images**: All image fields store **Cloudinary URLs** only. No binary data is stored in MongoDB.
- **Geo-Spatial**: Locations use MongoDB's GeoJSON format for proximity searches (e.g., finding nearby equipment).

---

## 1. Users Collection
**Purpose**: Centralized storage for all platform users across all portals (Farmers, Equipment Owners, Operators, Admins).

**Fields & Data Types**:
- `_id`: ObjectId (Required)
- `fullName`: String (Required)
- `phone`: String (Required, Unique)
- `email`: String (Optional, Unique)
- `passwordHash`: String (Required)
- `role`: String (Enum: `FARMER`, `EQUIPMENT_OWNER`, `SPRAYER_OPERATOR`, `ADMIN`) (Required)
- `profileImage`: String (URL) (Optional)
- `location`: GeoJSON Point (Optional)
- `address`: String (Optional)
- `verificationStatus`: String (Enum: `PENDING`, `VERIFIED`, `REJECTED`) (Default: `PENDING`)
- `kycDocuments`: Array of Strings (URLs) (Optional)
- `isDeleted`: Boolean (Default: false)
- `status`: String (Enum: `ACTIVE`, `SUSPENDED`, `INACTIVE`) (Default: `ACTIVE`)
- `createdAt`: Date (Required)
- `updatedAt`: Date (Required)

**Relationships**: Referenced by virtually every other collection (Bookings, Orders, Reviews).
**Recommended Indexes**:
- `{ "phone": 1 }` (Unique)
- `{ "email": 1 }` (Unique, Sparse)
- `{ "location": "2dsphere" }` (For proximity searches)
- `{ "role": 1, "status": 1 }`

**Example Document**:
```json
{
  "_id": ObjectId("64d1f2a..."),
  "fullName": "Suresh Patil",
  "phone": "+919876543210",
  "role": "FARMER",
  "location": { "type": "Point", "coordinates": [73.8567, 18.5204] },
  "verificationStatus": "VERIFIED",
  "isDeleted": false,
  "status": "ACTIVE",
  "createdAt": ISODate("2026-07-29T10:00:00Z"),
  "updatedAt": ISODate("2026-07-29T10:00:00Z")
}
```

---

## 2. Equipment Collection
**Purpose**: Stores machinery and tools listed by Equipment Owners for rent.

**Fields & Data Types**:
- `_id`: ObjectId (Required)
- `ownerId`: ObjectId (Ref: Users) (Required)
- `name`: String (Required)
- `category`: String (Enum: `TRACTOR`, `IMPLEMENT`, `HARVESTER`, `DRONE`) (Required)
- `brand`: String (Optional)
- `model`: String (Optional)
- `hourlyRate`: Number (Required)
- `specifications`: Object (Dynamic Key-Value pairs) (Optional)
- `images`: Array of Strings (URLs) (Required)
- `isAvailable`: Boolean (Default: true)
- `location`: GeoJSON Point (Required)
- `rating`: Number (Default: 0.0)
- `reviewCount`: Number (Default: 0)
- `status`: String (Enum: `PENDING`, `APPROVED`, `REJECTED`) (Default: `PENDING`)
- `isDeleted`: Boolean (Default: false)
- `createdAt`, `updatedAt`, `createdBy`, `updatedBy`: Dates / ObjectIds

**Relationships**: References `Users` (owner). Referenced by `Equipment Bookings` and `Reviews`.
**Recommended Indexes**:
- `{ "ownerId": 1 }`
- `{ "location": "2dsphere" }`
- `{ "category": 1, "status": 1, "isAvailable": 1 }`

---

## 3. Equipment Bookings Collection
**Purpose**: Tracks rental transactions between Farmers and Equipment Owners.

**Fields & Data Types**:
- `_id`: ObjectId (Required)
- `farmerId`: ObjectId (Ref: Users) (Required)
- `ownerId`: ObjectId (Ref: Users) (Required)
- `equipmentId`: ObjectId (Ref: Equipment) (Required)
- `startDate`: Date (Required)
- `endDate`: Date (Required)
- `totalHours`: Number (Required)
- `totalAmount`: Number (Required)
- `paymentStatus`: String (Enum: `PENDING`, `COMPLETED`, `REFUNDED`) (Default: `PENDING`)
- `bookingStatus`: String (Enum: `REQUESTED`, `CONFIRMED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`) (Default: `REQUESTED`)
- `cancellationReason`: String (Optional)
- `isDeleted`: Boolean (Default: false)
- `createdAt`, `updatedAt`, `createdBy`, `updatedBy`

**Relationships**: References `Users` (Farmer, Owner), `Equipment`.
**Recommended Indexes**:
- `{ "farmerId": 1 }`
- `{ "ownerId": 1 }`
- `{ "equipmentId": 1, "bookingStatus": 1 }`

---

## 4. Marketplace Products Collection
**Purpose**: Inventory for seeds, fertilizers, and pesticides sold to farmers.

**Fields & Data Types**:
- `_id`: ObjectId (Required)
- `sellerId`: ObjectId (Ref: Users) (Required)
- `name`: String (Required)
- `category`: String (Enum: `SEEDS`, `FERTILIZER`, `PESTICIDE`, `TOOLS`) (Required)
- `description`: String (Required)
- `price`: Number (Required)
- `stockQuantity`: Number (Required)
- `unit`: String (e.g., "kg", "liter", "pack") (Required)
- `images`: Array of Strings (URLs) (Required)
- `status`: String (Enum: `PENDING`, `ACTIVE`, `OUT_OF_STOCK`, `REJECTED`) (Default: `PENDING`)
- `isDeleted`: Boolean (Default: false)
- `createdAt`, `updatedAt`, `createdBy`, `updatedBy`

**Recommended Indexes**:
- `{ "sellerId": 1 }`
- `{ "category": 1, "status": 1 }`
- `{ "name": "text" }` (For marketplace search)

---

## 5. Orders Collection
**Purpose**: Tracks marketplace purchases made by Farmers.

**Fields & Data Types**:
- `_id`: ObjectId (Required)
- `farmerId`: ObjectId (Ref: Users) (Required)
- `items`: Array of Objects:
  - `productId`: ObjectId (Ref: Marketplace Products)
  - `quantity`: Number
  - `unitPrice`: Number
- `totalAmount`: Number (Required)
- `shippingAddress`: Object (Required)
- `paymentStatus`: String (Enum: `PENDING`, `PAID`, `FAILED`) (Default: `PENDING`)
- `orderStatus`: String (Enum: `PLACED`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`) (Default: `PLACED`)
- `isDeleted`: Boolean (Default: false)
- `createdAt`, `updatedAt`, `createdBy`, `updatedBy`

**Recommended Indexes**:
- `{ "farmerId": 1 }`
- `{ "orderStatus": 1, "createdAt": -1 }`

---

## 6. Sprayer Services Collection
**Purpose**: Profiles for Sprayer Operators detailing their service areas and rates.

**Fields & Data Types**:
- `_id`: ObjectId (Required)
- `operatorId`: ObjectId (Ref: Users) (Required, Unique)
- `baseRatePerAcre`: Number (Required)
- `equipmentUsed`: Array of Strings (e.g., ["Drone", "Manual Knapsack"]) (Required)
- `serviceRadiusKm`: Number (Required)
- `location`: GeoJSON Point (Required)
- `rating`: Number (Default: 0.0)
- `isAvailable`: Boolean (Default: true)
- `status`: String (Enum: `PENDING`, `APPROVED`, `SUSPENDED`) (Default: `PENDING`)
- `isDeleted`: Boolean (Default: false)
- `createdAt`, `updatedAt`, `createdBy`, `updatedBy`

**Recommended Indexes**:
- `{ "operatorId": 1 }`
- `{ "location": "2dsphere" }`

---

## 7. Sprayer Bookings Collection
**Purpose**: Tracks spraying jobs booked by Farmers.

**Fields & Data Types**:
- `_id`: ObjectId (Required)
- `farmerId`: ObjectId (Ref: Users) (Required)
- `operatorId`: ObjectId (Ref: Users) (Required)
- `farmSizeAcres`: Number (Required)
- `cropType`: String (Required)
- `chemicalProvidedBy`: String (Enum: `FARMER`, `OPERATOR`) (Required)
- `scheduledDate`: Date (Required)
- `totalAmount`: Number (Required)
- `paymentStatus`: String (Default: `PENDING`)
- `bookingStatus`: String (Enum: `REQUESTED`, `ACCEPTED`, `COMPLETED`, `CANCELLED`) (Default: `REQUESTED`)
- `location`: GeoJSON Point (Required)
- `isDeleted`: Boolean (Default: false)
- `createdAt`, `updatedAt`, `createdBy`, `updatedBy`

**Recommended Indexes**:
- `{ "farmerId": 1 }`
- `{ "operatorId": 1 }`
- `{ "scheduledDate": 1 }`

---

## 8. Payments Collection
**Purpose**: Centralized ledger for all financial transactions (Razorpay webhooks).

**Fields & Data Types**:
- `_id`: ObjectId (Required)
- `userId`: ObjectId (Ref: Users) (Required)
- `referenceId`: ObjectId (Ref: Equipment Bookings | Sprayer Bookings | Orders) (Required)
- `referenceType`: String (Enum: `EQUIPMENT_BOOKING`, `SPRAYER_BOOKING`, `ORDER`) (Required)
- `amount`: Number (Required)
- `currency`: String (Default: "INR")
- `gatewayTransactionId`: String (Required, Unique)
- `paymentMethod`: String (e.g., "UPI", "CARD", "NETBANKING") (Optional)
- `status`: String (Enum: `PENDING`, `SUCCESS`, `FAILED`, `REFUNDED`) (Default: `PENDING`)
- `isDeleted`: Boolean (Default: false)
- `createdAt`, `updatedAt`, `createdBy`, `updatedBy`

**Recommended Indexes**:
- `{ "userId": 1 }`
- `{ "referenceId": 1, "referenceType": 1 }`
- `{ "gatewayTransactionId": 1 }`

---

## 9. AI Plant Doctor Reports
**Purpose**: Logs crop disease detection scans performed by Farmers.

**Fields & Data Types**:
- `_id`: ObjectId (Required)
- `farmerId`: ObjectId (Ref: Users) (Required)
- `imageUrl`: String (URL) (Required)
- `detectedDisease`: String (Optional)
- `confidenceScore`: Number (Optional)
- `recommendedActions`: Array of Strings (Optional)
- `status`: String (Enum: `PROCESSING`, `SUCCESS`, `FAILED`) (Default: `PROCESSING`)
- `isDeleted`: Boolean (Default: false)
- `createdAt`, `updatedAt`, `createdBy`, `updatedBy`

**Recommended Indexes**:
- `{ "farmerId": 1, "createdAt": -1 }`

---

## 10. Reviews Collection
**Purpose**: Unified rating and review system for equipment, operators, and products.

**Fields & Data Types**:
- `_id`: ObjectId (Required)
- `reviewerId`: ObjectId (Ref: Users) (Required)
- `targetId`: ObjectId (Ref: Equipment | Users | Marketplace Products) (Required)
- `targetType`: String (Enum: `EQUIPMENT`, `OPERATOR`, `PRODUCT`) (Required)
- `rating`: Number (Min: 1, Max: 5) (Required)
- `comment`: String (Optional)
- `status`: String (Enum: `VISIBLE`, `HIDDEN`) (Default: `VISIBLE`)
- `isDeleted`: Boolean (Default: false)
- `createdAt`, `updatedAt`, `createdBy`, `updatedBy`

**Recommended Indexes**:
- `{ "targetId": 1, "targetType": 1 }`

---

## 11. Notifications Collection
**Purpose**: System and push notifications for users.

**Fields & Data Types**:
- `_id`: ObjectId (Required)
- `userId`: ObjectId (Ref: Users) (Required)
- `title`: String (Required)
- `message`: String (Required)
- `type`: String (Enum: `BOOKING_UPDATE`, `PAYMENT`, `SYSTEM_ALERT`, `PROMO`) (Required)
- `isRead`: Boolean (Default: false)
- `relatedEntityId`: ObjectId (Optional)
- `relatedEntityType`: String (Optional)
- `isDeleted`: Boolean (Default: false)
- `status`: String (Default: `ACTIVE`)
- `createdAt`, `updatedAt`, `createdBy`, `updatedBy`

**Recommended Indexes**:
- `{ "userId": 1, "isRead": 1 }`
- `{ "createdAt": -1 }` (TTL Index to auto-delete old notifications after 30 days)

---

## 12. Support Tickets Collection
**Purpose**: Customer service and dispute resolution tracking.

**Fields & Data Types**:
- `_id`: ObjectId (Required)
- `userId`: ObjectId (Ref: Users) (Required)
- `subject`: String (Required)
- `description`: String (Required)
- `attachments`: Array of Strings (URLs) (Optional)
- `priority`: String (Enum: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`) (Default: `MEDIUM`)
- `status`: String (Enum: `OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`) (Default: `OPEN`)
- `isDeleted`: Boolean (Default: false)
- `createdAt`, `updatedAt`, `createdBy`, `updatedBy`

**Recommended Indexes**:
- `{ "userId": 1 }`
- `{ "status": 1, "priority": 1 }`

---

## Future Scalability Considerations
- **Sharding**: The `Payments`, `Notifications`, and `AI Reports` collections will grow rapidly. Sharding by `userId` or `createdAt` should be considered as traffic scales.
- **TTL Indexes**: Implemented on `Notifications` to automatically expire old alerts and save storage.
- **Text Search**: Implemented on `Marketplace Products` and `Equipment` for efficient full-text search capabilities using MongoDB Atlas Search.
- **Denormalization**: `farmerName` and `ownerName` can be safely duplicated into Bookings/Orders arrays later if join (`$lookup`) performance becomes a bottleneck, though sticking to raw ObjectIds ensures consistency in this phase.
