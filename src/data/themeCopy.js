const themedPosts = {
  'air-force-one-beijing': {
    neon: {
      title: 'AF1 / BEIJING',
      location: 'BEIJING',
      displayLocation: 'BEIJING',
      category: 'AIR-SIGNAL',
      excerpt: 'BEIJING · AF1 · LONG LENS · WAIT WINDOW · SHUTTER LOCK',
      body: 'TARGET: AF1. CITY: BEIJING. MODE: WAIT / TRACK / CAPTURE. OUTPUT: ONE FRAME, NO REPLAY.',
    },
    ink: {
      title: '京华候翼',
      location: '京师',
      displayLocation: '京师',
      category: '航影',
      excerpt: '京华天阔，候一机自云际来。风定光明，快门一响，遂成片刻之记。',
      body:
        '是日候机于京华，先察云色，复量光影。铁翼未至，心已随风。及其入镜，不过须臾，而一瞬既定，遂可久藏。',
    },
  },
  'hkia-rescue-exercise': {
    neon: {
      title: 'HKIA / RESCUE DRILL',
      location: 'HKIA',
      displayLocation: 'HKIA',
      category: 'OPS-DRILL',
      excerpt: 'HKIA · RESCUE GRID · FIRE UNIT · MEDICAL UNIT · RUNWAY CONTROL',
      body: 'AIRPORT SAFETY STACK ONLINE. FIRE / MEDICAL / OPS / RUNWAY. DRILL DATA CAPTURED.',
    },
    ink: {
      title: '赤鱲角演救',
      location: '香江机场',
      displayLocation: '香江机场',
      category: '纪事',
      excerpt: '赤鱲角上，车马疾行，救援诸司各循其度，见机场安危之所系。',
      body:
        '机场之安，非一人一器所能成。是日观其演救，消防、医护、调度诸事并举，进退有序，始知巨港运行，皆赖细密章程。',
    },
  },
  'singapore-airshow': {
    neon: {
      title: 'SINGAPORE AIRSHOW',
      location: 'SINGAPORE',
      displayLocation: 'SINGAPORE',
      category: 'AIRSHOW',
      excerpt: 'FEB 06 · HKG NIGHT · PETER · AIRSHOW · SOUTHBOUND VECTOR',
      body: 'SINGAPORE AIRSHOW. HKG PRE-NIGHT. PETER TO TPE. EARLY FLIGHT. CITY ARRIVAL.',
      content: {
        titles: ['DEPARTURE NODE', 'ARRIVAL NODE'],
        texts: [
          'FEB 06 · HKG · PETER · AIRSHOW PREP · CAMERA READY',
          'LOW LOAD · SLEEP WINDOW · MALACCA STRAIT · SINGAPORE INBOUND',
          'CHINATOWN · FOOD SIGNAL · MUSEUM · CITY SYSTEM',
          'STUDENT GROUPS · GUIDE AUDIO · GLOBAL CITY MEMORY',
          'NTU ROUTE · HDB BLOCKS · PUBLIC HOUSING GRID',
        ],
      },
    },
    ink: {
      title: '星洲航展记',
      location: '星洲',
      displayLocation: '星洲',
      category: '游记',
      excerpt: '盼航展将近，前夜宿港，晓飞南洋。海峡云开，星洲在望。',
      body: '赴星洲观航展，前夕仍至香港机场候影。翌晨南飞，过马六甲海峡，云光开处，异国城市渐入眼帘。',
      content: {
        titles: ['启程', '初至星洲'],
        texts: [
          '盼航展久矣。二月六日前夕，仍循旧例至香港机场候影。友人 Peter 亦将远行，遂同在夜色中话别。',
          '客舱人稀，得片刻安眠。及醒，云下已是马六甲海峡，星洲之行由此展开。',
          '抵星洲，先入牛车水，尝福建炒面；继至国博，观弹丸之地如何成海上都会。',
          '馆中学子往来，讲员博闻而辞明。其城开放兼容，非一日之功。',
          '往南洋理工途中，过组屋成片。民居有序，亦可窥一城治生之法。',
        ],
      },
    },
  },
  'taipei-trip': {
    neon: {
      title: 'TAIPEI / DAY 001',
      location: 'TAIPEI',
      displayLocation: 'TAIPEI',
      category: 'CITY-LOG',
      excerpt: 'NEW YEAR · TAIPEI · STREET GRID · AIRPORT LINK · FIRST SIGNAL',
      body: 'YEAR START: TAIPEI. ROUTE: STREET / TERMINAL / WEATHER / SHORT STAY.',
    },
    ink: {
      title: '元日台北',
      location: '台北',
      displayLocation: '台北',
      category: '行旅',
      excerpt: '元日入台北，街雨微寒，城声初起，聊作新岁第一记。',
      body:
        '岁首至台北，风物清润。街巷、车声、机场短驻，皆不求奇，只记新年初日所见，留作一岁开卷。',
    },
  },
  'bangkok-trip': {
    neon: {
      title: 'BANGKOK / HEAT MAP',
      location: 'BANGKOK',
      displayLocation: 'BANGKOK',
      category: 'CITY-TRACE',
      excerpt: 'BANGKOK · HEAT · STREET DENSITY · SKYTRAIN · NIGHT COLOR',
      body: 'CITY INPUT: HEAT / TRAFFIC / TEMPLE / MALL / STREET. OUTPUT: MOVING COLOR.',
    },
    ink: {
      title: '曼谷行',
      location: '曼谷',
      displayLocation: '曼谷',
      category: '行旅',
      excerpt: '暹罗都城，暑气蒸腾。车流如织，灯火相衔，行人入其声色之间。',
      body:
        '曼谷者，热而繁，动而不息。街衢、高桥、寺宇、市肆交错成章。人在其间，随光影流转，记所见声色而已。',
    },
  },
  'lufthansa-a340-hkia': {
    neon: {
      title: 'LH A340 / HKIA',
      location: 'HKIA',
      displayLocation: 'HKIA',
      category: 'AIRFRAME',
      excerpt: 'HKIA · LUFTHANSA · A340 · FOUR ENGINES · FINAL FRAME',
      body: 'AIRFRAME: A340. ENGINE COUNT: 4. LOCATION: HKIA. STATUS: DEPARTURE MEMORY.',
    },
    ink: {
      title: '送汉莎四发',
      location: '香江机场',
      displayLocation: '香江机场',
      category: '航影',
      excerpt: '赤鱲角海风中，送汉莎 A340 离港。四发长机，渐成旧梦。',
      body:
        '汉莎 A340 起离香江，四发之声犹带旧日远航气。镜头所送，非独一机，亦是一代客机形影也。',
    },
  },
}

export function getThemedPost(post, theme) {
  if (theme === 'classic') {
    return post
  }

  const override = themedPosts[post.slug]?.[theme]

  if (!override) {
    return post
  }

  return {
    ...post,
    ...override,
    content: getThemedContent(post, override),
  }
}

function getThemedContent(post, override) {
  if (!post.content || !override.content) {
    return post.content
  }

  let textIndex = 0

  return post.content.map((section, sectionIndex) => ({
    ...section,
    title: override.content.titles?.[sectionIndex] || section.title,
    blocks: section.blocks.map((block) => {
      if (block.type !== 'paragraph' && block.type !== 'media') {
        return block
      }

      const nextText = override.content.texts?.[textIndex]
      textIndex += 1

      return nextText ? { ...block, text: nextText } : block
    }),
  }))
}
