# ⚙️ Backend API

Asynchronous, non-blocking backend API built with **Node.js**, **Express.js**, **SQLite**, and **bcrypt** for managing data and securing passwords.

---

## Features

- **Node.js**: Server runtime environment.
- **Express.js**: Web application framework for building APIs.
- **SQLite**: Lightweight database for data storage.
- **bcrypt**: Password hashing and security.
- **Port**: The server runs on port `5000`.

---

## Installing

You can use `npm` to install the dependencies:

```bash
npm install
```

---

## Available Scripts

In the project directory, you can run:

### `npm start`
Runs the server in development mode.  
The server will start on [http://localhost:5000](http://localhost:5000).  
The application will reload if you make edits.  
You may also see errors in the console.

### `npm test`
Launches the test runner in interactive watch mode.  
See the section about [running tests](#testing) for more information.

### `npm run lint`
Runs the linter to check for code quality issues.  
You can fix linting errors by running:
```bash
npm run lint --fix
```

---

## Environment Variables

Before running the application, make sure to set up the required environment variables. Create a `.env` file in the root directory and add the following:

```env
DATABASE_URL=./database.sqlite
PORT=5000
JWT_SECRET=your_secret_key
```

---

## API Endpoints

### Authentication
- **POST /login**: Authenticate a user.
- **POST /register**: Register a new user.

### User Data
- **GET /user/:id**: Retrieve user data by ID.
- **PUT /user/:id**: Update user data by ID.

---

## Usage Example

Here’s an example of how to use the SQLite database in the project:

```javascript
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run("CREATE TABLE lorem (info TEXT)");

    const stmt = db.prepare("INSERT INTO lorem VALUES (?)");
    for (let i = 0; i < 10; i++) {
        stmt.run("Ipsum " + i);
    }
    stmt.finalize();

    db.each("SELECT rowid AS id, info FROM lorem", (err, row) => {
        console.log(row.id + ": " + row.info);
    });
});

db.close();
```

---

## Project Structure

```plaintext
├── src
│   ├── controllers    # Business logic for API endpoints
│   ├── models         # Database models
│   ├── routes         # API routes
│   ├── database       # SQLite database setup
│   └── utils          # Utility functions (e.g., password hashing)
├── .env               # Environment variables
├── package.json       # Project dependencies
├── README.md          # Project documentation
└── server.js          # Entry point for the application
```

---

## Testing

To run tests, use the following command:

```bash
npm test
```

Make sure to configure your test environment before running tests.

---

## Prebuilt Binaries

The project uses **sqlite3**, which supports prebuilt binaries for various platforms. If your environment isn't supported, the module will use `node-gyp` to build SQLite, but you will need to install a C++ compiler and linker.

To force a build from source, use:

```bash
npm install --build-from-source
```

---

## Contributors

- **Your Name** - Project creator and maintainer.

---

## Acknowledgments

Special thanks to the maintainers of the following libraries:
- [Node.js](https://nodejs.org/en/)
- [Express.js](https://expressjs.com/)
- [SQLite](https://www.sqlite.org/)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)

---

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
