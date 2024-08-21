import { PublicKey } from "@solana/web3.js";

import * as anchor from "@project-serum/anchor";

// Initialize connection
const wallet = pg.wallet;

// Set up the program with IDL and provider
const program = pg.program;

const [servicePda, serviceBump] = PublicKey.findProgramAddressSync(
  [Buffer.from("service"), wallet.publicKey.toBuffer()],
  program.programId
);

const registerService = async () => {
  const description = "Copywriting";
  const price = new anchor.BN(1000000);
  const transactionSignature = await program.methods
    .registerService(description, price)
    .accounts({
      user: wallet.publicKey, // payer for transaction
      serviceAccount: servicePda,
    })
    .rpc({ commitment: "confirmed" });

  const serviceAccount = await program.account.serviceAccount.fetch(
    servicePda,
    "confirmed"
  );

  console.log(
    `${description} service for ${price} lamports registered.\n PDA Public Key: ${servicePda.toBase58()}`
  );
  console.log(
    "Transaction Signature:\n",
    `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`
  );
};

// Call the function
registerService().catch((err) => {
  console.error(err);
});
