use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, System, Transfer};

declare_id!("6qEzpDYoYmPJNdsfnAGU7pR5KWgc8qjGtUg6eG9W1Hst");

#[program]
pub mod service_platform {
    use super::*;

    pub fn register_service(
        ctx: Context<RegisterService>,
        description: String,
        price: u64,
    ) -> Result<()> {
        msg!("Register Service: {}", description);

        let service_account = &mut ctx.accounts.service_account;
        service_account.user = ctx.accounts.user.key();
        service_account.description = description;
        service_account.price = price;
        service_account.rating = 0;
        service_account.bump = ctx.bumps.service_account;

        Ok(())
    }

    // pub fn pay_for_service(ctx: Context<PayForService>, amount: u64) -> Result<()> {
    //     let estelle_pubkey =
    //         Pubkey::from_str("HFmEXcEenDYTuMdLrJ1mCYD9qH5S8yfCphKTGgyXLtXc").unwrap();

    //     let transfer_accounts = Transfer {
    //         from: ctx.accounts.user.to_account_info(),
    //         to: ctx.accounts.vault_account.to_account_info(),
    //     };
    //     let cpi_context = CpiContext::new(
    //         ctx.accounts.system_program.to_account_info(),
    //         transfer_accounts,
    //     );
    //     transfer(cpi_context, amount)?;

    //     let payment_status = &mut ctx.accounts.payment_status;
    //     payment_status.service_id = ctx.accounts.service_account.key();
    //     payment_status.payer = *ctx.accounts.user.key;
    //     payment_status.paid = true;
    //     Ok(())
    // }
}

#[derive(Accounts)]
#[instruction(description: String)]
pub struct RegisterService<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        init,
        payer = user,
        seeds = [b"service", user.key().as_ref()],
        bump,
        space = 8 + 32 + 4 + description.len() + 8 + 1 + 1
    )]
    pub service_account: Account<'info, ServiceAccount>,
    pub system_program: Program<'info, System>,
}

// #[derive(Accounts)]
// pub struct PayForService<'info> {
//     #[account(mut)]
//     pub user: Signer<'info>,

//     #[account(mut, address = Pubkey::from_str("HFmEXcEenDYTuMdLrJ1mCYD9qH5S8yfCphKTGgyXLtXc").unwrap())]
//     pub estelle_account: AccountInfo<'info>,

//     #[account(mut)]
//     pub service_account: Account<'info, ServiceAccount>,

//     #[account(init, payer = user, space = 8 + 32 + 32 + 1)]
//     pub payment_status: Account<'info, PaymentStatus>,
//     pub system_program: Program<'info, System>,
// }

#[account]
pub struct ServiceAccount {
    pub user: Pubkey,        // 32 bytes
    pub description: String, // 4 bytes (length prefix) + actual string length
    pub price: u64,          // 8 bytes
    pub rating: u8,          // 1 byte
    pub bump: u8,            // 1 byte
}

#[account]
pub struct PaymentStatus {
    pub service_id: Pubkey, // 32 bytes (Pubkey)
    pub payer: Pubkey,      // 32 bytes (Pubkey)
    pub paid: bool,         // 1 byte
}
