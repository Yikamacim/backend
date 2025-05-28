export enum OrderItemQueries {
  GET_ORDER_ITEMS_$ORID = `SELECT * FROM "OrderItem" WHERE "orderId" = $1`,

  INSERT_ORDER_ITEM_$ORID_$ITID = `INSERT INTO "OrderItem" ("orderId", "itemId") VALUES ($1, $2)`,
}
