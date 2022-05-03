import AnalogClock from '../problems/analog-clock'
import Head from 'next/head'

const AnalogClockPage = () => {
  return <>
    <Head>
      <title>Analog clock</title>
    </Head>
    <link rel="stylesheet" href="analog-clock.css"/>
    <AnalogClock/>
  </>
}

export default AnalogClockPage
