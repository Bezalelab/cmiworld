type MediaField = { node?: { mediaItemUrl?: string | null } | null } | null | undefined;

/**
 * Safely extract a WPGraphQL media URL from a `{ node: { mediaItemUrl } }` field.
 *
 * WPGraphQL returns `null` for image connections that have no media set (e.g. a
 * slider item or portrait with no image chosen in WordPress). Accessing
 * `field.node.mediaItemUrl` on such a field throws and — because the site is
 * `output: "static"` — kills the entire build. This helper returns `fallback`
 * (default `undefined`) instead, so a missing CMS image degrades gracefully.
 *
 * When the image IS present the returned URL is identical to the raw access,
 * so rendered output is unchanged.
 */
export function getMediaUrl(field: MediaField, fallback?: string): string | undefined {
	return field?.node?.mediaItemUrl ?? fallback;
}
