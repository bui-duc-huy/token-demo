import { SolanaConfigService, TestAccountService } from '@coin98/solana-support-library/config';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { DemoTokenServices } from '../services/demoToken.service';
import { SolanaService, TokenProgramService } from '@coin98/solana-support-library';
import { DemoTokenInstruction } from '../services/instructions.service';

describe("Mint token", function () {
  const PROGRAM_ID = new PublicKey('CX1bqbNdhuc2LS9h8i5frBK9B6CARj6s7Qc8XqCnMU7f')
  const connection: Connection = new Connection('http://localhost:8899', 'confirmed');
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

    console.log('xxxx')
    const a = await DemoTokenServices.createMetadataAccount(
      connection,
      'Coin',
      'C',
      'https://bafybeibh7jov6vmqo76ycnihairv7sqnblg74isi5ei32afp3zsfkch2li.ipfs.nftstorage.link/1510.json',
      ownerAccount,
      tokenMint,
      ownerAccount.publicKey,
      PROGRAM_ID
    )

    console.log(a)

    // await DemoTokenServices.createMasterEditionAccount(connection, ownerAccount, tokenMint, ownerAccount.publicKey, PROGRAM_ID);

  })
})