##Announcement on the Stop of Updating the json2hml-react Library
```bash
Dear users

With great regret and sincere apologies, we would like to inform everyone that due to our team's in-depth exploration and research and development, we have now launched a more innovative and high-performance alternative solution. Therefore, we have decided to stop updating and maintaining the json2hhtml-react library.

We are well aware that the json2hml-react library has gained the trust and selection of many users in the past few days, and has contributed to everyone's project development process. We are deeply grateful for this. However, with the rapid development of technology, we have to make this difficult decision in order to provide everyone with a better, more efficient, and convenient development experience.

But please rest assured that we have carefully prepared a brand new plan for this change, which will open up a new development perspective for everyone and bring many surprising features:
1、 A true zero programming experience
The new solution has achieved an unprecedented breakthrough, allowing you to easily create and layout pages without the need to write complex code. Whether you are an experienced developer or a novice, you can quickly achieve your ideal page effect in a zero programming environment, greatly saving development time and energy, allowing you to focus more on business logic and creative ideas.
2、 High flexibility and customizability
Although no programming is required, the new solution never sacrifices flexibility and customization. It provides a rich variety of preset templates and components, allowing you to easily personalize and customize various elements of the page according to specific project needs. From page style, layout structure to element style, everything can be changed according to your wishes, ensuring that you create a unique and perfect page that meets project needs.
3、 Excellent performance and compatibility
While pursuing convenience, the new solution also demonstrates outstanding performance and compatibility. It has undergone rigorous testing and optimization, and can run stably on various mainstream browsers and devices, ensuring that your page can be displayed smoothly in any environment, providing users with a high-quality browsing experience. At the same time, its efficient rendering mechanism can quickly process large amounts of data, even in the face of complex page structures and rich content, it can easily cope without pressure.

We sincerely invite all users to visit our [official website](https://i-simple.fun/) Experience firsthand the amazing features brought by the new solution and witness the wonderful moments of zero programming to achieve page miracles together.

Once again, we deeply apologize for any inconvenience caused to everyone. We sincerely hope that everyone can understand our decision and look forward to the new solution bringing more convenience and surprises to your project development.
Thank you all for your continuous support and kindness towards us!

-- 小火球
```
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
    css: '', // Not required! There is class/id and so on.
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

Currently, all the content related to the form, json2html-react has been processed. The form object will be exposed to events and actions. please refer to [rc-field-form](https://www.npmjs.com/package/rc-field-form)

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

[Welcome to contact me](https://i-simple.fun/contactUs)
