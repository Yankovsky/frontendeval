import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { FC } from 'react'
import styles from '../styles/home.module.css'
import { Problem, problems } from '../problems'

const Problem: FC<{ problem: Problem }> = ({ problem }) => {
  return <Link key={problem.path} href={problem.path}>
    <a className={styles.problem}>
      <h2>{problem.name}</h2>
      <p>{problem.about}</p>
    </a>
  </Link>
}

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Frontendeval solutions</title>
        <meta name="description" content="Frontendeval solutions by Yankovsky"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <h1>Frontendeval solutions by Yankovsky</h1>
      <article>
        <p>
          Solutions for problems listed at <a href="https://frontendeval.com/">frontendeval</a>
        </p>
        <p>
          Source code for this website and all of the solutions can be found at <a
          href="https://github.com/Yankovsky/frontendeval">Github</a>
        </p>
      </article>
      <nav className={styles.problems}>
        {problems.map(problem => <Problem key={problem.id} problem={problem}/>)}
      </nav>
    </>
  )
}

export default Home
