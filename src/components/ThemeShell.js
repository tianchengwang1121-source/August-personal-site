import { createContext, useContext, useEffect, useState } from 'react'

export const homeThemes = [
  { id: 'classic', label: 'Classic', inkLabel: '素笺', note: 'quiet archive' },
  { id: 'neon', label: 'Neon', inkLabel: '星网', note: 'future signal' },
  { id: 'ink', label: 'Ink', inkLabel: '水墨', note: 'brush garden' },
]

const themeStorageKey = 'august-home-theme'
const ThemeContext = createContext('classic')

export function useTheme() {
  return useContext(ThemeContext)
}

export default function ThemeShell({ children }) {
  const [theme, setTheme] = useState('classic')
  const [pointer, setPointer] = useState({ x: 50, y: 34 })
  const [keyBursts, setKeyBursts] = useState([])
  const [inkMarks, setInkMarks] = useState([])

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(themeStorageKey)

    if (homeThemes.some((item) => item.id === storedTheme)) {
      setTheme(storedTheme)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(themeStorageKey, theme)
    document.documentElement.dataset.homeTheme = theme

    return () => {
      delete document.documentElement.dataset.homeTheme
    }
  }, [theme])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (theme === 'classic' || event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      const key =
        event.key.length === 1 ? event.key.toUpperCase() : event.key.replace('Arrow', '')
      const burst = {
        id: `${Date.now()}-${Math.random()}`,
        key: theme === 'ink' ? inkKeyFor(key) : key,
        x: 12 + Math.random() * 76,
        y: 14 + Math.random() * 62,
      }

      setKeyBursts((items) => [...items.slice(-12), burst])
      window.setTimeout(() => {
        setKeyBursts((items) => items.filter((item) => item.id !== burst.id))
      }, 1300)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [theme])

  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const nextPointer = {
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    }
    const viewportPointer = {
      x: (event.clientX / window.innerWidth) * 100,
      y: (event.clientY / window.innerHeight) * 100,
    }

    setPointer(nextPointer)

    if (theme !== 'ink') {
      return
    }

    const mark = {
      id: `${Date.now()}-${Math.random()}`,
      x: viewportPointer.x,
      y: viewportPointer.y,
      rotate: -24 + Math.random() * 48,
      scale: 0.72 + Math.random() * 0.72,
    }

    setInkMarks((items) => [...items.slice(-26), mark])
    window.setTimeout(() => {
      setInkMarks((items) => items.filter((item) => item.id !== mark.id))
    }, 2400)
  }

  return (
    <div
      className="theme-stage"
      data-home-theme={theme}
      onMouseMove={handlePointerMove}
      style={{
        '--cursor-x': `${pointer.x}%`,
        '--cursor-y': `${pointer.y}%`,
        '--tilt-x': `${(pointer.y - 50) * -0.035}deg`,
        '--tilt-y': `${(pointer.x - 50) * 0.035}deg`,
        '--drift-x': `${(pointer.x - 50) * 0.02}px`,
        '--drift-y': `${(pointer.y - 50) * 0.02}px`,
      }}
    >
      <ThemeContext.Provider value={theme}>
        <div className="theme-backdrop" aria-hidden="true">
          <span className="theme-orb theme-orb-one" />
          <span className="theme-orb theme-orb-two" />
          <span className="theme-calligraphy">王天诚</span>
          <span className="theme-scanline" />
          <span className="theme-cyberline theme-cyberline-one">AUGUST // HKG // FLIGHT LOG</span>
          <span className="theme-cyberline theme-cyberline-two">SIGNAL: PERSONAL ARCHIVE</span>
          <span className="theme-cyber-kanji">未来</span>
          <span className="theme-cyber-rain">0101 1100  AIRFRAME  CITYLIGHT  VECTOR  HORIZON</span>
        </div>

        <div className="theme-ink-trail" aria-hidden="true">
          {inkMarks.map((mark) => (
            <span
              className="theme-ink-mark"
              key={mark.id}
              style={{
                left: `${mark.x}%`,
                top: `${mark.y}%`,
                '--mark-rotate': `${mark.rotate}deg`,
                '--mark-scale': mark.scale,
              }}
            />
          ))}
        </div>

        <div className="theme-key-layer" aria-hidden="true">
          {keyBursts.map((burst) => (
            <span
              className="theme-key-burst"
              key={burst.id}
              style={{
                left: `${burst.x}%`,
                top: `${burst.y}%`,
              }}
            >
              {burst.key}
            </span>
          ))}
        </div>

        <section className="theme-console" aria-label="Theme selector">
          <div>
            <p className="eyebrow">{theme === 'ink' ? '风骨' : 'Visual mode'}</p>
            <strong>
              {theme === 'ink'
                ? homeThemes.find((item) => item.id === theme)?.inkLabel
                : homeThemes.find((item) => item.id === theme)?.label}
            </strong>
          </div>
          <div className="theme-switcher" role="group" aria-label="Choose theme">
            {homeThemes.map((item) => (
              <button
                type="button"
                key={item.id}
                className={theme === item.id ? 'theme-option is-active' : 'theme-option'}
                onClick={() => setTheme(item.id)}
                aria-pressed={theme === item.id}
                title={item.note}
              >
                <span>{theme === 'ink' ? item.inkLabel : item.label}</span>
              </button>
            ))}
          </div>
        </section>

        {children(theme)}
      </ThemeContext.Provider>
    </div>
  )
}

function inkKeyFor(key) {
  const inkKeys = {
    A: '山',
    B: '水',
    C: '云',
    D: '风',
    E: '月',
    F: '舟',
    G: '墨',
    H: '竹',
    I: '星',
    J: '江',
    K: '鹤',
    L: '兰',
    M: '松',
    N: '雪',
    O: '澜',
    P: '诗',
    Q: '青',
    R: '岚',
    S: '石',
    T: '天',
    U: '雨',
    V: '远',
    W: '王',
    X: '霄',
    Y: '雁',
    Z: '诚',
  }

  return inkKeys[key] || key
}
