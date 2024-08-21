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

const payForService = async () => {
  const servicePublicKey = new PublicKey(
    "Be3Bp42T1yodfnCZyCRiRppaccF86jP5KCbiKcyc6haA"
  );
  const amount = new anchor.BN(100); // Example amount in lamports

  const [vaultPda, vaultBump] = PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), servicePublicKey.toBuffer()],
    program.programId
  );

  const [paymentStatus, paymentStatusPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("status"),
      servicePublicKey.toBuffer(),
      wallet.publicKey.toBuffer(),
    ],
    program.programId
  );

  const tx = await program.methods
    .payForService(amount)
    .accounts({
      vaultAccount: vaultPda,
      serviceAccount: servicePublicKey,
      paymentStatus: paymentStatusPda,
      systemProgram: SystemProgram.programId,
    })
    .rpc({ commitment: "confirmed" });

  console.log("Payment completed with transaction signature:", tx);
};

// Execute the function
payForService().catch(console.error);
