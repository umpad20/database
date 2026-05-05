# Project Documentation: MotoRent Butuan
## Premium Motorcycle Rental Service Management System

**Prepared for**: School Project Presentation  
**Project Name**: MotoRent Butuan  
**System Type**: Web-based Rental Management System  
**Frameworks**: Laravel 12 (Backend) + React 19 & Inertia.js v2 (Frontend)

---

## 1. EXECUTIVE SUMMARY
MotoRent Butuan is a premium, full-stack web application designed to digitize and streamline motorcycle rental operations in Butuan City. The system bridges the gap between traditional manual rentals and a modern, automated experience, offering secure bookings, document verification, and comprehensive fleet management for administrators.

---

## 2. PROBLEM STATEMENT
Traditional rental services in the region often suffer from:
- **Inefficient Booking**: Manual paperwork and walk-in only availability checks.
- **Security Risks**: Difficulties in verifying customer licenses and tracking maintenance.
- **Lack of Transparency**: Customers have no way to see real-time availability or peer reviews of the service.
- **Disorganized Records**: Managing payments and fleet status via spreadsheets or physical logs.

---

## 3. KEY SYSTEM FEATURES

### 👤 User Roles
- **Admin**: Full system control, revenue analytics, fleet management, and staff oversight.
- **Staff**: Handles rental approvals, payment verification, and maintenance logging.
- **Customer**: Browses bikes, manages profile details, submits rental requests, and leaves verified reviews.

### 🏍️ Advanced Fleet Management
- **Category-Based Catalog**: Organize bikes into Scooters, Manuals, Big Bikes, etc.
- **Maintenance Guard**: The system prevents staff from marking a bike for maintenance if it is currently rented or reserved.
- **Real-Time Status**: Automated status updates (Available, Rented, Maintenance).

### 💳 Secure Rental Workflow
1. **Request**: Customer selects a bike and submits license details.
2. **Verification**: Staff reviews the request and attached documents (Valid ID, License).
3. **Fulfillment**: Support for both **Branch Pickup** and **Door-to-Door Delivery**.
4. **Payment**: Secure tracking of GCash, Bank Transfers, and Cash on Pickup.
5. **Return & Review**: Only after a successful return can a customer leave a **Verified Service Review**.

---

## 4. TECHNICAL STACK
- **Backend**: Laravel 12 (PHP) — Robust API and business logic.
- **Frontend**: React 19 & Inertia.js — Single Page Application (SPA) feel with SEO benefits.
- **Styling**: Tailwind CSS v4 — High-fidelity, responsive "Royal Blue" design.
- **Database**: MySQL — Relational data storage following strict ERD rules.
- **Security**: Laravel Breeze (Authentication) + Middleware-based role protection.

---

## 5. DATABASE ARCHITECTURE (ERD)
The system is built on 8 core relational tables:
- **Users & Customers**: Handles authentication and detailed demographic/licensing profiles.
- **Motorcycles & Categories**: Manages the fleet and specifications.
- **Rentals**: The central transaction table linking customers, bikes, and staff.
- **Payments**: Tracks financial transactions and statuses.
- **Maintenance**: Logs service records and costs for fleet longevity.
- **System Reviews**: Stores verified customer testimonials.

---

## 6. BUSINESS LOGIC & VALIDATIONS
The system implements "Logically True" rules:
- **Profile Completion**: Users cannot rent until their profile (License, DOB) is 100% complete.
- **Auto-Fill Logic**: Returning customers have their details automatically populated for a faster booking experience.
- **One Review per Trip**: Reviews are strictly locked to a specific `rental_id` and only allowed after the unit is returned.

---

## 7. CONCLUSION
MotoRent Butuan represents a state-of-the-art solution for local vehicle rentals. By combining modern aesthetics with strict business logic, the system ensures a high-trust environment for both the business owner and the customer.
