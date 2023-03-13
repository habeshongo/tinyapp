# tinyapp

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Purpose

Tinyapp folder contains was an introductory project to embedded javascript and building a server in express.

This is a simple multipage app:

- with authentication protection
- that reacts appropriately to the user's logged-in state,
- and permits the user to create, read, update, and delete (CRUD) a simple entity (e.g. blog posts, URL shortener).

**_BEWARE:_ This library was published for learning purposes. It is _not_ intended for use in production-grade software.**
This project was created and published by Ashton Ferguson as part of my learnings at Lighthouse Labs.

## Documentation

## Dependencies

- Node.js
- Express
- EJS
- bcryptjs
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.

The following pages are contained in the app:

### login

- The login page allows previously registered users to login to the app.
- If a user who is not registered tries to login, an error message will be displayed.
- An email and password has to be provided or an error message will be displayed.

### register

- The register page allows new users to the app to register.
- An email and passwprd is required to register.
- If the user is already registered, he will be redirected to the webpage that shows the list of his shortened URLs.

### index

- This page shows the list of shortened URLs that the user has shortened.
- The logged in user can only see the list of shortened URLs that he has generated.

### new

- This page allows the logged-in user to input a full URL address and press submit to generate a shortened 6 character string for the URL.

### show

- This page shows the logged-in user the shortened URL that he just generated and allows him to edit the URL.

# Functions

- generateRandomString - This function generates a random 6 character string to respresent the full length URL that the user submitted.
- urlsForUser - This function returns the URLs where the userID is equal to the id of the currently logged-in user to ensure that the user can only view, edit and delete the URLs that he has submitted.
- getUserByEmail - This function is finds a user in the users object from its email to ensure that the user can log in with his prior password and his URLs can be retrieved.

# Miscellaneous

- Testing of the getUsersByEmail function is done with mocha and chai.

# Final Product

["Screenshot of the register page."](https://github.com/habeshongo/tinyapp/blob/main/docs/register_page.jpg)
["Screenshot of the login page."](https://github.com/habeshongo/tinyapp/blob/main/docs/login_page.jpg)
["Screenshot of page to create a shoretened URL."](https://github.com/habeshongo/tinyapp/blob/main/docs/create_shortened_URL.jpg)
["Screenshot of the page after URL is shortened."](https://github.com/habeshongo/tinyapp/blob/main/docs/shortened_URL.jpg)
["Screenshot of index of shortened URLS generated and saved."](https://github.com/habeshongo/tinyapp/blob/main/docs/main_URLs_page.jpg)
