# SmartResponse API - System Users, Roles & Routes

## Document Overview

This document provides a comprehensive guide to all system user roles and their accessible API routes. Use this for frontend AI agent routing decisions and permission validation.

**Last Updated**: March 27, 2026  
**API Version**: 1.0  
**Authentication**: JWT Bearer Token Required (except public endpoints)

---

## System Roles & Permissions

### 1. **USER** - Standard Citizen/Caller

**Description**: General public users who report accidents and provide incident information.

**Key Permissions**:

- Report accidents with media
- Upload incident images/videos
- View their own accident reports
- View notifications
- Manage personal profile

**Use Case**: Person who witnessed an accident using the mobile app to report it.

---

### 2. **OFFICER** - Police/Law Enforcement Officer

**Description**: Respond to incidents, investigate accidents, manage dispatch, create official reports.

**Key Permissions**:

- View all accidents
- Assign officers to incidents
- Create and submit reports
- Manage dispatch operations
- Review emergency responses
- View user and vehicle information
- Update incident status
- Manage emergency services

**Use Case**: Police officer investigating an accident and coordinating response.

---

### 3. **EMERGENCY_RESPONDER** - Paramedic/Firefighter/EMT

**Description**: First responders who receive dispatch assignments and respond to incidents.

**Key Permissions**:

- View assigned incidents (dispatches)
- View incident details and full context
- Acknowledge dispatch assignments
- Update response status in real-time
- Provide location tracking during response
- View accident information
- Submit status updates and notes
- Access AI-generated accident insights

**Use Case**: Ambulance paramedic receiving dispatch and responding to collision scene.

---

### 4. **DISPATCHER** - Emergency Dispatch Coordinator

**Description**: Coordinates emergency response by assigning responders to incidents, manages incident dispatch flow.

**Key Permissions**:

- Send dispatch instructions to specific responders
- View all active dispatches under management
- Track responder status in real-time
- Manage emergency service assignments
- View accident and incident details
- Monitor response progress

**Use Case**: Dispatch center coordinator receiving accident report and assigning paramedics/police to the scene.

---

### 5. **ADMIN** - System Administrator

**Description**: Full system access, user management, configuration, system-wide operations.

**Key Permissions**:

- All permissions (unrestricted access)
- User CRUD operations
- User activation/deactivation
- View system statistics
- Manage emergency services
- Delete any resource
- View system health and diagnostics

**Use Case**: System administrator managing user accounts and system configuration.

---

## API Routes by Role

### PUBLIC ENDPOINTS (No Authentication Required)

```
POST   /auth/signin                      Login with email/password
POST   /auth/refresh                     Refresh JWT tokens
POST   /auth/forgot-password             Request password reset
POST   /auth/reset-password              Reset password with token
POST   /users/                           Register new user
POST   /accidents/report                 Report accident (PUBLIC with AI analysis)
```

---

## Role-Based Route Matrix

### **USER** Routes

#### Authentication Endpoints

```
POST   /auth/signin                      Login
POST   /auth/refresh                     Refresh token
POST   /auth/logout                      Logout
POST   /auth/change-password             Change password
GET    /auth/profile                     Get profile
PATCH  /auth/profile                     Update profile
GET    /auth/sessions                    View active sessions
DELETE /auth/sessions/:sessionId         Logout from specific device
DELETE /auth/sessions                    Logout from all devices
```

#### Accident Endpoints

```
POST   /accidents/                       Create basic accident report
POST   /accidents/report                 Report with AI analysis & auto-dispatch
GET    /accidents/user/:userId           Get my accident reports
GET    /accidents/:id                    Get specific accident details
```

#### Media Endpoints

```
POST   /upload/file                      Upload single file/image
POST   /upload/files                     Upload multiple files (max 10)
POST   /upload/video                     Upload video
GET    /upload/status/:uploadId          Check upload status
```

#### Notification Endpoints

```
GET    /notifications/                   Get all my notifications
GET    /notifications/:id                Get specific notification
```

#### Vehicle Endpoints

```
POST   /vehicles/                        Register vehicle
```

---

### **EMERGENCY_RESPONDER** Routes

#### Dispatcher Communication Endpoints

```
GET    /dispatch/my-assignments          Get incidents assigned to me (pending/active)
GET    /dispatch/my-assignments/history  Get all assignments (including completed)
GET    /dispatch/:id/details             Get full incident details with context
POST   /dispatch/:id/acknowledge         Acknowledge dispatch & mark en-route
PATCH  /dispatch/:id/status              Update response status or on-scene
```

#### Accident Endpoints

```
GET    /accidents/                       View all accidents
GET    /accidents/report/:reportNumber   Find accident by report number
GET    /accidents/status/:status         Get accidents by status
GET    /accidents/officer/:officerId     Get accidents by assigned officer
GET    /accidents/user/:userId           Get accidents by user
GET    /accidents/:id                    Get accident details
```

#### AI Endpoints

```
POST   /ai/analyze-accident              Get AI analysis of accident
POST   /ai/generate-report               Generate report with AI insights
POST   /ai/extract-text                  Extract text from images (OCR)
POST   /ai/classify-severity             Classify accident severity
GET    /ai/insights/:accidentId          Get AI insights for incident
```

#### Emergency Services Endpoints

```
GET    /emergency-services/              View emergency service records
GET    /emergency-services/:id           Get emergency service details
PATCH  /emergency-services/:id           Update emergency service status
```

#### Reports Endpoints

```
GET    /reports/                         View all reports
GET    /reports/report/:reportNumber     Get report by number
GET    /reports/accident/:accidentId     Get reports for incident
GET    /reports/submitted                Get submitted reports
GET    /reports/:id                      Get specific report
```

#### Notifications Endpoints

```
GET    /notifications/                   Get all notifications
GET    /notifications/:id                Get specific notification
PATCH  /notifications/:id                Mark notification as read
```

#### Media Endpoints

```
POST   /upload/file                      Upload file
POST   /upload/files                     Upload multiple files
POST   /upload/document                  Upload accident document
POST   /upload/video                     Upload video
GET    /upload/status/:uploadId          Check upload status
```

#### Locations Endpoints

```
GET    /locations/                       View all locations
GET    /locations/:id                    Get location details
```

#### Authentication

```
GET    /auth/profile                     Get profile
PATCH  /auth/profile                     Update profile
GET    /auth/sessions                    View sessions
DELETE /auth/sessions/:sessionId         Logout from session
```

---

### **DISPATCHER** Routes

#### Dispatcher Communication Endpoints

```
POST   /dispatch/send-to-responder       Send dispatch with full incident details to responder
GET    /dispatch/dispatcher/active       View all active dispatches under management
GET    /dispatch/:id/details             Get dispatch details
```

#### Dispatch Management Endpoints

```
GET    /dispatch/active                  Get all active dispatches
GET    /dispatch/accident/:accidentId    Get dispatches for specific accident
GET    /dispatch/pending                 Get pending dispatches
GET    /dispatch/completed               Get completed dispatches
GET    /dispatch/statistics              View dispatch statistics
```

#### Accident Endpoints

```
GET    /accidents/                       View all accidents
GET    /accidents/report/:reportNumber   Find accident by report number
GET    /accidents/status/:status         Get accidents by status
GET    /accidents/officer/:officerId     Get accidents by officer
GET    /accidents/statistics             View accident statistics
GET    /accidents/:id                    Get accident details
```

#### Emergency Services Endpoints

```
GET    /emergency-services/              View emergency services
GET    /emergency-services/:id           Get emergency service details
PATCH  /emergency-services/:id           Update emergency service
POST   /emergency-services/              Create emergency service
```

#### Notifications Endpoints

```
GET    /notifications/                   Get notifications
POST   /notifications/                   Create notification
GET    /notifications/:id                Get notification
PATCH  /notifications/:id                Update notification
```

#### Locations Endpoints

```
GET    /locations/                       View locations
GET    /locations/:id                    Get location
```

#### Authentication

```
GET    /auth/profile                     Get profile
PATCH  /auth/profile                     Update profile
GET    /auth/sessions                    View sessions
DELETE /auth/sessions/:sessionId         Logout from session
```

---

### **OFFICER** Routes

#### Accident Management Endpoints

```
POST   /accidents/                       Create accident report
POST   /accidents/report                 Report with AI analysis
GET    /accidents/                       Get all accidents
GET    /accidents/report/:reportNumber   Get accident by report number
GET    /accidents/status/:status         Get accidents by status
GET    /accidents/officer/:officerId     Get my assigned accidents
GET    /accidents/statistics             View accident statistics
GET    /accidents/user/:userId           Get user's accidents
GET    /accidents/:id                    Get accident details
PATCH  /accidents/:id                    Update accident details
PATCH  /accidents/:id/assign-officer     Assign officer to accident
PATCH  /accidents/:id/status             Update accident status
DELETE /accidents/:id                    Delete accident
```

#### Dispatch Management Endpoints

```
POST   /dispatch/manual                  Manually dispatch emergency services
GET    /dispatch/active                  Get all active dispatches
GET    /dispatch/accident/:accidentId    Get dispatches for accident
GET    /dispatch/pending                 Get pending dispatches
GET    /dispatch/completed               Get completed dispatches
GET    /dispatch/statistics              View dispatch statistics
```

#### Report Management Endpoints

```
POST   /reports/                         Create report
GET    /reports/                         View all reports
GET    /reports/report/:reportNumber     Get report by number
GET    /reports/accident/:accidentId     Get reports for accident
GET    /reports/officer/:officerId       Get my reports
GET    /reports/submitted                Get submitted reports
GET    /reports/draft                    Get draft reports
GET    /reports/statistics               View report statistics
GET    /reports/:id                      Get report details
PATCH  /reports/:id                      Update report
PATCH  /reports/:id/submit               Submit report
DELETE /reports/:id                      Delete report
```

#### User Management Endpoints

```
GET    /users/                           Get all users
GET    /users/stats                      View user statistics
GET    /users/active                     Get active users
GET    /users/role/:role                 Get users by role
GET    /users/:id                        Get user details
```

#### Vehicle Management Endpoints

```
POST   /vehicles/                        Register vehicle
GET    /vehicles/                        Get all vehicles
GET    /vehicles/accident/:accidentId    Get vehicles in accident
GET    /vehicles/plate/:licensePlate     Get vehicle by plate
GET    /vehicles/:id                     Get vehicle details
PATCH  /vehicles/:id                     Update vehicle
DELETE /vehicles/:id                     Delete vehicle
```

#### Emergency Services Endpoints

```
GET    /emergency-services/              View emergency services
GET    /emergency-services/:id           Get emergency service details
PATCH  /emergency-services/:id           Update emergency service
```

#### Locations Endpoints

```
GET    /locations/                       View all locations
GET    /locations/:id                    Get location details
PATCH  /locations/:id                    Update location
```

#### Media Endpoints

```
POST   /media/                           Upload media
GET    /media/                           Get all media
GET    /media/:id                        Get media details
PATCH  /media/:id                        Update media
DELETE /media/:id                        Delete media
```

#### Upload Endpoints

```
POST   /upload/file                      Upload single file
POST   /upload/files                     Upload multiple files
POST   /upload/document                  Upload accident document
POST   /upload/video                     Upload video
GET    /upload/status/:uploadId          Check upload status
DELETE /upload/file/:publicId            Delete uploaded file
```

#### AI Endpoints

```
POST   /ai/analyze-accident              Analyze accident with AI
POST   /ai/generate-report               Generate report with AI
POST   /ai/extract-text                  Extract text from image
POST   /ai/classify-severity             Classify accident severity
GET    /ai/insights/:accidentId          Get AI insights
```

#### Notifications Endpoints

```
POST   /notifications/                   Create notification
GET    /notifications/                   Get all notifications
GET    /notifications/:id                Get notification
PATCH  /notifications/:id                Update notification
```

#### Authentication

```
GET    /auth/profile                     Get profile
PATCH  /auth/profile                     Update profile
POST   /auth/change-password             Change password
GET    /auth/sessions                    View sessions
DELETE /auth/sessions/:sessionId         Logout from session
DELETE /auth/sessions                    Logout from all sessions
```

---

### **ADMIN** Routes (Unrestricted Access)

#### User Management Endpoints

```
POST   /users/                           Register new user
GET    /users/                           Get all users (with filters)
GET    /users/stats                      Get user statistics
GET    /users/active                     Get active users
GET    /users/role/:role                 Get users by role
GET    /users/:id                        Get user details
PATCH  /users/:id                        Update user
PATCH  /users/:id/deactivate             Deactivate user
PATCH  /users/:id/activate               Activate user
DELETE /users/:id                        Delete user permanently
```

#### Accident Management Endpoints

```
POST   /accidents/                       Create accident
POST   /accidents/report                 Report with AI analysis
GET    /accidents/                       Get all accidents
GET    /accidents/report/:reportNumber   Get accident by report number
GET    /accidents/status/:status         Get by status
GET    /accidents/officer/:officerId     Get by officer
GET    /accidents/statistics             Get statistics
GET    /accidents/user/:userId           Get by user
GET    /accidents/:id                    Get accident details
PATCH  /accidents/:id                    Update accident
PATCH  /accidents/:id/assign-officer     Assign officer
PATCH  /accidents/:id/status             Update status
DELETE /accidents/:id                    Delete accident
```

#### Dispatch Management Endpoints

```
POST   /dispatch/manual                  Manually dispatch
POST   /dispatch/send-to-responder       Send to responder
GET    /dispatch/active                  Get active dispatches
GET    /dispatch/dispatcher/active       Get dispatcher view
GET    /dispatch/accident/:accidentId    Get by accident
GET    /dispatch/pending                 Get pending
GET    /dispatch/completed               Get completed
GET    /dispatch/statistics              Get statistics
GET    /dispatch/:id/details             Get dispatch details
```

#### Report Management Endpoints

```
POST   /reports/                         Create report
GET    /reports/                         Get all reports
GET    /reports/report/:reportNumber     Get by number
GET    /reports/accident/:accidentId     Get by accident
GET    /reports/officer/:officerId       Get by officer
GET    /reports/submitted                Get submitted
GET    /reports/draft                    Get draft
GET    /reports/statistics               Get statistics
GET    /reports/:id                      Get report details
PATCH  /reports/:id                      Update report
PATCH  /reports/:id/submit               Submit report
DELETE /reports/:id                      Delete report
```

#### Emergency Services Endpoints

```
POST   /emergency-services/              Create emergency service
GET    /emergency-services/              Get all services
GET    /emergency-services/:id           Get service details
PATCH  /emergency-services/:id           Update service
DELETE /emergency-services/:id           Delete service
```

#### Vehicle Management Endpoints

```
POST   /vehicles/                        Create vehicle
GET    /vehicles/                        Get all vehicles
GET    /vehicles/accident/:accidentId    Get by accident
GET    /vehicles/plate/:licensePlate     Get by plate
GET    /vehicles/:id                     Get vehicle details
PATCH  /vehicles/:id                     Update vehicle
DELETE /vehicles/:id                     Delete vehicle
```

#### Locations Endpoints

```
POST   /locations/                       Create location
GET    /locations/                       Get all locations
GET    /locations/:id                    Get location details
PATCH  /locations/:id                    Update location
DELETE /locations/:id                    Delete location
```

#### Media Endpoints

```
POST   /media/                           Create media
GET    /media/                           Get all media
GET    /media/:id                        Get media details
PATCH  /media/:id                        Update media
DELETE /media/:id                        Delete media
```

#### Notifications Endpoints

```
POST   /notifications/                   Create notification
GET    /notifications/                   Get all notifications
GET    /notifications/:id                Get notification
PATCH  /notifications/:id                Update notification
DELETE /notifications/:id                Delete notification
```

#### Upload Endpoints

```
POST   /upload/file                      Upload file
POST   /upload/files                     Upload multiple files
POST   /upload/document                  Upload document
POST   /upload/video                     Upload video
GET    /upload/status/:uploadId          Check status
DELETE /upload/file/:publicId            Delete file
```

#### AI Endpoints

```
POST   /ai/analyze-accident              Analyze accident
POST   /ai/generate-report               Generate report
POST   /ai/extract-text                  Extract text
POST   /ai/classify-severity             Classify severity
GET    /ai/insights/:accidentId          Get insights
```

#### Authentication

```
POST   /auth/signin                      Login
POST   /auth/refresh                     Refresh token
POST   /auth/logout                      Logout
POST   /auth/change-password             Change password
POST   /auth/forgot-password             Request reset
POST   /auth/reset-password              Reset password
GET    /auth/profile                     Get profile
PATCH  /auth/profile                     Update profile
GET    /auth/sessions                    Get sessions
DELETE /auth/sessions/:sessionId         Logout session
DELETE /auth/sessions                    Logout all sessions
```

---

## Authentication & Headers

### Required Headers for Protected Routes

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### JWT Token Contents

```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "role": "officer|user|dispatcher|responder|admin",
  "username": "username",
  "iat": 1234567890,
  "exp": 1234571490
}
```

---

## Response Codes

| Code | Meaning                                     |
| ---- | ------------------------------------------- |
| 200  | OK - Successful GET/PATCH/DELETE            |
| 201  | Created - Successful POST                   |
| 400  | Bad Request - Invalid input                 |
| 401  | Unauthorized - Missing/invalid token        |
| 403  | Forbidden - Insufficient permissions        |
| 404  | Not Found - Resource not found              |
| 409  | Conflict - Duplicate entry (email/username) |
| 500  | Internal Server Error                       |

---

## Common Request Examples

### 1. User Registration (PUBLIC)

```bash
POST /users/
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "SecurePass123!",
  "phoneNumber": "+1234567890",
  "role": "user"
}
```

### 2. Login & Get Token (PUBLIC)

```bash
POST /auth/signin
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}

Response:
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### 3. Report Accident with AI Analysis (PUBLIC)

```bash
POST /accidents/report
Content-Type: multipart/form-data

{
  "description": "Multiple vehicle collision",
  "location": "Highway 101, Mile 45",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "images": [file1.jpg, file2.jpg]
}
```

### 4. Dispatcher Send Incident to Responder (DISPATCHER/OFFICER/ADMIN)

```bash
POST /dispatch/send-to-responder
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "accidentId": "uuid",
  "responderId": "uuid",
  "serviceType": "ambulance",
  "severity": 85,
  "incidentDescription": "Multi-vehicle collision with injuries",
  "instructions": "Bring triple immobilization kits",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "address": "123 Main St, City, State 12345",
  "numberOfVehicles": 3,
  "numberOfInjuries": 4,
  "weatherConditions": "Rainy",
  "actionItems": ["Establish scene safety", "Triage patients"]
}
```

### 5. Responder View Assignments (EMERGENCY_RESPONDER)

```bash
GET /dispatch/my-assignments
Authorization: Bearer <TOKEN>

Response:
{
  "data": [
    {
      "id": "uuid",
      "accidentId": "uuid",
      "type": "ambulance",
      "status": "dispatched",
      "severity": 85,
      "dispatchedAt": "2026-03-27T10:15:00Z",
      "accident": {
        "description": "Multi-vehicle collision",
        "latitude": 37.7749,
        "longitude": -122.4194,
        "numberOfInjuries": 4
      }
    }
  ]
}
```

### 6. Responder Acknowledge Dispatch (EMERGENCY_RESPONDER)

```bash
POST /dispatch/uuid/acknowledge
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "message": "Acknowledged - En route to scene. ETA 5 minutes"
}
```

### 7. Responder Update Status (EMERGENCY_RESPONDER)

```bash
PATCH /dispatch/uuid/status
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "status": "on_scene",
  "notes": "Arrived on scene. Multiple injuries confirmed. 3 patients requiring transport.",
  "currentLatitude": 37.7749,
  "currentLongitude": -122.4194
}
```

---

## AI Integration Notes

For frontend AI agents using this API:

1. **Role Detection**: Check JWT token's `role` field to determine available endpoints
2. **Conditional Rendering**: Only show UI for accessible endpoints
3. **Dispatcher Flow**: New `DISPATCHER` role enables central coordination
4. **Real-time Updates**: Responder status updates visible to dispatcher via `/dispatch/dispatcher/active`
5. **Auto-Assignment**: Use `POST /dispatch/send-to-responder` for intelligent responder matching
6. **Incident Context**: `GET /dispatch/:id/details` provides complete incident context for responders

---

## Migration from Previous Versions

If upgrading from previous version without DISPATCHER role:

1. Officers managing dispatch should be migrated to DISPATCHER role
2. Existing dispatch workflows still work via OFFICER role
3. New dispatcher-specific endpoints inherit permissions from OFFICER for backward compatibility
4. Add DISPATCHER role to user registration options

---

## Error Handling

All error responses include:

```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Bad Request",
  "timestamp": "2026-03-27T10:15:00Z"
}
```

---

**End of Document**
