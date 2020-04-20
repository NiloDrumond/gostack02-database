import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const income = transactions.reduce((acc, { value, type }) => {
      if (type === 'income') {
        return acc + value;
      }

      return acc;
    }, 0);
    const outcome = transactions.reduce((acc, { value, type }) => {
      if (type === 'outcome') {
        return acc + value;
      }

      return acc;
    }, 0);
    const total = income - outcome;
    const balance = {
      income,
      outcome,
      total,
    };

    return balance;
  }
}

export default TransactionsRepository;
