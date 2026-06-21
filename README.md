# JobTracker

JobTracker is a full-stack web application designed to help users organize, monitor, and manage their job applications in one centralized dashboard. Users can register, log in, create job applications, track their status (e.g., Pending, Interviewing, Offered, Rejected), filter/search their applications, and add personalized notes.

---

## Tech Stack

### Frontend
- **Framework:** React 19 (TypeScript, Vite)
- **Styling:** Tailwind CSS v4
- **Routing & State:** Component-based state management, custom API integration
- **Deployment:** Vercel configured (`vercel.json`)

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose ODM)
- **Authentication:** JSON Web Tokens (JWT) & bcrypt password hashing
- **Input Validation:** Joi

---

## Prerequisites

Before running the application, make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB](https://www.mongodb.com/) (local community server running or a MongoDB Atlas cloud URI)

---

## Installation & Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/subod4/JobTracker.git
   cd JobTracker
   ```

2. **Backend Setup:**
   Navigate to the `Backend` directory, install dependencies, and configure environment variables:
   ```bash
   cd Backend
   npm install
   cp .env.example .env
   ```

3. **Frontend Setup:**
   Navigate to the `JobTracker` directory, install dependencies, and configure environment variables:
   ```bash
   cd ../JobTracker
   npm install
   cp .env.example .env
   ```

---

## Environment Variables

Both the frontend and backend require configuration via `.env` files.

### Backend (`Backend/.env`)
Create a `.env` file in the `Backend` folder with the following variables:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/jobtracker
JWT_SECRET=your_jwt_secret_key_here
```
- `PORT`: The port on which the backend Express server will run.
- `MONGODB_URI`: The connection string for your MongoDB database.
- `JWT_SECRET`: A secret key used to sign and verify JSON Web Tokens for authentication.

### Frontend (`JobTracker/.env`)
Create a `.env` file in the `JobTracker` folder with the following variables:
```env
VITE_API_URL=http://localhost:5000
```
- `VITE_API_URL`: The URL pointing to the running backend service.

---

## Running in Development Mode

You need to run both the backend server and frontend development server simultaneously.

### 1. Start the Backend Server
From the root of the project:
```bash
cd Backend
npm start
```
This launches the backend using `nodemon`, which will automatically reload on any file changes. It runs at `http://localhost:5000` by default.

### 2. Start the Frontend Server
From the root of the project (in a new terminal):
```bash
cd JobTracker
npm run dev
```
This starts the Vite dev server at `http://localhost:3000` (as configured in `package.json` with `--port=3000`).

---

## Running Tests

- **Backend:** Currently, a placeholder test script is provided in `Backend/package.json` (`npm test`). `mongodb-memory-server` is installed in `devDependencies` to facilitate testing with an in-memory database instance once test suites are configured.
- **Frontend:** Testing utilities are not configured by default. You can run type checking and linting using:
  ```bash
  cd JobTracker
  npm run lint
  ```

---

## API Documentation

The backend exposes a REST API with the following endpoints:

### Authentication (`/api/auth` or `/auth`)
All authentication endpoints handle JSON payloads.

* **POST** `/api/auth/signup` - Register a new user
  * **Payload:**
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "securepassword123"
    }
    ```
  * **Response (201 Created):** Returns user details and the JWT token.
* **POST** `/api/auth/login` - Authenticate an existing user
  * **Payload:**
    ```json
    {
      "email": "john@example.com",
      "password": "securepassword123"
    }
    ```
  * **Response (200 OK):** Returns user details and the JWT token.

### Job Applications (`/api/applications` or `/applications`)
*All application endpoints require the `Authorization` header with a valid JWT token: `Bearer <token>`.*

* **GET** `/api/applications` - Retrieve all applications for the logged-in user
  * **Query Parameters (Optional):**
    * `status`: Filter by status (e.g., `Pending`, `Interviewing`, `Offered`, `Rejected`)
    * `search`: Case-insensitive search on company name or job title
  * **Response (200 OK):** Array of job application objects.
* **POST** `/api/applications` - Add a new job application
  * **Payload:**
    ```json
    {
      "company_name": "Google",
      "job_title": "Software Engineer",
      "job_type": "Full-time",
      "status": "Pending",
      "applied_date": "2026-06-21T00:00:00.000Z",
      "notes": "Referral from teammate."
    }
    ```
  * **Response (201 Created):** The created application object.
* **GET** `/api/applications/:id` - Get details of a specific job application (ownership checked)
  * **Response (200 OK):** The requested application object.
* **PATCH** `/api/applications/:id` - Update details of an existing job application
  * **Payload:** Any subset of fields: `company_name`, `job_title`, `job_type`, `status`, `applied_date`, `notes`.
  * **Response (200 OK):** The updated application object.
* **DELETE** `/api/applications/:id` - Delete a job application
  * **Response (200 OK):** Confirmation message.
