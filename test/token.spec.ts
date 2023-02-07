import { SolanaConfigService, TestAccountService } from '@coin98/solana-support-library/config';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { DemoTokenServices } from '../services/demoToken.service';
import { SolanaService, TokenProgramService } from '@coin98/solana-support-library';
import { DemoTokenInstruction } from '../services/instructions.service';
import { web3 } from '@project-serum/anchor';
import { BN } from 'bn.js';

describe("Mint token", function () {
  const PROGRAM_ID = new PublicKey('CX1bqbNdhuc2LS9h8i5frBK9B6CARj6s7Qc8XqCnMU7f')
  const connection: Connection = new Connection('http://127.0.0.1:8899', 'confirmed');
  let ownerAccount: Keypair;
  let tokenMint: Keypair;

  before(async function () {
    ownerAccount = await SolanaConfigService.getDefaultAccount();
    tokenMint = Keypair.generate();
  })

  it("Create token", async function () {
    await TokenProgramService.createTokenMint(
      connection,
      ownerAccount,
      tokenMint,
      0,
      ownerAccount.publicKey,
      ownerAccount.publicKey
    );

    const tokenATA = TokenProgramService.findAssociatedTokenAddress(ownerAccount.publicKey, tokenMint.publicKey);

    await TokenProgramService.mint(
      connection,
      ownerAccount,
      ownerAccount,
      tokenMint.publicKey,
      tokenATA,
      new BN(1),
    )

    await DemoTokenServices.createMetadataAccount(
      connection,
      'Coin',
      'C',
      'https://bafybeibh7jov6vmqo76ycnihairv7sqnblg74isi5ei32afp3zsfkch2li.ipfs.nftstorage.link/1510.json',
      ownerAccount,
      tokenMint,
      ownerAccount.publicKey,
      PROGRAM_ID
    )

    console.log(tokenMint.publicKey.toString())

    await TokenProgramService.createAssociatedTokenAccount(connection, ownerAccount, ownerAccount.publicKey, tokenMint.publicKey);
    await DemoTokenServices.mintNft(connection, ownerAccount, ownerAccount.publicKey, tokenMint.publicKey, ownerAccount.publicKey, PROGRAM_ID)
  })
})