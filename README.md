json2html-react主要功能是：用于将json渲染成页面，包含页面的动作action，组件之间的联动linkage。
## 使用说明

1. 下载json2html-react：
```bash
npm i -S json2html-react
# or
yarn add json2html-react
# or
pnpm i -S json2html-react
```
2. 引用：

```bash
import { useState, useEffect } from 'react';
import components from '../utils/components'
import actions from '../utils/actions'
import { RenderJSON, registerAction, registerComponent } from 'json2html-react';
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

  if (!renderData) {
    return null;
  }

  const options = {
    rootState: {}, // 非必须！页面自定义state，可用于联动判断，会注入到$globalState中。
    renderJson: renderData, // 必须！待渲染的json数据
    events: { //非必须！form组件绑定事件
      onChange: (k, v, form) => {
        console.log('表单变化的key:', k);
        console.log('表单变化的value:', v);
        console.log('表单form:', form);
      }
    }
  }

  return (<RenderJSON {...options} />)
}

```
## json数据结构字段说明：

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
  dataBind: String, // 固定配置，表示当前组件为表单组件，且对应表单元素的key值
  rules: Array, // 表单规则
  linkage: String, // 联动脚本，返回Object会以属性方式传入子组件；返回空则隐藏子组件。
  validateTrigger： String, // 当前组件校验时机，onChange | onBlur 等，默认onBlur，即失焦时候校验。
}
```

## 表单

目前所有关于表单form的内容，json2html都帮处理好了。会将form对象暴露给events和action。具体form属性了解，可参考[rc-form](https://www.npmjs.com/package/rc-form)

## 源码解读

推荐关注公众号："小火球烧屁股"。

嫌烦？不要紧。
直接上链接： [json2html-react 核心代码源码解读](https://mp.weixin.qq.com/s?__biz=MzkzMTQ1NDU4Nw==&mid=2247484271&idx=1&sn=f8230fba87efed9a997a7f53c1198508&chksm=c26b887bf51c016d7f6085fee855c69596932c6af8d2478362caa128df25350a353f74daa40c&token=1854349548&lang=zh_CN#rd)

## 例子🌰查看
1. clone项目：
```bash
git clone https://github.com/alan1111/json2html-react.git
```

2. 安装依赖： 
```bash
npm i
```

3. 启动应用：

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. 访问http://location:3000即可。

## 还有疑惑？

可以扫码进群，知无不言。

![交流群二维码](./qr.jpg)
