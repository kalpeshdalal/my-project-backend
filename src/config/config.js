const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVaribleSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(5001),
    MONGODB_URI: Joi.string().required().description('Mongo DB url'),
  })
  .unknown();

const { value: envVariables, error } = envVaribleSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVariables.NODE_ENV,
  port: envVariables.PORT,
  mongoose: {
    url: envVariables.MONGODB_URI,
    options: {
      // useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  }
  // ,
  // jwt: {
  //   secret: envVariables.JWT_SECRET,
  //   accessExpirationMinutes: envVariables.JWT_ACCESS_EXPIRATION_MINUTES,
  //   refreshExpirationDays: envVariables.JWT_REFRESH_EXPIRATION_DAYS,
  //   resetPasswordExpirationMinutes: envVariables.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
  //   verifyEmailExpirationMinutes: envVariables.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  // },
  
};
