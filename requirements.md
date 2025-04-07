# **Office Cab Booking Service - Requirement Document**  

## **1. Introduction**  
The **Office Cab Booking Service** is a white-label application designed for employers to provide cab facilities to their employees. Employees can book cabs for their daily commute, with special provisions for female employees during late hours. The system includes role-based access control, fare calculation based on distance, and approval workflows for sensitive bookings.  

## **2. Objectives**  
- Provide a seamless cab booking experience for employees.  
- Ensure safety for female employees during late-night travel.  
- Allow managers to approve/disapprove sensitive booking requests.  
- Automate fare calculation based on predefined pickup/drop locations.  
- Offer a white-label solution that companies can customize.  

## **3. Scope**  
### **In Scope**  
- Employee registration & authentication.  
- Role-based access (Employee, Manager, Admin).  
- Cab booking with pickup/drop location selection.  
- Special booking requests for female employees (post 10 PM or night shifts).  
- Manager approval workflow for sensitive bookings.  
- Fare calculation based on distance from the office.  
- Booking history & receipts.  
- Notifications (email/SMS) for booking confirmation, approvals, and ride updates.  
- Admin dashboard for managing employees, drivers, and cabs.  

### **Out of Scope**  
- Real-time cab tracking (can be added in future phases).  
- Payment integration (since this is a company-sponsored service).  
- Driver app (assumes integration with an existing fleet service).  

## **4. User Roles & Permissions**  
| **Role**       | **Permissions** |  
|---------------|----------------|  
| **Employee**  | - Book cabs <br> - View booking history <br> - Request late-night cabs (if female) |  
| **Manager**   | - Approve/Reject late-night cab requests <br> - View team bookings <br> - Modify bookings (if needed) |  
| **Admin**     | - Add/Remove employees & managers <br> - Manage pickup/drop locations <br> - Configure fare rates <br> - Generate reports |  

## **5. Functional Requirements**  
### **5.1 Employee Features**  
- **Registration & Login**  
  - Employees register using company email.  
  - Profile includes gender, department, and shift timings.  
- **Cab Booking**  
  - Select pickup & drop locations (predefined by admin).  
  - Select date & time.  
  - For female employees booking post 10 PM or night shift, request goes to manager for approval.  
- **Booking History**  
  - View past and upcoming bookings.  
  - Cancel bookings (with restrictions if ride is too close).  

### **5.2 Manager Features**  
- **Approval Dashboard**  
  - View pending late-night cab requests from female employees.  
  - Approve/Reject with optional comments.  
- **Team Management**  
  - View all bookings of team members.  
  - Modify bookings in case of emergencies.  

### **5.3 Admin Features**  
- **Employee Management**  
  - Add/Remove employees and assign roles.  
- **Location & Fare Management**  
  - Define pickup/drop locations.  
  - Set fare calculation rules (e.g., ₹X per km from office).  
- **Reports & Analytics**  
  - Monthly usage reports.  
  - Expense tracking per department.  

## **6. Special Features for Female Employees**  
- **Late-Night Booking Request**  
  - If booking time is after 10 PM or during night shift, request is sent to manager.  
  - Booking confirmed only after approval.  
- **Safety Measures**  
  - Option to share ride details with emergency contacts.  
  - Preferred female drivers (if available).  

## **7. Fare Calculation Logic**  
- Fare = Base Fare + (Distance from Office × Rate per km)  
- Admin can configure:  
  - Base fare (e.g., ₹50).  
  - Rate per km (e.g., ₹10/km).  
  - Peak/non-peak hour pricing.  

## **8. Notifications**  
- **Employees**  
  - Booking confirmation.  
  - Approval status (for late-night requests).  
  - Ride reminders.  
- **Managers**  
  - Approval requests.  
  - Booking modifications by employees.  

## **9. Non-Functional Requirements**  
- **Security**  
  - Role-based access control.  
  - Data encryption for sensitive information.  
- **Performance**  
  - Support up to 10,000 employees.  
  - Response time < 2 seconds for booking requests.  
- **Scalability**  
  - Cloud-hosted with auto-scaling capabilities.  

## **10. Future Enhancements**  
- Real-time cab tracking.  
- Integration with payroll for deductions (if applicable).  
- Mobile app for drivers with navigation.  

## **11. Conclusion**  
This document outlines the requirements for a **white-label Office Cab Booking Service** that ensures convenience, safety, and efficiency for employees while providing administrative control to employers.  

**Approval:**  
[Company Name]  
[Approved by]  
[Date]  

---
Would you like any modifications or additional sections?