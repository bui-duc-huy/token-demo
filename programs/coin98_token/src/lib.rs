use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke;
use mpl_token_metadata::instruction as mpl_instrucions;
use anchor_spl::token;
pub mod constant;
pub mod context;
pub mod error;
pub mod event;
pub mod state;

use crate::context::*;
// use crate::constant::*;
// use crate::error::*;
// use crate::event::*;
// use crate::state::*;

declare_id!("4ahWyZYRFKDXsXqs96iXXDG92sVYSvsjDVLctwTNeWDD");

#[program]
pub mod coin98_token {
  use super::*;
  pub fn create_metadata_account(
    ctx: Context<CreateMetadataAccountContext>,
    name: String,
    symbol: String,
    uri: String
  ) -> Result<()> {
    // Create metadata account
    invoke(
      &mpl_instrucions::create_metadata_accounts_v3(
        ctx.accounts.metaplex_metadata_program_id.key(),
        ctx.accounts.metadata_account.key(),
        ctx.accounts.mint_account.key(),
        ctx.accounts.authority.key(),
        ctx.accounts.payer.key(),
        ctx.accounts.authority.key(),
        name,
        symbol,
        uri,
        None, // Creators
        500, // Seller fee basis points
        false, // Update authority is signer
        true, // Is mutable
        None, // Collection
        None, // Uses
        None // Collection Details
      ),
      &[
        ctx.accounts.metadata_account.to_account_info(),
        ctx.accounts.mint_account.to_account_info(),
        ctx.accounts.authority.to_account_info(),
        ctx.accounts.payer.to_account_info(),
        ctx.accounts.authority.to_account_info(),
        ctx.accounts.rent.to_account_info(),
      ]
    )?;

    msg!("NFT created successfully.");

    // Create master edition
    Ok(())
  }

  pub fn mint_nft(
    ctx: Context<MintNFTContext>
  ) -> Result<()> {
    token::mint_to(
      CpiContext::new(ctx.accounts.token_program.to_account_info(), token::MintTo {
        mint: ctx.accounts.mint_account.to_account_info(),
        to: ctx.accounts.recipient_ata_account.to_account_info(),
        authority: ctx.accounts.mint_authority.to_account_info(),
      }),
      1
    )?;
    msg!("Minted NFT ({}) to address: {}", ctx.accounts.mint_account.key().to_string() ,ctx.accounts.recipient_account.key().to_string());

    invoke(
      &mpl_instrucions::create_master_edition_v3(
        ctx.accounts.metaplex_metadata_program_id.key(),
        ctx.accounts.edition_account.key(),
        ctx.accounts.mint_account.key(),
        ctx.accounts.mint_authority.key(),
        ctx.accounts.mint_authority.key(),
        ctx.accounts.metadata_account.key(),
        ctx.accounts.payer.key(),
        Some(0)
      ),
      &[
        ctx.accounts.edition_account.to_account_info(),
        ctx.accounts.metadata_account.to_account_info(),
        ctx.accounts.mint_account.to_account_info(),
        ctx.accounts.mint_authority.to_account_info(),
        ctx.accounts.payer.to_account_info(),
        ctx.accounts.metaplex_metadata_program_id.to_account_info(),
        ctx.accounts.rent.to_account_info(),
      ]
    )?;

    msg!("Created master edition account.");
    Ok(())
  }
}
