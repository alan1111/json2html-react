// v/x -> 750/320 (设计稿按照750宽度设计) h5项目默认字体范围14px-28px.
const getCalculateRem = (v) => {
  // 将750设计稿中的px值换算为320【最小屏幕】时的px值, 0.01与scss中的r函数统一
  const x = ((v * 320) / 750) + 0.01;
  // 换算当前px对应的rem值【320情况下，默认字体大小为14px】
  return x / 14;
};

const getNumReg = /^r\((\d+)\)$/;
const styleLengthReg = /r\((\d+)\)/g; // 例如： r(160) 或者 "0 r(4) r(16) 0 rgba(204,68,0,0.04)"

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

const formatData = (data) => {
  if (data) {
    const tempData = structuredClone(data);
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

export {
  numToRem,
  formatData,
};
