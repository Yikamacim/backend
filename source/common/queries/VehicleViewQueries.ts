export enum VehicleViewQueries {
  GET_VEHICLES_$ACID_$ISDEL = `SELECT * FROM "VehicleView" WHERE "accountId" = $1 AND "isDeleted" = $2`,

  GET_VEHICLE_$ITID = `SELECT * FROM "VehicleView" WHERE "itemId" = $1`,
  GET_VEHICLE_$ACID_$VHID = `SELECT * FROM "VehicleView" WHERE "accountId" = $1 AND "vehicleId" = $2`,
  GET_VEHICLE_$VHID_$ISDEL = `SELECT * FROM "VehicleView" WHERE "vehicleId" = $1 AND "isDeleted" = $2`,
  GET_VEHICLE_$ACID_$VHID_$ISDEL = `SELECT * FROM "VehicleView" WHERE "accountId" = $1 AND "vehicleId" = $2 AND "isDeleted" = $3`,
}
