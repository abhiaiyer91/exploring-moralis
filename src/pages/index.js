import * as React from "react";
import { useAuth } from "../hooks/useAuth";

const wrapper = {
  backgroundColor: `rgb(197,250,3)`,
  display: `flex`,
  alignItems: `center`,
  justifyContent: `center`,
  flexDirection: `column`,
  height: `100vh`,
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
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
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
};

const button = {
  borderRadius: `4px`,
  border: `1px solid rgb(247, 248, 250)`,
  backgroundColor: `rgb(255, 255, 255)`,
  height: `40px`,
  width: 240,
  cursor: `pointer`,
};

const buttonWrapper = {
  textAlign: `center`,
};

// markup
const IndexPage = () => {
  const { logout, currentUser } = useAuth();
  const user = currentUser();
  const userAddress = user?.get("ethAddress");

  return (
    <main style={wrapper}>
      <title>Home Page</title>

      <div style={loginCard}>
        <p>ETH Address: {userAddress}</p>
        <div style={buttonWrapper}>
          <button
            style={button}
            onClick={() => {
              return logout().catch((e) => {
                console.error(e);
              });
            }}
          >
            LOG OUT
          </button>
        </div>
      </div>
    </main>
  );
};

export default IndexPage;
