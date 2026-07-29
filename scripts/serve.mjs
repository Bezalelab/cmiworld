/**
 * Static file server for the built site (dist/).
 *
 * Why this exists instead of `astro preview`:
 *
 * Vite 5.4.21 (which Astro 4.16.19 depends on) rejects requests whose Host
 * header it does not recognise, as DNS-rebinding protection:
 *
 *   Blocked request. This host ("...up.railway.app") is not allowed.
 *   To allow this host, add "..." to `preview.allowedHosts` in vite.config.js.
 *
 * That option cannot be reached from astro.config.mjs — Astro 4.16.19 does
 * not forward `vite.preview` to the preview server, so even
 * `allowedHosts: true` still returns 403. Astro also documents `preview` as
 * a local development aid, not a production server.
 *
 * The site is fully static (no `output` set, so Astro defaults to static),
 * so serving dist/ directly is simpler and more correct.
 *
 * Plain Node with no dependencies: nothing to add to package.json, so the
 * lockfile is untouched.
 */

import { createServer } from 'node:http'
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { join, normalize, extname, resolve as resolvePath } from 'node:path'

const ROOT = resolvePath('dist')
const PORT = Number(process.env.PORT || 4321)

const TYPES = {
	'.html': 'text/html; charset=utf-8',
	'.css': 'text/css; charset=utf-8',
	'.js': 'text/javascript; charset=utf-8',
	'.mjs': 'text/javascript; charset=utf-8',
	'.json': 'application/json; charset=utf-8',
	'.xml': 'application/xml; charset=utf-8',
	'.txt': 'text/plain; charset=utf-8',
	'.svg': 'image/svg+xml',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.gif': 'image/gif',
	'.webp': 'image/webp',
	'.avif': 'image/avif',
	'.ico': 'image/x-icon',
	'.woff': 'font/woff',
	'.woff2': 'font/woff2',
	'.ttf': 'font/ttf',
	'.mp4': 'video/mp4',
	'.mov': 'video/quicktime',
	'.pdf': 'application/pdf',
}

/** Resolve a URL path to a real file inside ROOT, or null. */
async function resolveFile(pathname) {
	let rel
	try {
		rel = decodeURIComponent(pathname)
	} catch {
		return null // malformed percent-encoding
	}

	// Collapse any ".." before joining, then verify the result is still inside
	// ROOT. Belt and braces against path traversal.
	const base = join(ROOT, normalize(rel))
	if (base !== ROOT && !base.startsWith(ROOT + '/')) return null

	// Astro's default build.format is "directory", so /blog lives at
	// dist/blog/index.html. Try the exact path first, then as a directory.
	const candidates = rel.endsWith('/')
		? [join(base, 'index.html')]
		: [base, join(base, 'index.html')]

	for (const c of candidates) {
		try {
			if ((await stat(c)).isFile()) return c
		} catch {
			// missing; try next
		}
	}
	return null
}

function send(res, status, file, pathname) {
	// Astro fingerprints assets under /_astro/, so those are immutable.
	// Everything else must revalidate or a redeploy keeps serving stale HTML.
	const cache =
		pathname && pathname.startsWith('/_astro/')
			? 'public, max-age=31536000, immutable'
			: 'public, max-age=0, must-revalidate'

	res.writeHead(status, {
		'Content-Type': TYPES[extname(file).toLowerCase()] || 'application/octet-stream',
		'Cache-Control': cache,
	})
	createReadStream(file).pipe(res)
}

const server = createServer(async (req, res) => {
	try {
		const pathname = new URL(req.url, 'http://localhost').pathname
		const file = await resolveFile(pathname)

		if (file) return send(res, 200, file, pathname)

		const notFound = await resolveFile('/404.html')
		if (notFound) return send(res, 404, notFound, null)

		res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
		res.end('Not Found\n')
	} catch (err) {
		console.error('request failed:', err)
		if (!res.headersSent) {
			res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
		}
		res.end('Internal Server Error\n')
	}
})

server.listen(PORT, '0.0.0.0', () => {
	console.log(`serving ${ROOT} on http://0.0.0.0:${PORT}`)
})

// Railway sends SIGTERM on redeploy; exit cleanly so it does not wait.
for (const sig of ['SIGTERM', 'SIGINT']) {
	process.on(sig, () => server.close(() => process.exit(0)))
}
