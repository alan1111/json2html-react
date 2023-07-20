## Document
[EN](https://github.com/alan1111/json2html-react/blob/main/README.md)｜[CN](https://github.com/alan1111/json2html-react/blob/main/README_CN.md)

## Introduction
The main function of json2html-react is to render JSON into a page, including page action and linkage between components.
## Instructions for use

1. Download json2html-react：
```bash
npm i -S json2html-react
# or
yarn add json2html-react
# or
pnpm i -S json2html-react
```
2. Reference:

```bash
import { useState, useEffect } from 'react';
import components from '../utils/components'
import actions from '../utils/actions'
import { RenderJSON, registerAction, registerComponent } from 'json2html-react';
import data from '../examples/mock.json'

export default function DynamicLinkage() {
  const [renderData, setRenderData] = useState(null);

  // Register customized actions
  useEffect(() => {
    registerAction({
      onSubmit: async (d, {form}) => {
        console.log('json data：', d);
        try {
          const values = await form.validateFields();
          console.log('form values', values);
        } catch (errorList) {
          errorList.forEach(({ name, errors }) => {
            // Do something...
          });
        }
      },
    });
  }, []);

  useEffect(() => {
    // Register common actions
    registerAction(actions)
    // Register common components
    registerComponent(components)
  }, [])

  useEffect(() => {
    // JSON data is saved by the backend, there is mock by timeout function.
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
    renderJson: renderData, // Required！JSON data to be rendered.

    initialValues: {}, // Not required! Initialize the form values.
    events: { // Not required! There is form components binding events.
      onChange: (v, opt) => {
        const {form, pathName}  = opt || {};
        console.log('form key:', pathName);
        console.log('form value:', v);
        console.log('form:', form);
        console.log('get form vaue by pathName: ', form.getFieldValue(pathName));
      }
    }
  }

  return (<RenderJSON {...options} />)
}

```
## JSON data structure descriptions:

```bash
{
  // normal properties
  widget: String, // for component mapping.
  jChildren: Array | Object, // the children components.
  jProps: Object, // the props to the component.
  action: Array | Object, // bind onClick event to the component.
    {
      type: String, // for action mapping.
      data: Any, // data to the action.
    }
  
  // form properties
  dataBind: String, // The corresponding form key of the current component, which is also a part of the path.
  isFormField: Boolean // When it is true, it indicates that the current component is a form component.
  rules: Array, // form rules.
  linkage: String, // Linkage script, returning Object will be passed in the component; If empty, hide the component.
  validateTrigger： String, // The current component verification time, onChange | onBlur, etc. defaults to onChange.
}
```

## form

Currently, all the content related to the form, json2html-react has been processed. The form object will be exposed to events and actions. please refer to[rc-field-form](https://www.npmjs.com/package/rc-field-form)

## example🌰
1. Clone project：
```bash
git clone https://github.com/alan1111/json2html-react.git
```

2. Install dependencies： 
```bash
npm i
```

3. Start the application：

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Visit http://location:3000。

## Any other problems?

Welcome to scan the QR code below, you can leave any questions you want to know.

<img width="200" src="./author.png" />

