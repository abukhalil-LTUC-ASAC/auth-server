# LAB 11 - Auth Server
Express server that implements Basic Authentication, with signup and signin capabilities, using a Mongo database for storage.

## Project Details
Author: Yahya Abu Khalil
Links and Resources
[submission PR](https://github.com/abukhalil-LTUC-ASAC/auth-server)
[Github actions](#)

### Modules and Middlewares
- [`server.js`](lib/server.js) server module as a centralized base of operations.
- [`404.js`](lib//middleware/404.js) error page not found middleware.
- [`500.js`](lib//middleware/500.js) error input/logic middleware.

-[./auth/middleware/basic] verifies login information with username and password.
-[./auth/middleware/oauth] verifies login information through username and github OAuth.
-[./auth/middleware/bearer] verifies user session information for each required route.
-[./auth/middleware/basic] verifies user action permission for each required route.

### Database and Routes
- [`./auth/models/users-model`](lib/models/mongo.js) is the primary model/collection that is extended into each of product and category.

### Setup
Clone the repo, and run the following commands to install the required dependencies and dev dependencies. 
- `npm install` to download all that exists in `package.json`.
- `npm install mongoose` to run the database properly, and start it beforehand.

### Running the app
- `npm start` to test the server yourself using postman.
- `npm test` to run the thorough testing functions.
  
Unit testing with: npm test using supertest to test each route. 

### Unified Modeling Language (UML)
![UML image](resources/.PNG)
