import { writeFile, mkdir } from 'fs/promises';

// Функция для выполнения запроса к API
async function fetchAPI({ query }) {
  const response = await fetch('https://www.cmiworld.org/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });
  const data = await response.json();
  return data.data;
}

// Основная функция для получения постов и сохранения их в файл
async function getPostsAndSaveToFile() {
  const { posts } = await fetchAPI({
    query: `
			query BLOG {
					posts (first: 100) {
						nodes { slug 	title content date excerpt featuredImage {node { mediaItemUrl } } }
					}
				}
			`,
  });

  try {
    await mkdir('src/data', { recursive: true });
    await writeFile('src/data/data.json', JSON.stringify(posts.nodes, null, 2), 'utf8');
    console.log('Data has been saved successfully!');
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

getPostsAndSaveToFile();
