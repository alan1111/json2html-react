import { useState, useEffect } from 'react';
import Head from 'next/head'
import components from '../utils/components'
import actions from '../utils/actions'
import { RenderJSON, registerAction, registerComponent } from '../utils/main';
import data from '../examples/mock.json'

export default function DynamicLinkage() {
  const [renderData, setRenderData] = useState(null);

  // 注册页面私有的action
  useEffect(() => {
    registerAction({
      onSubmit: (d, {form}) => {
        console.log('json数据：', d);
        form.validateFieldsAndScroll((error, value) => {
          if (error) {
            console.log('表单出错了：', error);
            return;
          }
          console.log('表单值：', value)
        })
      },
    });
  }, []);

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

  const options = {
    rootState: {}, // 页面自定义state，可用于联动判断，会注入到$globalState中。
    renderJson: renderData, // 待渲染的json数据
    events: { // form组件绑定事件
      onChange: (k, v, form) => {
        console.log('表单变化的key:', k);
        console.log('表单变化的value:', v);
        console.log('表单form:', form);
      }
    }
  }

  return (
    <>
      <Head>
        <title>json2html渲染</title>
        <meta name="description" content="json2html渲染" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.jpeg" />
      </Head>
      <main>
        {renderData && <RenderJSON {...options}></RenderJSON>}
      </main>
    </>
  )
}
