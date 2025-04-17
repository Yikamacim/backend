import express, { type Express } from "express";
import { ConfigConstants } from "./app/constants/ConfigConstants";
import { EnvironmentHelper } from "./app/helpers/EnvironmentHelper";
import { LogHelper } from "./app/helpers/LogHelper";
import { AuthMiddleware } from "./app/middlewares/AuthMiddleware";
import { CatcherMiddleware } from "./app/middlewares/CatcherMiddleware";
import { FailureMiddleware } from "./app/middlewares/FailureMiddleware";
import { LoggerMiddleware } from "./app/middlewares/LoggerMiddleware";
import { MethodMiddleware } from "./app/middlewares/MethodMiddleware";
import { PoolTest } from "./app/tests/PoolTest";
import { AccountType } from "./common/enums/AccountType";
import { EndpointsBuilder } from "./core/_internal/endpoints/EndpointsBuilder";
import { PurgeBuilder } from "./core/_internal/purge/PurgeBuilder";
import { RecordsBuilder } from "./core/_internal/records/RecordsBuilder";
import { AccountsBuilder } from "./core/accounts/AccountsBuilder";
import { CountriesBuilder } from "./core/countries/CountriesBuilder";
import { DistrictsBuilder } from "./core/districts/DistrictsBuilder";
import { LoginBuilder } from "./core/login/LoginBuilder";
import { LogoutBuilder } from "./core/logout/LogoutBuilder";
import { MyAddressesBuilder } from "./core/my/addresses/MyAddressesBuilder";
import { MyBedsBuilder } from "./core/my/beds/MyBedsBuilder";
import { MyCarpetsBuilder } from "./core/my/carpets/MyCarpetsBuilder";
import { MyChairsBuilder } from "./core/my/chairs/MyChairsBuilder";
import { MyCurtainsBuilder } from "./core/my/curtains/MyCurtainsBuilder";
import { MyMediasBuilder } from "./core/my/medias/MyMediasBuilder";
import { MySessionsBuilder } from "./core/my/sessions/MySessionsBuilder";
import { MySofasBuilder } from "./core/my/sofas/MySofasBuilder";
import { MyVehiclesBuilder } from "./core/my/vehicles/MyVehiclesBuilder";
import { NeighborhoodsBuilder } from "./core/neighborhoods/NeighborhoodsBuilder";
import { ProvincesBuilder } from "./core/provinces/ProvincesBuilder";
import { RefreshBuilder } from "./core/refresh/RefreshBuilder";
import { SignupBuilder } from "./core/signup/SignupBuilder";
import { VerifyBuilder } from "./core/verify/VerifyBuilder";
import { PurgeTask } from "./tasks/purge/task";

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
  // _internal/endpoints
  EndpointsBuilder.BASE_ROUTE,
  new EndpointsBuilder().router,
);
app.use(
  // _internal/endpoints
  PurgeBuilder.BASE_ROUTE,
  new PurgeBuilder().router,
);
app.use(
  // _internal/records
  RecordsBuilder.BASE_ROUTE,
  new RecordsBuilder().router,
);

// AUTHENTICATING ROUTES
app.use(
  // login
  LoginBuilder.BASE_ROUTE,
  new LoginBuilder().router,
);
app.use(
  // signup
  SignupBuilder.BASE_ROUTE,
  new SignupBuilder().router,
);
app.use(
  // verify
  VerifyBuilder.BASE_ROUTE,
  new VerifyBuilder().router,
);

// PUBLIC ROUTES
app.use(
  // accounts
  AccountsBuilder.BASE_ROUTE,
  new AccountsBuilder().router,
);
app.use(
  // countries
  CountriesBuilder.BASE_ROUTE,
  new CountriesBuilder().router,
);
app.use(
  // districts
  DistrictsBuilder.BASE_ROUTE,
  new DistrictsBuilder().router,
);
app.use(
  // neighborhoods
  NeighborhoodsBuilder.BASE_ROUTE,
  new NeighborhoodsBuilder().router,
);
app.use(
  // provinces
  ProvincesBuilder.BASE_ROUTE,
  new ProvincesBuilder().router,
);

// PRIVATE ROUTES
app.use(
  // my/addresses
  MyAddressesBuilder.BASE_ROUTE,
  AuthMiddleware.verifyAuth([AccountType.USER]).bind(AuthMiddleware),
  new MyAddressesBuilder().router,
);
app.use(
  // my/beds
  MyBedsBuilder.BASE_ROUTE,
  AuthMiddleware.verifyAuth([AccountType.USER]).bind(AuthMiddleware),
  new MyBedsBuilder().router,
);
app.use(
  // my/carpets
  MyCarpetsBuilder.BASE_ROUTE,
  AuthMiddleware.verifyAuth([AccountType.USER]).bind(AuthMiddleware),
  new MyCarpetsBuilder().router,
);
app.use(
  // my/chairs
  MyChairsBuilder.BASE_ROUTE,
  AuthMiddleware.verifyAuth([AccountType.USER]).bind(AuthMiddleware),
  new MyChairsBuilder().router,
);
app.use(
  // my/curtains
  MyCurtainsBuilder.BASE_ROUTE,
  AuthMiddleware.verifyAuth([AccountType.USER]).bind(AuthMiddleware),
  new MyCurtainsBuilder().router,
);
app.use(
  // my/medias
  MyMediasBuilder.BASE_ROUTE,
  AuthMiddleware.verifyAuth(Object.values(AccountType)).bind(AuthMiddleware),
  new MyMediasBuilder().router,
);
app.use(
  // my/sessions
  MySessionsBuilder.BASE_ROUTE,
  AuthMiddleware.verifyAuth(Object.values(AccountType)).bind(AuthMiddleware),
  new MySessionsBuilder().router,
);
app.use(
  // my/sofas
  MySofasBuilder.BASE_ROUTE,
  AuthMiddleware.verifyAuth([AccountType.USER]).bind(AuthMiddleware),
  new MySofasBuilder().router,
);
app.use(
  // my/vehicles
  MyVehiclesBuilder.BASE_ROUTE,
  AuthMiddleware.verifyAuth([AccountType.USER]).bind(AuthMiddleware),
  new MyVehiclesBuilder().router,
);
app.use(
  // logout
  LogoutBuilder.BASE_ROUTE,
  AuthMiddleware.verifyAuth(Object.values(AccountType)).bind(AuthMiddleware),
  new LogoutBuilder().router,
);
app.use(
  // refresh
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

// Tasks
PurgeTask.instance.schedule();

// Server
app.listen(ConfigConstants.PORT, (): void => {
  LogHelper.progress(`Server listening on port ${ConfigConstants.PORT}...`);
});
