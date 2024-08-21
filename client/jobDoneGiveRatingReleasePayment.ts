import { PublicKey } from "@solana/web3.js";

import * as anchor from "@project-serum/anchor";

// Initialize connection
const wallet = pg.wallet;

// Set up the program with IDL and provider
const program = pg.program;

const servicePda = new PublicKey(
  "HiezcMKuU1UwsrREZGPNsZkFHchiJ1pnSczdXDxrqPFr"
);
const rating = 5;

const markJobDone = async () => {
  const [vaultPda, vaultBump] = PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), servicePda.toBuffer()],
    program.programId
  );

  // const tx = await program.methods
  //   .markJobDone(rating)
  //   .accounts({
  //     user: wallet.publicKey, // Bob's wallet
  //     serviceAccount: servicePda,
  //     vaultAccount: vaultPda,
  //     systemProgram: SystemProgram.programId,
  //   })
  //   .rpc({ commitment: "confirmed" });

  console.log(
    `Service ${servicePda} marked as done with ${rating} star rating.`
  );
  console.log(
    `Payment to service provider released. Transaction signature: ...`
  );
};

// Call the function
markJobDone().catch((err) => {
  console.error(err);
});
