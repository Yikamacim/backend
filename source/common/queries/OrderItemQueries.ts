export enum OrderItemQueries {
  GET_ORDER_ITEMS_$ORID = `SELECT * FROM "OrderItem" WHERE "orderId" = $1`,
}
