import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { parseISO, format } from 'date-fns';
import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
  createdAtFormatted?: string;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const res = await api.get('transactions');

      const transactionsData = res.data.transactions.map((tx: any) => {
        return {
          ...tx,
          value: formatValue(tx.value),
          createdAtFormatted: format(parseISO(tx.created_at), 'dd/MM/yyyy', {}),
        };
      });

      setTransactions(transactionsData);

      const balanceData = res.data.balance;
      balanceData.income = formatValue(balanceData.income);
      balanceData.outcome = formatValue(balanceData.outcome);
      balanceData.total = formatValue(balanceData.total);
      setBalance(balanceData);
    }

    loadTransactions();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{balance.income}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">{balance.outcome}</h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{balance.total}</h1>
          </Card>
        </CardContainer>

        <br />
        <Link to="import">Importar</Link>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td className="title">{transaction.title}</td>
                  {transaction.type === 'income' && (
                    <td className="income">{transaction.value}</td>
                  )}
                  {transaction.type === 'outcome' && (
                    <td className="outcome">{`- ${transaction.value}`}</td>
                  )}
                  <td>{transaction.category.title}</td>
                  <td>{transaction.createdAtFormatted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
