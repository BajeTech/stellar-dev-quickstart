const StellarSdk = require("stellar-sdk");
const fetch = require("node-fetch");

// create a completely new and unique pair of keys
// see more about KeyPair objects: https://stellar.github.io/js-stellar-sdk/Keypair.html
const pair = StellarSdk.Keypair.random();

console.log(`Public Key: ${pair.publicKey()}`);
console.log(`Secret Key: ${pair.secret()}`);

// The SDK does not have tools for creating and funding test accounts, so you'll have to
// make your own HTTP request.
(async function createTestAccount() {
  console.log(
    "Funding a new account on the test network (takes a few seconds)…"
  );

  try {
    const response = await fetch(
      `https://friendbot.stellar.org?addr=${encodeURIComponent(
        pair.publicKey(),
      )}`,
    );
    const responseJSON = await response.json();
    console.log("SUCCESS! You have a new account :)\n", responseJSON);
  } catch (e) {
    console.error("ERROR!", e);
  }

  const server = new StellarSdk.Server("https://horizon-testnet.stellar.org");

  // The JS SDK uses promises for most actions, such as retrieving an account
  const account = await server.loadAccount(pair.publicKey());
  console.log("\nBalances for account: " + pair.publicKey());
  account.balances.forEach(function (balance) {
    console.log("Type: ", balance.asset_type, ", Balance: ", balance.balance);
  });
})();