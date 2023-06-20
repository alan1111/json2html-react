这是一个[Next.js](https://nextjs.org/)项目，可以用[`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app)生成项目。
主要功能是：用于将json渲染成页面，包含页面的动作action，组件之间的联动linkage。
## 使用说明

1. 启动应用：

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```
2. 组件引用说明：
```bash
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
  const [renderData, setRenderData] = useState(null); // 待渲染的数据，由后端返回
  
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
    // 注册公共动作actions
    registerAction(actions)
    // 注册公共组件components
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

  // 非表单页面，可不传globalData
  const globalData = {
    form, // 解析器core.js使用, 公共action内部如需获取表单状态，也可以使用。
    FormItem, // 解析器core.js使用
    events: { // form组件绑定事件，onChange, onBlur等
      onChange: (k, el) => {
        console.log('表单变化的key:', k);
        console.log('表单变化的value:', el.target.value);
      }
    }
  }

  return (
    <Json2Html jsonObj={renderData} globalData={globalData}></Json2Html>
  )
})

```

3. json数据结构字段说明：
```bash
{
  // 常规属性
  widget: String, // 用于作组件映射
  jChildren: Array | Object, // 用于渲染子组件
  jProps: Object, // 子组件属性透传
  action: Array | Object, // 用于给组件绑定onClick事件
    {
      type: String, // 用于action映射
      data: Any, // 作为传入action数据
    }
  
  // 表单属性
  needFormItem: true, // 固定配置，表示当前组件为表单组件
  rules: Array, // 表单规则
  linkage: String, // 联动脚本，返回Object会以属性方式传入子组件；返回空则隐藏子组件。
  validateTrigger： String, // 当前组件校验时机，onChange | onBlur 等
}
```

## 表单组件

目前测试用例强依赖于组件库：react-form-validates，大家可按需选择。

## 源码解读

推荐关注公众号："小火球烧屁股"。

嫌烦？不要紧。
直接上链接： [json2html-react 核心代码源码解读](https://mp.weixin.qq.com/s?__biz=MzkzMTQ1NDU4Nw==&mid=2247484271&idx=1&sn=f8230fba87efed9a997a7f53c1198508&chksm=c26b887bf51c016d7f6085fee855c69596932c6af8d2478362caa128df25350a353f74daa40c&token=1854349548&lang=zh_CN#rd)

## 还有疑惑？

可以扫码进群，知无不言。

![交流群二维码](./qr.jpg)
