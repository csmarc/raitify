import {
  Keypair,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  PublicKey,
} from "@solana/web3.js";

import * as anchor from "@project-serum/anchor";

const wallet = pg.wallet;
const program = pg.program;

const sender = wallet.keypair;

// MOCK escrow account
const estellePubkey = new PublicKey(
  "HFmEXcEenDYTuMdLrJ1mCYD9qH5S8yfCphKTGgyXLtXc"
);

const lamports = 1000000;

const payForService = async () => {
  // Create transfer instruction
  const transferInstruction = SystemProgram.transfer({
    fromPubkey: sender.publicKey,
    toPubkey: estellePubkey,
    lamports,
  });

  // Create transaction and add the transfer instruction
  const transaction = new Transaction().add(transferInstruction);

  // Send and confirm the transaction
  const transactionSignature = await sendAndConfirmTransaction(
    pg.connection,
    transaction,
    [sender] // Signer array
  );

  //MOCK Escrow marks service_id as paid
  const servicePublicKey = new PublicKey(
    "7Amm9JFWXYBbMcVbXQ1q68Hjt9fj3ZpWKkD6kdpHGsvW"
  );
  // const tx2 = await program.methods
  //   .markServiceAsPaid(servicePublicKey)
  //   .accounts({
  //     serviceAccount: servicePublicKey,
  //     payer: wallet.publicKey, // payer for transaction
  //     paymentStatus,
  //     systemProgram: SystemProgram.programId,
  //   })
  //   .rpc({ commitment: "confirmed" });

  // Log the transaction signature
  console.log(
    "Payment completed with transaction signature:\n",
    `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`
  );
};

// Execute the function
payForService().catch(console.error);
