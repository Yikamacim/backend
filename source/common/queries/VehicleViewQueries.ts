export enum VehicleViewQueries {
  GET_VEHICLES_$ACID = `SELECT * FROM "VehicleView" WHERE "accountId" = $1`,

  GET_VEHICLE_$ACID_$VHID = `SELECT * FROM "VehicleView" WHERE "accountId" = $1 AND "vehicleId" = $2`,
}
