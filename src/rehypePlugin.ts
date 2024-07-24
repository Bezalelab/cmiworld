import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';
import urls from 'rehype-urls';

const transformUrl = (url: URL, node: any) => {
  if (node.tagName === 'img' && node.properties && node.properties.src) {
    const src = node.properties.src as string;
    if (src.includes('cmiworld.org')) {
      node.properties.src = src.replace('cmiworld.org', 'test.org');
    }
  }
};

export async function replaceImageUrlsInArticle(htmlContent: string): Promise<string> {
  return await unified()
    .use(rehypeParse)
    .use(urls, { transform: transformUrl })
    .use(rehypeStringify)
    .process(htmlContent)
    .then((file) => file.toString());
}
