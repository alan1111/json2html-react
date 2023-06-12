import Head from 'next/head'
import styles from '@/styles/Home.module.css'

export default function Home() {
  return (
    <>
      <Head>
        <title>json2html</title>
        <meta name="description" content="用于将json渲染成页面，包含页面的动作action，组件之间的联动linkage。" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.jpeg" />
      </Head>
      <main className={styles.main}>
        test
      </main>
    </>
  )
}
