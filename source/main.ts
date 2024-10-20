import express, { type Express } from "express";
import { ConfigConstants } from "./app/constants/ConfigConstants.ts";
import { EnvironmentHelper } from "./app/helpers/EnvironmentHelper.ts";
import { CatcherMiddleware } from "./app/middlewares/CatcherMiddleware.ts";
import { FailureMiddleware } from "./app/middlewares/FailureMiddleware.ts";
import { LoggerMiddleware } from "./app/middlewares/LoggerMiddleware.ts";
import { MethodMiddleware } from "./app/middlewares/MethodMiddleware.ts";
import { AccountsBuilder } from "./core/accounts/AccountsBuilder.ts";
import { LoginBuilder } from "./core/login/LoginBuilder.ts";
import { SignupBuilder } from "./core/signup/SignupBuilder.ts";

// App
const app: Express = express();

// Environment
EnvironmentHelper.load();

// Pre-Middlewares
app.use(express.json());
app.use(LoggerMiddleware.log);

// Routes without authentication
app.use(
  `${ConfigConstants.API_PREFIX}/${AccountsBuilder.BASE_ROUTE}`,
  new AccountsBuilder().router,
);
app.use(`${ConfigConstants.API_PREFIX}/${LoginBuilder.BASE_ROUTE}`, new LoginBuilder().router);
app.use(`${ConfigConstants.API_PREFIX}/${SignupBuilder.BASE_ROUTE}`, new SignupBuilder().router);

// Post-Middlewares
app.use("*", MethodMiddleware.methodNotAllowed);
app.use("*", CatcherMiddleware.resourceNotFound);
app.use(FailureMiddleware.serverFailure);

// Server
app.listen(ConfigConstants.PORT, (): void => {
  console.info(`Server listening on port ${ConfigConstants.PORT}`);
});
