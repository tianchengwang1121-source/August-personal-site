import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const siteSource = readFileSync(
  join(projectRoot, 'src/data/site.js'),
  'utf8'
)
const cssSource = readFileSync(
  join(projectRoot, 'src/styles/globals.css'),
  'utf8'
)

assert.ok(
  siteSource.includes("layout: 'arrival'"),
  'Singapore arrival section should use the wider arrival layout'
)

assert.ok(
  cssSource.includes('.blog-story-section--arrival .blog-image-grid'),
  'Singapore arrival layout should define wider gallery rules'
)

const expectedSingaporeText = [
  '落地新加坡，先来到Chinatown体验一下特色的南洋美食：福建炒面。随后去了新加坡国家博物馆，在这里，深入了解新加坡是如何从弹丸之地，发展成为一个具有世界影响力的港口城市，这里的开放、包容令我印象深刻。',
  '博物馆里有很多来参观的本地中小学生，我作为游客，也偷听了一些讲解员的讲述内容。令我惊讶的是，这里的每一个讲解员，都有广泛的知识积累，讲述的内容跨度广，且十分深刻，外加上全英的语言背景，不得不佩服新加坡基础教育的完善。',
  '前往NTU的途中，路过了组屋。作为新加坡出名的住房制度，80%的公民都住在组屋内，组屋制的成功，保障了新加坡的社会发展与经济稳定。对比香港的公屋，组屋保障了更多居民的住房问题，而香港的住房体系则更加割裂。',
]

for (const text of expectedSingaporeText) {
  assert.ok(
    siteSource.includes(text),
    `Singapore blog should include Markdown paragraph: ${text}`
  )
}

const expectedImages = [
  ['6.jpg', '博物馆里巨大的新加坡国旗🇸🇬'],
  ['7.jpg', '新加坡人在全球化中“Making Waves”'],
  ['8.jpg', '路过新加坡管理大学（比PolyU还要小😂）'],
  ['9.jpg', '组屋的小区内部'],
  ['10.jpg', '组屋内部的托管班，看上去干净整洁'],
]

for (const [fileName, caption] of expectedImages) {
  const publicImagePath = join(
    projectRoot,
    'public/images/blog/singapore-airshow',
    fileName
  )

  assert.ok(
    existsSync(publicImagePath),
    `Singapore blog image should be published: ${fileName}`
  )
  assert.ok(
    siteSource.includes(`/images/blog/singapore-airshow/${fileName}`),
    `Singapore blog should reference published image: ${fileName}`
  )
  assert.ok(
    siteSource.includes(caption),
    `Singapore blog should include caption: ${caption}`
  )
}
