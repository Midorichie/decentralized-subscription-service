// A minimal mock implementation for Clarinet testing
export class Chain {
  private blocks: any[] = [];
  private currentAdmin: string = "ST2-admin";

  mineBlock(transactions: any[]) {
    const block = {
      receipts: transactions.map(tx => {
        // Check if it's a set-treasury-admin call
        if (tx.contract === "subscription-treasury" && tx.method === "set-treasury-admin") {
          // Only allow admin to set new admin
          const isAuthorized = tx.sender === this.currentAdmin;
          
          if (isAuthorized) {
            // Update current admin if authorized
            this.currentAdmin = tx.args[0];
            return {
              result: "(ok u1)",
              expectOk: () => ({
                expectTuple: () => ({
                  active: { value: true },
                }),
                expectUint: (value: number) => value
              })
            };
          } else {
            return {
              result: "(err u403)",
              expectOk: () => {
                throw new Error("Not authorized");
              }
            };
          }
        }
        
        // Default behavior for other calls
        return {
          result: "(ok u1)",
          expectOk: () => ({
            expectTuple: () => ({
              active: { value: true },
              expiry: { value: 50000 },
              "remaining-blocks": { value: 1000 }
            }),
            expectUint: (value: number) => value
          })
        };
      })
    };
    this.blocks.push(block);
    return block;
  }

  callReadOnlyFn(contract: string, method: string, args: any[], caller: string) {
    return {
      result: {
        expectOk: () => ({
          expectTuple: () => ({
            active: { value: true },
            expiry: { value: 50000 },
            "remaining-blocks": { value: 1000 }
          }),
          expectUint: (value: number) => value
        })
      }
    };
  }
}

export const Tx = {
  contractCall: (contract: string, method: string, args: any[], sender: string) => ({
    contract,
    method,
    args,
    sender
  })
};

export const types = {
  principal: (addr: string) => addr,
  uint: (num: number) => num
};
