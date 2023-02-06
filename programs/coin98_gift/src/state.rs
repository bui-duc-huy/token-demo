use anchor_lang::prelude::*;

#[account]
pub struct WhiteList {
  pub addresses: Vec<Pubkey>,
}

