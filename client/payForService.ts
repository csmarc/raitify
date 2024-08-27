import {
  Keypair,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";

const wallet = pg.wallet;
const program = pg.program;
const sender = wallet.keypair;

// Define escrow program ID (replace with your actual program ID)
const ESCROW_PROGRAM_ID = new PublicKey("Your_Escrow_Program_ID_Here");

const createEscrow = async (amount: number, receiverPubkey: PublicKey) => {
  const escrowAccount = Keypair.generate();
  const lamports = amount * LAMPORTS_PER_SOL;

  const createEscrowIx = await program.methods
    .createEscrow(new anchor.BN(lamports))
    .accounts({
      escrow: escrowAccount.publicKey,
      sender: sender.publicKey,
      receiver: receiverPubkey,
      systemProgram: SystemProgram.programId,
    })
    .instruction();

  const transferToEscrowIx = SystemProgram.transfer({
    fromPubkey: sender.publicKey,
    toPubkey: escrowAccount.publicKey,
    lamports,
  });

  const transaction = new Transaction().add(createEscrowIx, transferToEscrowIx);

  const txSignature = await sendAndConfirmTransaction(
    pg.connection,
    transaction,
    [sender, escrowAccount]
  );

  console.log(
    `Escrow created and funded: https://solana.fm/tx/${txSignature}?cluster=devnet-solana`
  );
  return escrowAccount.publicKey;
};

const completeEscrow = async (escrowPubkey: PublicKey) => {
  const completeEscrowIx = await program.methods
    .completeEscrow()
    .accounts({
      escrow: escrowPubkey,
      sender: sender.publicKey,
      receiver: receiverPubkey, // Assuming receiverPubkey is defined
      systemProgram: SystemProgram.programId,
    })
    .instruction();

  const transaction = new Transaction().add(completeEscrowIx);

  const txSignature = await sendAndConfirmTransaction(
    pg.connection,
    transaction,
    [sender]
  );

  console.log(
    `Escrow completed: https://solana.fm/tx/${txSignature}?cluster=devnet-solana`
  );
};

const cancelEscrow = async (escrowPubkey: PublicKey) => {
  const cancelEscrowIx = await program.methods
    .cancelEscrow()
    .accounts({
      escrow: escrowPubkey,
      sender: sender.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .instruction();

  const transaction = new Transaction().add(cancelEscrowIx);

  const txSignature = await sendAndConfirmTransaction(
    pg.connection,
    transaction,
    [sender]
  );

  console.log(
    `Escrow cancelled: https://solana.fm/tx/${txSignature}?cluster=devnet-solana`
  );
};

// Example usage
const main = async () => {
  const receiverPubkey = new PublicKey("Receiver_Public_Key_Here");
  const escrowPubkey = await createEscrow(1, receiverPubkey); // Create escrow with 1 SOL

  // Simulate some time passing or condition met
  await new Promise((resolve) => setTimeout(resolve, 5000));

  // Complete the escrow
  await completeEscrow(escrowPubkey);

  // Or cancel the escrow if needed
  // await cancelEscrow(escrowPubkey);
};

main().catch(console.error);
