/NODE-API
│
├───
│ │
│ ├── /controllers
│ │ └── customerController.js # Controller to manage customer business logic.
│ │ └── itemsController.js
└── salesOrdersController.js
│ ├── /routes
│ │ └── customerRoutes.js # API route definitions for customers.
│ │ └── itemsRoutes.js
│ │ └── salesOrderRoutes.js
│ │
│ │
│ │
│ └── app.js # Main file to start the application.
│ └── db.js # Main file to start the application.
│
│
├── Dockerfile # File to create the Docker image of the application.
├── docker-compose.yml # File to define and run application containers.
├── package.json # NPM configuration file with project dependencies.
└── README.md # Project documentation.

1. Set Up the Environment
   Install Dependencies: Make sure you have Node.js and Docker installed on your machine.
   Create the .env File: Create a .env file in the root directory and define the necessary environment variables, for example:
   makefile
   MYSQL_HOST=db
   MYSQL_USER=root
   MYSQL_PASSWORD=root
   MYSQL_DATABASE=mydatabase
2. Build and Run the Containers
   Build the Docker Image:

docker-compose build
Start the Containers:

docker-compose up
This will start the application server and the MySQL database.

3. Initialize the Database
   Run the Default Data Script:

Once the database is running, execute the seed script to insert default data:

docker exec -it <root> node src/seeds/seed.js

4. Test the Endpoints
   You can use Postman or any similar tool to test your API endpoints:

Get All Customers:

Method: GET
URL: http://localhost:3000/api/customers
Add a New Customer:

Method: POST
URL: http://localhost:3000/api/customers
Body (JSON):

{
"name": "Juan Pérez",
"phone": "123456789",
"streetAddress1": "Calle Falsa 123",
"city": "Ciudad",
"state": "Estado",
"zip": "12345"
}
Test with CURL (if you prefer command line):

Get all customers:

curl http://localhost:3000/api/customers
Add a new customer:

curl -X POST http://localhost:3000/api/customers -H "Content-Type: application/json" -d '{"name": "Juan Pérez", "phone": "123456789", "streetAddress1": "Calle Falsa 123", "city": "Ciudad", "state": "Estado", "zip": "12345"}'
