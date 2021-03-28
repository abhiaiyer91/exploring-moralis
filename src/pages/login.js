import React from "react";
import { Layout } from "../components/Layout";
import { useAuth } from "../hooks/useAuth";

const header = { textAlign: `center`, margin: `0 0 8px` };

const paragraph = { margin: `0 0 24px` };

const button = {
  borderRadius: `4px`,
  border: `1px solid rgb(247, 248, 250)`,
  backgroundColor: `rgb(255, 255, 255)`,
  height: `40px`,
  width: 240,
  cursor: `pointer`,
};

export default function Login() {
  const { login } = useAuth();
  return (
    <Layout>
      <h1 style={header}>Welcome to the App</h1>

      <p style={paragraph}>You can try out logging in below!</p>

      <button
        style={button}
        onClick={() => {
          return login().catch((e) => {
            console.error(e);
          });
        }}
      >
        LOG IN
      </button>
    </Layout>
  );
}
