export enum OrderViewQueries {
  GET_ORDERS_$ACID = `SELECT * FROM "OrderView" WHERE "accountId" = $1`,
  GET_ORDERS_$BSID = `SELECT * FROM "OrderView" WHERE "businessId" = $1`,

  GET_ORDER_$ORID = `SELECT * FROM "OrderView" WHERE "orderId" = $1`,
  GET_ORDER_$ACID_$ORID = `SELECT * FROM "OrderView" WHERE "accountId" = $1 AND "orderId" = $2`,
  GET_ORDER_$BSID_$ORID = `SELECT * FROM "OrderView" WHERE "businessId" = $1 AND "orderId" = $2`,
}
