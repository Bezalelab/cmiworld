/**
 * Base URL of the headless WordPress CMS.
 *
 * Single source of truth. The CMS host used to be hardcoded in three
 * places (src/lib/api.ts, src/utils/export-data.js and the client-side
 * image fixup in src/pages/blog/[slug].astro), which meant moving the
 * CMS required a code change and a deploy.
 *
 * Override per environment with the PUBLIC_WP_URL variable — no trailing
 * slash. The default is the production CMS hostname, so production needs
 * no variable set at all.
 *
 * NOTE: this is NOT the host used by src/components/Join.tsx. That talks
 * to cmiauto.bezalelstudio.co, a separate email-automation service, and
 * is deliberately unrelated to the CMS.
 */
export const WP_URL = (
	import.meta.env.PUBLIC_WP_URL || 'https://cms.cmiworld.org'
).replace(/\/+$/, '')

export const WP_GRAPHQL = `${WP_URL}/graphql`
