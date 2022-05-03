export type Problem = {
  name: string,
  path: string,
  id: string,
  about: string,
}

export const problems: Problem[] = [
  {
    name: 'Countdown timer',
    path: '/counter',
    id: 'countdown-timer',
    about: 'Create a countdown timer that notifies the user',
  },
  {
    name: 'Analog clock',
    path: '/analog-clock',
    id: 'analog-clock',
    about: 'Create an analog clock with hour, minute, and second hands',
  },
  {
    name: 'Debounce',
    path: '/debounce',
    id: 'debounce',
    about: 'Implement a barebones debounce function',
  },
]