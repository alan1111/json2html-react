import React from 'react';

function Div(props) {
  const { children, label, noTag, ...others } = props;

  if (children) {
    return (
      <div {...others}>{children}</div>
    );
  }

  if (noTag) {
    return label;
  }

  return (
    // eslint-disable-next-line
    <div {...others} dangerouslySetInnerHTML={{ __html: label }} />
  );
}

export default Div;
