const getCalculatePx = (rVal) => {
  const rem = Math.min(
    640,
    Math.max(document.documentElement.clientWidth, 320),
  );
  return (rVal * rem) / 750;
};

const getNumReg = /^r\((\d+)\)$/;
const styleLengthReg = /r\((\d+)\)/g; // 例如： r(160) 或者 "0 r(4) r(16) 0 rgba(204,68,0,0.04)"

const numToPx = (str) => {
  const matchRes = str.match(styleLengthReg);
  if (matchRes) {
    matchRes.forEach((i) => {
      str = str.replace(i, `${getCalculatePx(i.match(getNumReg)[1])}px`);
    });
    return str;
  }
  return str;
};

const formatData = (data) => {
  if (data) {
    const tempData = JSON.parse(JSON.stringify(data));
    const fn = (obj) => {
      const { jChildren, jProps } = obj;
      const { style } = jProps || {};
      if (style) {
        Object.keys(style).forEach((k) => {
          style[k] = numToPx(style[k]);
        });
      }
      if (jProps?.label) {
        const { label } = jProps;
        jProps.label = numToPx(label);
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
  numToPx,
  formatData,
};
