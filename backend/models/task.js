const { sql } = require("../database/db");

const taskModel = {
  async createTask(userId, title, description, dueDate = null, status = "pending") {
    try {
      const result = await sql`
        INSERT INTO tasks (user_id, title, description, due_date, status)
        VALUES (${userId}, ${title}, ${description}, ${dueDate}, ${status})
        RETURNING id, user_id, title, description, status, due_date, created_at, updated_at
      `;
      return result[0];
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  },

  async getAllTasksByUser(userId, filters = {}) {
    try {
      const { status, searchTerm, sortBy = "created_at", sortOrder = "DESC", limit = 50, offset = 0 } = filters;

      let conditions = [];
      let queryParams = [];

      conditions.push(`user_id = $${queryParams.length + 1}`);
      queryParams.push(userId);

      if (status) {
        conditions.push(`status = $${queryParams.length + 1}`);
        queryParams.push(status);
      }

      if (searchTerm) {
        conditions.push(`(title ILIKE $${queryParams.length + 1} OR description ILIKE $${queryParams.length + 1})`);
        queryParams.push(`%${searchTerm}%`);
      }

      const validSortColumns = ["created_at", "updated_at", "due_date", "title", "status"];
      const validatedSortBy = validSortColumns.includes(sortBy) ? sortBy : "created_at";

      const validatedSortOrder = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";

      const queryString = `
        SELECT * FROM tasks 
        WHERE ${conditions.join(" AND ")}
        ORDER BY ${validatedSortBy} ${validatedSortOrder}
        LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
      `;

      queryParams.push(limit, offset);

      const result = await sql.unsafe(queryString, queryParams);
      return result;
    } catch (error) {
      console.error("Error getting tasks:", error);
      throw error;
    }
  },

  async getTaskById(taskId, userId) {
    try {
      const result = await sql`
        SELECT * FROM tasks 
        WHERE id = ${taskId} AND user_id = ${userId}
      `;
      return result[0] || null;
    } catch (error) {
      console.error("Error getting task:", error);
      throw error;
    }
  },

  async updateTask(taskId, userId, updates) {
    try {
      const { title, description, status, dueDate } = updates;

      const result = await sql`
        UPDATE tasks 
        SET 
          title = COALESCE(${title}, title),
          description = COALESCE(${description}, description),
          status = COALESCE(${status}, status),
          due_date = COALESCE(${dueDate}, due_date),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${taskId} AND user_id = ${userId}
        RETURNING id, user_id, title, description, status, due_date, created_at, updated_at
      `;

      return result[0] || null;
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  },

  async deleteTask(taskId, userId) {
    try {
      const result = await sql`
        DELETE FROM tasks 
        WHERE id = ${taskId} AND user_id = ${userId}
        RETURNING id
      `;

      return result.length > 0;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  },

  async getTaskStats(userId) {
    try {
      const result = await sql`
        SELECT 
          COUNT(*) AS total,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending,
          SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) AS in_progress,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed
        FROM tasks
        WHERE user_id = ${userId}
      `;

      return result[0];
    } catch (error) {
      console.error("Error getting task stats:", error);
      throw error;
    }
  },
};

module.exports = taskModel;
