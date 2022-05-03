import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { problems } from '../problems'
import Link from 'next/link'

const GITHUB_REPO_PROBLEMS_PATH = 'https://github.com/Yankovsky/frontendeval/tree/main/problems/'
const FRONTENDEVAL_QUESTIONS_PATH = 'https://frontendeval.com/questions/'

function MyApp({ Component, pageProps }: AppProps) {
  const {route} = useRouter()
  const currentProblem = problems.find(problem => problem.path === route)
  const problemId = currentProblem?.id


  if (problemId) {
    return <article>
      <p>
        <Link href='/'><a>← back to problems list</a></Link>
      </p>
      <p>
        <a href={FRONTENDEVAL_QUESTIONS_PATH + problemId}>Problem statement</a>
      </p>
      <p>
        <a href={`${GITHUB_REPO_PROBLEMS_PATH}${problemId}.tsx`}>Solution source code</a>
      </p>
      <Component {...pageProps} />
    </article>
  }
  return <Component {...pageProps} />
}

export default MyApp
