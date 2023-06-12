import * as zarmComponent from 'zarm';

import * as customComponents from './customComponents';

console.log('123', customComponents)
export default {
  ...zarmComponent,
  ...customComponents,
};
