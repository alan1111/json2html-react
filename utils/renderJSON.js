import React from 'react';
import Form from 'react-form-validates';
import { Json2Html } from './core';
import { formatData } from './tool';

const createForm = Form.create;
const FormItem = Form.Item;
function RenderJSON(props) {
  const { renderJson, events, rootState, form } = props;

  if (!renderJson) {
    return null;
  }

  const options = {
    jsonObj: formatData(renderJson),
    globalData: {
      form, // 解析器使用
      FormItem, // 解析器使用
      events, // 用于表单绑定事件
      rootState, // 用于传入全局状态
    },
  };

  return <Json2Html {...options} />;
}

export default createForm()(RenderJSON);
