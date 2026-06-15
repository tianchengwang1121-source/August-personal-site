import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { externalLinks, navItems, siteProfile } from '@/data/site'

const inkNavLabels = {
  Home: '归卷',
  About: '其人',
  Blog: '札记',
  Timeline: '行年',
  Photos: '影集',
}

export default function Navbar({ theme = 'classic' }) {
  const router = useRouter()
  const isInk = theme === 'ink'

  return (
    <header className="site-header">
      <Link href="/about" className="site-mark" aria-label="About August">
        <span>{isInk ? '王天诚' : siteProfile.mark}</span>
        <Image
          className="site-mark-avatar"
          src={siteProfile.avatar}
          alt=""
          width={28}
          height={28}
          priority
        />
      </Link>
      <nav className="site-nav" aria-label="Primary navigation">
        {navItems.map((item) => {
          const isActive =
            item.href === '/'
              ? router.pathname === '/'
              : router.pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={isActive ? 'nav-link active' : 'nav-link'}
            >
              {isInk ? inkNavLabels[item.label] || item.label : item.label}
            </Link>
          )
        })}
        <a
          className="nav-link nav-external"
          href={externalLinks.jetphotos.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="jetphotos-icon" aria-hidden="true" />
          {isInk ? '航影' : externalLinks.jetphotos.label}
        </a>
      </nav>
    </header>
  )
}
