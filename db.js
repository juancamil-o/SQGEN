import mysql from "mysql2";

const db = mysql.createPool({
  host: "db",
  user: "root",
  password: "secret",
  database: "mydatabase",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const createTables = () => {
  const createCustomersTable = `
    CREATE TABLE IF NOT EXISTS customers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(15) NOT NULL,
        streetAddress1 VARCHAR(255),
        streetAddress2 VARCHAR(255),
        city VARCHAR(100),
        state VARCHAR(100),
        zip VARCHAR(10)
    );
  `;

  const createItemsTable = `
    CREATE TABLE IF NOT EXISTS items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        qty INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL
    );
  `;

  const createSalesOrdersTable = `
    CREATE TABLE IF NOT EXISTS sales_orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer_id INT,
        order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        total DECIMAL(10, 2),
        status ENUM('Open', 'Closed') DEFAULT 'Open',
        FOREIGN KEY (customer_id) REFERENCES customers(id)
    );
  `;

  db.query(createCustomersTable, (err) => {
    if (err) throw err;
    console.log("Table customers created or already exists.");
  });

  db.query(createItemsTable, (err) => {
    if (err) throw err;
    console.log("Table customers items or already exists.");
  });

  db.query(createSalesOrdersTable, (err) => {
    if (err) throw err;
    console.log("Table sales_orders created or already exists.");
  });
};

createTables();

export default db;
