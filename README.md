# tinyapp

Application to shorten the URL of a webpage.

## Purpose

Tinyapp folder contains was an introductory project to embedded javascript and building a server in express.

**_BEWARE:_ This library was published for learning purposes. It is _not_ intended for use in production-grade software.**
This project was created and published by Ashton Ferguson as part of my learnings at Lighthouse Labs.

## Documentation

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
