use anchor_lang::prelude::*;
// use mpl_token_metadata::solana_program
#[derive(Accounts)]
pub struct CreateMetadataAccountContext<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  /// CHECK: Metaplex will check this
  pub metaplex_metadata_program_id: UncheckedAccount<'info>,

  /// CHECK:
  #[account(mut)]
  pub metadata_account: AccountInfo<'info>,
  /// CHECK:
  #[account(mut)]
  pub mint_account: AccountInfo<'info>,
  /// CHECK:
  #[account(mut)]
  pub authority: AccountInfo<'info>,

  pub rent: Sysvar<'info, Rent>,
  pub system_program: Program<'info, System>,
  /// CHECK: Metaplex will check this
  pub token_program: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct MintNFTContext<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  /// CHECK: Metaplex will check this
  #[account(mut)]
  pub metadata_account: AccountInfo<'info>,
  
  /// CHECK: 
  #[account(mut)]
  pub recipient_account: AccountInfo<'info>,

  /// CHECK: 
  #[account(mut)]
  pub recipient_ata_account: AccountInfo<'info>,
  
  /// CHECK: Metaplex will check this
  pub metaplex_metadata_program_id: AccountInfo<'info>,
  /// CHECK:
  #[account(mut)]
  pub mint_account: AccountInfo<'info>,
  pub mint_authority: SystemAccount<'info>,  
  /// CHECK: Metaplex will check this
  #[account(mut)]
  pub edition_account: AccountInfo<'info>,

  pub rent: Sysvar<'info, Rent>,
  pub system_program: Program<'info, System>,
  /// CHECK: Metaplex will check this
  pub token_program: AccountInfo<'info>,
}
