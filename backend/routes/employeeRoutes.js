// const express = require('express');
// const router = express.Router();
// const { addEmployee, getEmployeeById, getAllEmployees, submitScorecard, deleteEmployee, updateEmployee } = require('../controller/employeeController');

// const ensureAuthenticated = (req, res, next) => {
//     if (req.isAuthenticated()) {
//         return next();
//     }
//     return res.status(401).json({ message: 'Unauthorized must the login' });
// };
// router.post('/add',addEmployee);
// router.get('/getemp/:id',ensureAuthenticated, getEmployeeById);
// router.get('/all', ensureAuthenticated,getAllEmployees);
// router.post('/:id/scorecard', ensureAuthenticated,submitScorecard);
// router.delete('/delete/:id',ensureAuthenticated, deleteEmployee);
// router.put('/edit/:id',ensureAuthenticated, updateEmployee);



// module.exports = router;
//========= main -2 
// const express = require('express');
// const router = express.Router();
// const { addEmployee, getEmployeeById, getAllEmployees, submitScorecard, deleteEmployee, updateEmployee } = require('../controller/employeeController');

// // Middleware to ensure user is authenticated
// const ensureAuthenticated = (req, res, next) => {
//     if (req.isAuthenticated()) {
//         return next();
//     }
    
//     // Check for token-based authentication for mobile apps
//     const authHeader = req.headers.authorization;
//     if (authHeader && authHeader.startsWith('Bearer ')) {
//         const token = authHeader.substring(7);
//         // Validate the token with Azure AD
//         // Note: You'd typically use a library like jsonwebtoken or passport-azure-ad
//         // This is a placeholder for where you would verify the token
//         try {
//             // Implement token validation here
//             // If valid, call next()
//             // For now, we'll just reject since validation isn't implemented
//             return res.status(401).json({ message: 'Invalid token' });
//         } catch (error) {
//             return res.status(401).json({ message: 'Token validation failed' });
//         }
//     }
    
//     return res.status(401).json({ message: 'Unauthorized, must login' });
// };

// // Employee routes
// router.post('/add', addEmployee);
// router.get('/getemp/:id', ensureAuthenticated, getEmployeeById);
// router.get('/all', ensureAuthenticated, getAllEmployees);
// router.post('/:id/scorecard', ensureAuthenticated, submitScorecard);
// router.delete('/delete/:id', ensureAuthenticated, deleteEmployee);
// router.put('/edit/:id', ensureAuthenticated, updateEmployee);

// // API Documentation endpoints for iOS developers
// router.get('/endpoints', (req, res) => {
//     const baseUrl = `${req.protocol}://${req.get('host')}`;
//     res.json({
//         employee: {
//             getEmployeeById: {
//                 method: 'GET',
//                 url: `${baseUrl}/api/employee/getemp/:id`,
//                 description: 'Get employee details by ID',
//                 authentication: 'Bearer token required',
//                 parameters: {
//                     id: 'Employee ID (path parameter)'
//                 }
//             },
//             getAllEmployees: {
//                 method: 'GET',
//                 url: `${baseUrl}/api/employee/all`,
//                 description: 'Get all employees',
//                 authentication: 'Bearer token required'
//             },
//             submitScorecard: {
//                 method: 'POST',
//                 url: `${baseUrl}/api/employee/:id/scorecard`,
//                 description: 'Submit a scorecard for an employee',
//                 authentication: 'Bearer token required',
//                 parameters: {
//                     id: 'Employee ID (path parameter)'
//                 },
//                 requestBody: {
//                     type: 'JSON object',
//                     example: {
//                         // Add an example scorecard structure here
//                         metrics: [
//                             { name: 'Performance', score: 4 },
//                             { name: 'Attendance', score: 5 }
//                         ],
//                         comments: 'Great performance this quarter.'
//                     }
//                 }
//             }
//         },
//         auth: {
//             authorizationEndpoint: `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/authorize`,
//             tokenEndpoint: `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`,
//             userInfoEndpoint: 'https://graph.microsoft.com/oidc/userinfo',
//             redirectURI: 'com.demovr.fitness:/loginCallback',
//             redirectLogoutURI: 'com.demovr.fitness:/logoutCallback',
//             revokeEndpoint: `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/logout`,
//             logoutEndpoint: `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/logout`,
//             audience: 'api://default',
//             scopes: ['openid', 'email', 'profile', 'offline_access']
//         }
//     });
// });

// module.exports = router;
// ================== main -3
const express = require('express');
const router = express.Router();
const { addEmployee, getEmployeeById, getAllEmployees, submitScorecard, deleteEmployee, updateEmployee } = require('../controller/employeeController');
const { validateAzureToken, validateTokenSimple } = require('../utils/tokenUtils');

// Middleware to ensure user is authenticated
const ensureAuthenticated = async (req, res, next) => {
    // Check if user is authenticated via session (web app)
    if (req.isAuthenticated()) {
        return next();
    }
    
    // Check for token-based authentication for mobile apps
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        
        try {
            // Choose validation method based on environment
            let decodedToken;
            
            if (process.env.NODE_ENV === 'production') {
                // Full validation against Azure AD in production
                decodedToken = await validateAzureToken(token);
            } else {
                // Simple validation in development
                decodedToken = validateTokenSimple(token);
                
                if (!decodedToken) {
                    throw new Error('Invalid token format or expired');
                }
            }
            
            // Attach the user info to the request
            req.user = {
                oid: decodedToken.oid || decodedToken.sub,
                email: decodedToken.preferred_username || decodedToken.email,
                name: decodedToken.name
            };
            
            return next();
        } catch (error) {
            console.error('Token validation error:', error.message);
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
    }
    
    return res.status(401).json({ message: 'Unauthorized, must login' });
};

// Employee routes
router.post('/add', ensureAuthenticated, addEmployee);
router.get('/getemp/:id', ensureAuthenticated, getEmployeeById);
router.get('/all', ensureAuthenticated, getAllEmployees);
router.post('/:id/scorecard', ensureAuthenticated, submitScorecard);
router.delete('/delete/:id', ensureAuthenticated, deleteEmployee);
router.put('/edit/:id', ensureAuthenticated, updateEmployee);

// API Documentation endpoints for iOS developers
router.get('/endpoints', (req, res) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    res.json({
        employee: {
            getEmployeeById: {
                method: 'GET',
                url: `${baseUrl}/api/employee/getemp/:id`,
                description: 'Get employee details by ID',
                authentication: 'Bearer token required',
                parameters: {
                    id: 'Employee ID (path parameter)'
                }
            },
            getAllEmployees: {
                method: 'GET',
                url: `${baseUrl}/api/employee/all`,
                description: 'Get all employees',
                authentication: 'Bearer token required'
            },
            addEmployee: {
                method: 'POST',
                url: `${baseUrl}/api/employee/add`,
                description: 'Add a new employee',
                authentication: 'Bearer token required',
                requestBody: {
                    type: 'JSON object',
                    example: {
                        first_name: 'John',
                        last_name: 'Doe',
                        email: 'john.doe@example.com',
                        phone_number: '1234567890',
                        job_code: 'DEV123',
                        designation: 'Software Engineer'
                    }
                }
            },
            updateEmployee: {
                method: 'PUT',
                url: `${baseUrl}/api/employee/edit/:id`,
                description: 'Update an existing employee',
                authentication: 'Bearer token required',
                parameters: {
                    id: 'Employee ID (path parameter)'
                },
                requestBody: {
                    type: 'JSON object',
                    example: {
                        first_name: 'John',
                        last_name: 'Doe',
                        email: 'john.doe@example.com',
                        phone_number: '1234567890',
                        designation: 'Senior Software Engineer'
                    }
                }
            },
            deleteEmployee: {
                method: 'DELETE',
                url: `${baseUrl}/api/employee/delete/:id`,
                description: 'Delete an employee',
                authentication: 'Bearer token required',
                parameters: {
                    id: 'Employee ID (path parameter)'
                }
            },
            submitScorecard: {
                method: 'POST',
                url: `${baseUrl}/api/employee/:id/scorecard`,
                description: 'Submit a scorecard for an employee',
                authentication: 'Bearer token required',
                parameters: {
                    id: 'Employee ID (path parameter)'
                },
                requestBody: {
                    type: 'JSON object',
                    example: {
                        shoulder_error: 12.5,
                        back_error: 8.3,
                        knee_error: 5.2,
                        total_error: 26.0,
                        green_percentage: 74.0,
                        red_percentage: 26.0
                    }
                }
            }
        },
        auth: {
            authorizationEndpoint: `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/authorize`,
            tokenEndpoint: `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`,
            userInfoEndpoint: 'https://graph.microsoft.com/oidc/userinfo',
            redirectURI: 'com.demovr.fitness:/loginCallback',
            redirectLogoutURI: 'com.demovr.fitness:/logoutCallback',
            revokeEndpoint: `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/logout`,
            logoutEndpoint: `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/logout`,
            audience: process.env.CLIENT_ID,
            scopes: ['openid', 'email', 'profile', 'offline_access']
        }
    });
});

module.exports = router;