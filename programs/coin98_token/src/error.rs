use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Coin98Gift: Invalid account")]
    InvalidAccount,
}
