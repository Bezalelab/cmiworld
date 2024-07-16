import { writeFile, mkdir } from 'fs/promises';

// Функция для выполнения запроса к API
async function fetchAPI({ query }) {
  const response = await fetch('https://cmiworld.bezalelstudio.co/graphql', {
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
          posts(first: 200) {
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
                showOnMainPage
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
        countries (first: 200) {
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

  try {
    await mkdir('src/data', { recursive: true });
    await writeFile('src/data/data.json', JSON.stringify(posts.nodes, null, 2), 'utf8');
    await writeFile('src/data/countries.json', JSON.stringify(countries.nodes, null, 2), 'utf8');
    console.log('Data has been saved successfully!');
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

getPostsAndSaveToFile();
