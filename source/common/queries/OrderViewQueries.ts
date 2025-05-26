export enum OrderViewQueries {
  GET_ORDERS_$ACID = `SELECT * FROM "OrderView" WHERE "accountId" = $1`,

  GET_ORDER_$ORID = `SELECT * FROM "OrderView" WHERE "orderId" = $1`,
  GET_ORDER_$ACID_$ORID = `SELECT * FROM "OrderView" WHERE "accountId" = $1 AND "orderId" = $2`,
}
