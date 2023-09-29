User Management API

This project provides a simple RESTful API for managing user data, including user registration, user details retrieval, and user deletion. It also includes authentication middleware to secure the API using JSON Web Tokens (JWT).

Table of Contents
Requirements
Installation
Usage
API Endpoints
Authentication
Contributing
License
Requirements
To run this project, you need the following software installed on your system:

Node.js
MySQL Database
npm (Node Package Manager)
Installation
Clone the repository:

git clone https://github.com/your-username/user-management-api.git

Install project dependencies:

npm install
Set up the MySQL database. Create a .env file in the project root directory and provide the necessary database configuration, like this:

env example:
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASS=your_database_password
DB_NAME=your_database_name
JWT_KEY=your_secret_key_for_jwt
Start the server:

To start project
npm start
The server should now be running at http://localhost:5000.

Usage
API Endpoints
Register a New User

POST /insert

Register a new user with the following request body:

json
Copy code
{
"user_name": "JohnDoe",
"user_email": "john.doe@example.com",
"user_password": "secretpassword",
"total_orders": 0
}
Get User Details

GET /details/:user_id

Retrieve user details by providing the user_id as a parameter.

Update User Information

PUT /update/:user_id

Update user information for a specific user by providing the user_id as a parameter and the updated details in the request body.

Delete User

DELETE /delete/:user_id

Delete a user by providing the user_id as a parameter.

Authentication
To access protected routes (e.g., update or delete user), you need to include a JWT token in the Authorization header of your HTTP request. The token should be obtained by authenticating with the API.

User Authentication

POST /api/user/authenticate

Contributing
Contributions are welcome! If you'd like to contribute to this project, please follow these guidelines:

Fork the repository.
Create a new branch for your feature or bug fix.
Make your changes and commit them.
Push your branch to your fork.
Create a pull request to the main branch of the original repository.
License
This project is licensed under the MIT License. See the LICENSE file for details.
