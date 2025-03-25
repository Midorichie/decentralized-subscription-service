import { describe, it, expect } from "vitest";
import { Chain, Tx, types } from "../src/clarinet-mock";

describe("Subscription Service Contract", () => {
  it("should subscribe a user when balance is sufficient", () => {
    const userAddress = "ST1-user";
    const chain = new Chain();
    
    // Simulate calling the subscribe function.
    const block = chain.mineBlock([
      Tx.contractCall("subscription-service", "subscribe", [], userAddress),
    ]);
    
    // Check that each receipt returned success.
    block.receipts.forEach((receipt) => {
      expect(receipt.result).toBe("(ok u1)");
    });
    
    // Simulate a read-only call for checking subscription status.
    const readCall = chain.callReadOnlyFn(
      "subscription-service",
      "check-subscription",
      [types.principal(userAddress)],
      userAddress
    );
    const subscription = readCall.result.expectOk().expectTuple();
    expect(subscription.active.value).toBe(true);
    expect(subscription.expiry.value).toBe(50000);
    expect(subscription["remaining-blocks"].value).toBe(1000);
  });

  it("should allow a user to cancel a subscription", () => {
    const userAddress = "ST1-user";
    const chain = new Chain();
    
    // Simulate calling the cancel-subscription function.
    const block = chain.mineBlock([
      Tx.contractCall("subscription-service", "cancel-subscription", [], userAddress),
    ]);
    
    block.receipts.forEach((receipt) => {
      expect(receipt.result).toBe("(ok u1)");
    });
  });

  it("should allow admin to extend a subscription", () => {
    const adminAddress = "ST2-admin";
    const userAddress = "ST1-user";
    const chain = new Chain();
    
    // Simulate admin extending the subscription.
    const extendBlock = chain.mineBlock([
      Tx.contractCall(
        "subscription-service",
        "extend-subscription",
        [types.principal(userAddress), types.uint(100)],
        adminAddress
      ),
    ]);
    
    extendBlock.receipts.forEach((receipt) => {
      expect(receipt.result).toBe("(ok u1)");
    });
  });
});
