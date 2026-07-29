import { writeFile, mkdir } from 'fs/promises';

// This runs under plain node (see the "build" script), not through Astro,
// so it reads process.env rather than import.meta.env. Keep the default in
// sync with src/lib/wp.ts.
const WP_URL = (process.env.PUBLIC_WP_URL || 'https://cms.cmiworld.org').replace(/\/+$/, '');

// Функция для выполнения запроса к API
async function fetchAPI({ query }) {
  const response = await fetch(`${WP_URL}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });
  const data = await response.json();
  return data.data;
}

async function getPostsAndSaveToFile() {
  const { posts } = await fetchAPI({
    query: `
			query BLOG {
          posts(first: 1000) {
            nodes {
              slug
              title
              content
              date
              excerpt
              featuredImage {
                node {
                  mediaItemUrl
                }
              }
              posts {
                location
              }
            }
          }
        }
			`,
  });

  const { countries } = await fetchAPI({
    query: `
			query COUNTRIES {
        countries (first: 1000) {
          nodes {
            title slug 
            featuredImage {
              node {
                mediaItemUrl
              }
            }
            countryContent { city content description caption numberOfCities numberOfChurces codeLang
              images {
                nodes {
                  mediaItemUrl
                }
              }
            }
          }
        }
      }
			`,
  });

  const generals = await fetchAPI({
    query: `
        query generals {
          page(id: "general", idType: URI) {
          mainSettings {
            upcomingYear
          }
        }
      }
			`,
  });

  try {
    await mkdir('src/data', { recursive: true });
    await writeFile('src/data/data.json', JSON.stringify(posts.nodes, null, 2), 'utf8');
    await writeFile('src/data/countries.json', JSON.stringify(countries.nodes, null, 2), 'utf8');
    await writeFile('src/data/generals.json', JSON.stringify(generals.page.mainSettings), 'utf8');
    console.log('Data has been saved successfully!');
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

getPostsAndSaveToFile();
