# Lab 3: REST API, Query Parameters, Validation & Debugging

## Student Details

| Field | Details |
|---|---|
| Name | V. Pranav |
| Registration Number | 252U1R9164 |
| Section | CSE(GEN-AI)-2C-112 |
| Course | Backend Development Fundamentals |
| Lab Number | 03 |
| Module | RESTful API Development and Validation |
| Faculty | Mr . Joel Prashanth D |

---

## 1. Introduction

This lab focuses on developing a RESTful API using Node.js, Express.js and SQLite database. The project manages book records through different API operations such as creating, retrieving, updating and deleting books.

The application also provides search functionality, sorting, pagination, price-range filtering and input validation. Appropriate HTTP status codes are returned for successful requests and error conditions.

API requests are tested using the REST Client extension in Visual Studio Code through the `app.http` file.

## 2. Objectives

- Develop RESTful API endpoints using Express.js.
- Implement GET, POST, PUT and DELETE operations.
- Implement search functionality using query parameters.
- Add sorting functionality using ASC and DESC.
- Implement pagination using limit and offset.
- Filter books based on minimum and maximum prices.
- Validate incoming POST and PUT request data.
- Return appropriate HTTP status codes.
- Handle invalid requests and missing records.
- Practise debugging common backend development errors.

## 3. Technologies Used

| Technology | Purpose |
|---|---|
| HTML | Not required for this backend API |
| JavaScript | Application programming |
| Node.js | JavaScript runtime environment |
| Express.js | Backend framework |
| SQLite3 | Database management |
| Nodemon | Automatic server restarting |
| REST Client | API testing |
| Visual Studio Code | Code editor |

## 4. Project Structure

```text
lab-3/
│
├── node_modules/
│
├── app.js
├── app.http
├── books.db
├── package.json
├── package-lock.json
├── README.md
├── .gitignore
│
└── screeshots/
    ├── Screenshot 2026-11-05 at 3.18.52 PM.png
    ├── Screenshot 2026-11-05 at 3.20.02 PM.png
    ├── Screenshot 2026-11-05 at 3.20.12 PM.png
    ├── Screenshot 2026-11-05 at 3.20.21 PM.png
    ├── Screenshot 2026-11-05 at 3.20.28 PM.png
    ├── Screenshot 2026-11-05 at 3.20.33 PM.png
    ├── Screenshot 2026-11-05 at 3.20.39 PM.png
    ├── Screenshot 2026-11-05 at 3.20.47 PM.png
    ├── Screenshot 2026-11-05 at 3.20.57 PM.png
    ├── Screenshot 2026-11-05 at 3.21.04 PM.png
    ├── Screenshot 2026-11-05 at 3.21.11 PM.png
    ├── Screenshot 2026-11-05 at 3.21.17 PM.png
    ├── Screenshot 2026-11-05 at 3.21.24 PM.png
    ├── Screenshot 2026-11-05 at 3.21.31 PM.png
    ├── Screenshot 2026-11-05 at 3.21.46 PM.png
    ├── Screenshot 2026-11-05 at 3.21.54 PM.png
    ├── Screenshot 2026-11-05 at 3.22.01 PM.png
    ├── Screenshot 2026-11-05 at 3.22.07 PM.png
    ├── Screenshot 2026-11-05 at 3.22.16 PM.png
    ├── Screenshot 2026-11-05 at 3.22.26 PM.png
    ├── Screenshot 2026-11-05 at 3.22.33 PM.png
    ├── Screenshot 2026-11-05 at 3.22.39 PM.png
    └── Screenshot 2026-11-05 at 3.22.46 PM.png
```

## 5. Installation and Setup

### Prerequisites

- Node.js
- npm
- Visual Studio Code
- REST Client extension

### Step 1: Initialize the project

```bash
npm init -y
```

### Step 2: Install required packages

```bash
npm install express sqlite3
```

### Step 3: Install Nodemon

```bash
npm install --save-dev nodemon
```

### Step 4: Configure package.json

```bash
npm pkg set scripts.start="node app.js"
npm pkg set scripts.dev="nodemon app.js"
```

### Step 5: Start the application

```bash
npm run dev
```

Expected terminal output:

```text
Connected to SQLite database
Books table is ready
Server running at http://localhost:3000
```

The application runs locally at:

`http://localhost:3000`

### Environment Variables

No environment variables are required for this local development version.

The application uses port 3000 and automatically creates the SQLite database file named `books.db`.

## 6. API Endpoints

The application provides the following REST API endpoints.

| HTTP Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Displays the welcome message |
| GET | `/books` | Retrieves all books |
| GET | `/books/:id` | Retrieves a specific book by ID |
| POST | `/books` | Adds a new book |
| PUT | `/books/:id` | Updates an existing book |
| DELETE | `/books/:id` | Deletes a book |

## 7. Query Parameters

The GET `/books` endpoint supports different query parameters for searching, sorting, pagination and price filtering.

| Parameter | Description | Default Value |
|---|---|---|
| `search_q` | Searches books by partial title | Empty |
| `order_by` | Sorts by id, title, author or price | id |
| `order` | Sorting direction ASC or DESC | ASC |
| `limit` | Maximum number of records | 10 |
| `offset` | Number of records to skip | 0 |
| `min_price` | Minimum book price | Optional |
| `max_price` | Maximum book price | Optional |

### Search Books

Search books using a partial title match.

```http
GET http://localhost:3000/books?search_q=Fire
```

### Sorting in Ascending Order

```http
GET http://localhost:3000/books?order_by=price&order=ASC
```

### Sorting in Descending Order

```http
GET http://localhost:3000/books?order_by=price&order=DESC
```

### Pagination

Retrieve the first two books:

```http
GET http://localhost:3000/books?limit=2&offset=0
```

Retrieve the next two books:

```http
GET http://localhost:3000/books?limit=2&offset=2
```

### Price Range Filtering

Retrieve books priced between 200 and 300.

```http
GET http://localhost:3000/books?min_price=200&max_price=300
```

### Combined Search and Sorting

```http
GET http://localhost:3000/books?search_q=Rich&order_by=price&order=DESC
```

## 8. Request Body Examples

### POST - Add a New Book

Request:

```http
POST http://localhost:3000/books
Content-Type: application/json
```

JSON body:

```json
{
    "title": "The Power of Habit",
    "author": "Charles Duhigg",
    "price": 400
}
```

Expected status code: `201 Created`

### PUT - Update an Existing Book

Request:

```http
PUT http://localhost:3000/books/1
Content-Type: application/json
```

JSON body:

```json
{
    "title": "The Power of Habit Updated",
    "author": "Charles Duhigg",
    "price": 450
}
```

Expected status code: `200 OK`

## 9. Input Validation

The application validates incoming POST and PUT requests.

The following validations are implemented:

1. Book title must be provided.
2. Author name must be provided.
3. Price must be a valid numeric value.
4. Price must not be negative.
5. Invalid input returns HTTP 400.
6. A book that does not exist returns HTTP 404.

### Example: Missing Title

```json
{
    "author": "Test Author",
    "price": 250
}
```

Expected response:

```json
{
    "message": "Title, author and a valid non-negative numeric price are required"
}
```

Status code: `400 Bad Request`

### Example: Invalid Price

```json
{
    "title": "Test Book",
    "author": "Test Author",
    "price": "invalid"
}
```

Expected status code: `400 Bad Request`

## 10. HTTP Status Codes

The application uses appropriate HTTP status codes for different operations.

| Status Code | Description | Usage |
|---|---|---|
| 200 | OK | Successful GET, PUT and DELETE |
| 201 | Created | Successfully created a new book |
| 400 | Bad Request | Invalid or missing input |
| 404 | Not Found | Requested book or route does not exist |
| 500 | Internal Server Error | Unexpected server-side error |

## 11. Database Details

The application uses SQLite3 as its database.

Database filename: `books.db`

Table name: `books`

### Books Table Structure

| Column Name | Data Type | Description |
|---|---|---|
| id | INTEGER | Primary key with auto increment |
| title | TEXT | Name of the book |
| author | TEXT | Name of the author |
| price | REAL | Price of the book |

### Sample Records

The application automatically inserts five sample records when the books table is empty.

| ID | Book Title | Author | Price |
|---|---|---|---|
| 1 | Wings of Fire | A.P.J. Abdul Kalam | 250 |
| 2 | Atomic Habits | James Clear | 350 |
| 3 | The Alchemist | Paulo Coelho | 200 |
| 4 | Rich Dad Poor Dad | Robert Kiyosaki | 300 |
| 5 | Think and Grow Rich | Napoleon Hill | 280 |

Parameterized SQL queries are used to prevent user input from being directly inserted into SQL statements.

## 12. API Testing Using REST Client

The application is tested using the REST Client extension in Visual Studio Code.

The `app.http` file contains requests for testing the different API functionalities.

The following test cases are included:

| Test No. | Test Case | Expected Result |
|---|---|---|
| 1 | Home API | 200 OK |
| 2 | Get all books | 200 OK |
| 3 | Search books | 200 OK |
| 4 | Sort books ASC | 200 OK |
| 5 | Sort books DESC | 200 OK |
| 6 | Pagination | 200 OK |
| 7 | Price range filter | 200 OK |
| 8 | Get book by ID | 200 OK |
| 9 | Get invalid book ID | 404 Not Found |
| 10 | Add new book | 201 Created |
| 11 | Missing title validation | 400 Bad Request |
| 12 | Invalid price validation | 400 Bad Request |
| 13 | Update book | 200 OK |
| 14 | Update missing book | 404 Not Found |
| 15 | Delete book | 200 OK |
| 16 | Delete missing book | 404 Not Found |
| 17 | Invalid sorting order | 400 Bad Request |
| 18 | Invalid pagination | 400 Bad Request |
| 19 | Invalid price range | 400 Bad Request |
| 20 | Invalid route | 404 Not Found |

## 13. Screenshots of Working Output

The following screenshots demonstrate the implementation and testing of the REST API. The project contains 23 captured screenshots covering all test cases from the API checklist.

### 1. Home API Response

![Home API Response](./screeshots/Screenshot%202026-11-05%20at%203.18.52%E2%80%AFPM.png)

### 2. Retrieve All Books

![Get All Books](./screeshots/Screenshot%202026-11-05%20at%203.20.12%E2%80%AFPM.png)

### 3. Search Books

![Search Books](./screeshots/Screenshot%202026-11-05%20at%203.20.12%E2%80%AFPM.png)

### 4. Sorting Functionality

![Sorting Books](./screeshots/Screenshot%202026-11-05%20at%203.20.21%E2%80%AFPM.png)

### 5. Pagination Functionality

![Pagination](./screeshots/Screenshot%202026-11-05%20at%203.20.28%E2%80%AFPM.png)

### 6. Price Range Filtering

![Price Filter](./screeshots/Screenshot%202026-11-05%20at%203.20.33%E2%80%AFPM.png)

### 7. Add New Book - POST

![POST Book](./screeshots/Screenshot%202026-11-05%20at%203.20.39%E2%80%AFPM.png)

### 8. Input Validation Error

![Validation Error](./screeshots/Screenshot%202026-11-05%20at%203.20.47%E2%80%AFPM.png)

### 9. Update Book - PUT

![Update Book](./screeshots/Screenshot%202026-11-05%20at%203.20.57%E2%80%AFPM.png)

### 10. Delete Book - DELETE

![Delete Book](./screeshots/Screenshot%202026-11-05%20at%203.21.04%E2%80%AFPM.png)

### 11. Error Handling

![Error Handling](./screeshots/Screenshot%202026-11-05%20at%203.21.11%E2%80%AFPM.png)

### 12. Get Non-Existing Book

![Get Non-Existing Book](./screeshots/Screenshot%202026-11-05%20at%203.21.17%E2%80%AFPM.png)

### 13. POST Request Validation Response

![POST Validation Response](./screeshots/Screenshot%202026-11-05%20at%203.21.24%E2%80%AFPM.png)

### 14. Update Existing Book Response

![Update Existing Book Response](./screeshots/Screenshot%202026-11-05%20at%203.21.31%E2%80%AFPM.png)

### 15. Delete Response for Existing Book

![Delete Existing Book Response](./screeshots/Screenshot%202026-11-05%20at%203.21.46%E2%80%AFPM.png)

### 16. Delete Response for Missing Book

![Delete Missing Book Response](./screeshots/Screenshot%202026-11-05%20at%203.21.54%E2%80%AFPM.png)

### 17. Invalid Sorting Order Response

![Invalid Sorting Order](./screeshots/Screenshot%202026-11-05%20at%203.22.01%E2%80%AFPM.png)

### 18. Invalid Limit Response

![Invalid Limit](./screeshots/Screenshot%202026-11-05%20at%203.22.07%E2%80%AFPM.png)

### 19. Invalid Price Range Response

![Invalid Price Range](./screeshots/Screenshot%202026-11-05%20at%203.22.16%E2%80%AFPM.png)

### 20. Health Check Endpoint

![Health Check Endpoint](./screeshots/Screenshot%202026-11-05%20at%203.22.26%E2%80%AFPM.png)

### 21. Search and Filter Result

![Search and Filter Result](./screeshots/Screenshot%202026-11-05%20at%203.22.33%E2%80%AFPM.png)

### 22. Combined Search and Sorting Response

![Combined Search and Sorting](./screeshots/Screenshot%202026-11-05%20at%203.22.39%E2%80%AFPM.png)

### 23. Final API Validation Output

![Final API Validation Output](./screeshots/Screenshot%202026-11-05%20at%203.22.46%E2%80%AFPM.png)

## 14. Debugging Exercises

The lab includes practice with the following common backend development errors.

### 1. Port Conflict (EADDRINUSE)

This error occurs when another process is already using the server port.

Solution: Stop the process using the occupied port or configure another available port.

### 2. Wrong Import Path

This error occurs when a module or file is imported using an incorrect path.

Solution: Check the file location and correct the import statement.

### 3. Table Name Typo

This error occurs when an incorrect database table name is used in an SQL query.

Solution: Verify the table name in the SQLite database and correct the SQL statement.

### 4. Missing Await

This error occurs when an asynchronous database operation is not properly awaited.

Solution: Use async and await correctly to ensure database operations finish before their results are used.

### 5. Connection Refused

This error occurs when the API client attempts to connect while the local server is stopped.

Solution: Start the application again using:

```bash
npm run dev
```

Keep the server running while testing API requests.

## 15. Problems Faced and Solutions

| Problem | Solution |
|---|---|
| Node.js was not installed | Installed Node.js on macOS |
| SQLite installation scripts required approval | Approved and rebuilt SQLite |
| Server stopped during API testing | Restarted the server using Nodemon |
| Connection refused in REST Client | Kept the local server running |
| API input validation errors | Added validation checks |
| Database query errors | Used parameterized SQL queries |

## 16. Security and Best Practices

- Used parameterized SQL queries.
- Validated incoming request data.
- Used appropriate HTTP status codes.
- Implemented error-handling middleware.
- Avoided exposing detailed internal errors in API responses.
- Used asynchronous database operations.
- Kept dependencies managed through npm.
- Avoided committing the `node_modules` directory.
- Avoided sharing sensitive environment files.

## 17. Conclusion

Through this lab, I learned how to develop a RESTful API using Node.js, Express.js and SQLite database. I implemented CRUD operations and learned how to retrieve, add, update and delete book records.

I also implemented search functionality, sorting, pagination, price-range filtering and input validation using query parameters. Testing the API using the REST Client extension helped me understand how HTTP requests and responses work.

This lab improved my practical knowledge of backend development, database connectivity, error handling, debugging and REST API design.

## 18. GitHub Repository and Submission

**GitHub Repository:** [Add your public GitHub repository URL here]

**Lab Folder:** `lab-03/`

The repository contains the application source code, API testing file, database, README documentation and screenshots.

### Git Commands

Initialize the Git repository:

```bash
git init
```

Add project files:

```bash
git add .
```

Commit the project:

```bash
git commit -m "Complete Lab 3 REST API implementation"
```

Connect your GitHub repository:

```bash
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
```

Push the project:

```bash
git push -u origin main
```

**Submission:** GitHub repository link.

---

**End of Lab 3 Report**
