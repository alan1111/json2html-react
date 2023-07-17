import React from 'react';
import ReactDOM from 'react-dom';
import { Toast, Popup } from 'zarm';
import { RenderJSON, registerAction } from './main';

const toast = (data) => {
  const { message, duration } = data || {};
  Toast.show(message, duration || 3000);
};

const url = (data) => {
  window.location.href = data;
};

const actionPopup = (data) => {
  const { jChildren, direction, isMaskClose, className } = data;

  const ele = document.querySelector('html');
  const { body } = document;

  const oldEle = document.getElementById('actionPopup');
  if (oldEle) {
    ReactDOM.unmountComponentAtNode(oldEle);
    document.body.removeChild(oldEle);
    ele.style.overflow = 'initial';
    body.style.overflow = 'initial';
  }

  ele.style.overflow = 'hidden';
  body.style.overflow = 'hidden';

  const div = document.createElement('div');
  div.id = 'actionPopup';
  document.body.appendChild(div);
  // 关闭弹层
  const onClose = () => {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
    ele.style.overflow = 'initial';
    body.style.overflow = 'initial';
  };

  registerAction({
    onActionPopupOk: () => {
      onClose();
    },
  });

  const options = {
    renderJson: jChildren,
  };

  ReactDOM.render(
    <Popup
      visible
      direction={direction}
      className={className}
      onMaskClick={() => {
        if (isMaskClose) {
          onClose();
        }
      }}
    >
      <RenderJSON {...options} />
    </Popup>,
    div,
  );
};

export default {
  toast,
  url,
  'action-popup': actionPopup,
};
