import React, { forwardRef, useImperativeHandle }  from 'react';
import Form from 'react-form-validates';
import { Json2Html } from './core';
import { formatData } from './tool';

const createForm = Form.create;
const FormItem = Form.Item;
function RenderJSON(props, ref) {
  const { renderJson, events, form } = props;

  useImperativeHandle(ref, () => ({form}))

  if (!renderJson) {
    return null;
  }

  const options = {
    jsonObj: formatData(renderJson),
    globalData: {
      form, // 解析器使用
      FormItem, // 解析器使用
      events
    },
  };

  return <Json2Html {...options} />;
}

export default createForm()(forwardRef(RenderJSON));
