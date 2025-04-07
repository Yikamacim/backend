export enum AddressViewQueries {
  GET_ADDRESSES_$ACID = `SELECT * FROM "AddressView" WHERE "accountId" = $1`,

  GET_ADDRESS_$ADID = `SELECT * FROM "AddressView" WHERE "addressId" = $1`,
  GET_ADDRESS_$ACID_$ADID = `SELECT * FROM "AddressView" WHERE "accountId" = $1 AND "addressId" = $2`,
}
