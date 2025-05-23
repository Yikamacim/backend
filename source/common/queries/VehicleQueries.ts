export enum VehicleQueries {
  INSERT_VEHICLE_RT_$ITID_$BRAND_$MODEL_$VHTP = `INSERT INTO "Vehicle" ("itemId", "brand", "model", "vehicleType") VALUES ($1, $2, $3, $4::"VehicleType") RETURNING *`,
  UPDATE_VEHICLE_RT_$CPID_$BRAND_$MODEL_$VHTP = `UPDATE "Vehicle" SET "brand" = $2, "model" = $3, "vehicleType" = $4::"VehicleType" WHERE "vehicleId" = $1 RETURNING *`,
}
