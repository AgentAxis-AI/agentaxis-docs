export async function getServerSideProps({ res, req }) {
  // Get the base URL from the request or environment variable
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `https://${req.headers.host}`
  
  // Import the meta data for pages
  const pages = Object.keys(require('./_meta.json'))
  
  // Filter out any hidden pages or special routes if needed
  const publicPages = pages.filter(page => !page.startsWith('_'))

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${['', ...publicPages].map(path => {
        // Clean the path (remove index, ensure proper formatting)
        const cleanPath = path.replace('index', '').replace(/\.mdx?$/, '')
        return `
          <url>
            <loc>${baseUrl}${cleanPath ? `/${cleanPath}` : ''}</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
            <changefreq>daily</changefreq>
            <priority>${path === '' ? '1.0' : '0.8'}</priority>
          </url>
        `
      }).join('')}
    </urlset>
  `.trim()

  // Set proper cache control headers
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=59')
  res.setHeader('Content-Type', 'text/xml')
  res.write(sitemap)
  res.end()

  return { props: {} }
}

export default function Sitemap() {
  return null
} 