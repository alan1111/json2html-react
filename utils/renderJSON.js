import React, { useState, useEffect, useMemo } from 'react';
import Form from 'rc-field-form';
import Json2Html from './core';
import { formatData, addStyle } from './utils';
import { setGlobalForm, getGlobalForm } from './bind';

const HOOK_MARK = 'RC_FORM_INTERNAL_HOOKS';
function RenderJSON(props) {
  /**
   * renderJson：待渲染的数据，支持数组和对象；
   * events: form的原生事件，例如：onChange,onBlur等；
   * editCb：用于html2json时获取当前点击模块的json数据；
   * initialValues： 用于作为form初始值，只能首次渲染默认展示。
   */
  const { renderJson, events, editCb, initialValues, css } = props;

  const [form] = Form.useForm();
  const [formState, setFormState] = useState({});

  // 当前页面如果使用了多个渲染引擎组件进行渲染，仅维持1个form实例，从而所有组件可以共享form状态。
  const finalForm = useMemo(() => {
    const globalForm = getGlobalForm();
    if (globalForm) {
      return globalForm;
    }
    setGlobalForm(form);
    return form;
  }, [form]);

  // 支持css样式在线编辑
  useEffect(() => {
    if (css) {
      addStyle(css);
    }
  }, [css]);

  useEffect(() => {
    const { registerWatch } = finalForm.getInternalHooks(HOOK_MARK);
    const cb = (values) => {
      setFormState(values);
    };
    const fn = registerWatch(cb);
    // 取消watch
    return () => fn();
  }, [finalForm]);

  if (!renderJson) {
    return null;
  }

  if (Array.isArray(renderJson)) {
    return (
      <Form form={finalForm} initialValues={initialValues}>
        {renderJson.map((i, k) => {
          const opts = {
            jsonObj: formatData(i),
            globalData: {
              editCb,
              formState,
              events, // 用于表单绑定事件
            },
          };
          return (
            <Json2Html key={+k} {...opts} />
          );
        })}
      </Form>
    );
  }

  const options = {
    jsonObj: formatData(renderJson),
    globalData: {
      editCb,
      formState,
      events, // 用于表单绑定事件
    },
  };

  return (
    <Form form={finalForm} initialValues={initialValues}>
      <Json2Html {...options} />
    </Form>
  );
}

export default RenderJSON;
