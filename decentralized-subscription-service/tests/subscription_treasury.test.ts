import { describe, it, expect } from "vitest";
import { Chain, Tx, types } from "../src/clarinet-mock";

describe("Subscription Treasury Contract", () => {
  it("should deposit funds into the treasury", () => {
    const userAddress = "ST1-user";
    const chain = new Chain();
    
    // Simulate a deposit call.
    const block = chain.mineBlock([
      Tx.contractCall("subscription-treasury", "deposit", [types.uint(1000000)], userAddress),
    ]);
    
    block.receipts.forEach((receipt) => {
      expect(receipt.result).toBe("(ok u1)");
    });
    
    // Simulate a read-only call to get total funds.
    const readCall = chain.callReadOnlyFn(
      "subscription-treasury", 
      "get-total-funds", 
      [], 
      userAddress
    );
    
    const totalFunds = readCall.result.expectOk().expectUint(1000000);
    expect(totalFunds).toBe(1000000);
  });

  it("should allow admin to withdraw funds", () => {
    const adminAddress = "ST2-admin";
    const recipientAddress = "ST3-recipient";
    const chain = new Chain();
    
    // Simulate a withdrawal call by admin.
    const withdrawBlock = chain.mineBlock([
      Tx.contractCall(
        "subscription-treasury",
        "withdraw-funds",
        [types.uint(1000000), types.principal(recipientAddress)],
        adminAddress
      ),
    ]);
    
    withdrawBlock.receipts.forEach((receipt) => {
      expect(receipt.result).toBe("(ok u1)");
    });
  });

  it("should allow only the admin to set treasury admin", () => {
    const adminAddress = "ST2-admin";
    const nonAdminAddress = "ST1-nonadmin";
    const chain = new Chain();
    
    // Simulate failure when a non-admin attempts to change treasury admin.
    const failBlock = chain.mineBlock([
      Tx.contractCall(
        "subscription-treasury", 
        "set-treasury-admin", 
        [types.principal(nonAdminAddress)], 
        nonAdminAddress
      ),
    ]);
    
    failBlock.receipts.forEach((receipt) => {
      expect(receipt.result).toBe("(err u403)");
    });
    
    // Simulate success when the current admin changes treasury admin.
    const successBlock = chain.mineBlock([
      Tx.contractCall(
        "subscription-treasury", 
        "set-treasury-admin", 
        [types.principal(nonAdminAddress)], 
        adminAddress
      ),
    ]);
    
    successBlock.receipts.forEach((receipt) => {
      expect(receipt.result).toBe("(ok u1)");
    });
  });
});
