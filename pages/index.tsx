import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'


const routes = [
  {
    name: 'Counter',
    path: '/counter',
    linkToTask: 'https://frontendeval.com/questions/countdown-timer',
    about: 'Create a countdown timer that notifies the user',
  },
  {
    name: 'Analog clock',
    path: '/analog-clock',
    linkToTask: 'https://frontendeval.com/questions/analog-clock',
    about: 'Create an analog clock with hour, minute, and second hands. Each of the hands should be accurate to the browser\'s local timezone and update once per second.',
  },
]


const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Frontendeval solutions</title>
        <meta name="description" content="Frontendeval solutions by Yankovsky"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <nav>
        {routes.map(route => (
          <Link key={route.path} href={route.path}>
            <a>{route.name}</a>
          </Link>
        ))}
      </nav>
      <div><a href="https://frontendeval.com/">https://frontendeval.com/</a></div>
    </>
  )
}

export default Home