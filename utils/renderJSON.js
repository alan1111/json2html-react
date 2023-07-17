import React, { useState, useEffect, useMemo } from 'react';
import Form from 'rc-field-form';
import Json2Html from './core';
import { formatData } from './tool';
import { setGlobalForm, getGlobalForm } from './bind';

const HOOK_MARK = 'RC_FORM_INTERNAL_HOOKS';
function RenderJSON(props) {
  const { renderJson, events, initialValues } = props;

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

  const options = {
    jsonObj: formatData(renderJson),
    globalData: {
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
