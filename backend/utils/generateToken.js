const jwt = require('jsonwebtoken');

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  // Render sets the 'RENDER' environment variable to 'true' automatically.
  // This ensures cookies have sameSite: 'none' and secure: true in deployed environments
  const isProd = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';
  
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000, 
  });
};

module.exports = generateToken;
