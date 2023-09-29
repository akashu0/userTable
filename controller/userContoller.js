const mysql = require("mysql2");
const jwt = require("jsonwebtoken");

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: "myuser", // Set the default database here
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error getting MySQL connection:", err);
    return;
  }
  console.log("Connected to MySQL");
  createTable(connection);
});

function createTable(connection) {
  connection.query(
    `CREATE TABLE IF NOT EXISTS users (
      user_id CHAR(36) NOT NULL DEFAULT (UUID()),
      user_name VARCHAR(100) NOT NULL,
      user_email VARCHAR(255) NOT NULL,
      user_password VARCHAR(100) NOT NULL,
      user_image LONGBLOB,
      total_orders INT NOT NULL ,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_logged_in TIMESTAMP
    )`,
    (err) => {
      if (err) {
        console.error("Error creating table:", err);
        return;
      }
      console.log("Table created/exists");
    }
  );
}

const addNewUser = async (req, res) => {
  try {
    const { user_name, user_email, user_password, total_orders } = req.body;
    // Check if an image file was uploaded
    const user_image = req.file ? req.file.filename : null;
    console.log(user_email, total_orders);
    pool.query(
      "INSERT INTO users (user_name, user_email, user_password, user_image,total_orders ) VALUES (?, ?, ?, ?, ?)",
      [user_name, user_email, user_password, user_image, total_orders],
      (error, results) => {
        if (error) {
          console.error("Error inserting user:", error);
          res.status(500).json({ error: "Database error" });
        } else {
          console.log("User inserted successfully");
          // Generate a JWT token for the new user
          const payload = { id: results.insertId, role: "user" };
          const token = jwt.sign(payload, process.env.JWT_KEY, {
            expiresIn: "5d", // Set the token expiration as needed
          });
          res.status(200).json({
            status: "success",
            message: "User added successfully.",
            token: token, // Include the token in the response
          });
        }
      }
    );
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const update_user = async (req, res) => {
  try {
    // Extract updated user information from the request body
    const { user_id, user_name, user_email, user_password, total_orders } =
      req.body;

    // Check if an image file was uploaded
    const user_image = req.file ? req.file.filename : null;

    //  SQL UPDATE query
    const updateQuery = `
     UPDATE users
     SET user_name = ?, user_email = ?, user_password = ?, user_image = ?, total_orders = ?
     WHERE user_id = ?
   `;

    // Execute the UPDATE query
    pool.query(
      updateQuery,
      [user_name, user_email, user_password, user_image, total_orders, user_id],
      (error, results) => {
        if (error) {
          console.error("Error updating user:", error);
          res.status(500).json({ error: "Database error" });
        } else {
          if (results.affectedRows === 0) {
            // No user with the specified ID found
            res.status(404).json({ error: "User not found" });
          } else {
            // User updated successfully
            console.log("User updated successfully");
            res.status(200).json({
              status: "success",
              message: "User updated successfully.",
            });
          }
        }
      }
    );
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const user_details = async (req, res) => {
  try {
    // Extract the user_id parameter from the route URL
    const { user_id } = req.params;

    // SQL SELECT query to fetch user details by user_id
    const selectQuery = `
      SELECT user_id, user_name, user_email, user_image, total_orders, created_at, last_logged_in
      FROM users
      WHERE user_id = ?
    `;

    // Execute the SELECT query
    pool.query(selectQuery, [user_id], (error, results) => {
      if (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ error: "Database error" });
      } else {
        if (results.length === 0) {
          // No user with the specified ID found
          res.status(404).json({ error: "User not found" });
        } else {
          // User details fetched successfully
          const userDetails = results[0];
          res.status(200).json({
            status: "success",
            message: "userData fetch successfully",
            data: userDetails,
          });
        }
      }
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const get_userImage = async (req, res) => {
  try {
    // Extract the user_id parameter from the route URL
    const { user_id } = req.params;

    //  SQL SELECT query to fetch the user's image by user_id
    const selectQuery = `
      SELECT user_image
      FROM users
      WHERE user_id = ?
    `;

    // Execute the SELECT query
    pool.query(selectQuery, [user_id], (error, results) => {
      if (error) {
        console.error("Error fetching user image:", error);
        res.status(500).json({ error: "Database error" });
      } else {
        if (results.length === 0) {
          // No user with the specified ID found
          res.status(404).json({ error: "User not found" });
        } else {
          // User image fetched successfully
          const userImage = results[0].user_image;
          console.log(userImage);

          // Set the appropriate content type for the response
          res.setHeader("Content-Type", "image/jpeg"); // Adjust content type as needed

          // Send the user's image as a response
          res.status(200).send(userImage);
        }
      }
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const delete_userbyid = async (req, res) => {
  try {
    // Extract the user_id parameter from the route URL
    const { user_id } = req.params;
    console.log(user_id);
    // SQL DELETE query to remove the user by user_id
    const deleteQuery = `
      DELETE FROM users
      WHERE user_id = ?
    `;

    // Execute the DELETE query
    pool.query(deleteQuery, [user_id], (error, results) => {
      if (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Database error" });
      } else {
        if (results.affectedRows === 0) {
          // No user with the specified ID found
          res.status(404).json({ error: "User not found" });
        } else {
          // User deleted successfully
          res.status(200).json({ message: "User deleted successfully" });
        }
      }
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = {
  addNewUser,
  update_user,
  user_details,
  get_userImage,
  delete_userbyid,
};
