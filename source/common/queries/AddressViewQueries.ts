export enum AddressViewQueries {
  GET_ADDRESSES_$ACID_$ISDEL = `SELECT * FROM "AddressView" WHERE "accountId" = $1 AND "isDeleted" = $2`,

  GET_ADDRESS_$ADID_$ISDEL = `SELECT * FROM "AddressView" WHERE "addressId" = $1 AND "isDeleted" = $2`,
  GET_ADDRESS_$ACID_$ADID_$ISDEL = `SELECT * FROM "AddressView" WHERE "accountId" = $1 AND "addressId" = $2 AND "isDeleted" = $3`,
}
