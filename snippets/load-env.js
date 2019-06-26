// eslint-disable-next-line import/no-extraneous-dependencies
const dotenv = require('dotenv');

const loadEnvironment = () => {
  // when local, load the environment variables
  if (!process.env.CI) {
    dotenv.config(); // put variables from .env into process.env
  }
};

export default loadEnvironment;
