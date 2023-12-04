// v/x -> 750/320 (设计稿按照750宽度设计) h5项目默认字体范围14px-28px.
const getCalculateRem = (v) => {
  // 将750设计稿中的px值换算为320【最小屏幕】时的px值, 0.01与scss中的r函数统一
  const x = ((v * 320) / 750) + 0.01;
  // 换算当前px对应的rem值【320情况下，默认字体大小为14px】
  return x / 14;
};

// getCalculateRem 取反
const rollbackRem = (r) => {
  return Math.ceil(((r * 14 - 0.01) * 750) / 320);
};

const getNumReg = /^r\((\d+)\)$/;
const styleLengthReg = /r\((\d+)\)/g; // 例如： r(160) 或者 "0 r(4) r(16) 0 rgba(204,68,0,0.04)"
const getRemReg = /^([0-9.]+)rem$/;
const styleRemReg = /([0-9.]+)rem/g;

const numToRem = (str) => {
  if (typeof str !== 'string') {
    return str;
  }
  const matchRes = str.match(styleLengthReg);
  if (matchRes) {
    matchRes.forEach((i) => {
      str = str.replace(i, `${getCalculateRem(i.match(getNumReg)[1])}rem`);
    });
    return str;
  }
  return str;
};

const RemToNum = (str) => {
  if (typeof str !== 'string') {
    return str;
  }
  const matchRes = str.match(styleRemReg);
  if (matchRes) {
    matchRes.forEach((i) => {
      str = str.replace(i, `r(${rollbackRem(i.match(getRemReg)[1])})`);
    });
    return str;
  }
  return str;
};

const formatData = (data) => {
  if (data) {
    const tempData = JSON.parse(JSON.stringify(data));
    const fn = (obj) => {
      if (Array.isArray(obj)) {
        return obj.forEach((child) => {
          fn(child);
        });
      }
      const { jChildren, jProps } = obj;
      const { style } = jProps || {};
      if (style) {
        Object.keys(style).forEach((k) => {
          style[k] = numToRem(style[k]);
        });
      }
      if (jProps?.label) {
        const { label } = jProps;
        jProps.label = numToRem(label);
      }

      if (Array.isArray(jChildren)) {
        jChildren.forEach((child) => {
          fn(child);
        });
      }
    };
    fn(tempData);
    return tempData;
  }
  return data;
};

const backFormatData = (data) => {
  if (data) {
    const tempData = JSON.parse(JSON.stringify(data));
    const fn = (obj) => {
      if (Array.isArray(obj)) {
        return obj.forEach((child) => {
          fn(child);
        });
      }
      const { jChildren, jProps } = obj;
      const { style } = jProps || {};
      if (style) {
        Object.keys(style).forEach((k) => {
          style[k] = RemToNum(style[k]);
        });
      }
      if (jProps?.label) {
        const { label } = jProps;
        jProps.label = RemToNum(label);
      }

      if (Array.isArray(jChildren)) {
        jChildren.forEach((child) => {
          fn(child);
        });
      }
    };
    fn(tempData);
    return tempData;
  }
  return data;
};

const addStyle = (() => {
  if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    document.head.append(style);
    return (styleString) => {
      style.textContent = styleString;
    };
  }
})();

export {
  numToRem,
  backFormatData,
  formatData,
  addStyle,
};
