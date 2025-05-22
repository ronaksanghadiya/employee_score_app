// const express = require('express');
// const session = require('express-session');
// const passport = require('passport');
// const bodyParser = require('body-parser');
// const employeeRoutes = require('./routes/employeeRoutes');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// require('./auth/azureStrategy');

// // === Middleware ===
// app.use(cors({
//   origin: 'http://localhost:3000',
//   credentials: true
// }));

// app.use(bodyParser.json());

// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false,
// }));

// app.use(passport.initialize());
// app.use(passport.session());

// // === Auth Routes ===
// app.get('/auth', passport.authenticate('azuread-openidconnect'));

// app.get('/auth/callback',
//   passport.authenticate('azuread-openidconnect', { failureRedirect: 'http://localhost:3000/login' }),
//   (req, res) => {
//     console.log('User:', req.user);
//     // After login, redirect to React frontend
//     console.log(res);
//     res.redirect('http://localhost:3000');
//   }
// );

// // Auth status endpoint
// app.get('/me', (req, res) => {
//   if (req.isAuthenticated()) {
//     res.json({ user: req.user });
//   } else {
//     res.status(401).json({ message: 'Not authenticated' });
//   }
// });

// // Logout
// app.get('/logout', (req, res) => {
//   req.logout(() => {
//     req.session.destroy();
//     res.clearCookie('connect.sid');
//     res.redirect('http://localhost:3000');
//   });
// });

// // === API Routes ===
// app.use('/api/employee', employeeRoutes);

// // === Start Server ===
// app.listen(5000, () => {
//   console.log('Server running on http://localhost:5000');
// });

//=================================== main-1 =========================
// const express = require('express');
// const session = require('express-session');
// const passport = require('passport');
// const bodyParser = require('body-parser');
// const employeeRoutes = require('./routes/employeeRoutes');
// const cors = require('cors');
// require('dotenv').config();
// const flash = require('connect-flash');
// // Initialize Express app
// const app = express();

// // Load Azure AD authentication strategy
// require('./auth/azureStrategy');

// // === Middleware ===
// app.use(cors({
//   origin: process.env.CLIENT_URL || 'http://localhost:3000',
//   credentials: true
// }));

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true })); // Important for handling form data!

// // Session configuration
// app.use(session({
//   secret: process.env.SESSION_SECRET || 'your-secret-key',
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     secure: process.env.NODE_ENV === 'production', // Only use secure cookies in production
//     maxAge: 24 * 60 * 60 * 1000 // 24 hours
//   }
// }));
// app.use(flash());
// // Initialize Passport and restore authentication state from session
// app.use(passport.initialize());
// app.use(passport.session());

// // === Auth Routes ===
// // Login route - start the authentication flow
// app.get('/auth/login', (req, res, next) => {
//   passport.authenticate('azuread-openidconnect', {
//     prompt: 'select_account',
//     failureRedirect: '/auth/failed'
//   })(req, res, next);
// });

// // Azure AD callback route - this is where Azure redirects after authentication
// app.get('/auth/callback', (req, res, next) => {
//   passport.authenticate('azuread-openidconnect', {
//     successRedirect: process.env.CLIENT_URL || 'http://localhost:3000',
//     failureRedirect: '/auth/failed',
//     failureFlash: true
//   })(req, res, next);
// });

// // Also handle POST callback (depending on Azure AD response mode)
// app.post('/auth/callback', (req, res, next) => {
//   passport.authenticate('azuread-openidconnect', {
//     successRedirect: process.env.CLIENT_URL || 'http://localhost:3000',
//     failureRedirect: '/auth/failed',
//     failureFlash: true
//   })(req, res, next);
// });

// // Authentication failure handler
// app.get('/auth/failed', (req, res) => {
//   console.log('Authentication failed');
//   res.status(401).json({ success: false, message: 'Authentication failed' });
// });

// // Auth status endpoint - check if user is authenticated
// app.get('/me', (req, res) => {
//   if (req.isAuthenticated()) {
//     // Only return necessary user info (avoid exposing sensitive data)
//     const { oid, name, email, displayName } = req.user;
//     res.json({ 
//       isAuthenticated: true, 
//       user: { oid, name, email, displayName } 
//     });
//   } else {
//     res.status(401).json({ 
//       isAuthenticated: false,
//       message: 'Not authenticated' 
//     });
//   }
// });

// // Logout
// app.get('/logout', (req, res) => {
//   req.logout(function(err) {
//     if (err) { 
//       console.error('Logout error:', err); 
//       return res.status(500).json({ success: false, message: 'Logout failed' });
//     }
//     req.session.destroy();
//     res.clearCookie('connect.sid');

//     // Redirect to Azure AD logout to fully sign out
//     const azureLogoutUrl = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/logout?post_logout_redirect_uri=${encodeURIComponent(process.env.CLIENT_URL || 'http://localhost:3000')}`;
//     res.redirect(azureLogoutUrl);
//   });
// });

// // === API Routes ===
// app.use('/api/employee', employeeRoutes);

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error('Server error:', err);
//   res.status(500).json({ 
//     success: false, 
//     message: 'Internal server error',
//     error: process.env.NODE_ENV === 'development' ? err.message : undefined
//   });
// });

// // === Start Server ===
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

// ==================== Main -2 ====================================

// const express = require('express');
// const session = require('express-session');
// const passport = require('passport');
// const bodyParser = require('body-parser');
// const employeeRoutes = require('./routes/employeeRoutes');
// const cors = require('cors');
// require('dotenv').config();
// const flash = require('connect-flash');
// // Initialize Express app
// const app = express();

// // Load Azure AD authentication strategy
// require('./auth/azureStrategy');

// // === Middleware ===
// // app.use(cors({
// //   origin: function(origin, callback) {
// //     // Allow requests with no origin (like mobile apps)
// //     if (!origin) return callback(null, true);
// //     // Or allow specific origins
// //     const allowedOrigins = [
// //       process.env.CLIENT_URL || 'http://localhost:3000',
// //       'com.demovr.fitness'
// //     ];
// //     if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
// //       callback(null, true);
// //     } else {
// //       callback(new Error('Not allowed by CORS'));
// //     }
// //   },
// //   credentials: true
// // }));
// app.use(cors({ origin: true, credentials: true }));

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true })); // Important for handling form data!

// // Session configuration
// app.use(session({
//   secret: process.env.SESSION_SECRET || 'your-secret-key',
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     secure: process.env.NODE_ENV === 'production', // Only use secure cookies in production
//     maxAge: 24 * 60 * 60 * 1000 // 24 hours
//   }
// }));
// app.use(flash());
// // Initialize Passport and restore authentication state from session
// app.use(passport.initialize());
// app.use(passport.session());

// // === Auth Routes ===
// // Login route - start the authentication flow
// app.get('/auth/login', (req, res, next) => {
//   passport.authenticate('azuread-openidconnect', {
//     prompt: 'select_account',
//     failureRedirect: '/auth/failed'
//   })(req, res, next);
// });

// // Azure AD callback route - this is where Azure redirects after authentication
// app.get('/auth/callback', (req, res, next) => {
//   console.log('Authorization Code:', req.query.code);
//   const code = req.query.code;
//   console.log('Authorization Code:', code);

//   if (code) {
//     // ✅ Display the code on the browser for easy copy
//     return res.send(`<h2>Authorization Code:</h2><p style="font-size: 18px; color: green;"><b>${code}</b></p>`);
//   }
//   // passport.authenticate('azuread-openidconnect', {
//   //   successRedirect: process.env.CLIENT_URL || 'http://localhost:3000',
//   //   failureRedirect: '/auth/failed',
//   //   failureFlash: true
//   // })(req, res, next);
// });

// // Also handle POST callback (depending on Azure AD response mode)
// app.post('/auth/callback', (req, res, next) => {
//   console.log('Authorization Code (POST):', req.query.code || req.body.code);
//   const code = req.query.code;
//   console.log('Authorization Code:', code);

//   if (code) {
//     // ✅ Display the code on the browser for easy copy
//     return res.send(`<h2>Authorization Code:</h2><p style="font-size: 18px; color: green;"><b>${code}</b></p>`);
//   }
//   // passport.authenticate('azuread-openidconnect', {
//   //   successRedirect: process.env.CLIENT_URL || 'http://localhost:3000',
//   //   failureRedirect: '/auth/failed',
//   //   failureFlash: true
//   // })(req, res, next);
// });

// // New endpoint to provide OIDC configuration
// app.get('/.well-known/openid-configuration', (req, res) => {
//   // Provide OIDC configuration for native apps
//   const baseUrl = `${req.protocol}://${req.get('host')}`;
//   const tenantId = process.env.TENANT_ID;

//   res.json({
//     issuer: `https://login.microsoftonline.com/${tenantId}/v2.0`,
//     authorization_endpoint: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`,
//     token_endpoint: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
//     userinfo_endpoint: 'https://graph.microsoft.com/oidc/userinfo',
//     revocation_endpoint: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/logout`,
//     end_session_endpoint: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/logout`,
//     jwks_uri: `https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`,
//     response_types_supported: [
//       'code',
//       'id_token',
//       'code id_token',
//       'token id_token',
//       'token'
//     ],
//     subject_types_supported: ['pairwise'],
//     id_token_signing_alg_values_supported: ['RS256'],
//     scopes_supported: ['openid', 'profile', 'email', 'offline_access'],
//     token_endpoint_auth_methods_supported: [
//       'client_secret_post',
//       'client_secret_basic',
//       'private_key_jwt'
//     ],
//     claims_supported: [
//       'sub',
//       'iss',
//       'aud',
//       'exp',
//       'iat',
//       'auth_time',
//       'acr',
//       'nonce',
//       'preferred_username',
//       'name',
//       'email'
//     ],
//     request_uri_parameter_supported: false,
//     grant_types_supported: [
//       'authorization_code',
//       'implicit',
//       'client_credentials',
//       'refresh_token'
//     ]
//   });
// });

// // Authentication failure handler
// app.get('/auth/failed', (req, res) => {
//   console.log('Authentication failed');
//   res.status(401).json({ success: false, message: 'Authentication failed' });
// });

// // Auth status endpoint - check if user is authenticated
// app.get('/me', (req, res) => {
//   if (req.isAuthenticated()) {
//     // Only return necessary user info (avoid exposing sensitive data)
//     const { oid, name, email, displayName } = req.user;
//     res.json({
//       isAuthenticated: true,
//       user: { oid, name, email, displayName }
//     });
//   } else {
//     res.status(401).json({
//       isAuthenticated: false,
//       message: 'Not authenticated'
//     });
//   }
// });

// // Logout
// app.get('/logout', (req, res) => {
//   req.logout(function (err) {
//     if (err) {
//       console.error('Logout error:', err);
//       return res.status(500).json({ success: false, message: 'Logout failed' });
//     }
//     req.session.destroy();
//     res.clearCookie('connect.sid');

//     // Check if it's a mobile app request
//     const isMobileApp = req.query.mobile === 'true';
//     const redirectUri = isMobileApp
//       ? encodeURIComponent('com.demovr.fitness:/logoutCallback')
//       : encodeURIComponent(process.env.CLIENT_URL || 'http://localhost:3000');

//     // Redirect to Azure AD logout to fully sign out
//     const azureLogoutUrl = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/logout?post_logout_redirect_uri=${redirectUri}`;
//     res.redirect(azureLogoutUrl);
//   });
// });

// // === API Routes ===
// app.use('/api/employee', employeeRoutes);

// // Add an endpoint to get token for mobile app
// app.post('/api/token', (req, res) => {
//   const { code, redirect_uri } = req.body;

//   if (!code || !redirect_uri) {
//     return res.status(400).json({
//       success: false,
//       message: 'Missing required parameters'
//     });
//   }

//   // Exchange authorization code for tokens
//   const tokenRequestBody = {
//     client_id: process.env.CLIENT_ID,
//     client_secret: process.env.CLIENT_SECRET,
//     code: code,
//     redirect_uri: redirect_uri,
//     grant_type: 'authorization_code'
//   };

//   // Use axios or another HTTP client to make this request
//   // This is just a placeholder - you would typically use an HTTP client here
//   res.status(501).json({
//     message: 'Not implemented. This endpoint should exchange the code for tokens.'
//   });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error('Server error:', err);
//   res.status(500).json({
//     success: false,
//     message: 'Internal server error',
//     error: process.env.NODE_ENV === 'development' ? err.message : undefined
//   });
// });

// // === Start Server ===
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
//========================= main -3 ==============
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const employeeRoutes = require('./routes/employeeRoutes');
const { exchangeCodeForToken } = require('./controller/tokenController');
const cors = require('cors');
require('dotenv').config();
const flash = require('connect-flash');

// Initialize Express app
const app = express();

// Load Azure AD authentication strategy
require('./auth/azureStrategy');

// === Middleware ===
app.use(cors({ origin: true, credentials: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Important for handling form data!

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Only use secure cookies in production
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
app.use(flash());

// Initialize Passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());

// === Auth Routes ===
// Login route - start the authentication flow
app.get('/auth/login', (req, res, next) => {
  // Check if it's a mobile app request
  const isMobileApp = req.query.mobile === 'true';

  // Set the appropriate redirect URI based on the client type
  const redirectUri = isMobileApp
    ? 'com.demovr.fitness:/loginCallback'
    : (process.env.REDIRECT_URI || 'http://localhost:5000/auth/callback');

  passport.authenticate('azuread-openidconnect', {
    prompt: 'select_account',
    failureRedirect: '/auth/failed',
    // resourceURL: process.env.CLIENT_ID,
    redirectUri: redirectUri
  })(req, res, next);
});

// Azure AD callback route - this is where Azure redirects after authentication
app.get('/auth/callback', (req, res, next) => {

  const code = req.query.code||req.body.code;
  console.log('Authorization Code:', code);
  passport.authenticate('azuread-openidconnect', {
   // successRedirect: process.env.CLIENT_URL || 'http://localhost:3000',
    failureRedirect: '/auth/failed',
    failureFlash: true
  })(req, res, next);
});

// Also handle POST callback (depending on Azure AD response mode)
app.post('/auth/callback', (req, res, next) => {
  const code = req.query.code||req.body.code;
  console.log('Authorization Code:', code);
  passport.authenticate('azuread-openidconnect', {
   // successRedirect: process.env.CLIENT_URL || 'http://localhost:3000',
    failureRedirect: '/auth/failed',
    failureFlash: true
  })(req, res, next);
});

// New endpoint to provide OIDC configuration
app.get('/.well-known/openid-configuration', (req, res) => {
  // Provide OIDC configuration for native apps
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const tenantId = process.env.TENANT_ID;

  res.json({
    issuer: `https://login.microsoftonline.com/${tenantId}/v2.0`,
    authorization_endpoint: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`,
    token_endpoint: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
    userinfo_endpoint: 'https://graph.microsoft.com/oidc/userinfo',
    revocation_endpoint: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/logout`,
    end_session_endpoint: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/logout`,
    jwks_uri: `https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`,
    response_types_supported: [
      'code',
      'id_token',
      'code id_token',
      'token id_token',
      'token'
    ],
    subject_types_supported: ['pairwise'],
    id_token_signing_alg_values_supported: ['RS256'],
    scopes_supported: ['openid', 'profile', 'email', 'offline_access'],
    token_endpoint_auth_methods_supported: [
      'client_secret_post',
      'client_secret_basic',
      'private_key_jwt'
    ],
    claims_supported: [
      'sub',
      'iss',
      'aud',
      'exp',
      'iat',
      'auth_time',
      'acr',
      'nonce',
      'preferred_username',
      'name',
      'email'
    ],
    request_uri_parameter_supported: false,
    grant_types_supported: [
      'authorization_code',
      'implicit',
      'client_credentials',
      'refresh_token'
    ]
  });
});

// Authentication failure handler
app.get('/auth/failed', (req, res) => {
  console.log('Authentication failed');
  const error = req.flash('error') || 'Unknown error';
  res.status(401).json({ success: false, message: 'Authentication failed', error });
});

// Auth status endpoint - check if user is authenticated
app.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    // Only return necessary user info (avoid exposing sensitive data)
    const { oid, name, email, displayName } = req.user;
    res.json({
      isAuthenticated: true,
      user: { oid, name, email, displayName }
    });
  } else {
    res.status(401).json({
      isAuthenticated: false,
      message: 'Not authenticated'
    });
  }
});

// Logout
app.get('/logout', (req, res) => {
  req.logout(function (err) {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ success: false, message: 'Logout failed' });
    }
    req.session.destroy();
    res.clearCookie('connect.sid');

    // Check if it's a mobile app request
    const isMobileApp = req.query.mobile === 'true';
    const redirectUri = isMobileApp
      ? encodeURIComponent('com.demovr.fitness:/logoutCallback')
      : encodeURIComponent(process.env.CLIENT_URL || 'http://localhost:3000');

    // Redirect to Azure AD logout to fully sign out
    const azureLogoutUrl = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/logout?post_logout_redirect_uri=${redirectUri}`;
    res.redirect(azureLogoutUrl);
  });
});

// === API Routes ===
app.use('/api/employee', employeeRoutes);

// Add an endpoint to get token for mobile app
app.post('/api/token', exchangeCodeForToken);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// === Start Server ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});