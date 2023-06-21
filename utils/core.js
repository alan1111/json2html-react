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
    for (let i = 0; i < action.length; i++) {
      const item = action[i];
      await handleAction(item, globalData);
    }
    return;
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

  const { widget, action, jProps, jChildren, linkage, dataBind, rules, validateTrigger } = jsonObj || {};
  const { form, FormItem, rootState } = globalData || {};

  const formState = form?.getFieldsValue() || {};
  const globalState = { ...rootState, ...formState }; // 用于管理页面所有状态。
  const events = globalData?.events || {}; // 用于给表单组件绑定事件，后续会遍历，防止报错

  // 处理action
  useEffect(() => {
    if (action && filterProps) {
      setFilterProps((v) => ({ ...v, onClick: () => handleAction(action, globalData) }));
    }
  }, [action, globalData, JSON.stringify(filterProps)]);

  // 处理表单事件events绑定
  useEffect(() => {
    if (dataBind && filterProps && Object.keys(events).length > 0) {
      // 处理表单事件回传，带上dataBind
      const tempV = {};
      const setFormValue = (v) => {
        if (!v.target) {
          form.setFieldsValue({
            [dataBind]: v,
          });
        }
      };
      Object.keys(events).forEach((e) => {
        tempV[e] = (v) => {
          // 处理部分情况，组件form绑定未生效问题。 如设置defaultValue， 或者受控组件间接修改value值，未更新form绑定。
          setFormValue(v);
          events[e](dataBind, v, form);
        };
      });

      // 兼容无需传入onChange的情况, 处理表单状态
      if (!tempV.onChange) {
        tempV.onChange = (v) => {
          setFormValue(v);
        };
      }
      setFilterProps((v) => ({ ...v, ...tempV }));
    }
  }, [events, dataBind, JSON.stringify(filterProps)]);

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

  const renderJChildren = () => {
    if (!jChildren) {
      return null;
    }

    if (Array.isArray(jChildren)) {
      return jChildren.map((i, k) => {
        return (<Json2Html key={+k} jsonObj={i} globalData={globalData} />);
      });
    }

    return <Json2Html jsonObj={jChildren} globalData={globalData} />;
  };

  // 处理jsonObj
  const currentWidget = getWidget(widget);
  const CurrentComponent = JSON2HTML_COMPONENTS[currentWidget];

  if (!CurrentComponent) {
    console.error('不存在当前组件：', widget);
    return null;
  }

  if (dataBind && form && FormItem) {
    const tProps = form.getFieldProps(dataBind, { rules, validateTrigger: validateTrigger || '' }); // validateTrigger设置为‘’，将校验时机由页面控制

    return (
      <FormItem>
        <div {...tProps}>
          <CurrentComponent {...filterProps}>
            {renderJChildren()}
          </CurrentComponent>
        </div>
      </FormItem>
    );
  }
  return (
    <CurrentComponent {...filterProps}>
      {renderJChildren()}
    </CurrentComponent>
  );
}

export {
  Json2Html,
  handleAction,
  registerAction,
  registerComponent,
};
