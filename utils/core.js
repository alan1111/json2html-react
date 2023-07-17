import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Field } from 'rc-field-form';
import {
  handleAction,
  getPropsProxyData,
  getWidget,
  getComponents,
  getFormValue,
  getGlobalForm,
} from './bind';

// 解析json，将json转化为页面html。只做页面初始化解析，后续动作组件内部控制。
export default function Json2Html({ jsonObj, globalData, parentPath }) {
  const { dataBind } = jsonObj || {};

  const [filterProps, setFilterProps] = useState(); // 统一管理所有子组件的props，初始化为null，避免联动产生的无效渲染。如果filterProps存在，表示展示，否则为隐藏。

  const [fieldExplain, setFieldExplain] = useState(''); // form error 展示
  const [value, setValue] = useState(''); // form value 受控

  const [hide, setHide] = useState(false); // 用于联动是否展示组件

  const { events, formState } = globalData || {};

  const form = getGlobalForm();

  // 获取当前表单的路径name，用户查询或者设置form值。
  const pathName = useMemo(() => {
    if (dataBind) {
      return parentPath ? [].concat(parentPath, dataBind) : [dataBind];
    }
    return parentPath;
  }, [parentPath, dataBind]);

  // update action更改props
  const newJson = useMemo(() => {
    const propsProxyData = getPropsProxyData();
    if (pathName) {
      const proxyData = propsProxyData[pathName?.join('.')];
      return { ...jsonObj, ...proxyData };
    }
    return jsonObj;
  }, [jsonObj, pathName]);

  const { widget, action, defaultValue, jProps, isFormField, jChildren, linkage, rules, validateTrigger } = newJson || {};

  useEffect(() => {
    setFilterProps(jProps);
  }, [jProps]);

  // 设置表单默认值
  useEffect(() => {
    if (defaultValue && pathName) {
      form.setFieldValue(pathName, defaultValue);
    }
  }, [form, defaultValue, pathName]);

  // 支持form库设置value时，表单未更新问题。https://www.npmjs.com/package/rc-field-form 第8点。
  useEffect(() => {
    if (formState && isFormField && pathName) {
      setValue(form.getFieldValue(pathName) || '');
    }
  }, [formState, form, isFormField, pathName]);

  // 处理表单事件events绑定
  useEffect(() => {
    const { onChange, ...otherEvents } = events || {};
    if (isFormField && pathName && otherEvents && Object.keys(otherEvents).length > 0) {
      // 处理表单事件回传，带上pathName
      const tempV = {};
      Object.keys(otherEvents).forEach((event) => {
        tempV[event] = (e) => {
          // 处理部分情况，组件form绑定未生效问题。 如设置defaultValue， 或者受控组件间接修改value值，未更新form绑定。
          otherEvents[event](getFormValue(e), { form, pathName });
        };
      });
      setFilterProps((v) => ({ ...v, ...tempV }));
    }
  }, [isFormField, events, pathName, form]);

  const handleChange = useCallback((e) => {
    const tempV = getFormValue(e);

    // 托管rc-field-form中默认的设置form value功能。部分情况会出现偏差，例如自定义组件checkbox, 无论状态是true或者false，form.getFieldsValue()返回的始终是string类型的'true'
    setTimeout(() => {
      form.setFieldValue(pathName, tempV);
      if (events?.onChange) {
        events.onChange(tempV, { form, pathName });
      }
    });
  }, [form, events, pathName]);

  // 处理action
  useEffect(() => {
    if (action) {
      setFilterProps((v) => ({ ...v, onClick: () => handleAction(action) }));
    }
  }, [action, form]);

  // 处理cascade联动
  useEffect(() => {
    if (linkage) {
      // eslint-disable-next-line
      const fn = new Function('$formState', linkage);
      const newState = fn(formState);
      if (!newState) {
        setHide(true);
      } else {
        setHide(false);
        setFilterProps((v) => ({ ...v, ...newState }));
      }
    }
  }, [formState, linkage]);

  // 最里层jsonObj为undefined时childrens为null; hide为true时，表示组件初始化或者联动隐藏时无需渲染子组件。
  if (hide) {
    return null;
  }

  const renderJChildren = () => {
    if (!jChildren) {
      return null;
    }

    if (Array.isArray(jChildren)) {
      return jChildren.map((i, k) => {
        return (<Json2Html key={+k} jsonObj={i} parentPath={pathName} globalData={globalData} />);
      });
    }

    return <Json2Html jsonObj={jChildren} parentPath={pathName} globalData={globalData} />;
  };

  // 处理jsonObj
  const currentWidget = getWidget(widget);
  const CurrentComponent = getComponents()[currentWidget];

  if (!CurrentComponent) {
    console.error('不存在当前组件：', widget);
    return null;
  }

  if (isFormField) {
    const tProps = {
      name: pathName,
      rules,
      validateTrigger,
      onMetaChange: () => {
        const err = form.getFieldError(pathName);
        setFieldExplain(err?.[0]);
      },
    };

    return (
      <Field {...tProps}>
        <div className="field-block">
          <CurrentComponent value={value} onChange={handleChange} {...filterProps}>
            {renderJChildren()}
          </CurrentComponent>
          {fieldExplain && (<div className="field-explain">{fieldExplain}</div>)}
        </div>
      </Field>
    );
  }
  return (
    <CurrentComponent {...filterProps}>
      {renderJChildren()}
    </CurrentComponent>
  );
}
