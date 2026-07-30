# 🎬 Video Rental Management System

A full-stack, responsive web application for managing movie rentals, customer records, and active inventory tracking. Built with an **ASP.NET Core Web API** backend and a **React** single-page frontend.

---

## 🚀 Features

- **Inventory Tracking:** Real-time client-side and server-side movie stock updates upon rental and return.
- **Rental Processing:** Interactive movie selection queue with dynamic stock availability checks and error guards.
- **Active & Historical Rental Records:** Comprehensive dashboard displaying active rentals, returned items, customer metadata, and return timestamps.
- **Robust API Integration:** Flexible JSON data normalization and error handlings across C# entity conventions (PascalCase/camelCase) and React state management.

---

## 🛠️ Tech Stack

### **Backend**
* **Framework:** C# / .NET 8 ASP.NET Core Web API
* **Database / ORM:** Entity Framework Core, SQL Server
* **Data Access:** Eager Loading (`Include` / `ThenInclude`) for relational models

### **Frontend**
* **Library:** React.js (Functional Components, Hooks)
* **HTTP Client:** Axios
* **UI/Styling:** Modular CSS-in-JS / Inline Styles

---

## 📊 Database Schema Overview

The system models relationships using three core entities:

1. **Customers (`Customers`)**
   - `CustomerId` (PK)
   - `CustomerName` / `FirstName`, `LastName`

2. **Movies (`Movies`)**
   - `MovieID` (PK)
   - `Title` / `MovieName`
   - `NumberAvailable` (Stock Count)

3. **Rentals & Details (`RentalHeaders` & `RentalDetails`)**
   - `RentalHeader`: Tracks `RentalID` (PK), `CustomerID` (FK), and `DateRented`.
   - `RentalDetail`: Junction table linking `RentalID` and `MovieID` with tracking for `DateReturned`.

---

## 💻 Getting Started

### Prerequisites
* [.NET 6 SDK or higher](https://dotnet.microsoft.com/download)
* [Node.js (v16+ or higher)](https://nodejs.org/) & `npm`
* SQL Server / LocalDB instance

---

### Backend Setup (ASP.NET Core Web API)

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/YOUR_USERNAME/rental-management-system.git](https://github.com/YOUR_USERNAME/rental-management-system.git)
   cd rental-management-system/backend
