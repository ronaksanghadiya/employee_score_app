const axios = require('axios');
require('dotenv').config();

/**
 * Exchange authorization code for tokens from Azure AD
 * @param {*} req - Express request object
 * @param {*} res - Express response object
 */
exports.exchangeCodeForToken = async (req, res) => {
  const { code, redirect_uri } = req.body;

  if (!code || !redirect_uri) {
    return res.status(400).json({
      success: false,
      message: 'Missing required parameters: code and redirect_uri'
    });
  }

  try {
    // Prepare token request to Azure AD
    const tokenRequestParams = new URLSearchParams({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code: code,
      redirect_uri: redirect_uri,
      grant_type: 'authorization_code'
    });

    // Make token request to Azure AD
    const response = await axios.post(
      `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`,
      tokenRequestParams.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    // Return tokens to the client
    return res.json({
      success: true,
      tokens: {
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token,
        id_token: response.data.id_token,
        expires_in: response.data.expires_in,
        token_type: response.data.token_type
      }
    });
  } catch (error) {
    console.error('Token exchange error:', error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      success: false,
      message: 'Failed to exchange code for tokens',
      error: process.env.NODE_ENV === 'development' 
        ? (error.response?.data || error.message) 
        : undefined
    });
  }
};