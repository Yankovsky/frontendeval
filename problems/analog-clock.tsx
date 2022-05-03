import { FC, useEffect, useRef, useState } from 'react'

const useAnimationFrame = (callback: () => void) => {
  const savedCallback = useRef<() => void>()

  useEffect(() => {
    savedCallback.current = callback
  })

  useEffect(() => {
    let rafId: number
    const loop = () => {
      if (savedCallback.current) {
        savedCallback.current()
      }
      rafId = requestAnimationFrame(loop)
    }
    loop()
    return () => cancelAnimationFrame(rafId)
  }, [savedCallback])
}

const identity = <T, >(x: T) => x

const Clockface = () => {
  const numbers = Array(12).fill(0).map((_, i) => i)
  return <div className="clockface">
    {numbers.map(num => {
      const angle = Math.PI - num * (2 * Math.PI) / 12
      const style = {
        top: `${Math.cos(angle) * 42}%`,
        left: `${Math.sin(angle) * 42}%`,
        transform: `translate(-50%, -50%)`,
      }
      return <div key={num} className="num" style={style}>{num === 0 ? 12 : num}</div>
    })}
  </div>
}

type ClockProps = {
  shouldQuantize: boolean,
  timeZone: string | 'local',
}

const ClockHands: FC<ClockProps> = ({ shouldQuantize, timeZone }) => {
  const degrees = 360
  const [handsAngles, setHandsAngles] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  const getTimeZoneOffsetMs = (timeZone: string | 'local') => {
    const now = new Date()
    const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }))
    const tzDate = new Date(now.toLocaleString('en-US', { timeZone: timeZone === 'local' ? undefined : timeZone }))
    return (tzDate.getTime() - utcDate.getTime())
  }

  useAnimationFrame(() => {
    const nowMs = Date.now() + getTimeZoneOffsetMs(timeZone)
    const hours = nowMs % (1000 * 60 * 60 * 12) / 1000 / 60 / 60
    const minutes = hours % 1 * 60
    const seconds = minutes % 1 * 60
    const quantize = shouldQuantize ? Math.floor : identity

    setHandsAngles({
      hours: (quantize(hours) / 12) * degrees,
      minutes: (quantize(minutes) / 60) * degrees,
      seconds: (quantize(seconds) / 60) * degrees,
    })
  })

  return <>
    <div className="hand hours" style={{ transform: `rotate(${handsAngles.hours}deg)` }}/>
    <div className="hand minutes" style={{ transform: `rotate(${handsAngles.minutes}deg)` }}/>
    <div className="hand seconds" style={{ transform: `rotate(${handsAngles.seconds}deg)` }}/>
  </>
}

const Clock: FC<ClockProps> = ({ shouldQuantize, timeZone }) => {
  return <div>
    <h2>{timeZone}</h2>
    <div className="clock">
      <Clockface/>
      <ClockHands shouldQuantize={shouldQuantize} timeZone={timeZone}/>
      <div className='clock-center' />
    </div>
  </div>
}

const AnalogClock = () => {
  const [shouldQuantize, setShouldQuantize] = useState(false)

  return <main>
    <h1>Analog clock</h1>
    <label>
      <span>Quantize time:</span>
      <input type="checkbox" checked={shouldQuantize} onChange={() => setShouldQuantize(!shouldQuantize)}/>
    </label>
    <div className="clocks-container">
      <Clock shouldQuantize={shouldQuantize} timeZone="local"/>
      <Clock shouldQuantize={shouldQuantize} timeZone="Europe/Berlin"/>
      <Clock shouldQuantize={shouldQuantize} timeZone="America/New_York"/>
      <Clock shouldQuantize={shouldQuantize} timeZone="Australia/Eucla"/>
    </div>
  </main>
}

export default AnalogClock
