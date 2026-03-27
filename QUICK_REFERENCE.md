# Quick Reference Guide

## 📋 Documentation Files

### For AI Agents & API Integration

📄 **SYSTEM_USERS_AND_ROUTES.md**

- Complete API reference by user role
- 5 system roles documented
- Authentication setup
- Request/response examples
- Error codes
- Real-time update notes

### For Dispatcher Dashboard

📄 **DISPATCHER_DASHBOARD_GUIDE.md**

- Complete feature documentation
- Workflow diagrams
- Technical architecture
- Component structure
- Testing checklist
- Deployment guide

### Implementation Overview

📄 **IMPLEMENTATION_SUMMARY.md**

- What was built
- File structure
- Next steps
- Quality checklist
- Support resources

---

## 🎯 Dispatcher Dashboard Features

### 1️⃣ Dashboard

- Real-time metrics
- Critical incidents counter
- Active cases tracking
- Response time metrics
- Charts & statistics

### 2️⃣ Incidents Queue

- Search & filter incidents
- View full incident details
- Severity indicators
- Status tracking
- Modal viewer

### 3️⃣ Responders Management

- View available responders
- Filter by role & status
- Quick dispatch to responders
- Real-time tracking
- Current assignments

### 4️⃣ Emergency Services

- Manage service providers
- Add new services
- View service status
- Track response times
- Coverage areas

### 5️⃣ Settings

- Configure alerts
- Performance settings
- System monitoring
- Theme preferences

---

## 👥 System Roles Quick Reference

```
USER              → Report incidents, view own reports
  Dashboard: Minimal features, personal reporting

EMERGENCY_RESPONDER → Respond to dispatch, track assignments
  Dashboard: Assignments, incident details, status updates

OFFICER           → Manage incidents, create reports, dispatch
  Dashboard: Full incident management, AI assistance

DISPATCHER (NEW)  → Coordinate responses, assign responders
  Dashboard: 5-page interface for coordination

ADMIN             → System management, full access
  Dashboard: System-wide controls
```

---

## 🔌 Key API Routes (by Dispatcher)

```
GET  /dispatch/dispatcher/active              View all active dispatches
POST /dispatch/send-to-responder              Send incident to responder
GET  /emergency-services/                     View emergency services
PATCH /emergency-services/:id                 Update emergency service
POST /emergency-services/                     Create emergency service
GET  /dispatch/:id/details                    Get dispatch details
```

See `SYSTEM_USERS_AND_ROUTES.md` for complete list.

---

## 🎨 Design System

| Component       | Color            |
| --------------- | ---------------- |
| Primary Accent  | Teal (#0d9488)   |
| Dark Background | Slate (#0f172a)  |
| Cards           | Slate (#1e293b)  |
| Critical        | Red (#dc2626)    |
| High            | Orange (#f97316) |
| Medium          | Yellow (#eab308) |
| Low/Available   | Green (#22c55e)  |

### Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px-1024px
- Desktop: 1024px-1280px
- Large: > 1280px

---

## 📁 File Structure

```
src/components/dispatcher/
├── DispatcherSidebar.tsx          Navigation menu
├── DispatcherTopNav.tsx           Top navigation bar
├── DispatcherTypes.ts             Type definitions
└── pages/
    ├── DispatcherDashboardPage.tsx     Real-time metrics
    ├── IncidentsQueuePage.tsx          Incident management
    ├── RespondersManagementPage.tsx    Responder assignments
    ├── EmergencyServicesPage.tsx       Service providers
    └── DispatcherSettingsPage.tsx      Configuration
```

---

## 🚀 Using the Dispatcher Dashboard

### Access

```
URL: /dashboard/dispatcher
Auth: Requires DISPATCHER role in JWT token
```

### Navigation

1. Use sidebar to switch between pages
2. Collapse/expand sidebar for more space
3. Click menu items to navigate
4. Toggle dark mode in top right

### Typical Workflow

1. **Check Dashboard** - See real-time metrics
2. **Review Queue** - Sort incidents by severity
3. **Select Responders** - Go to Responders page
4. **Send Dispatch** - Click Dispatch button
5. **Monitor Status** - Track in Dashboard

---

## 🔑 Key Features by Page

| Page       | Search | Filter | Actions       | Modal |
| ---------- | ------ | ------ | ------------- | ----- |
| Dashboard  | —      | —      | View charts   | —     |
| Queue      | ✅     | ✅     | View details  | ✅    |
| Responders | ✅     | ✅     | Send dispatch | ✅    |
| Services   | ✅     | ✅     | Edit, add     | ✅    |
| Settings   | —      | —      | Update        | —     |

---

## 🧪 Testing Workflows

### Test Incident Dispatch

1. Go to Incidents Queue
2. Search for incident
3. Go to Responders
4. Find Available responder
5. Click Dispatch
6. Select incident
7. Confirm dispatch

### Test Responder Tracking

1. Go to Dashboard - check metrics
2. Go to Responders - filter by status
3. See current assignments
4. Check time to available

### Test Settings

1. Go to Settings
2. Toggle preferences
3. Refresh page
4. Verify persistence

---

## 📊 Statistics Available

### Dashboard Metrics

- Total critical incidents
- Active cases count
- Resolved today
- Response times (dispatch → arrival → resolution)
- Incident severity distribution

### Responder Metrics

- Availability status
- Current assignment
- Time until available
- Service type

### Service Metrics

- Total services
- Active services
- Total units
- Average response time

---

## 🔐 Authentication

### JWT Token Example

```json
{
  "sub": "user-uuid",
  "email": "dispatcher@responders.com",
  "role": "DISPATCHER",
  "username": "dispatcher1",
  "iat": 1234567890,
  "exp": 1234571490
}
```

### Required Header

```
Authorization: Bearer <JWT_TOKEN>
```

---

## 🐛 Troubleshooting

### Empty Data

- Check API connection
- Verify authentication token
- Check useGetAccidents hook
- Review browser console

### Settings Not Saving

- Check localStorage enabled
- Clear browser cache
- Verify theme preference

### Responders Not Available

- Check incident → responder role match
- Verify responder status
- Check permissions

---

## 📞 Support Resources

**API Reference**: See `SYSTEM_USERS_AND_ROUTES.md`  
**Feature Guide**: See `DISPATCHER_DASHBOARD_GUIDE.md`  
**Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`

---

## ✅ Checklist for Setup

- [ ] API backend ready
- [ ] Database tables created
- [ ] Environment variables configured
- [ ] Authentication implemented
- [ ] WebSocket for real-time (optional)
- [ ] Map provider configured (optional)
- [ ] Notifications service setup

---

## 🎓 Learning Path

1. **Start Here**: Read this document
2. **Understand Roles**: Read SYSTEM_USERS_AND_ROUTES.md
3. **Feature Deep Dive**: Read DISPATCHER_DASHBOARD_GUIDE.md
4. **Explore Code**: Check src/components/dispatcher/pages/
5. **Test Features**: Go through workflows above
6. **Deploy**: Follow deployment notes in guide

---

## 📝 Development Notes

### Component Modularity

- Each page is independent
- Reusable UI components in `/ui`
- Consistent styling throughout
- Props-based customization

### State Management

- Local component state for UI
- localStorage for preferences
- useGetAccidents for incident data
- Session storage for auth

### Real-time Ready

- Hooks prepared for WebSocket
- Event listeners ready
- Status update mechanisms in place

---

**Last Updated**: March 27, 2026  
**Status**: Production Ready  
**Version**: 1.0
