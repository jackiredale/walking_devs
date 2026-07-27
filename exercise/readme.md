# Client Authentication

## Challenge

In this exercise, you have a simple web page that interacts with a backend API to handle **login**, **registration**, and **protected API calls**.

You'll observe how:

1. The application performs a login request.
2. The authentication token is stored after a successful login.
3. The token is passed along in subsequent secured requests.

However, there's a missing piece: **How do we serve the web page from our backend and deploy the solution?**

The answer is to serve the page and any client-side assets **statically from the server**.

💡 **Hint:** Check `W7-S3-Express/9_ServeStatic/exercise/server.js` for a reference on how to serve static files from the server.

## Key Learnings

- How a client-side script performs **login** and **register** requests, then stores an authentication token.
- How to use a **bearer token** to make authenticated API requests.
- How to **serve client-side files and assets** from an Express server using statically served routes.

## User Story

_As a developer, I want to authenticate users from the frontend, store their authentication token, and ensure my backend can serve the frontend files statically so that I can build a full authentication workflow._

## Acceptance Criteria

1. The frontend should be able to make API requests for **login** and **registration** and store the authentication token.
2. The authentication token should be included in protected API requests.
3. The Express server should **serve the static frontend files** so users can access the web page directly from the backend.
4. The solution should be structured so that it can be **easily deployed** as a full-stack application.

## Getting Started

1. **Install Dependencies** (if not already installed):

   ```bash
   npm install
   ```

2. **Start the Server:**

```bash
npm run start
```

3. **Test the Authentication Flow:**

- Open the frontend page.
- Attempt to register and log in.
- Check if the token is stored
- Try accessing a protected route with the token included in the request.

4. **Serve Static Files:**

- Modify the Express server to serve static files.
- Ensure the web page loads correctly when accessed from the backend.

## Resources

## Resources

- [Express Static Middleware](https://expressjs.com/en/starter/static-files.html)
- [Handling Authentication in JavaScript](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [jsonwebtoken (JWT) Package](https://www.npmjs.com/package/jsonwebtoken)
