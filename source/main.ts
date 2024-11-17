import express, { type Express } from "express";
import { ConfigConstants } from "./app/constants/ConfigConstants";
import { AccountType } from "./app/enums/AccountType";
import { EnvironmentHelper } from "./app/helpers/EnvironmentHelper";
import { LogHelper } from "./app/helpers/LogHelper";
import { AuthMiddleware } from "./app/middlewares/AuthMiddleware";
import { CatcherMiddleware } from "./app/middlewares/CatcherMiddleware";
import { FailureMiddleware } from "./app/middlewares/FailureMiddleware";
import { LoggerMiddleware } from "./app/middlewares/LoggerMiddleware";
import { MethodMiddleware } from "./app/middlewares/MethodMiddleware";
import { PoolTest } from "./app/tests/PoolTest";
import { EndpointsBuilder } from "./core/_internal/endpoints/EndpointsBuilder";
import { RecordsBuilder } from "./core/_internal/records/RecordsBuilder";
import { AccountsBuilder } from "./core/accounts/AccountsBuilder";
import { LoginBuilder } from "./core/login/LoginBuilder";
import { MySessionsBuilder } from "./core/my/sessions/MySessionsBuilder";
import { SignupBuilder } from "./core/signup/SignupBuilder";

// App
const app: Express = express();

// Environment
EnvironmentHelper.load();

// Pre-Middlewares
app.use(express.json());
app.use(LoggerMiddleware.log.bind(LoggerMiddleware));

// >--------------------------------------< ROUTES START >--------------------------------------< //

// INTERNAL ROUTES
app.use(
  // api/_internal/endpoints
  `${ConfigConstants.API_PREFIX}/${EndpointsBuilder.BASE_ROUTE}`,
  new EndpointsBuilder().router,
);
app.use(
  // api/_internal/records
  `${ConfigConstants.API_PREFIX}/${RecordsBuilder.BASE_ROUTE}`,
  new RecordsBuilder().router,
);

// AUTHENTICATING ROUTES
app.use(
  // api/login
  `${ConfigConstants.API_PREFIX}/${LoginBuilder.BASE_ROUTE}`,
  new LoginBuilder().router,
);
app.use(
  // api/signup
  `${ConfigConstants.API_PREFIX}/${SignupBuilder.BASE_ROUTE}`,
  new SignupBuilder().router,
);

// PUBLIC ROUTES
app.use(
  // api/accounts
  `${ConfigConstants.API_PREFIX}/${AccountsBuilder.BASE_ROUTE}`,
  new AccountsBuilder().router,
);

// PRIVATE ROUTES
app.use(
  // api/my/sessions
  `${ConfigConstants.API_PREFIX}/${MySessionsBuilder.BASE_ROUTE}`,
  AuthMiddleware.verifyAuth(Object.values(AccountType)).bind(AuthMiddleware),
  new MySessionsBuilder().router,
);

// >---------------------------------------< ROUTES END >---------------------------------------< //

// Post-Middlewares
app.use("*", MethodMiddleware.methodNotAllowed.bind(MethodMiddleware));
app.use("*", CatcherMiddleware.resourceNotFound.bind(CatcherMiddleware));
app.use(FailureMiddleware.serverFailure.bind(FailureMiddleware));

// Tests
void PoolTest.run();

// Server
app.listen(ConfigConstants.PORT, (): void => {
  LogHelper.progress(`Server listening on port ${ConfigConstants.PORT}...`);
});
