import React from 'react';

export const Trash: React.FC = () => (
  <svg width="16px" height="16px" viewBox="0 0 24 24" strokeWidth="2">
    <g strokeWidth="2">
      <path
        d="M20,9V21a2,2,0,0,1-2,2H6a2,2,0,0,1-2-2V9"
        fill="none"
        stroke="currentColor"
        strokeLinecap="square"
        strokeMiterlimit="10"
        strokeWidth="2"
        strokeLinejoin="miter"
      />
      <line
        x1="1"
        y1="5"
        x2="23"
        y2="5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="square"
        strokeMiterlimit="10"
        strokeWidth="2"
        strokeLinejoin="miter"
      />
      <line
        x1="12"
        y1="12"
        x2="12"
        y2="18"
        fill="none"
        stroke="currentColor"
        strokeLinecap="square"
        strokeMiterlimit="10"
        strokeWidth="2"
        strokeLinejoin="miter"
      />
      <line
        x1="8"
        y1="12"
        x2="8"
        y2="18"
        fill="none"
        stroke="currentColor"
        strokeLinecap="square"
        strokeMiterlimit="10"
        strokeWidth="2"
        strokeLinejoin="miter"
      />
      <line
        x1="16"
        y1="12"
        x2="16"
        y2="18"
        fill="none"
        stroke="currentColor"
        strokeLinecap="square"
        strokeMiterlimit="10"
        strokeWidth="2"
        strokeLinejoin="miter"
      />
      <polyline
        data-cap="butt"
        points="8 5 8 1 16 1 16 5"
        fill="none"
        stroke="currentColor"
        strokeMiterlimit="10"
        strokeWidth="2"
        strokeLinecap="butt"
        strokeLinejoin="miter"
      />
    </g>
  </svg>
);

export const NewIcon: React.FC = () => (
  <svg width="16px" height="16px" viewBox="0 0 24 24" strokeWidth="2">
    <g strokeWidth="2">
      <line
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        strokeMiterlimit="10"
        x1="12"
        y1="7"
        x2="12"
        y2="17"
        strokeLinejoin="miter"
      />
      <line
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        strokeMiterlimit="10"
        x1="17"
        y1="12"
        x2="7"
        y2="12"
        strokeLinejoin="miter"
      />
      <circle
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        strokeMiterlimit="10"
        cx="12"
        cy="12"
        r="11"
        strokeLinejoin="miter"
      />
    </g>
  </svg>
);

export const AccountIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
    strokeWidth="1"
  >
    <g strokeWidth="1" transform="translate(0.5, 0.5)">
      <path
        data-color="color-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="square"
        strokeMiterlimit="10"
        d="M12,16L12,16 c-2.209,0-4-1.791-4-4v-2c0-2.209,1.791-4,4-4h0c2.209,0,4,1.791,4,4v2C16,14.209,14.209,16,12,16z"
        strokeLinejoin="miter"
      />
      <path
        data-cap="butt"
        data-color="color-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeMiterlimit="10"
        d="M18.102,21.154 C17.002,19.86,15.332,19,13.5,19h-3c-1.847,0-3.499,0.835-4.6,2.147"
        strokeLinejoin="miter"
        strokeLinecap="butt"
      />
      <circle
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="square"
        strokeMiterlimit="10"
        cx="12"
        cy="12"
        r="11"
        strokeLinejoin="miter"
      />
    </g>
  </svg>
);

export const GithubIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      fill="currentColor"
      d="M12,0.3c-6.6,0-12,5.4-12,12c0,5.3,3.4,9.8,8.2,11.4 C8.8,23.8,9,23.4,9,23.1c0-0.3,0-1,0-2c-3.3,0.7-4-1.6-4-1.6c-0.5-1.4-1.3-1.8-1.3-1.8C2.5,17,3.7,17,3.7,17 c1.2,0.1,1.8,1.2,1.8,1.2c1.1,1.8,2.8,1.3,3.5,1c0.1-0.8,0.4-1.3,0.8-1.6c-2.7-0.3-5.5-1.3-5.5-5.9c0-1.3,0.5-2.4,1.2-3.2 C5.5,8.1,5,6.9,5.7,5.3c0,0,1-0.3,3.3,1.2c1-0.3,2-0.4,3-0.4c1,0,2,0.1,3,0.4c2.3-1.6,3.3-1.2,3.3-1.2c0.7,1.7,0.2,2.9,0.1,3.2 c0.8,0.8,1.2,1.9,1.2,3.2c0,4.6-2.8,5.6-5.5,5.9c0.4,0.4,0.8,1.1,0.8,2.2c0,1.6,0,2.9,0,3.3c0,0.3,0.2,0.7,0.8,0.6 c4.8-1.6,8.2-6.1,8.2-11.4C24,5.7,18.6,0.3,12,0.3z"
    />
  </svg>
);

export const HandleIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="7.5" cy="4.5" r="1.5" fill="currentColor" />
    <circle cx="15.5" cy="4.5" r="1.5" fill="currentColor" />
    <circle cx="7.5" cy="11.5" r="1.5" fill="currentColor" />
    <circle cx="15.5" cy="11.5" r="1.5" fill="currentColor" />
    <circle cx="7.5" cy="18.5" r="1.5" fill="currentColor" />
    <circle cx="15.5" cy="18.5" r="1.5" fill="currentColor" />
  </svg>
);
