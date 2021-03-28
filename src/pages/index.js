import { Link } from "gatsby";
import { navigate } from "gatsby-link";
import * as React from "react";
import { Layout } from "../components/Layout";
import { useAuth } from "../hooks/useAuth";

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

  React.useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  return (
    <Layout>
      <p>ETH Address: {userAddress}</p>

      <div style={{ marginBottom: `16px` }}>
        <Link to="/profile" style={{ color: `rgb(197,250,3)` }}>
          Profile
        </Link>
      </div>

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
    </Layout>
  );
};

export default IndexPage;
