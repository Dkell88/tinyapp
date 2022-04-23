# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly). The application does require you to register and login before use. Once logged in users can view all shortened URLs that have been create and stored on the server. However, only short URLs that were created by the user can be edited or deletes.

## Final Product

![Screenshot of TinyApp Homepage](./docs/tiny1.png)
![Screenshot of New URL](https://github.com/Dkell88/tinyapp/blob/master/docs/Tiny2.png)
![Screenshot of User URLs](https://github.com/Dkell88/tinyapp/blob/master/docs/Tiny3.png)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session
- method-override


## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `npm start` command.
- In a browser go to http://localhost:8080/urls.
- Click on the register link on the /urls page and register an email and password. This will automatically sign you in. 
- Create a new short url by going to [Create New URL](http://localhost:8080/urls/new) on the navigation bar at teh top. 