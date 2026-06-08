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
            text: '在机场过夜，真的是很累很累。幸好，飞往新加坡的早班机上座率并不高，在机上美美地睡了一觉，睁眼便已经来到了马六甲海峡上空。我的新加坡🇸🇬之旅就要开始啦！',
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
            text: '落地新加坡，先来到Chinatown体验一下特色的南洋美食：福建炒面。随后去了新加坡国家博物馆，在这里，深入了解新加坡是如何从弹丸之地，发展成为一个具有世界影响力的港口城市，这里的开放、包容令我印象深刻。',
            image: {
              src: '/images/blog/singapore-airshow/5.jpg',
              alt: '福建炒面（7新币，中规中矩）',
              caption: '福建炒面（7新币，中规中矩）',
              width: 1200,
              height: 1600,
            },
          },
          {
            type: 'paragraph',
            text: '博物馆里有很多来参观的本地中小学生，我作为游客，也偷听了一些讲解员的讲述内容。令我惊讶的是，这里的每一个讲解员，都有广泛的知识积累，讲述的内容跨度广，且十分深刻，外加上全英的语言背景，不得不佩服新加坡基础教育的完善。',
          },
          {
            type: 'gallery',
            variant: 'compact',
            images: [
              {
                src: '/images/blog/singapore-airshow/6.jpg',
                alt: '博物馆里巨大的新加坡国旗🇸🇬',
                caption: '博物馆里巨大的新加坡国旗🇸🇬',
                width: 1200,
                height: 1600,
              },
              {
                src: '/images/blog/singapore-airshow/7.jpg',
                alt: '新加坡人在全球化中“Making Waves”',
                caption: '新加坡人在全球化中“Making Waves”',
                width: 1200,
                height: 1600,
              },
              {
                src: '/images/blog/singapore-airshow/8.jpg',
                alt: '路过新加坡管理大学（比PolyU还要小😂）',
                caption: '路过新加坡管理大学（比PolyU还要小😂）',
                width: 1200,
                height: 1600,
              },
            ],
          },
          {
            type: 'paragraph',
            text: '前往NTU的途中，路过了组屋。作为新加坡出名的住房制度，80%的公民都住在组屋内，组屋制的成功，保障了新加坡的社会发展与经济稳定。对比香港的公屋，组屋保障了更多居民的住房问题，而香港的住房体系则更加割裂。',
          },
          {
            type: 'gallery',
            variant: 'compact',
            images: [
              {
                src: '/images/blog/singapore-airshow/9.jpg',
                alt: '组屋的小区内部',
                caption: '组屋的小区内部',
                width: 1200,
                height: 1600,
              },
              {
                src: '/images/blog/singapore-airshow/10.jpg',
                alt: '组屋内部的托管班，看上去干净整洁',
                caption: '组屋内部的托管班，看上去干净整洁',
                width: 1200,
                height: 1600,
              },
            ],
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
