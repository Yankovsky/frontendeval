import { useCallback, useState } from 'react'

const debounce = (callback: (...args: any[]) => void, interval: number) => {
  if (typeof callback !== 'function') {
    throw new TypeError('callback should be a function')
  }
  if (interval < 0) {
    throw new RangeError('interval should be a number greater or equal to 0')
  }

  let timeoutId: NodeJS.Timeout | null = null
  return (...args: any[]) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      timeoutId = null
      callback(...args)
    }, interval)
  }
}

const Debounce = () => {
  const [clickCount, setClickCount] = useState(0)
  const [executedCount, setExecutedCount] = useState(0)
  const debouncedUpdate = useCallback(debounce(() => setExecutedCount(executedCount => executedCount + 1), 500), [])

  return <main>
    <h1>Debounce</h1>
    <div>Debounce delay 500ms</div>
    <div>Clicked count {clickCount}</div>
    <div>Executed count {executedCount}</div>
    <button onClick={() => {
      setClickCount(clickCount + 1)
      debouncedUpdate()
    }}>
      Execute
    </button>
  </main>
}

export default Debounce