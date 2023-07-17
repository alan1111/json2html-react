let GLOBAL_FORM = null;
let JSON2HTML_COMPONENTS = null;
const PROPS_PROXY_DATA = {};

// 检查是否需要更新form value。
const checkValue = (name, data) => {
  const { value } = data || {};
  if (typeof value !== 'undefined') {
    GLOBAL_FORM?.setFieldValue?.(name, value);
  }
};

let JSON2HTML_ACTIONS = {
  // dataList: [{nameList: [], name, value: {}}] =》 [{nameList:['a','b'], value: {defaultValue: '1'}}, {name:'c', value: {jProps: {style: {color: 'red'}}}}]
  update: (dataList, { parentResult, form }) => {
    try {
      // 多对多模式
      dataList.forEach((item) => {
        const { nameList, name, value } = item;
        const tempValue = parentResult || value;
        // 1对1模式
        if (name) {
          PROPS_PROXY_DATA[name] = { ...PROPS_PROXY_DATA[name], ...tempValue };
          checkValue(name, tempValue);
        }
        // 多对1模式
        if (Array.isArray(nameList)) {
          nameList.forEach((nI) => {
            PROPS_PROXY_DATA[nI] = { ...PROPS_PROXY_DATA[nI], ...tempValue };
            checkValue(nI, tempValue);
          });
        }
      });
      // REFRESH 不会作用于业务内容，仅仅是为了触发组件更新state
      form.setFieldValue('REFRESH', true);
    } catch (e) {
      console.info('action update error: ', e);
    }
  },
};

const getGlobalForm = () => {
  return GLOBAL_FORM;
};

const setGlobalForm = (v) => {
  GLOBAL_FORM = {
    ...v,
    validateFieldsAndScroll: async (...args) => {
      try {
        const values = await v.validateFields(...args);
        return values;
      } catch (e) {
        const element = document.querySelector('.field-explain');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
        }
        return Promise.reject(e);
      }
    },
  };
};

// 获取props proxy数据
const getPropsProxyData = () => {
  return PROPS_PROXY_DATA;
};

// 获取action动作列表
const getActions = () => {
  return JSON2HTML_ACTIONS;
};

// 注册action动作列表
const registerAction = (actions) => {
  JSON2HTML_ACTIONS = { ...JSON2HTML_ACTIONS, ...actions };
};

// 获取组件列表
const getComponents = () => {
  return JSON2HTML_COMPONENTS;
};

// 注册components列表
const registerComponent = (components) => {
  JSON2HTML_COMPONENTS = { ...JSON2HTML_COMPONENTS, ...components };
};

// 处理action动作列表。action: {type: xx, data: xx}; formData: {form: xxx}
const handleAction = async (action, parentData) => {
  if (!action) {
    return;
  }
  if (Array.isArray(action)) {
    let res = null;
    for (let i = 0; i < action.length; i++) {
      const item = action[i];
      // eslint-disable-next-line
      res = await handleAction(item, { parentResult: res });
    }
    return;
  }
  const { type, data } = action;
  if (JSON2HTML_ACTIONS[type]) {
    const res = await JSON2HTML_ACTIONS[type](data, { ...parentData, form: GLOBAL_FORM });
    if (res?.type && JSON2HTML_ACTIONS[res.type]) {
      return handleAction(res, { parentResult: res });
    }
    return res;
  }
  console.error('不存在当前action：', type);
};

// 兼容小写开头 | 字符串中包含"-"
const getWidget = (widgetStr) => widgetStr?.replace(widgetStr[0], widgetStr[0].toUpperCase()).replace(/(-.)/g, (v) => v[1].toUpperCase());

const getFormValue = (e) => {
  const type = e?.target?.type;
  if (type) {
    const { value, checked } = e.target;
    return type === 'checkbox' ? checked : value;
  }
  return e;
};

export {
  getWidget,
  getPropsProxyData,
  getActions,
  getComponents,
  getFormValue,
  getGlobalForm,
  setGlobalForm,
  handleAction,
  registerAction,
  registerComponent,
};
