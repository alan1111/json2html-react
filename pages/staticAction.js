import { useState, useEffect } from 'react';
import Head from 'next/head'
import components from '../utils/components'
import actions from '../utils/actions'
import { Json2Html, registerAction, registerComponent } from '../utils/core';
import data from '../examples/staticAction.json'

export default function StaticAction() {
  const [renderData, setRenderData] = useState(null);
  
  useEffect(() => {
    // 注册actions
    registerAction(actions)
    // 注册components
    registerComponent(components)
  }, [])

  useEffect(() => {
    // json数据由后端保存，这边用timeout模拟请求数据
    const timer = setTimeout(() => {
      setRenderData(data)
    }, 100)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  return (
    <>
      <Head>
        <title>json2html静态页面 + action渲染</title>
        <meta name="description" content="json2html静态页面 + action渲染" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.jpeg" />
      </Head>
      <main>
        {renderData && <Json2Html jsonObj={renderData}></Json2Html>}
      </main>
    </>
  )
}
