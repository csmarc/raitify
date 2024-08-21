import {
  LAMPORTS_PER_SOL,
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  PublicKey,
  clusterApiUrl,
} from "@solana/web3.js";

import * as anchor from "@project-serum/anchor";

const wallet = pg.wallet;
const program = pg.program;

const sender = pg.wallet.keypair;

const estellePubkey = new PublicKey(
  "HFmEXcEenDYTuMdLrJ1mCYD9qH5S8yfCphKTGgyXLtXc"
);

const lamports = 100;

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

  // Log the transaction signature
  console.log(
    "Transaction Signature:",
    `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`
  );
};

const markAsPaid = async () => {
  const servicePublicKey = new PublicKey(
    "75zzvZ3uddQgzhhTFcYn3vXsZptaP9fmp4NKXHVt36pn"
  );
  const amount = new anchor.BN(100); // Example amount in lamports
  const tx = await program.methods
    .payForService(amount)
    .accounts({
      user: wallet.publicKey, // Bob's wallet
      estelleAccount: ESTELLE_PUBKEY, // Estelle's wallet
      serviceAccount: servicePublicKey,
      paymentStatus: Keypair.generate().publicKey, // Generate a new keypair for payment status
      systemProgram: SystemProgram.programId,
    })
    .rpc({ commitment: "confirmed" });

  console.log("Payment completed with transaction signature:", tx);
};

// Execute the function
payForService().catch(console.error);
