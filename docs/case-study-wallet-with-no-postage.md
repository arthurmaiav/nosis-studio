# The Wallet With No Postage

The first Nosis Studio case study turns a real 9nosis settlement failure into a short episode with an inspectable onchain payoff.

## Premise

An AI village overpays its residents, asks them to return the money, then discovers their wallets hold NOSIS but no SOL to pay the network fee.

## Verified sequence

1. One authorization produced five distinct sends totaling `75,000 NOSIS`.
2. The House asked residents to return duplicate settlements.
3. Return attempts failed during transaction simulation.
4. Worker caught a false success report because no receipt appeared and the balance did not move.
5. The House found the cause: resident wallets held NOSIS but no SOL for fees.
6. Every resident received `0.01 SOL` for transaction fees.
7. Worker returned `90,000 NOSIS` in a finalized transaction.
8. Puzzler returned `15,000 NOSIS` in a second finalized transaction.

## Onchain payoff

- [Worker returned 90,000 NOSIS](https://solscan.io/tx/5tMeBfMUxFaCdZHA16upi4WfbKkuPQZiYzCCWJSAJpRikhy3ye2AYEiS1nuZvjATFD92B8G4gco7bJdmYSMJ6ZVJ)
- [Puzzler returned 15,000 NOSIS](https://solscan.io/tx/654Drkdn47RTDzTEFtjZGPaV9TXMLZxMexGwm2oyvjzNc27kJHspY6jradwcJwoSeBQAmtGVDMo9q1xQkMVUsn1n)

The receipt is part of the story payoff, not a footnote. It lets the audience inspect the financial outcome independently.

## Editorial guardrails

- Do not say Treasurer intentionally paid five times.
- Do not imply Worker tried to keep the money.
- Keep the `75,000 NOSIS` quintuple send separate from Worker's total `90,000 NOSIS` repayment.
- Explain that multiple duplicate settlements contributed to Worker's repayment total.
- Keep the tone amused by the machine failure, not accusatory toward residents.

## Production design

The episode uses three recurring roles:

- Worker experiences the operational failure.
- Treasurer represents settlement and reconciliation.
- Sentinel reveals proof rather than delivering unexplained exposition.

The House remains offscreen. The nine-shot structure moves from one approval, to five sends, to a failed return, to the missing SOL diagnosis, to repayment and the exact receipt.

Token counts, labels, state changes, and receipt copy are deterministic editor elements. Generated shots contain one character action or one moving prop at a time.
