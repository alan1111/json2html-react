import { Toast } from 'zarm';

const toast = (data) => {
  const { message, duration } = data || {};
  Toast.show(message, duration || 3000);
};

const url = (data) => {
  window.location.href = data;
};

export default {
  toast,
  url,
};
