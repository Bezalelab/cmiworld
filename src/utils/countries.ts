export const countries = [
  { city: 'pl', top: 52.5, right: 47 },
  { city: 'cz', top: 58.5, right: 52 },
  { city: 'sk', top: 61, right: 46 },
  { city: 'hu', top: 65.5, right: 46 },
  { city: 'ro', top: 68, right: 38 },
  { city: 'si', top: 68, right: 52 },
  { city: 'hr', top: 68.7, right: 49 },
  { city: 'ba', top: 72.2, right: 47.5 },
  { city: 'rs', top: 72.2, right: 43 },
  { city: 'bg', top: 76, right: 37 },
  { city: 'al', top: 80, right: 43.5 },
]

export const TestCountries = (jsonData) => {
  return countries.map((country) => {
    const matchingJsonItem = jsonData.find((item) => item.countryContent.codeLang === country.city)
    if (matchingJsonItem) {
      return {
        ...country,
        name: `${matchingJsonItem.title}, ${matchingJsonItem.countryContent.city}`,
        countCity: matchingJsonItem.countryContent.numberOfCities,
        countChurches: matchingJsonItem.countryContent.numberOfChurces,
        countryContent: matchingJsonItem.countryContent,
        slug: matchingJsonItem.slug
      }
    }
    return country
  })
}
