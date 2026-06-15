import Image from 'next/image'
import Layout from '@/components/Layout'

const facts = [
  {
    label: 'The Hong Kong Polytechnic University',
    inkLabel: '香港理工大学',
    href: 'https://www.polyu.edu.hk',
  },
  {
    label: 'Aeronautical and Aviation Engineering',
    inkLabel: '航空及民航工程',
    href: 'https://www.polyu.edu.hk/aae/',
  },
  {
    label: 'Aviation photography enthusiast',
    inkLabel: '好航影，亦好远游',
    href: 'https://www.jetphotos.com/photographer/419967',
  },
]

export default function About() {
  return (
    <Layout title="About">
      <section className="page-intro">
        <div className="page-intro-main">
          <p className="eyebrow theme-has-neon">
            <span className="theme-copy-classic">About</span>
            <span className="theme-copy-neon">IDENTITY NODE</span>
            <span className="theme-copy-ink">小传</span>
          </p>
          <h1 className="theme-has-neon">
            <span className="theme-copy-classic">About me</span>
            <span className="theme-copy-neon">AUGUST / PROFILE</span>
            <span className="theme-copy-ink">王天诚小记</span>
          </h1>
          <div className="page-intro-meta" aria-label="Profile summary">
            <span>
              <span className="theme-copy-classic">Student</span>
              <span className="theme-copy-ink">问学</span>
            </span>
            <span>
              <span className="theme-copy-classic">Aviation</span>
              <span className="theme-copy-ink">逐翼</span>
            </span>
            <span>
              <span className="theme-copy-classic">Photography</span>
              <span className="theme-copy-ink">摄景</span>
            </span>
          </div>
        </div>
        <div className="about-intro-side" aria-label="August portrait">
          <div className="about-intro-portrait">
            <Image
              src="/images/profile/august-headshot.jpg"
              alt="Portrait of August"
              width={132}
              height={132}
              priority
            />
          </div>
          <div className="page-intro-mark" aria-hidden="true">
            <span>01</span>
            <strong>
              <span className="theme-copy-classic">Profile</span>
              <span className="theme-copy-ink">其人</span>
            </strong>
          </div>
        </div>
      </section>

      <section className="about-content" aria-label="About August">
        <div className="about-facts panel">
          <p className="eyebrow theme-has-neon">
            <span className="theme-copy-classic">A few things</span>
            <span className="theme-copy-neon">QUICK DATA</span>
            <span className="theme-copy-ink">数语记之</span>
          </p>
          <ul>
            {facts.map((fact) => (
              <li key={fact.label}>
                <a href={fact.href} target="_blank" rel="noopener noreferrer">
                  <span className="theme-copy-classic">{fact.label}</span>
                  <span className="theme-copy-ink">{fact.inkLabel}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <section className="about-photos panel" aria-label="About snapshots">
          <div className="section-heading">
            <p className="eyebrow theme-has-neon">
              <span className="theme-copy-classic">Snapshots</span>
              <span className="theme-copy-neon">VISUAL LOG</span>
              <span className="theme-copy-ink">片影</span>
            </p>
            <h2 className="theme-has-neon">
              <span className="theme-copy-classic">Places I keep</span>
              <span className="theme-copy-neon">CAPTURED PLACES</span>
              <span className="theme-copy-ink">所至所藏</span>
            </h2>
          </div>
          <div className="about-photo-grid">
            <figure className="about-photo-card about-photo-wide">
              <Image
                src="/images/about/polyu-arrival.jpg"
                alt="August standing in front of The Hong Kong Polytechnic University sign"
                width={1706}
                height={1279}
              />
              <figcaption>
                <span className="theme-copy-classic">PolyU</span>
                <span className="theme-copy-ink">理大门前</span>
              </figcaption>
            </figure>
            <figure className="about-photo-card about-photo-tall">
              <Image
                src="/images/about/city-walk.jpg"
                alt="August walking through a city street with a backpack"
                width={1279}
                height={1706}
              />
              <figcaption>
                <span className="theme-copy-classic">On the road</span>
                <span className="theme-copy-ink">行于途中</span>
              </figcaption>
            </figure>
          </div>
        </section>

        <article className="about-story panel">
          <div className="section-heading">
            <p className="eyebrow theme-has-neon">
              <span className="theme-copy-classic">Short introduction</span>
              <span className="theme-copy-neon">BIO STREAM</span>
              <span className="theme-copy-ink">小序</span>
            </p>
            <h2 className="theme-has-neon">
              <span className="theme-copy-classic">Notes</span>
              <span className="theme-copy-neon">KEY SIGNALS</span>
              <span className="theme-copy-ink">自述</span>
            </h2>
          </div>

          <p className="theme-copy-classic">
            I am a first-year student studying Aeronautical and Aviation
            Engineering at The Hong Kong Polytechnic University. I am interested
            in aircraft, engineering, and the world around flight.
          </p>

          <p className="theme-copy-classic">
            I was born in Lanzhou, Gansu. When I was in Grade 4, I moved to
            Wuxi, Jiangsu, and later came to Hong Kong for university through
            the Gaokao. These places feel quite different from each other, and I
            think that has shaped how I notice small changes in a city.
          </p>

          <p className="theme-copy-classic">
            I started getting into aviation photography in 2024. I also enjoy
            road cycling, photography, travel, and plane spotting. Most of these
            interests are quiet ones: going somewhere, waiting, looking closely,
            and keeping a record of what passed by.
          </p>

          <p className="theme-copy-classic">
            This website is where I keep parts of that record: personal
            experiences, photos, projects, travel notes, and a few thoughts that
            I may want to return to later.
          </p>

          <div className="theme-copy-ink about-ink-prose">
            <p>
              王天诚者，兰州人也。幼迁无锡，后负笈香江，入香港理工大学，习航空及民航工程。
              性好观天，见铁鸟凌云，则心随其远。
            </p>
            <p>
              其来也，西北有河山之阔，江南有烟雨之柔，香江有海风之急。
              三地风物，各成胸中丘壑，故每过一城，必细察灯影、人声与云色。
            </p>
            <p>
              甲辰以来，始好航影。或候机坪之外，或立海风之中，待一机入镜，
              以快门留其一瞬。亦喜骑行、远游、摄影，皆取静中之趣。
            </p>
            <p>
              此站如案上一卷，收其行旅，藏其照片，记其工程与偶得之思。
              他日重展，愿仍见少年看云时之心。
            </p>
          </div>

          <div className="theme-copy-neon-block about-neon-prose">
            <p>ORIGIN: LANZHOU / WUXI / HONG KONG</p>
            <p>CURRENT: POLYU AAE / YEAR 01</p>
            <p>INTEREST: AIRCRAFT / CAMERA / ROAD / CITY</p>
            <p>ARCHIVE: TRAVEL LOGS + IMAGE SIGNALS + FLIGHT NOTES</p>
          </div>
        </article>
      </section>
    </Layout>
  )
}
