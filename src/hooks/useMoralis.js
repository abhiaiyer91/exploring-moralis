export function useMoralis() {
  // Moralis Initialization
  let Moralis;
  if (typeof window !== `undefined`) {
    Moralis = require("moralis");
    Moralis.initialize(process.env.GATSBY_MORALIS_APPLICATION_ID);
    Moralis.serverURL = GATSBY_MORALIS_SERVER_ID;
  }
  return { Moralis };
}
