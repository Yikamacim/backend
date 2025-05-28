export enum OrderQueries {
  INSERT_ORDER_RT_$SVID_$ADID_$ACID = `INSERT INTO "Order" ("serviceId", "addressId", "accountId") VALUES ($1, $2, $3) RETURNING *`,
  UPDATE_ORDER_RT_$ORID_$STATE = `UPDATE "Order" SET "orderState" = $2::OrderState, "updatedAt" = NOW() WHERE "orderId" = $1 RETURNING *`,
  UPDATE_ORDER_RT_$ORID_$STATE_$PRICE = `UPDATE "Order" SET "orderState" = $2::OrderState, "price" = $3, "updatedAt" = NOW() WHERE "orderId" = $1 RETURNING *`,
  UPDATE_ORDER_$ORID = `UPDATE "Order" SET "updatedAt" = NOW() WHERE "orderId" = $1`,
}
