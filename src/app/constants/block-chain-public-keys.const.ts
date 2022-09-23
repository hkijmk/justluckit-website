import { PublicKey } from '@solana/web3.js';

export const BLOCK_CHAIN_KEYS = {
    host: new PublicKey("6dn3C4UwnwFCXceLP99jpXZynRAEx1Zi644kcbcHpgFF"),
    programId: new PublicKey("DJaSdF3qmw3KdE82oTNHCnSDvij9EtEr1xL2pGESMAyv"),
    record: new PublicKey("7JJurLjM2PnZGDt7TtsyawobZejV5VcDxVz6FJ8ScySE"), // Week/counter info
    term: new PublicKey("2zpLySmhPWmjeof8KNeHmmXQJiWQYQFa26JnpFtNAZ1G"), // Game/Host Pricing
    minerTerms: new PublicKey("87BywfRdwL4GmTsGptWGv4AaPs3um1Vp5jdAX8HJs73F"), // How much miners will earn
    dateOfDraw: new PublicKey("4m34LMb9Kc7aCiXfdvPtx1M15qNTL4ztJGUuNEfXLwNW"), // Milliseconds to when the lotto will happen
    howOften: new PublicKey("AqtvXKUgAvKM7gfFoAGichizyjcUvsCLprtCaYyBbmxR"),
    lottoFund: new PublicKey("CBKbeSGXYwgAboku6UXcVBR1yfd9mvzMrjoExLFrgNsg"), // Money to give to winners
    rentTerms: new PublicKey("BcJLA7X6DWkpnDsbALXP88Z7baSrSVg4PdcykTvUX8kT"), // Stable Solana money account
    lottery: new PublicKey("FEHczfXRR41sYghTkB8Lm6RgPGsQgrST5DkdJSt2Hs4u"),
}
