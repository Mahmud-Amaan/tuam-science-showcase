# Performance Optimization Quick Reference

Quick guidelines for maintaining high performance when developing.

## 🎯 Core Principles

### 1. **Default to Server Components**
```tsx
// ✅ GOOD - Server Component (default)
export default async function Page() {
  const data = await fetchData()
  return <div>{data}</div>
}

// ❌ BAD - Unnecessary client component
"use client"
export default function Page() {
  return <div>Static content</div>
}
```

### 2. **Use Dynamic Imports for Heavy Components**
```tsx
// ✅ GOOD - Lazy load heavy components
import dynamic from 'next/dynamic'

const Chart = dynamic(() => import('./Chart'), {
  loading: () => <div>Loading chart...</div>,
  ssr: false // If component uses browser APIs
})

// ❌ BAD - Import heavy library at top
import Chart from './Chart'
```

### 3. **Optimize Images**
```tsx
// ✅ GOOD - Use Next.js Image component
import Image from 'next/image'

<Image 
  src="/hero.jpg" 
  width={1200} 
  height={600}
  alt="Hero"
  priority // For above-the-fold images
  placeholder="blur" // Optional blur-up effect
/>

// ❌ BAD - Regular img tag
<img src="/hero.jpg" alt="Hero" />
```

### 4. **Font Loading**
```tsx
// ✅ GOOD - Use next/font
import { Inter } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true
})

// ❌ BAD - External font link
<link href="https://fonts.googleapis.com/..." />
```

## 📦 Bundle Size Checklist

### Before Adding a New Dependency
1. Check package size: https://bundlephobia.com/
2. Look for lighter alternatives
3. Consider if you can build it yourself
4. Check if tree-shaking is supported

### Examples
```bash
# Check size before installing
npx bundle-size <package-name>

# Good choices (small bundles)
✅ date-fns (tree-shakeable)
✅ clsx (tiny)
✅ lucide-react (tree-shakeable)

# Avoid or lazy-load (large bundles)
⚠️  moment.js (use date-fns instead)
⚠️  lodash (use lodash-es for tree-shaking)
⚠️  chart.js (lazy load)
```

## ⚡ Component Patterns

### Heavy Libraries Pattern
```tsx
// Create a wrapper component with dynamic import
// components/ChartWrapper.tsx
'use client'
import dynamic from 'next/dynamic'

const Chart = dynamic(
  () => import('react-chartjs-2').then(mod => mod.Line),
  { ssr: false, loading: () => <Skeleton /> }
)

export default function ChartWrapper({ data }) {
  return <Chart data={data} />
}
```

### Code Splitting by Route
```tsx
// app/dashboard/page.tsx
import dynamic from 'next/dynamic'

// These only load when user visits /dashboard
const DashboardChart = dynamic(() => import('./DashboardChart'))
const DashboardTable = dynamic(() => import('./DashboardTable'))
```

### Conditional Loading
```tsx
// Only load when needed
const [showModal, setShowModal] = useState(false)

const Modal = useMemo(
  () => dynamic(() => import('./Modal')),
  []
)

{showModal && <Modal />}
```

## 🎨 CSS & Styling

### Tailwind Best Practices
```tsx
// ✅ GOOD - Use Tailwind classes
<div className="flex items-center gap-4 p-6">

// ❌ BAD - Inline styles (harder to optimize)
<div style={{ display: 'flex', alignItems: 'center' }}>
```

### CSS-in-JS Performance
```tsx
// ✅ GOOD - Static styles outside component
const styles = {
  container: 'bg-white rounded-lg shadow-md p-6'
}

export default function Component() {
  return <div className={styles.container} />
}

// ❌ BAD - Creating new objects every render
export default function Component() {
  return <div className={\`bg-white rounded-lg\`} />
}
```

## 🚀 Data Fetching

### Server-Side Fetching (Preferred)
```tsx
// ✅ GOOD - Fetch on server
export default async function Page() {
  const data = await fetch('https://api.example.com/data', {
    next: { revalidate: 3600 } // ISR
  })
  return <div>{data}</div>
}
```

### Client-Side Fetching (When Needed)
```tsx
// ✅ GOOD - Use SWR or React Query for caching
'use client'
import useSWR from 'swr'

export default function Component() {
  const { data } = useSWR('/api/data', fetcher)
  return <div>{data}</div>
}
```

## 🔍 Debugging Performance

### Quick Checks
```bash
# 1. Check bundle size
npm run analyze

# 2. Run Lighthouse
npx lighthouse http://localhost:3000

# 3. Check for hydration issues
# Open browser console and look for warnings
```

### Performance Monitoring in Dev
```tsx
// Add to any component
useEffect(() => {
  if (process.env.NODE_ENV === 'development') {
    import('@/lib/performance').then(({ logPerformanceMetrics }) => {
      logPerformanceMetrics()
    })
  }
}, [])
```

## 📊 Metrics to Watch

### Critical Metrics
- **FCP** (First Contentful Paint): < 1.8s
- **LCP** (Largest Contentful Paint): < 2.5s
- **CLS** (Cumulative Layout Shift): < 0.1
- **TTI** (Time to Interactive): < 3.8s

### How to Measure
1. **Chrome DevTools**: Lighthouse tab
2. **Vercel Analytics**: Automatic in production
3. **Web Vitals Extension**: Install from Chrome Web Store

## ⚠️ Common Pitfalls

### 1. Using "use client" Too Much
```tsx
// ❌ BAD
"use client"
export default function Page() {
  return <StaticContent />
}

// ✅ GOOD - Only mark interactive parts as client
export default function Page() {
  return (
    <>
      <StaticHeader />
      <ClientInteractiveSection />
    </>
  )
}
```

### 2. Not Lazy Loading Modals/Dialogs
```tsx
// ❌ BAD - Modal bundle loaded even when not open
import Modal from './Modal'

// ✅ GOOD - Only load when needed
const Modal = dynamic(() => import('./Modal'))
```

### 3. Loading All Icons Upfront
```tsx
// ❌ BAD
import * as Icons from 'lucide-react'

// ✅ GOOD - Import only what you need
import { Home, Settings, User } from 'lucide-react'
```

### 4. Not Using Next.js Image
```tsx
// ❌ BAD
<img src="/large-image.jpg" />

// ✅ GOOD
<Image src="/large-image.jpg" width={800} height={600} alt="" />
```

## 🎓 Learning Resources

- [Next.js Performance Docs](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web.dev - Core Web Vitals](https://web.dev/vitals/)
- [Bundle Phobia](https://bundlephobia.com/)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)

## 🛠️ Quick Commands

```bash
# Development with Turbopack (faster)
npm run dev:turbo

# Build and analyze bundle
npm run analyze

# Check for updates that might improve performance
npx npm-check-updates

# Run Lighthouse CI
npx lighthouse-ci
```

---

**Remember**: Premature optimization is the root of all evil, but measured optimization is the path to great UX! 🚀
