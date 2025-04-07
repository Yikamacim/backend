export enum ProvinceQueries {
  GET_PROVINCES_$CNID = `SELECT * FROM "Province" WHERE "countryId" = $1`,

  GET_PROVINCE_$PVID = `SELECT * FROM "Province" WHERE "provinceId" = $1`,
}
