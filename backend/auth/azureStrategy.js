// const passport = require('passport');
// const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
// require('dotenv').config();

// passport.use(new OIDCStrategy({
//   identityMetadata: `https://login.microsoftonline.com/${process.env.TENANT_ID}/v2.0/.well-known/openid-configuration`,
//   clientID: process.env.CLIENT_ID,
//   clientSecret: process.env.CLIENT_SECRET,
//   responseType: 'code',
//   responseMode: 'query',
//   redirectUrl: process.env.REDIRECT_URI,
//   allowHttpForRedirectUrl: true,
//   scope: ['profile', 'email', 'openid'],
// }, (iss, sub, profile, accessToken, refreshToken, done) => {
//   return done(null, profile);
// }));

// passport.serializeUser((user, done) => {
//     console.log(user);
//   done(null, user.oid);
// });

// passport.deserializeUser((oid, done) => {
//   done(null, { oid });
// });

//======================== main -1=================================
// const passport = require('passport');
// const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
// require('dotenv').config();

// /**
//  * Configure the Azure AD authentication strategy
//  */
// passport.use('azuread-openidconnect', new OIDCStrategy({
//   // Azure AD tenant and endpoint configuration
//   identityMetadata: `https://login.microsoftonline.com/${process.env.TENANT_ID}/v2.0/.well-known/openid-configuration`,
//   clientID: process.env.CLIENT_ID,
//   clientSecret: process.env.CLIENT_SECRET,
  
//   // Make sure this matches with your server routes
//   redirectUrl: process.env.REDIRECT_URI || 'http://localhost:5000/auth/callback',
  
//   // responseType and responseMode should align with how Azure AD sends back the token
//   responseType: 'code id_token',  // Request both code and id_token
//   responseMode: 'form_post',      // Azure AD will POST the response
  
//   // Required scopes
//   scope: ['profile', 'email', 'openid', 'offline_access'],
  
//   // Allow non-HTTPS redirect URLs in development
//   allowHttpForRedirectUrl: process.env.NODE_ENV !== 'production',
  
//   // Validate the issuer for added security
//   validateIssuer: true,
//   issuer: `https://login.microsoftonline.com/${process.env.TENANT_ID}/v2.0`,
  
//   // Pass the request to the callback for more context if needed
//   passReqToCallback: true,
  
//   allowMultiAudiences: true,
//   // Set a reasonable timeout
//   loggingLevel: 'info',
  
//   // Useful for debugging
//   loggingNoPII: false
// }, 
//------------- this code already comment start -----
// passport.use('azuread-openidconnect', new OIDCStrategy({
//   identityMetadata: 'https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration',
//   clientID: process.env.CLIENT_ID,
//   clientSecret: process.env.CLIENT_SECRET,
//   redirectUrl: process.env.REDIRECT_URI || 'http://localhost:5000/auth/callback',
//   responseType: 'code id_token',
//   responseMode: 'form_post',
//   scope: ['profile', 'email', 'openid', 'offline_access'],
//   allowHttpForRedirectUrl: process.env.NODE_ENV !== 'production',

//   // Disable issuer validation to support multiple tenants or Microsoft accounts
//   validateIssuer: false,
//   issuer: null,

//   passReqToCallback: true,
//   allowMultiAudiences: true,
//   loggingLevel: 'info',
//   loggingNoPII: false
// },
//------------- this code already comment end  -----
// Strategy callback function
// function(req, iss, sub, profile, accessToken, refreshToken, done) {
//   if (!profile.oid) {
//     return done(new Error("No OID found in user profile."));
//   }
  
//   try {
//     // For this example we're just using the profile info for session
//     // In a real app, you'd lookup/save this user in your database
//     const user = {
//       oid: profile.oid,
//       displayName: profile.displayName,
//       email: profile.upn || profile._json.preferred_username || (profile.emails && profile.emails[0].value),
//       name: profile.name || profile.displayName
//     };
    
//     console.log('Authentication successful for user:', user.displayName);
    
//     // Pass the user to the done callback to store in session
//     return done(null, user);
//   } catch (err) {
//     console.error('Error during authentication:', err);
//     return done(err);
//   }
// }));

// /**
//  * Serialize user to store in session
//  */
// passport.serializeUser((user, done) => {
//   // Only store the user ID in the session
//   console.log('Serializing user:', user.displayName);
//   done(null, user);
// });

// /**
//  * Deserialize user from session
//  */
// passport.deserializeUser((oid, done) => {
//   // In a real app, you would fetch the user from your database
//   // For this example, we'll just create a minimal user object
//   console.log('Deserializing user ID:', oid);
//   done(null, { oid });
// });

//====================== Main -2 =======================
const passport = require('passport');
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
require('dotenv').config();

/**
 * Configure the Azure AD authentication strategy
 */
passport.use('azuread-openidconnect', new OIDCStrategy({
  // Azure AD tenant and endpoint configuration
  identityMetadata: `https://login.microsoftonline.com/${process.env.TENANT_ID}/v2.0/.well-known/openid-configuration`,
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  
  // Make sure this matches with your server routes
  redirectUrl: process.env.REDIRECT_URI || 'http://localhost:5000/auth/callback',
  
  // Additional redirect URIs for mobile app
  additionalRedirectUris: [
    'com.demovr.fitness:/loginCallback'
  ],
  
  // responseType and responseMode should align with how Azure AD sends back the token
  responseType: 'code id_token',  // Request both code and id_token
  responseMode: 'form_post',      // Azure AD will POST the response
  
  // Required scopes
  scope: ['profile', 'email', 'openid', 'offline_access'],
  
  // Allow non-HTTPS redirect URLs in development
  allowHttpForRedirectUrl: process.env.NODE_ENV !== 'production',
  
  // Validate the issuer for added security
  validateIssuer: true,
  issuer: `https://login.microsoftonline.com/${process.env.TENANT_ID}/v2.0`,
  
  // Pass the request to the callback for more context if needed
  passReqToCallback: true,
  
  allowMultiAudiences: true,
  // Set a reasonable timeout
  loggingLevel: 'info',
  
  // Useful for debugging
  loggingNoPII: false
}, function(req, iss, sub, profile, accessToken, refreshToken, done) {
  if (!profile.oid) {
    return done(new Error("No OID found in user profile."));
  }
  
  try {
    // For this example we're just using the profile info for session
    // In a real app, you'd lookup/save this user in your database
    const user = {
      oid: profile.oid,
      displayName: profile.displayName,
      email: profile.upn || profile._json.preferred_username || (profile.emails && profile.emails[0].value),
      name: profile.name || profile.displayName,
      // Store tokens for mobile API access
      accessToken: accessToken,
      refreshToken: refreshToken
    };
    
    console.log('Authentication successful for user:', user.displayName);
    
    // Pass the user to the done callback to store in session
    return done(null, user);
  } catch (err) {
    console.error('Error during authentication:', err);
    return done(err);
  }
}));

/**
 * Serialize user to store in session
 */
passport.serializeUser((user, done) => {
  // Only store the user ID in the session
  console.log('Serializing user:', user.displayName);
  done(null, user);
});

/**
 * Deserialize user from session
 */
passport.deserializeUser((oid, done) => {
  // In a real app, you would fetch the user from your database
  // For this example, we'll just create a minimal user object
  console.log('Deserializing user ID:', oid);
  done(null, { oid });
});
