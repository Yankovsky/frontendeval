import Head from 'next/head'
import Debounce from '../problems/debounce'

const DebouncePage = () => {
  return <>
    <link rel="stylesheet" href="debounce.css"/>
    <Head>
      <title>Debounce</title>
    </Head>
    <Debounce/>
  </>
}

export default DebouncePage
