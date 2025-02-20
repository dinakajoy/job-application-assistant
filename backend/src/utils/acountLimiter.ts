import rateLimit from 'express-rate-limit';

const acountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20, 
  message:
    'Too many access attempt from this IP, please try again after an hour',
  standardHeaders: true, 
  legacyHeaders: false,
});

export default acountLimiter;