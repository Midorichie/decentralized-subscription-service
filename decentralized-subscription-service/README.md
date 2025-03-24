# Decentralized Subscription Service

A blockchain-based subscription management system built on the Stacks blockchain using Clarity smart contracts. This project enables recurring payment handling for digital services in a decentralized way.

## Overview

The Decentralized Subscription Service provides a way for users to subscribe to services using STX tokens. The system keeps track of subscription periods, enables users to subscribe and cancel, and provides admins with tools to manage subscriptions.

## Smart Contracts

The project consists of two primary smart contracts:

### 1. Subscription Service Contract

The main contract that handles:
- User subscriptions
- Subscription period tracking
- Subscription status verification
- Admin functions for subscription management

### 2. Treasury Contract

A separate contract focused on financial operations:
- Handling deposits from subscribers
- Secure fund management
- Admin-controlled withdrawals
- Fund tracking

## Key Features

- **Subscription Management**: Users can subscribe and cancel their subscriptions
- **Automatic Expiry**: Built-in tracking of subscription expiry based on blockchain height
- **Decentralized Payment**: Uses STX tokens for subscription payments
- **Admin Controls**: Authorized principals can perform management operations
- **Security Focus**: Built with secure token handling practices
- **Status Checking**: Users can verify their subscription status

## Technical Details

- **Subscription Fee**: 1,000,000 microSTX (1 STX)
- **Subscription Duration**: 43,200 blocks (approximately 30 days at ~1 block per minute)
- **Security Measures**:
  - Principal-based access control
  - Safe token transfer handling
  - Contract-enforced subscription periods

## Getting Started

### Prerequisites

- [Clarinet](https://github.com/hirosystems/clarinet) installed
- [Stacks CLI tools](https://docs.stacks.co/references/stacks-cli) (optional)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/decentralized-subscription-service.git
cd decentralized-subscription-service
```

2. Use Clarinet to deploy and test:
```bash
clarinet console
```

### Usage Examples

#### Subscribe to a service

```clarity
(contract-call? .subscription-service subscribe)
```

#### Check subscription status

```clarity
(contract-call? .subscription-service check-subscription tx-sender)
```

#### Cancel a subscription

```clarity
(contract-call? .subscription-service cancel-subscription)
```

#### Admin: Extend a subscription

```clarity
(contract-call? .subscription-service extend-subscription 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7 u10000)
```

#### Admin: Withdraw funds

```clarity
(contract-call? .subscription-treasury withdraw u1000000 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7)
```

## Development

### Testing

Run the included test suite:
```bash
clarinet test
```

### Further Development Ideas

- Add tiered subscription models
- Implement subscription transferability
- Add multi-token support
- Create a frontend interface

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Stacks Foundation for blockchain infrastructure
- Clarity language documentation and community
