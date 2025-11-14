import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getUniqueCountries = (countries: any[]) => {
  const uniqueCountries: any[] = [];
  console.log(countries.map((country) => country.iso2));
  for (const country of countries) {
    const isCountryExist = uniqueCountries.some(
      (uniqueCountry) => uniqueCountry.iso2 === country.iso2,
    );

    if (!isCountryExist) {
      uniqueCountries.push(country);
    }
  }

  return uniqueCountries;
};

const getUniqueCities = (cities: any[]) => {
  const uniqueCities: any[] = [];

  for (const city of cities) {
    const isCityExist = uniqueCities.find(
      (uniqueCity) => uniqueCity.name === city.name,
    );

    if (!isCityExist) {
      uniqueCities.push(city);
    }
  }

  return uniqueCities;
};

async function main() {
  const countriesWithCitiesResponse = await fetch(
    "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/countries%2Bcities.json",
  );
  /**
   * response => [
   *  {
   *    name: "Afghanistan",
   *    iso2: "AF",
   *    cities: [
   *      {
   *        name: "Kabul",
   *      }
   *    ]
   *  }
   * ]
   */
  if (countriesWithCitiesResponse.ok) {
    const countriesWithCities = await countriesWithCitiesResponse.json();
    const countries = getUniqueCountries(countriesWithCities).map(
      (country: any) => ({
        name: country.name,
        countryCode: country.iso2,
      }),
    );

    //
    // const countriesBatch = await prisma.country.createMany({
    //   data: countries,
    // });

    // if (countriesBatch.count > 0) {
    const createdCountries = await prisma.country.findMany();
    for (const country of createdCountries) {
      const cities = countriesWithCities.find(
        (countryWithCities: any) =>
          countryWithCities.iso2 === country.countryCode,
      )?.cities;

      if (cities?.length) {
        await prisma.city.createMany({
          data: getUniqueCities(cities).map((city: any) => ({
            name: city.name,
            countryId: country.id,
          })),
        });
      }
    }
    // }
  }
}

main();
