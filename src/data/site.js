export const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Timeline', href: '/timeline' },
  { label: 'Photos', href: '/photos' },
]

export const externalLinks = {
  jetphotos: {
    label: 'JetPhotos',
    href: 'https://www.jetphotos.com/photographer/419967',
  },
}

export const siteProfile = {
  name: 'WANG TIANCHENG',
  mark: 'August',
  avatar: '/images/profile/august-headshot.jpg',
  education: {
    school: 'The Hong Kong Polytechnic University',
    program: 'Aeronautical and Aviation Engineering',
  },
  description:
    'A quiet place for notes, projects, photos, links, and longer records of work and life.',
}

export const blogPosts = [
  {
    slug: 'air-force-one-beijing',
    title: '在北京拍摄空军一号',
    date: '2026.5.13',
    location: '北京',
    category: 'Blog',
    image: '/images/blog/air-force-one-beijing.jpg',
    excerpt: '这是一行测试文字，记录在北京拍摄空军一号的经历。',
    body: '这是一行测试正文，记录在北京拍摄空军一号的经历。',
  },
  {
    slug: 'hkia-rescue-exercise',
    title: 'HKIA 年度救援演习',
    date: '2026.3.3',
    location: 'HKIA',
    category: 'Blog',
    image: '/images/blog/hkia-rescue-exercise.jpg',
    excerpt: '这是一行测试文字，记录 HKIA 年度救援演习。',
    body: '这是一行测试正文，记录 HKIA 年度救援演习。',
  },
  {
    slug: 'singapore-airshow',
    title: '新加坡航展',
    date: '2026.2.7',
    location: '新加坡',
    category: 'Blog',
    image: '/images/blog/singapore-airshow.jpg',
    excerpt: '这是一行测试文字，记录新加坡航展的所见。',
    body: '这是一行测试正文，记录新加坡航展的所见。',
  },
  {
    slug: 'taipei-trip',
    title: '台北之行',
    date: '2026.1.1',
    location: '台北',
    category: 'Blog',
    image: '/images/blog/taipei-trip.jpg',
    excerpt: '这是一行测试文字，记录新年第一天的台北之行。',
    body: '这是一行测试正文，记录新年第一天的台北之行。',
  },
  {
    slug: 'bangkok-trip',
    title: '曼谷之行',
    date: '2025.11.30',
    location: '曼谷',
    category: 'Blog',
    image: '/images/blog/bangkok-trip.jpg',
    excerpt: '这是一行测试文字，记录这次曼谷之行。',
    body: '这是一行测试正文，记录这次曼谷之行。',
  },
  {
    slug: 'lufthansa-a340-hkia',
    title: '在香港机场送别汉莎 A340',
    date: '2025.10.26',
    location: 'HKIA',
    category: 'Blog',
    image: '/images/blog/lufthansa-a340-hkia.jpg',
    excerpt: '这是一行测试文字，记录在香港机场送别汉莎 A340 的一天。',
    body: '这是一行测试正文，记录在香港机场送别汉莎 A340 的一天。',
  },
]

export const featuredPosts = blogPosts.slice(0, 2)

export const timelineItems = blogPosts.map((post) => ({
  date: post.date,
  location: post.location,
  href: `/blog/${post.slug}`,
}))
