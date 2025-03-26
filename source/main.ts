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
import { CountriesBuilder } from "./core/countries/CountriesBuilder";
import { DistrictsBuilder } from "./core/districts/DistrictsBuilder";
import { LoginBuilder } from "./core/login/LoginBuilder";
import { LogoutBuilder } from "./core/logout/LogoutBuilder";
import { MyAddressesBuilder } from "./core/my/addresses/MyAddressesBuilder";
import { MySessionsBuilder } from "./core/my/sessions/MySessionsBuilder";
import { NeighborhoodsBuilder } from "./core/neighborhoods/NeighborhoodsBuilder";
import { ProvincesBuilder } from "./core/provinces/ProvincesBuilder";
import { RefreshBuilder } from "./core/refresh/RefreshBuilder";
import { SignupBuilder } from "./core/signup/SignupBuilder";
import { VerifyBuilder } from "./core/verify/VerifyBuilder";

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
  EndpointsBuilder.BASE_ROUTE,
  new EndpointsBuilder().router,
);
app.use(
  // api/_internal/records
  RecordsBuilder.BASE_ROUTE,
  new RecordsBuilder().router,
);

// AUTHENTICATING ROUTES
app.use(
  // api/login
  LoginBuilder.BASE_ROUTE,
  new LoginBuilder().router,
);
app.use(
  // api/signup
  SignupBuilder.BASE_ROUTE,
  new SignupBuilder().router,
);
app.use(
  // api/verify
  VerifyBuilder.BASE_ROUTE,
  new VerifyBuilder().router,
);

// PUBLIC ROUTES
app.use(
  // api/accounts
  AccountsBuilder.BASE_ROUTE,
  new AccountsBuilder().router,
);
app.use(
  // api/countries
  CountriesBuilder.BASE_ROUTE,
  new CountriesBuilder().router,
);
app.use(
  // api/districts
  DistrictsBuilder.BASE_ROUTE,
  new DistrictsBuilder().router,
);
app.use(
  // api/neighborhoods
  NeighborhoodsBuilder.BASE_ROUTE,
  new NeighborhoodsBuilder().router,
);
app.use(
  // api/provinces
  ProvincesBuilder.BASE_ROUTE,
  new ProvincesBuilder().router,
);

// PRIVATE ROUTES
app.use(
  // api/my/sessions
  MySessionsBuilder.BASE_ROUTE,
  AuthMiddleware.verifyAuth(Object.values(AccountType)).bind(AuthMiddleware),
  new MySessionsBuilder().router,
);
app.use(
  // api/my/addresses
  MyAddressesBuilder.BASE_ROUTE,
  AuthMiddleware.verifyAuth(Object.values(AccountType)).bind(AuthMiddleware),
  new MyAddressesBuilder().router,
);
app.use(
  // api/logout
  LogoutBuilder.BASE_ROUTE,
  AuthMiddleware.verifyAuth(Object.values(AccountType)).bind(AuthMiddleware),
  new LogoutBuilder().router,
);
app.use(
  // api/refresh
  RefreshBuilder.BASE_ROUTE,
  AuthMiddleware.verifyAuth(Object.values(AccountType)).bind(AuthMiddleware),
  new RefreshBuilder().router,
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
