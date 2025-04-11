const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sql } = require("../database/db");

const userModel = {
  async createUser(name, email, password) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const result = await sql`
        INSERT INTO users (name, email, password)
        VALUES (${name}, ${email}, ${hashedPassword})
        RETURNING id, name, email, created_at
      `;

      return result[0];
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  async findByEmail(email) {
    try {
      const result = await sql`
        SELECT * FROM users WHERE email = ${email}
      `;
      return result[0] || null;
    } catch (error) {
      console.error("Error finding user:", error);
      throw error;
    }
  },

  async findById(id) {
    try {
      const result = await sql`
        SELECT id, name, email, created_at FROM users WHERE id = ${id}
      `;
      return result[0] || null;
    } catch (error) {
      console.error("Error finding user:", error);
      throw error;
    }
  },

  async validatePassword(user, password) {
    return await bcrypt.compare(password, user.password);
  },

  generateToken(user) {
    return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
  },

  async updateProfile(userId, updates) {
    try {
      const { name, email } = updates;

      const result = await sql`
        UPDATE users
        SET 
          name = COALESCE(${name}, name),
          email = COALESCE(${email}, email)
        WHERE id = ${userId}
        RETURNING id, name, email, created_at
      `;

      return result[0] || null;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  async updatePassword(userId, currentPassword, newPassword) {
    try {
      const user = await sql`
        SELECT * FROM users WHERE id = ${userId}
      `;

      if (!user[0]) {
        throw new Error("User not found");
      }

      const isValid = await bcrypt.compare(currentPassword, user[0].password);
      if (!isValid) {
        throw new Error("Current password is incorrect");
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await sql`
        UPDATE users
        SET password = ${hashedPassword}
        WHERE id = ${userId}
      `;

      return true;
    } catch (error) {
      console.error("Error updating password:", error);
      throw error;
    }
  },
};

module.exports = userModel;
