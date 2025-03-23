export enum CountryQueries {
  GET_COUNTRY_$CNID = `SELECT * FROM "Country" WHERE "countryId" = $1`,
  GET_COUNTRIES = `SELECT * FROM "Country"`,
}
