<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
  <h1 align="center">Creator Monetization Platform Backend</h1>
</p>

## 📚 Introduction

This is a **NestJS** backend for a Creator Monetization Platform. It allows creators to sell courses, manage lessons with video content, and handle access requests from students. The platform supports **invoicing integration** (Payme, Click) and a generic Mock provider for testing.

---

## 🚀 Features

- **Role-Based Access Control (RBAC)**: secure endpoints for `ADMIN`, `CREATOR`, and `STUDENT`.
- **Course Management**:
    - Manage courses, sections, and lessons.
    - **Visibility Rules**: Public courses are free; Private courses require purchase.
    - **Many-to-Many Video Assets**: Reuse the same video across multiple lessons/courses.
- **Invoicing & Payments**:
    - **Draft -> Sent -> Paid** workflow for invoices.
    - Mock payment flow for testing without external gateways.
    - Integration-ready structure for Payme/Click.
- **Student Enrollment**:
    - Request access to private courses.
    - Automatic enrollment (Entitlement) upon successful payment.

---

## 🛠️ Tech Stack

- **Framework**: [NestJS](https://nestjs.com/)
- **Database**: PostgreSQL
- **ORM**: [Prisma](https://www.prisma.io/)
- **Documentation**: Swagger UI
- **Validation**: class-validator, class-transformer

---

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd nest_back
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory (refer to `.env.example`):
   ```bash
   DATABASE_URL="postgresql://user:password@localhost:5432/db_name?schema=public"
   JWT_SECRET="your_secret_key"
   ```

4. **Database Migration & Seeding**
   ```bash
   # Push schema to database
   npx prisma db push

   # Seed default data (Admin, Creator, Student, Courses)
   npx prisma db seed
   ```

5. **Run the Application**
   ```bash
   # Development mode
   npm run start:dev
   ```

   The server will start at `http://localhost:5026` (or defined PORT).
   Swagger Documentation: `http://localhost:5026/docs`

---

## 💳 Payment & Access Flow (How it works)

### 1. Requesting Access
A student requests access to a **Private Course**.
- **POST** `/api/access-requests` -> Creates a `PENDING` request.

### 2. Accepting Request (Creator/Admin)
The creator accepts the request, which generates a **DRAFT** invoice.
- **PATCH** `/api/owner/access-requests/:id/accept`

### 3. Sending Invoice
The creator reviews the draft and sends it to the student.
- **PATCH** `/api/owner/invoices/:id/send` -> Status becomes `SENT`.

### 4. Payment (Student)
The student sees the invoice and initiates payment.
- **POST** `/api/payments/init`
  - Body: `{ "invoiceId": "...", "provider": "MOCK" }`

### 5. Confirmation (Student/System)
Confirm the payment (simulating a gateway callback).
- **POST** `/api/payments/:paymentId/confirm`
  - Result: Invoice `PAID`, Access Request `APPROVED`, Entitlement created.

### 6. Accessing Content
The student can now view the course content.
- **GET** `/api/courses/me/enrolled` -> Lists purchased courses.
- **GET** `/api/public/lessons/:id` -> Returns full lesson content (including videos).

---

## 📹 Video Management

- **Upload**: Videos are treated as assets (`VideoAsset`).
- **Attachment**: You can attach multiple video assets to a single lesson using `videoAssetIds`.
- **Reuse**: The same video UUID can be attached to different lessons.

---

## 🧪 Testing

```bash
# Unit tests
npm run test

# End-to-end tests
npm run test:e2e
```

## 📝 License

This project is [MIT licensed](LICENSE).
