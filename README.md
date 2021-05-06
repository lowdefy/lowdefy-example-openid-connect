# Lowdefy OpenID Connect Example

This example shows how to implement OpenID Connect user authentication in Lowdefy, and how to use role based authorization.

Auth0 is used as a OpenId Connect provider, and a MongoDB database and Auth0 login rule are used to create a "invite only" authentication service, where only users that have been added by an administrator are allowed to access the app.

This app has a public page, that can be accessed by anybody, as well as a protected page, that can only be accessed by logged in users. It also has profile and edit profile pages, that users can access to view and edit their profile. It also has user admin pages, that allow users with the "admin" role to view, create and edit users.

## Running the app

### Create a MongoDB cluster

##### Step 1
Create a free MongoDB database cluster hosted by MongoDB Atlas at [www.mongodb.com/try](https://www.mongodb.com/try).

##### Step 2
In the Database access section, create a database user with read access to any database.

##### Step 3
In the main cluster view, click "connect", then "Connect you application". This will give a MongoDB URI connection string. Use the credentials you just created in the connection string.

> You can read more about the [Lowdefy MongoDB connector](https://docs.lowdefy.com/MongoDB).

### Create an Auth0 OpenID Connect provider

##### Step 4 - Sign up for an Auth0 tenant
Sign up for an Auth0 tenant at [auth0.com](https://auth0.com)

##### Step 5 - Create a new application
Create a new application. An Auth0 application is an OpenID Connect client. Choose a "Regular Web Application".

##### Step 6 - Configure the application
Configure the application in the settings tab.

The things you should configure are:

Allowed Callback URLs:
```
http://localhost:3000/auth/openid-callback,https://your-custom-domain.example.com/auth/openid-callback
```
Allowed Logout URLs:
```
http://localhost:3000/logged-out, https://your-custom-domain.example.com/logged-out
```
Make sure to save the changes.

##### Step 7 - Note down your client information

You will need the "Domain", "Client ID", and "Client Secret" from the basic information section of the settings tab.

### Configure the Lowdefy app

##### Step 8 - Clone this repository

##### Step 9 - Create a JSON web token secret

You will need to create a JSON web token secret. Your app will use this to sign the tokens used to authorize users. You run the following command in the command console to generate the key:
```
node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"
```

We recommend using a different key in your development and production environments.

##### Step 10 - Create a .env file

Create a `.env` file in your project folder. It should contain the following:
```
LOWDEFY_SECRET_MONGODB_URI = YOUR_MONGODB_CONNECTION_STRING
LOWDEFY_SECRET_OPENID_CLIENT_ID = YOUR_AUTHO_CLIENT_ID
LOWDEFY_SECRET_OPENID_CLIENT_SECRET = YOUR_AUTHO_CLIENT_SECRET
LOWDEFY_SECRET_OPENID_DOMAIN = YOUR_AUTHO_DOMAIN
LOWDEFY_SECRET_JWT_SECRET = YOUR_SECRET_KEY
```

##### Step 10 - Run the app

In the command console, navigate to your project folder and run the Lowdefy CLI: `npx lowdefy@latest dev`.

## More Lowdefy resources

- Getting started with Lowdefy - https://docs.lowdefy.com/tutorial-start
- Lowdefy docs - https://docs.lowdefy.com
- Lowdefy website - https://lowdefy.com
- Community forum - https://github.com/lowdefy/lowdefy/discussions
- Bug reports and feature requests - https://github.com/lowdefy/lowdefy/issues

## Licence

[MIT](https://github.com/lowdefy/lowdefy-example-crud/blob/main/LICENSE)
