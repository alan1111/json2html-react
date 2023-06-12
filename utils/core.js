import React, { useState, useEffect } from 'react';

let JSON2HTML_ACTIONS = null;
let JSON2HTML_COMPONENTS = null;

// 注册action动作列表
const registerAction = (actions) => {
  JSON2HTML_ACTIONS = { ...JSON2HTML_ACTIONS, ...actions };
};

// 注册components列表
const registerComponent = (components) => {
  JSON2HTML_COMPONENTS = { ...JSON2HTML_COMPONENTS, ...components };
};

// 处理action动作列表
const handleAction = async (action, globalData) => {
  if (!action) {
    return;
  }
  if (Array.isArray(action)) {
    return action.forEach((i) => handleAction(i, globalData));
  }
  const { type, data } = action;
  if (JSON2HTML_ACTIONS[type]) {
    const res = await JSON2HTML_ACTIONS[type](data, globalData);
    if (res?.type && JSON2HTML_ACTIONS[res.type]) {
      handleAction(res, globalData);
    }
  } else {
    console.error('不存在当前action：', type);
  }
};

// 兼容小写开头 | 字符串中包含"-"
const getWidget = (widgetStr) => widgetStr?.replace(widgetStr[0], widgetStr[0].toUpperCase()).replace(/(-.)/g, (v) => v[1].toUpperCase());

// 解析json，将json转化为页面html。只做页面初始化解析，后续动作组件内部控制。
function Json2Html({ jsonObj, globalData }) {
  const [filterProps, setFilterProps] = useState(null); // 统一管理所有子组件的props，初始化为null，避免联动产生的无效渲染。
  const [uniKey, setUniKey] = useState('');

  useEffect(() => {
    setUniKey(Math.random());
  }, []);

  const { widget, action, jProps, jChildren, linkage, needFormItem, dataBind, rules, validateTrigger } = jsonObj || {};
  const { form, FormItem } = globalData || {};

  const globalState = form ? form.getFieldsValue() : {}; // 用于管理页面所有状态。
  const events = globalData?.events || {}; // 用于给表单组件绑定事件，后续会遍历，防止报错

  // 处理表单组件默认值
  useEffect(() => {
    const { defaultValue } = filterProps || {};
    if (defaultValue && form) {
      form.setFieldsValue({
        [dataBind]: defaultValue,
      });
    }
  }, [dataBind, JSON.stringify(filterProps)]);

  // 处理action
  useEffect(() => {
    if (action) {
      setFilterProps((v) => ({ ...v, onClick: () => handleAction(action, globalData) }));
    }
  }, [action, globalData]);

  // 处理表单事件events绑定
  useEffect(() => {
    if (needFormItem && Object.keys(events).length > 0) {
      // 处理表单事件回传，带上dataBind
      const tempV = {};
      Object.keys(events).forEach((e) => {
        tempV[e] = (v) => events[e](dataBind, v);
      });
      setFilterProps((v) => ({ ...v, ...tempV }));
    }
  }, [events, needFormItem, dataBind]);

  // 处理cascade联动
  useEffect(() => {
    if (linkage) {
      // eslint-disable-next-line
      const fn = new Function('$globalState', linkage);
      const newState = fn(globalState);
      setFilterProps(newState ? (v) => ({ ...v, ...jProps, ...newState }) : null);
    } else {
      setFilterProps((v) => ({ ...v, ...jProps }));
    }
  }, [JSON.stringify(globalState), linkage, jProps]);

  // 最里层jsonObj为undefined时childrens为null; filterProps为空时，表示组件初始化或者联动隐藏时无需渲染子组件。
  if (!jsonObj || !filterProps) {
    return null;
  }

  // 遍历childrens
  if (Array.isArray(jsonObj)) {
    return jsonObj.map((i, k) => {
      const tProps = { jsonObj: i, globalData };
      return (<Json2Html key={`${uniKey}-${k}`} {...tProps} />);
    });
  }

  // 处理jsonObj
  const currentWidget = getWidget(widget);
  const CurrentComponent = JSON2HTML_COMPONENTS[currentWidget];

  if (!CurrentComponent) {
    console.error('不存在当前组件：', widget);
    return null;
  }

  const tempProps = { jsonObj: jChildren, globalData };
  if (needFormItem && form && FormItem) {
    const tProps = form.getFieldProps(dataBind, { rules, validateTrigger: validateTrigger || '' }); // validateTrigger设置为‘’，将校验时机由页面控制

    return (
      <FormItem key={uniKey}>
        <div {...tProps}>
          <CurrentComponent {...filterProps}>
            {jChildren && (<Json2Html {...tempProps} />)}
          </CurrentComponent>
        </div>
      </FormItem>
    );
  }
  return (
    <CurrentComponent {...filterProps}>
      {jChildren && (<Json2Html {...tempProps} />)}
    </CurrentComponent>
  );
}

export {
  Json2Html,
  handleAction,
  registerAction,
  registerComponent,
};
