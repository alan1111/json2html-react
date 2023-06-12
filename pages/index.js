import Head from 'next/head'
import { Radio, List } from 'zarm'

const routeMap = ['static', 'staticAction', 'dynamic', 'dynamicLinkage'];
export default function Home() {

  const onChange = (value) => {
    console.log('onChange', value);
    window.location.href = routeMap[value] || ''
  };

  return (
    <>
      <Head>
        <title>json2html</title>
        <meta name="description" content="用于将json渲染成页面，包含页面的动作action，组件之间的联动linkage。" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.jpeg" />
      </Head>
      <main>
        <List>
          <List.Item title="查看模版：">
            <Radio.Group type="button" onChange={onChange}>
              <Radio value="0">静态页面渲染</Radio>
              <Radio value="1">静态页面渲染 + action</Radio>
              <Radio value="2">动态页面渲染</Radio>
              <Radio value="3">动态页面渲染 + linkage</Radio>
            </Radio.Group>
          </List.Item>
        </List>
      </main>
    </>
  )
}
