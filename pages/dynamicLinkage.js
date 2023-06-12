import { useState, useEffect } from 'react';
import Form from 'react-form-validates';
import Head from 'next/head'
import components from '../utils/components'
import actions from '../utils/actions'
import { Json2Html, registerAction, registerComponent } from '../utils/core';
import data from '../examples/dynamicLinkage.json'

const createForm = Form.create;
const FormItem = Form.Item;
export default createForm()(function DynamicLinkage(props) {
  const [renderData, setRenderData] = useState(null);
  
  const { form } = props

  // 注册页面私有的action
  useEffect(() => {
    registerAction({
      onSubmit: (d) => {
        console.log('json数据：', d);
        const val = form.getFieldsValue();
        console.log('表单数据：', val);
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

  const globalData = {
    form, // 解析器使用
    FormItem, // 解析器使用
    events: { // form组件绑定事件
      onChange: (k, el) => {
        console.log('表单变化的key:', k);
        console.log('表单变化的value:', el.target.value);
      }
    }
  }

  return (
    <>
      <Head>
        <title>json2html静态页面 + linkage渲染</title>
        <meta name="description" content="json2html动态页面 + linkage渲染" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.jpeg" />
      </Head>
      <main>
        {renderData && <Json2Html jsonObj={renderData} globalData={globalData}></Json2Html>}
      </main>
    </>
  )
})
