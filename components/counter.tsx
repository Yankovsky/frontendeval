import { FC, FormEvent, Fragment, InputHTMLAttributes, useEffect, useRef, useState } from 'react'

const useTitle = (title: string) => {
  useEffect(() => {
    document.title = title
  }, [title])
}

const parseMs = (ms: number) => {
  const totalSeconds = Math.ceil(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor(totalSeconds % 3600 / 60)
  const seconds = totalSeconds % 3600 % 60

  return [hours, minutes, seconds]
}

const limit = (min: number, max: number) => (value: number) => Math.max(Math.min(value, max), min)

type InputProps = Pick<InputHTMLAttributes<HTMLInputElement>, 'defaultValue' | 'name' | 'id' | 'placeholder'> & {
  label: string,
  min: number,
  max: number,
  onUpdate: (newValue: number) => void,
}

const Input: FC<InputProps> = ({ defaultValue, name, label, id, placeholder, min, max, onUpdate }) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const valueLimit = limit(min, max)

  const validateAndUpdate = () => {
    const inputField = inputRef.current
    if (inputField !== null) {
      const inputValue = inputField.value
      const inputValueAsNumber = Number(inputValue)
      if (inputValue.trim() === '' || Number.isNaN(inputValueAsNumber)) {
        onUpdate(0)
        inputField.value = ''
      } else {
        const validatedValue = valueLimit(inputValueAsNumber)
        onUpdate(validatedValue)
        inputField.value = String(validatedValue)
      }
    }
  }

  return <div>
    <label htmlFor={id}>{label}</label>
    <input ref={inputRef}
           defaultValue={defaultValue === 0 ? '' : defaultValue}
           placeholder={placeholder}
           name={name}
           id={id}
           type="tel"
           onBlur={validateAndUpdate}
    />
  </div>
}

type TimerFormProps = {
  timerStartMs: number,
  onStart: (timerValueMs: number) => void,
}

const TimerForm: FC<TimerFormProps> = ({ timerStartMs, onStart }) => {
  useTitle('Countdown timer')

  const [startHours, startMinutes, startSeconds] = parseMs(timerStartMs)

  const [hours, setHours] = useState(startHours)
  const [minutes, setMinutes] = useState(startMinutes)
  const [seconds, setSeconds] = useState(startSeconds)
  const [isSubmitted, setSubmitted] = useState(false)

  const start = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    for (const element of (e.currentTarget.elements as any)) {
      element.blur()
    }
    setSubmitted(true)
  }

  useEffect(() => {
    if (isSubmitted) {
      const timerValueMs = (3600 * hours + 60 * minutes + seconds) * 1000
      if (timerValueMs) {
        onStart(timerValueMs)
      } else {
        setSubmitted(false)
      }
    }
  }, [isSubmitted, hours, minutes, seconds, onStart])

  return <form className="container" onSubmit={start}>
    <div className="time-container">
      <Input
        defaultValue={hours}
        name="hours"
        id="hours"
        label="Hours"
        placeholder="HH"
        min={0}
        max={99}
        onUpdate={setHours}
      />
      <span>:</span>
      <Input
        defaultValue={minutes}
        name="minutes"
        id="minutes"
        label="Minutes"
        placeholder="MM"
        min={0}
        max={59}
        onUpdate={setMinutes}
      />
      <span>:</span>
      <Input
        defaultValue={seconds}
        name="seconds"
        id="seconds"
        label="Seconds"
        placeholder="SS"
        min={0}
        max={59}
        onUpdate={setSeconds}
      />
    </div>
    <button type="submit">Start</button>
  </form>
}

const useTimer = (callback: (ms: number) => void, delay: number | null) => {
  const savedCallback = useRef<(ms: number) => void>()
  const startMs = useRef(0)

  useEffect(() => {
    savedCallback.current = callback
  })

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    if (delay !== null) {
      startMs.current = performance.now()
      const loop = () => {
        const endMs = performance.now()
        if (savedCallback.current) {
          savedCallback.current(endMs - startMs.current)
        }
        startMs.current = endMs
        timeoutId = setTimeout(loop, delay)
      }
      loop()
    } else {
      if (savedCallback.current) {
        savedCallback.current(performance.now() - startMs.current)
      }
    }
    return () => clearTimeout(timeoutId)
  }, [delay])
}

const pad = (timeValue: number) => {
  return String(timeValue).padStart(2, '0')
}

const formatTime = (ms: number) => {
  return parseMs(ms).map(timePart => pad(timePart))
}

type TimerDisplayProps = {
  timerStartMs: number,
  onReset: () => void,
  onFinish: () => void,
}

const TimerDisplay: FC<TimerDisplayProps> = ({ timerStartMs, onReset, onFinish }) => {
  const ONE_SECOND = 1000

  const [delay, setDelay] = useState<number | null>(ONE_SECOND)
  const [isFinished, setFinished] = useState(false)
  const [msLeft, setMsLeft] = useState(timerStartMs)

  useTimer((elapsedMs: number) => {
    if (!isFinished) {
      const newCurrentMs = msLeft - elapsedMs
      if (newCurrentMs < 0) {
        setMsLeft(0)
        setDelay(null)
        setFinished(true)
        onFinish()
      } else {
        setMsLeft(newCurrentMs)
      }
    }
  }, delay)

  useTitle(msLeft ? formatTime(msLeft).join(':') : 'Countdown timer')

  const pause = () => setDelay(null)
  const resume = () => setDelay(ONE_SECOND)

  return <div className="container">
    <div className="time-container">
      {
        formatTime(msLeft).map((timePart, i) => (<Fragment key={i}>
          <span className="display-time-part">{timePart}</span>
          {i !== 2 && <span>:</span>}
        </Fragment>))
      }
    </div>
    {!isFinished && delay === null && <button type="button" onClick={resume}>Resume</button>}
    {!isFinished && delay !== null && <button type="button" onClick={pause}>Pause</button>}
    {isFinished && <span className="finished">Finished</span>}
    <button type="button" onClick={onReset}>Reset</button>
  </div>
}

const Timer = () => {
  const [isStarted, setStarted] = useState(false)
  const [timerStartMs, setTimerStartMs] = useState(0)

  const start = (startMs: number) => {
    if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission()
    }
    setStarted(true)
    setTimerStartMs(startMs)
  }

  const reset = () => {
    setStarted(false)
  }

  const notify = () => {
    setStarted(false)
    const message = 'Timer finished'
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(message)
    } else {
      alert('Timer finished')
    }
  }

  return <>
    {
      isStarted
        ? <TimerDisplay timerStartMs={timerStartMs} onReset={reset} onFinish={notify}/>
        : <TimerForm timerStartMs={timerStartMs} onStart={start}/>
    }
  </>
}

const Counter = () => {
  return <main>
    <h1>Countdown timer</h1>
    <Timer/>
  </main>
}

export default Counter
