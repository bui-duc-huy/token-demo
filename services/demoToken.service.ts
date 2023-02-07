import {
  Connection,
  Keypair,
  PublicKey,
  TransactionInstruction,
  Transaction,
} from '@solana/web3.js';
import {
  SolanaService,
  TokenProgramInstructionService,
  TokenProgramService,
  sendTransaction,
} from '@coin98/solana-support-library';
import { BN, web3, SplToken } from '@project-serum/anchor';
import { createMintToInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token';

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
    const transaction: Transaction = new Transaction();

    const createMetadataAccountInstruction: TransactionInstruction = DemoTokenInstruction.createMetadataAccountInstruction(
      name,
      symbol,
      uri,
      payer.publicKey,
      mint.publicKey,
      authority,
      demoTokenProgramId,
    )
    transaction.add(createMetadataAccountInstruction)

    return sendTransaction(connection, transaction, [payer]);
  }

  static async mintNft(
    connection: Connection,
    payer: Keypair,
    recipientAccount: PublicKey,
    mintAccount: PublicKey,
    mintAuthority: PublicKey,
    demoTokenProgramId: PublicKey
  ): Promise<string> {
    const transaction: Transaction = new Transaction();
    const recipientAtaAccount = TokenProgramService.findAssociatedTokenAddress(recipientAccount, mintAccount);
    if (await SolanaService.isAddressAvailable(connection, recipientAtaAccount)) {
      transaction.add(
        TokenProgramInstructionService.createAssociatedTokenAccount(
          payer.publicKey,
          recipientAccount,
          mintAccount
        )
      )
    }

    const createMasterEditionAccountInstruction: TransactionInstruction = DemoTokenInstruction.mintNft(
      payer.publicKey,
      recipientAccount,
      mintAccount,
      mintAuthority,
      demoTokenProgramId
    )

    transaction.add(createMasterEditionAccountInstruction);
    return await sendTransaction(connection, transaction, [payer]);
  }
}