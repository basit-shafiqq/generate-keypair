import {
    Connection,
    Transaction,
    SystemProgram,
    sendAndConfirmTransaction,
    PublicKey,
    LAMPORTS_PER_SOL,
    Keypair
} from "@solana/web3.js";
import "dotenv/config";

// Use dynamic import for ES Module
async function loadHelpers() {
    const { airdropIfRequired, getKeypairFromEnvironment } = await import('@solana-developers/helpers');

    const suppliedToPubkey = process.argv[2] || null;

    if (!suppliedToPubkey) {
        console.log("Please provide a public key to send to");
        process.exit(1);
    }

    const senderKeypair = getKeypairFromEnvironment("SECRET_KEY");
    const keypair = Keypair.generate();

    if (!senderKeypair) {
        console.error("Error: Unable to load sender keypair from environment");
        process.exit(1);
    }

    console.log(`suppliedToPubkey: ${suppliedToPubkey}`);

    const toPubkey = new PublicKey(suppliedToPubkey);

    const connection = new Connection("https://api.devnet.solana.com", "confirmed");

  

    console.log(
        `✅ Loaded our own keypair, the destination public key, and connected to Solana`,
    );

    const transaction = new Transaction();

    const LAMPORTS_TO_SEND = 5000;

    const sendSolInstruction = SystemProgram.transfer({
        fromPubkey: senderKeypair.publicKey,
        toPubkey,
        lamports: LAMPORTS_TO_SEND,
    });

    // Uncomment if airdrop is required
    await airdropIfRequired(
        connection,
        senderKeypair.publicKey,
        1 * LAMPORTS_PER_SOL,
        0.5 * LAMPORTS_PER_SOL,
    );

    transaction.add(sendSolInstruction);

    try {
        const signature = await sendAndConfirmTransaction(connection, transaction, [
            senderKeypair,
        ]);

        console.log(
            `💸 Finished! Sent ${LAMPORTS_TO_SEND} lamports to the address ${toPubkey}.`
        );
        console.log(`Transaction signature is ${signature}!`);
    } catch (error) {
        console.error("Transaction failed:", error);
    }

    console.log(
        `✅ Loaded our own keypair, the destination public key, and connected to Solana`,
    );
}

loadHelpers();
