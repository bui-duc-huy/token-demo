import {
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  Keypair,
  SYSVAR_RENT_PUBKEY
} from '@solana/web3.js';
import { BN, Idl } from '@project-serum/anchor';
import {
  IdlParserService,
  HashService,
  MerkleNode,
  BufferLayoutService,
  TOKEN_PROGRAM_ID,
  TokenProgramService,
} from '@coin98/solana-support-library';
import { PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";

import MintNftToken from "../target/idl/coin98_token.json";
const parser = new IdlParserService(MintNftToken as Idl) as any;

export class DemoTokenInstruction {
  static createMetadataAccountInstruction(
    name: string,
    symbol: string,
    uri: string,
    payer: PublicKey,
    mint: PublicKey,
    authority: PublicKey,
    demoTokenProgramId: PublicKey
  ): TransactionInstruction {
    const [metadataAccount] = this.findMetadataAccount(mint);
    console.log(TOKEN_METADATA_PROGRAM_ID.toString())

    return parser.createMetadataAccount(
      {
        name,
        symbol,
        uri
      },
      {
        payer,
        metaplexMetadataProgramId: TOKEN_METADATA_PROGRAM_ID,
        metadataAccount,
        mintAccount: mint,
        authority,
        rent: SYSVAR_RENT_PUBKEY,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID
      },
      demoTokenProgramId
    )
  }

  static createMasterEditionAccountInstruction(
    payer: PublicKey,
    mintAccount: PublicKey,
    mintAuthority: PublicKey,
    demoTokenProgramId: PublicKey,
  ): TransactionInstruction {
    const [metadataAccount] = this.findMetadataAccount(mintAccount);
    const [editionAccount] = this.findMasterEditionAccount(mintAccount);

    return parser.createMasterEditionAccount(
      {
      },
      {
        payer,
        metadataAccount,
        metaplexMetadataProgramId: TOKEN_METADATA_PROGRAM_ID,
        mintAccount,
        mintAuthority,
        editionAccount,
        rent: SYSVAR_RENT_PUBKEY,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
      demoTokenProgramId
    )
  }

  static findMetadataAccount(mintAddress: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mintAddress.toBuffer()
      ], TOKEN_METADATA_PROGRAM_ID
    )
  }

  static findMasterEditionAccount(mintAddress: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mintAddress.toBuffer(),
        Buffer.from('edition')
      ], TOKEN_METADATA_PROGRAM_ID
    )
  }
}