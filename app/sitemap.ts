import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tuam-science.vercel.app'
  const currentDate = new Date()

  // Main pages
  const routes = [
    '',
    '/physics',
    '/chemistry',
    '/biology',
    '/math',
    '/ict',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.9,
  }))

  // Subject pages
  const subjectPages = [
    // Biology
    '/biology/cells',
    '/biology/genetics',
    '/biology/ecology',
    '/biology/anatomy',
    '/biology/cells/animal-cell',
    '/biology/cells/plant-cell',
    '/biology/cells/eukaryotic-cell',
    '/biology/cells/nucleus',
    '/biology/cells/mitochondria',
    '/biology/cells/chloroplast',
    
    // Chemistry
    '/chemistry/atoms',
    '/chemistry/molecules',
    '/chemistry/periodic-table',
    '/chemistry/ph-scale',
    '/chemistry/states',
    
    // Math
    '/math/graphs',
    '/math/vector',
    '/math/trigonometry',
    
    // ICT
    '/ict/programming',
    '/ict/computer-hardware',
    '/ict/circuit-construction',
    '/ict/logic-gates',
    '/ict/ai',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...routes, ...subjectPages]
}
