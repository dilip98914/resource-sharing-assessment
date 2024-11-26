Expiring Temporary Resource Sharing Module
A backend module for managing temporary resource sharing, built using Node.js, TypeScript, Express, and PostgreSQL.

Features
-Users can share resources (e.g., file links) for a limited time.
-Resources become inaccessible after their expiration time.
-Supports querying active and expired resources.
-Access is secured with unique tokens.
-Automatic expiry of resources using a cron job.
-RESTful API with proper access control and error handling.

Setup Instructions

1. git clone https://github.com/your-username/temp-resource-sharing.git
   cd temp-resource-sharing

2. npm install

3. create .env file
   DB_CONNECTION_STRING=postgres://username:password@localhost:5432/temp_resource_db
   PORT=3000

4. Initialize the database:
   npx sequelize-cli db:create
   npx sequelize-cli db:migrate

5. start the development server
   npm run dev

6. Production build and start:
   npm run build
   npm start
