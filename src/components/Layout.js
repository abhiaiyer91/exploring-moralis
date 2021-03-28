import React from "react";

const wrapper = {
  backgroundColor: `rgb(197,250,3)`,
  display: `flex`,
  alignItems: `center`,
  justifyContent: `center`,
  flexDirection: `column`,
  height: `100vh`,
};

const loginCard = {
  maxWidth: 420,
  width: `100%`,
  background: `black`,
  boxShadow: `rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px, rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px`,
  borderRadius: `30px`,
  alignSelf: `center`,
  padding: `48px 16px`,
  color: `rgb(197,250,3)`,
  textAlign: `center`,
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
};

export function Layout({ children }) {
  return (
    <div style={wrapper}>
      <div style={loginCard}>{children}</div>
    </div>
  );
}
