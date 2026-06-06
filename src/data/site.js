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
    displayLocation: 'Beijing',
    category: 'Blog',
    image: '/images/blog/air-force-one-beijing.jpg',
    excerpt: '这是一行测试文字，记录在北京拍摄空军一号的经历。',
    body: '这是一行测试正文，记录在北京拍摄空军一号的经历。',
    globe: {
      city: 'Beijing',
      region: 'China',
      lat: 39.9075,
      lng: 116.39723,
    },
  },
  {
    slug: 'hkia-rescue-exercise',
    title: 'HKIA 年度救援演习',
    date: '2026.3.3',
    location: 'HKIA',
    displayLocation: 'HKIA',
    category: 'Blog',
    image: '/images/blog/hkia-rescue-exercise.jpg',
    excerpt: '这是一行测试文字，记录 HKIA 年度救援演习。',
    body: '这是一行测试正文，记录 HKIA 年度救援演习。',
    globe: {
      city: 'Hong Kong',
      region: 'Hong Kong',
      lat: 22.27832,
      lng: 114.17469,
    },
  },
  {
    slug: 'singapore-airshow',
    title: 'Singapore Airshow',
    date: '2026.2.7',
    location: 'Singapore',
    displayLocation: 'Singapore',
    category: 'Blog',
    image: '/images/blog/singapore-airshow/cover.jpg',
    excerpt: '期待了近一个月的新加坡航展旅程，从凌晨的 HKG 出发，到落地后的第一眼南洋印象。',
    body: '期待了近一个月的新加坡航展旅程，从凌晨的 HKG 出发，到落地后的第一眼南洋印象。',
    tags: ['aviation', 'airshow', 'photography', 'travel'],
    globe: {
      city: 'Singapore',
      region: 'Singapore',
      lat: 1.352083,
      lng: 103.819836,
    },
    content: [
      {
        type: 'section',
        layout: 'departure',
        title: 'Departure',
        blocks: [
          {
            type: 'media',
            text: '期待了近一个月，新加坡航展终于要来啦。虽然是2月6号的飞机，但是依旧保留传统，提前一晚到达HKG进行航空摄影活动。很巧的是，好基友Peter也是明天的飞机，他前往台北旅行。',
            image: {
              src: '/images/blog/singapore-airshow/1.jpg',
              alt: '临走之前带个墨镜装酷哈哈哈',
              caption: '临走之前带个墨镜装酷哈哈哈',
              width: 1200,
              height: 1600,
            },
          },
          {
            type: 'gallery',
            variant: 'compact',
            images: [
              {
                src: '/images/blog/singapore-airshow/2.jpg',
                alt: '在凌晨的HKG合影！',
                caption: '在凌晨的HKG合影！',
                width: 1200,
                height: 1600,
              },
              {
                src: '/images/blog/singapore-airshow/3.jpg',
                alt: '独享三个座位',
                caption: '独享三个座位',
                width: 1200,
                height: 1600,
              },
            ],
          },
          {
            type: 'paragraph',
            text: '在机场过夜，对体能的消耗是巨大的。幸好，飞往新加坡的早班机上座率并不高，在机上美美地睡了一觉，睁眼便已经来到了马六甲海峡上空。我的新加坡之旅就要开始啦！',
          },
          {
            type: 'image',
            variant: 'medium',
            src: '/images/blog/singapore-airshow/4.jpg',
            alt: '俯瞰新加坡城区',
            caption: '俯瞰新加坡城区',
            width: 1200,
            height: 1600,
          },
        ],
      },
      {
        type: 'section',
        title: '新加坡初印象',
        blocks: [
          {
            type: 'media',
            text: '落地新加坡，先来到Chinatown体验一下特色的南洋美食，',
            image: {
              src: '/images/blog/singapore-airshow/5.jpg',
              alt: '福建炒面（7新币，中规中矩）',
              caption: '福建炒面（7新币，中规中矩）',
              width: 1200,
              height: 1600,
            },
          },
        ],
      },
    ],
  },
  {
    slug: 'taipei-trip',
    title: '台北之行',
    date: '2026.1.1',
    location: '台北',
    displayLocation: 'Taipei',
    category: 'Blog',
    image: '/images/blog/taipei-trip.jpg',
    excerpt: '这是一行测试文字，记录新年第一天的台北之行。',
    body: '这是一行测试正文，记录新年第一天的台北之行。',
    globe: {
      city: 'Taipei',
      region: 'Taiwan',
      lat: 25.05306,
      lng: 121.52639,
    },
  },
  {
    slug: 'bangkok-trip',
    title: '曼谷之行',
    date: '2025.11.30',
    location: '曼谷',
    displayLocation: 'Bangkok',
    category: 'Blog',
    image: '/images/blog/bangkok-trip.jpg',
    excerpt: '这是一行测试文字，记录这次曼谷之行。',
    body: '这是一行测试正文，记录这次曼谷之行。',
    globe: {
      city: 'Bangkok',
      region: 'Thailand',
      lat: 13.75398,
      lng: 100.50144,
    },
  },
  {
    slug: 'lufthansa-a340-hkia',
    title: '在香港机场送别汉莎 A340',
    date: '2025.10.26',
    location: 'HKIA',
    displayLocation: 'HKIA',
    category: 'Blog',
    image: '/images/blog/lufthansa-a340-hkia.jpg',
    excerpt: '这是一行测试文字，记录在香港机场送别汉莎 A340 的一天。',
    body: '这是一行测试正文，记录在香港机场送别汉莎 A340 的一天。',
    globe: {
      city: 'Hong Kong',
      region: 'Hong Kong',
      lat: 22.27832,
      lng: 114.17469,
    },
  },
]

export const featuredPosts = blogPosts.slice(0, 2)

export const timelineItems = blogPosts.map((post) => ({
  date: post.date,
  location: post.displayLocation || post.location,
  href: `/blog/${post.slug}`,
}))
