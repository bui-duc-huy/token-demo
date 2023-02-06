import {
  Connection,
  Keypair,
  PublicKey,
  TransactionInstruction,
  Transaction,
  sendAndConfirmTransaction
} from '@solana/web3.js';
import {
  sendTransaction,
} from '@coin98/solana-support-library';
import { BN, web3 } from '@project-serum/anchor';
import { DemoTokenInstruction } from './instructions.service';


export class DemoTokenServices {
  static async createMetadataAccount(
    connection: Connection,
    name: string,
    symbol: string,
    uri: string,
    payer: Keypair,
    mint: Keypair,
    authority: PublicKey,
    demoTokenProgramId: PublicKey
  ): Promise<string> {
    console.log(demoTokenProgramId.toString())
    const transaction: Transaction = new Transaction();
    const createTokenInstruction: TransactionInstruction = DemoTokenInstruction.createMetadataAccountInstruction(
      name,
      symbol,
      uri,
      payer.publicKey,
      mint.publicKey,
      authority,
      demoTokenProgramId,
    )
    console.log(createTokenInstruction)

    transaction.add(createTokenInstruction)

    return connection.sendTransaction(transaction, [payer]);
  }

  static async createMasterEditionAccount(
    connection: Connection,
    payer: Keypair,
    mintAccount: Keypair,
    mintAuthority: PublicKey,
    demoTokenProgramId: PublicKey
  ): Promise<string> {
    const transaction: Transaction = new Transaction();

    const createMasterEditionAccountInstruction: TransactionInstruction = DemoTokenInstruction.createMasterEditionAccountInstruction(
      payer.publicKey,
      mintAccount.publicKey,
      mintAuthority,
      demoTokenProgramId
    )

    transaction.add(createMasterEditionAccountInstruction);
    return await sendTransaction(connection, transaction, [payer]);
  }
}