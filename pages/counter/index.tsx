import Head from 'next/head'
import Counter from '../../components/counter'

const CounterPage = () => {
  return <>
    <Head>
      <link rel="stylesheet" href="/counter.css"/>
    </Head>
    <Counter/>
  </>
}

export default CounterPage
