<!--
Last Edited by: Brianna
Location: SF
-->

![](https://ga-dash.s3.amazonaws.com/production/assets/logo-9f88ae6c9c3871690e33280fcf557f33.png)

# Simple Login Server with Express

An express server that handles storing simple users and authentication tasks.

## Dependencies & Usage Instructions

Requires MongoDB, Node.js. See Node.js for other packages required.

1. Install dependencies with `npm install`.
1. Run `mongod`.
1. Run `nodemon` to start the server on localhost:3000.


## The User Model

Users include the following fields:
- email (required, must be unique)
- passwordDigest (password, obscured for security reasons - see [#passwordencryption]

## API Endpoints

Local base url:  `localhost:3000`

Method | Endpoints | Usage | Returns |
----- | ----- | ------ | ---- |
 GET | /api/users |  Get all users | users
 GET | [/api/users/current](#apiuserscurrent) |  Get the current (logged-in) user | user
 GET | /api/users/:id |  Get a user | user
 POST | [/api/sessions](#apisessions) |  Log a user in | user
 GET | [/api/logout](#apilogout) |  Log out the current user | user

### /api/users/current

The server tracks logged-in users with sessions, so each requestor will have a separate value for the logged-in user.

### /api/sessions

The request body must include:

- `email` of the user attempting to log in
- `password` of the user attempting to log in

This route sets the current logged-in user by adding a user id to the session.

### /api/logout

This route logs out any current logged-in user by removing any user information from the session.

## Security

This server is *NOT SECURE*. It should be used for demo purposes only.

One primary reason is that the server expects plain text passwords transmitted over HTTP instead of HTTPS.  

Read more about the authentication strategy used here, below.

### Password Encryption

In order to authenticate a user, a simple strategy is to store their password in the database. This allows checking that the user typed in the correct password when logging into our site.

Simply storing the password would not be secure. If anyone ever got access to the database, they would also have access to all of the users' login information.

This server uses a <a href="https://crackstation.net/hashing-security.htm#normalhashing">hashing algorithm</a> called bcrypt to avoid storing plain-text passwords in the database. It also uses a <a href="https://crackstation.net/hashing-security.htm#salt">salt</a> to randomize the hashing algorithm, providing extra security against potential attacks.  The database stores these salted and hashed passwords in a passwordDigest field for each user. 

<img src="https://blog.engineyard.com/images/blog-images/password-security/hash-anatomy.png" width="60%">

### Alternative Strategies

There are a lot of libraries that help implement authentication.  For Node.js, Passport is very popular. For MEAN stack, Satellizer is a common choice. Both of these libraries also handle strategies beyond password-based local authentication. These other auth strategies include OAuth 1 or OAuth 2, JWT, and other token-based schemes - they are popular with web pages using "sign in with facebook", "sign in with github", etc.  
