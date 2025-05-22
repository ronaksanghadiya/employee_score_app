// tokenUtils.js
const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Validates an Azure AD token using Microsoft's OIDC discovery endpoint
 * @param {string} token - The Bearer token to validate
 * @returns {Promise<Object>} - The decoded token payload if valid
 */
exports.validateAzureToken = async (token) => {
  try {
    // First, decode the token without verification to get the headers
    const decodedToken = jwt.decode(token, { complete: true });
    
    if (!decodedToken) {
      throw new Error('Invalid token format');
    }
    
    // Get the tenant ID from the token or use the one from environment
    const tenantId = process.env.TENANT_ID;
    
    // Fetch Microsoft's JWKS (JSON Web Key Set)
    const jwksResponse = await axios.get(
      `https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`
    );
    
    const jwks = jwksResponse.data;
    
    // Find the signing key used for this token
    const kid = decodedToken.header.kid;
    const signingKey = jwks.keys.find(key => key.kid === kid);
    
    if (!signingKey) {
      throw new Error('Invalid token: Signing key not found');
    }
    
    // Convert JWK to PEM format that jwt.verify can use
    // This is a simplified version - in production use a library like jwk-to-pem
    // For example purposes only
    const pemKey = signingKey.x5c[0];
    
    // Verify the token
    const verified = jwt.verify(token, pemKey, {
      algorithms: ['RS256'],
      audience: process.env.CLIENT_ID, // Your app's client ID
      issuer: `https://login.microsoftonline.com/${tenantId}/v2.0`
    });
    
    return verified;
  } catch (error) {
    console.error('Token validation error:', error.message);
    throw new Error('Token validation failed');
  }
};

/**
 * Simple validation for development purposes
 * Only checks if the token is a valid JWT format
 * DO NOT USE IN PRODUCTION
 */
exports.validateTokenSimple = (token) => {
  try {
    // This only checks if the token is in a valid JWT format
    // It does NOT verify the signature or claims
    const decoded = jwt.decode(token);
    
    if (!decoded || !decoded.exp) {
      return false;
    }
    
    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      return false;
    }
    
    return decoded;
  } catch (error) {
    console.error('Simple token validation error:', error);
    return false;
  }
};