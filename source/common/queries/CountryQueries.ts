export enum CountryQueries {
  GET_COUNTRIES = `SELECT * FROM "Country"`,

  GET_COUNTRY_$CNID = `SELECT * FROM "Country" WHERE "countryId" = $1`,
}
