# Project Rules and API Usage

##  Code & Project Structure

- Use MVC: separate folders for controllers, models, routes, utils, and config under `src/`.
- All environment variables go in `.env` (never commit this file).
- Use `.gitignore` to exclude `node_modules`, `.env`, and other sensitive/unnecessary files.
- Use only required npm packages; remove unused dependencies regularly.
- For URL shortening, use `nanoid` v3.x if using CommonJS.

## 🛠️ API Development & Testing

- All endpoints must be tested with both Postman and curl[1].
- Use RESTful conventions: `/api/items` for CRUD, `/shorten` for URL shortening.
- Validate all POST/PUT data in controllers.
- Log errors and important events for debugging.
- Use MongoDB Compass to visually verify database changes.

## 🗃 Database

- Use MongoDB (local for dev, remote for prod if needed).
- Keep database names consistent in case (e.g., `healthCheck` vs `healthcheck`).
- Use Mongoose schemas for all collections.

##  Security

- Never commit secrets, passwords, or sensitive data.
- Sanitize and validate all user inputs.
- Use security middleware (like `helmet`) for Express apps.

##  Collaboration & Version Control

- Use clear, descriptive commit messages.
- All changes via pull requests; require review before merging.
- Communicate blockers/issues early via chat or GitHub Issues.
- Document all endpoints and major changes in `README.md` or `/docs`.

---

##  Example: Football Clubs CRUD (Top 4 Premier League by European Titles)

http://localhost:3000/shorten --> url to post

http://localhost:3000/api/health --> url for healthcheck

http://localhost:3000/api/items --> url for item list

### **Create Clubs**

curl -X POST http://localhost:3000/api/items -H "Content-Type: application/json" -d "{\"name\":\"Liverpool\",\"description\":\"14\"}"

curl -X POST http://localhost:3000/api/items -H "Content-Type: application/json" -d "{\"name\":\"Manchester United\",\"description\":\"6\"}"

curl -X POST http://localhost:3000/api/items -H "Content-Type: application/json" -d "{\"name\":\"Chelsea\",\"description\":\"6\"}"

curl -X POST http://localhost:3000/api/items -H "Content-Type: application/json" -d "{\"name\":\"Manchester City\",\"description\":\"2\"}"



### **Get All Clubs**

curl http://localhost:3000/api/items


### **Get One Club by ID**

curl http://localhost:3000/api/items/<item_id>


### **Update a Club**

curl -X PUT http://localhost:3000/api/items/<item_id> -H "Content-Type: application/json" -d "{\"name\":\"Updated Club\",\"description\":\"New Value\"}"


### **Delete a Club**

curl -X DELETE http://localhost:3000/api/items/<item_id>


---

##  General Usage

- Replace `<item_id>` with the actual `_id` from your database.
- Always use the full single-line curl command in Windows terminals.
- Check results in MongoDB Compass or via GET endpoints.

---
