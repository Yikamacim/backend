import express, { type Express } from "express";
import { ConfigConstants } from "./app/constants/ConfigConstants";
import { EnvironmentHelper } from "./app/helpers/EnvironmentHelper";
import { LogHelper } from "./app/helpers/LogHelper";
import { CatcherMiddleware } from "./app/middlewares/CatcherMiddleware";
import { FailureMiddleware } from "./app/middlewares/FailureMiddleware";
import { LoggerMiddleware } from "./app/middlewares/LoggerMiddleware";
import { MethodMiddleware } from "./app/middlewares/MethodMiddleware";
import { PoolTest } from "./app/tests/PoolTest";
import { AccountsBuilder } from "./core/accounts/AccountsBuilder";
import { EndpointsBuilder } from "./core/endpoints/EndpointsBuilder";
import { LoginBuilder } from "./core/login/LoginBuilder";
import { RecordsBuilder } from "./core/records/RecordsBuilder";
import { SignupBuilder } from "./core/signup/SignupBuilder";

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
app.use(
  `${ConfigConstants.API_PREFIX}/${EndpointsBuilder.BASE_ROUTE}`,
  new EndpointsBuilder().router,
);
app.use(`${ConfigConstants.API_PREFIX}/${LoginBuilder.BASE_ROUTE}`, new LoginBuilder().router);
app.use(`${ConfigConstants.API_PREFIX}/${RecordsBuilder.BASE_ROUTE}`, new RecordsBuilder().router);
app.use(`${ConfigConstants.API_PREFIX}/${SignupBuilder.BASE_ROUTE}`, new SignupBuilder().router);

// Post-Middlewares
app.use("*", MethodMiddleware.methodNotAllowed);
app.use("*", CatcherMiddleware.resourceNotFound);
app.use(FailureMiddleware.serverFailure);

// Tests
PoolTest.run();

// Server
app.listen(ConfigConstants.PORT, (): void => {
  LogHelper.progress(`Server listening on port ${ConfigConstants.PORT}...`);
});
