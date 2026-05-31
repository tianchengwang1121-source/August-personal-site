import Image from 'next/image'
import Layout from '@/components/Layout'

const facts = [
  {
    label: 'The Hong Kong Polytechnic University',
    href: 'https://www.polyu.edu.hk',
  },
  {
    label: 'Aeronautical and Aviation Engineering',
    href: 'https://www.polyu.edu.hk/aae/',
  },
  {
    label: 'Aviation photography enthusiast',
    href: 'https://www.jetphotos.com/photographer/419967',
  },
]

export default function About() {
  return (
    <Layout title="About">
      <section className="page-intro">
        <div className="page-intro-main">
          <p className="eyebrow">About</p>
          <h1>About me</h1>
          <div className="page-intro-meta" aria-label="Profile summary">
            <span>Student</span>
            <span>Aviation</span>
            <span>Photography</span>
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
            <strong>Profile</strong>
          </div>
        </div>
      </section>

      <section className="about-content" aria-label="About August">
        <div className="about-facts panel">
          <p className="eyebrow">A few things</p>
          <ul>
            {facts.map((fact) => (
              <li key={fact.label}>
                <a href={fact.href} target="_blank" rel="noopener noreferrer">
                  {fact.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <section className="about-photos panel" aria-label="About snapshots">
          <div className="section-heading">
            <p className="eyebrow">Snapshots</p>
            <h2>Places I keep</h2>
          </div>
          <div className="about-photo-grid">
            <figure className="about-photo-card about-photo-wide">
              <Image
                src="/images/about/polyu-arrival.jpg"
                alt="August standing in front of The Hong Kong Polytechnic University sign"
                width={1706}
                height={1279}
              />
              <figcaption>PolyU</figcaption>
            </figure>
            <figure className="about-photo-card about-photo-tall">
              <Image
                src="/images/about/city-walk.jpg"
                alt="August walking through a city street with a backpack"
                width={1279}
                height={1706}
              />
              <figcaption>On the road</figcaption>
            </figure>
          </div>
        </section>

        <article className="about-story panel">
          <div className="section-heading">
            <p className="eyebrow">Short introduction</p>
            <h2>Notes</h2>
          </div>

          <p>
            I am a first-year student studying Aeronautical and Aviation
            Engineering at The Hong Kong Polytechnic University. I am interested
            in aircraft, engineering, and the world around flight.
          </p>

          <p>
            I was born in Lanzhou, Gansu. When I was in Grade 4, I moved to
            Wuxi, Jiangsu, and later came to Hong Kong for university through
            the Gaokao. These places feel quite different from each other, and I
            think that has shaped how I notice small changes in a city.
          </p>

          <p>
            I started getting into aviation photography in 2024. I also enjoy
            road cycling, photography, travel, and plane spotting. Most of these
            interests are quiet ones: going somewhere, waiting, looking closely,
            and keeping a record of what passed by.
          </p>

          <p>
            This website is where I keep parts of that record: personal
            experiences, photos, projects, travel notes, and a few thoughts that
            I may want to return to later.
          </p>
        </article>
      </section>
    </Layout>
  )
}
