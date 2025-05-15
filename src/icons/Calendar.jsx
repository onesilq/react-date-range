import * as React from 'react';
const SvgComponent = props => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="none" {...props}>
    <path
      stroke="#6C6C6C"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M13.332 2.5v3.333M6.665 2.5v3.333M3.332 9.167h13.333M3.332 5.833a1.667 1.667 0 0 1 1.667-1.666h10a1.667 1.667 0 0 1 1.666 1.666v10A1.666 1.666 0 0 1 15 17.5h-10a1.667 1.667 0 0 1-1.667-1.667v-10Z"
    />
  </svg>
);
export default SvgComponent;
