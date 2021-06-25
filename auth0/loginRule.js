/*
  This login rule enforces a "invite-only" user system
*/

async function loginRule(user, context, callback) {
  const MongoClient = require('mongodb@3.1.4').MongoClient;
  // Namespace for custom claims
  // See: https://auth0.com/docs/tokens/create-namespaced-custom-claims
  const namespace = 'https://example.com';
  try {

    // Check if the user logged in with an email.
    if (!user.email) throw new UnauthorizedError('Access denied.');

    // The MongoDB connection is memoized in global, so it can be reused.
    // If it does not exist, it is created and stored.
    if (!global.userCollection) {
      const client = new MongoClient(configuration.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      try {
        await client.connect();
        const userCollection = client.db().collection('users');
        global.userCollection = userCollection;
      } catch (error) {
        await client.close();
        throw error;
      }
    }

    // Find the user in MongoDB by email
    // convert emails to lowercase so they are not case sensitive.
    const foundUser = await global.userCollection.findOne({
      $expr: { $eq: [user.email.toLowerCase(), { $toLower: '$email' }] },
    });

    // If the user cannot be found, the have not been authorized to acces the app.
    // Throw an UnauthorizedError to deny access.
    if (!foundUser) throw new UnauthorizedError('Access denied.');

    // Update the user profile claims based on the data in the MongoDB database.
    // These claims are maintained in MongoDB from the Lowdefy app.
    user.name = foundUser.name;
    user.given_name = foundUser.given_name;
    user.family_name = foundUser.family_name;
    user.picture = foundUser.picture;

    // Add a "roles" custom claim to the OpenID Connect ID token.
    context.idToken[`${namespace}/roles`] = foundUser.roles;

    // If it is the first time the user logs in,
    // update the user "sub" field (OpenID Connect user ID).
    if (!foundUser.sub) {
      await global.userCollection.updateOne(
        { _id: foundUser._id },
        { $set: { sub: user.user_id } }
      );
    }

    // Call the callback to indicate success
    callback(null, user, context);
  } catch (error) {
    // Call the callback with the error.
    callback(error);
  }
}
