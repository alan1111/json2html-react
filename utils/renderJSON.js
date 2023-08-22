import React, { useState, useEffect, useMemo } from 'react';
import Form from 'rc-field-form';
import Json2Html from './core';
import { formatData } from './utils';
import { setGlobalForm, getGlobalForm } from './bind';

const HOOK_MARK = 'RC_FORM_INTERNAL_HOOKS';
function RenderJSON(props) {
  /**
   * renderJson：待渲染的数据，支持数组和对象；
   * events: form的原生事件，例如：onChange,onBlur等；
   * editCb：用于html2json时获取当前点击模块的json数据；
   * initialValues： 用于作为form初始值，只能首次渲染默认展示。
   */
  const { renderJson, events, editCb, initialValues } = props;

  const [form] = Form.useForm();
  const [formState, setFormState] = useState({});

  const finalForm = useMemo(() => {
    const globalForm = getGlobalForm();
    if (globalForm) {
      return globalForm;
    }
    setGlobalForm(form);
    return form;
  }, [form]);

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
