// @flow
import { useRef, useEffect } from 'react'

// Inspired by https://overreacted.io/making-setinterval-declarative-with-react-hooks/
export function useInterval(callback: <T>(T) => void, delay: number) {
  const savedCallback = useRef()

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  })

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current()
      }
    }

    if (delay !== null) {
      const id = setInterval(tick, delay)

      return () => clearInterval(id)
    }
  }, [delay])
}

export default useInterval
