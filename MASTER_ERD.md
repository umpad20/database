# MotoRent Butuan — Master ERD
## Motorcycle Rental Service Management System

This document is a faithful representation of the project's ERD diagrams, including the official structure and the additional system enhancements.

---

## 1. OFFICIAL ERD TABLES (From Diagrams)

### 1.1 `users`
- `user_id` (PK)
- `user_name` (Linked to email for login)
- `password_hash`
- `role` (`admin`, `staff`, `customer`)
- `created_at`

### 1.2 `customers`
- `customer_id` (PK)
- `user_id` (FK)
- `first_name`
- `last_name`
- `middle_name`
- `gender`
- `date_of_birth`
- `phone`
- `email`
- `license_number`
- `license_expiry_date`
- `address`
- `registration_date`
- `customer_status`

### 1.3 `staff/admin`
- `staff_id` (PK)
- `user_id` (FK)
- `first_name`
- `last_name`
- `phone`
- `email`
*(Note: Handled directly via the `users` table in implementation as they represent the same entity)*

### 1.4 `categories`
- `category_id` (PK)
- `category_name` (Scooter, Automatic, Manual, Big Bike, Electric)

### 1.5 `motorcycles`
- `motorcycle_id` (PK)
- `brand`
- `year_model`
- `plate_number`
- `color`
- `engine_no`
- `chassis_no`
- `daily_rate`
- `status` (`available`, `rented`, `undermaintenance`)
- `category_id` (FK)

### 1.6 `rentals`
- `rental_id` (PK)
- `customer_id` (FK)
- `motorcycle_id` (FK)
- `staff_id` (FK)
- `rental_date`
- `expected_return_date`
- `actual_return_date`
- `daily_rate_at_rent`
- `total_amount`
- `rental_status`

### 1.7 `payments`
- `payment_id` (PK)
- `rental_id` (FK)
- `payment_date`
- `payment_method` (`GCash`, `Bank Transfer`, `Cash on Pickup`)
- `amount`
- `payment_status`

### 1.8 `maintenance`
- `maintenance_id` (PK)
- `motorcycle_id` (FK)
- `staff_id` (FK)
- `service_date`
- `maintenance_type`
- `cost`

---

## 2. 🚀 ENHANCEMENTS (What were added)

To make the system fully functional and "premium," the following fields/logics were added beyond the original diagram:

### 📸 Digital Documentation
- **`id_document_path`** (Rentals): Stores the uploaded image of the renter's Valid ID.
- **`license_document_path`** (Rentals): Stores the uploaded image of the Driver's License.
- **`image_path`** (Motorcycles): Allows the admin to upload real photos of the bikes.

### 🚚 Fulfillment Logic
- **`fulfillment_type`**: Allows users to choose between **Branch Pickup** or **Door-to-Door Delivery**.
- **`pickup_location`** & **`return_location`**: Captures specific addresses for the delivery/return of the unit.

### 🔒 Security & Tracking
- **`transaction_id`** (Payments): Captures the Reference Number for GCash or Bank Transfers.
- **`description`** (Maintenance): Allows staff to write detailed notes about what was repaired.
- **`auto_fill`**: System automatically remembers customer details for their next rent.

---

## 3. BUSINESS LOGIC RULES

1. **Profile Requirement**: Customers must complete their profile (License Info, DOB, etc.) before they can submit a rental request.
2. **Maintenance Lock**: A motorcycle cannot be put into maintenance if it is currently `Rented` or `Reserved`.
3. **Approval Flow**: Payment options only appear after a Staff/Admin has approved the rental request.
4. **Availability**: Units in `Maintenance` or `Rented` status are automatically hidden from the public catalog.
