import 'dotenv/config';
import * as joi from 'joi';

interface IEnv {
  PORT: number;
  SERVERS_NATS: string[];
  STRIPE_SECRET_KEY: string;
  STRPE_WEBHOOK_SECRET: string;
  STRIPE_SUCCESS_URL: string;
  STRIPE_CANCEL_URL: string;
}

const envSchema = joi
  .object<IEnv>({
    PORT: joi.number().port().required(),
    SERVERS_NATS: joi.array().items(joi.string()).required(),
    STRIPE_SECRET_KEY: joi.string().required(),
    STRPE_WEBHOOK_SECRET: joi.string().required(),
    STRIPE_SUCCESS_URL: joi.string().required(),
    STRIPE_CANCEL_URL: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envSchema.validate({
  ...process.env,
  SERVERS_NATS: process.env.SERVERS_NATS?.split(','),
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: IEnv = value;

export const envs: IEnv = {
  PORT: envVars.PORT,
  SERVERS_NATS: envVars.SERVERS_NATS,
  STRIPE_SECRET_KEY: envVars.STRIPE_SECRET_KEY,
  STRPE_WEBHOOK_SECRET: envVars.STRPE_WEBHOOK_SECRET,
  STRIPE_SUCCESS_URL: envVars.STRIPE_SUCCESS_URL,
  STRIPE_CANCEL_URL: envVars.STRIPE_CANCEL_URL,
};
