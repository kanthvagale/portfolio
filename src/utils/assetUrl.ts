// Files in public/ are served under the site's base path (/portfolio/ on
// GitHub Pages), so prefix them with it.
export function assetUrl(path: string) {
  return `${import.meta.env.BASE_URL}${path}`;
}
