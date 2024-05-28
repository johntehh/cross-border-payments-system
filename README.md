# CROSS-BORDER PAYMENTS SYSTEM

The Cross-Border Payments System is a blockchain-based platform that enables secure, efficient, and low-cost international payments. This system simplifies cross-border transactions by leveraging blockchain technology to provide transparency, reduce intermediaries, and lower transaction fees.

## Features

### 1. Payment Management

- Create, read, update, and delete payment transactions.
- Each transaction includes details such as sender, recipient, amount, currency, and transaction status.

### 2. Transaction History

- Maintain a history of all transactions, recording details of each payment and status updates.

### 3. Real-Time Notifications

- Send notifications to users regarding the status of their transactions.

### 4. Escrow Services

- Implement an escrow system to hold funds until certain conditions are met, providing additional security for transactions.

## Getting Started

To run the Cross-Border Payments System project locally, follow these steps:

1. Install Node.js (version 20 and above) and npm.
2. Clone this repository.
3. Install podman.
4. Install dfx.
5. Install dependencies: `npm install`
6. Start the program: `dfx start --clean --background --host 127.0.0.1:8000` then `dfx deploy`.
7. Access the API endpoints using an HTTP client such as Postman or curl.
8. Stop the application: `dfx stop`

## API Endpoints

Use the following API endpoints to interact with the application:

1. `POST /transactions`: Create a new payment transaction.

- Example: `curl -X POST http://<CANISTER-ID>.localhost:8000/transactions -H "Content-type: application/json" -d '{ "sender": "John Doe", "recipient": "Jane Doe", "amount": "1000", "currency": "usd", "escrow": "true", "escrowReleaseCondition": "The escrow condition" }'`

2. `GET /transactions`: Get all payment transactions.

- Example: `curl http://<CANISTER-ID>.localhost:8000/transactions`

3. `GET /transactions/:id`: Get details of a specific transaction by ID.

- Example: `curl http://<CANISTER-ID>.localhost:8000/transactions/<TRANSACTION-ID>`

4. `PUT /transactions/:id`: Update the status of a specific transaction by ID.

- Example: `curl -X PUT http://<CANISTER-ID>.localhost:8000/transactions/<TRANSACTION-ID> -H "Content-type: application/json" -d '{ "sender": "John Doe", "recipient": "Jane Doe", "amount": "1500", "currency": "gbp", "escrow": "true", "escrowReleaseCondition": "Updated escrow condition" }'`

5. `DELETE /transactions/:id`: Delete a specific transaction by ID.

- Example: `curl -X DELETE http://<CANISTER-ID>.localhost:8000/transactions/<TRANSACTION-ID>`

6. `POST /transactions/:id/release-escrow`: Release escrow for a specific transaction.

- Example: `curl -X PUT http://<CANISTER-ID>.localhost:8000/transactions/<TRANSACTION-ID>/release-escrow -H "Content-type: application/json" -d '{ "conditionMet": "true" }'`
