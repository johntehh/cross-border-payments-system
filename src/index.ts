import { v4 as uuidv4 } from "uuid";
import { Server, StableBTreeMap, ic } from "azle";
import express from "express";

/**
 * Represents a payment transaction.
 */
class PaymentTransaction {
  id: string;
  sender: string;
  recipient: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: Date;
  updatedAt: Date | null;
  transactionHistory: string[];
  escrow: boolean;
  escrowReleaseCondition: string | null; // Condition for releasing escrow, e.g., delivery confirmation
}

const paymentTransactionsStorage = StableBTreeMap<string, PaymentTransaction>(
  0
);

export default Server(() => {
  const app = express();
  app.use(express.json());

  // Create a new payment transaction
  app.post("/transactions", (req, res) => {
    const {
      sender,
      recipient,
      amount,
      currency,
      escrow,
      escrowReleaseCondition,
    } = req.body;

    // Validate input
    if (
      !sender ||
      !recipient ||
      !amount ||
      !currency ||
      isNaN(amount) ||
      amount <= 0
    ) {
      return res.status(400).json({
        error:
          "Invalid input. 'sender', 'recipient', 'amount', and 'currency' are required fields, and 'amount' must be a positive number",
      });
    }

    const transaction: PaymentTransaction = {
      id: uuidv4(),
      sender,
      recipient,
      amount,
      currency,
      status: "pending",
      createdAt: getCurrentDate(),
      updatedAt: null,
      transactionHistory: [`Transaction created by ${sender}`],
      escrow: escrow || false,
      escrowReleaseCondition: escrow ? escrowReleaseCondition : null,
    };

    paymentTransactionsStorage.insert(transaction.id, transaction);
    res.json(transaction);
  });

  // Get all transactions
  app.get("/transactions", (req, res) => {
    res.json(paymentTransactionsStorage.values());
  });

  // Get a specific transaction
  app.get("/transactions/:id", (req, res) => {
    const transactionId = req.params.id;
    const transactionOpt = paymentTransactionsStorage.get(transactionId);
    if ("None" in transactionOpt) {
      res.status(404).send(`Transaction with ID=${transactionId} not found`);
    } else {
      res.json(transactionOpt.Some);
    }
  });

  // Update a transaction status
  app.put("/transactions/:id", (req, res) => {
    const transactionId = req.params.id;
    const { status } = req.body;

    // Validate input
    if (!status) {
      return res.status(400).json({ error: "Status is a required field" });
    }

    const transactionOpt = paymentTransactionsStorage.get(transactionId);
    if ("None" in transactionOpt) {
      res.status(400).send(`Transaction with ID=${transactionId} not found`);
    } else {
      const transaction = transactionOpt.Some;
      transaction.status = status;
      transaction.updatedAt = getCurrentDate();
      transaction.transactionHistory.push(`Status updated to ${status}`);
      paymentTransactionsStorage.insert(transaction.id, transaction);
      res.json(transaction);
    }
  });

  // Release escrow (for escrow transactions)
  app.post("/transactions/:id/release-escrow", (req, res) => {
    const transactionId = req.params.id;
    const { conditionMet } = req.body;

    // Validate input
    if (conditionMet === undefined) {
      return res
        .status(400)
        .json({ error: "ConditionMet is a required field" });
    }

    const transactionOpt = paymentTransactionsStorage.get(transactionId);
    if ("None" in transactionOpt) {
      res.status(400).send(`Transaction with ID=${transactionId} not found`);
    } else {
      const transaction = transactionOpt.Some;
      if (!transaction.escrow) {
        return res
          .status(400)
          .send(
            `Transaction with ID=${transactionId} is not an escrow transaction`
          );
      }
      if (conditionMet) {
        transaction.status = "completed";
        transaction.updatedAt = getCurrentDate();
        transaction.transactionHistory.push(`Escrow released`);
      } else {
        return res.status(400).send(`Escrow release condition not met`);
      }
      paymentTransactionsStorage.insert(transaction.id, transaction);
      res.json(transaction);
    }
  });

  return app.listen();
});

function getCurrentDate() {
  const timestamp = new Number(ic.time());
  return new Date(timestamp.valueOf() / 1000_000);
}
