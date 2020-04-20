import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

class GetTransactionService {
  public async execute(): Promise<Transaction[]> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const categoryRepository = await getRepository(Category);
    const transactions = await transactionsRepository.find();
    const newTransactions: Transaction[] = [];
    await Promise.all(
      transactions.map(async transaction => {
        const category = await categoryRepository.findOne({
          where: { id: transaction.category_id },
        });
        if (category === undefined) {
          return;
        }
        const newTransaction = transaction;
        delete newTransaction.category_id;
        delete newTransaction.created_at;
        delete newTransaction.updated_at;
        delete category.updated_at;
        delete category.created_at;
        newTransaction.category = category;
        newTransactions.push(newTransaction);
      }),
    );
    return newTransactions;
  }
}

export default GetTransactionService;
