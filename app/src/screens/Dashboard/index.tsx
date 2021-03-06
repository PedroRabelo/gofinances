import React, {useCallback, useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTheme} from 'styled-components'
import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionList,
  LogoutButton,
  LoadContainer
} from './styles';
import {HighlightCard} from '../../components/HighlightCard';
import {TransactionCard, TransactionCardProps} from '../../components/TransactionCard';
import {useAuth} from '../../hooks/auth';

export interface DataListProps extends TransactionCardProps {
  id: string
}

interface HighlightProps {
  amount: string;
  lastTransaction: string;
}

interface HighlightData {
  entries: HighlightProps,
  expenses: HighlightProps,
  total: HighlightProps;
}

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);

  const theme = useTheme();
  const { user, signOut } = useAuth();

  function getLastTransactionData(
    collection: DataListProps[],
    type: 'positive' | 'negative'
  ) {
    const collectionFiltered = collection
      .filter(transaction => transaction.type === type);

    if (collectionFiltered.length === 0)
      return 0;

    const lastTransaction = new Date(
      Math.max.apply(Math, collectionFiltered
        .map(transaction => new Date(transaction.date).getTime())));

    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', {month: 'long'})}`;
  }

  async function loadTransactions() {
    const dataKey = `@gofinances:transactions_user:${user.id}`;
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    let entriesSum = 0;
    let expenseSum = 0;

    const transactionsFormatted: DataListProps[] =  transactions
      .map((item: DataListProps) => {

        if (item.type === 'positive') {
          entriesSum += Number(item.amount);
        } else {
          expenseSum += Number(item.amount);
        }

        const amount = Number(item.amount).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        });

        const date = item.date ? Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit'
        }).format(new Date(item.date)) : undefined;

        return {
          id: item.name,
          name: item.name,
          amount,
          type: item.type,
          category: item.category,
          date
        }
    });

    setTransactions(transactionsFormatted);

    const lastTransactionEntry = getLastTransactionData(transactions, 'positive');
    const lastTransactionExpense = getLastTransactionData(transactions, 'negative');
    const totalInterval = lastTransactionExpense === 0
      ? 'N??o h?? transa????es'
      : `01 a ${lastTransactionExpense}`;

    const total = entriesSum - expenseSum;

    setHighlightData({
      entries: {
        amount: entriesSum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: lastTransactionEntry === 0
          ? 'N??o h?? transa????es'
          : `??ltima entrada dia ${lastTransactionEntry}`,
      },
      expenses: {
        amount: expenseSum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: lastTransactionExpense === 0
          ? 'N??o h?? transa????es'
          : `??ltima sa??da dia ${lastTransactionExpense}`,
      },
      total: {
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: totalInterval,
      }
    });

    setIsLoading(false);
  }

  useEffect(() => {
    loadTransactions();
  },[]);

  useFocusEffect(useCallback(() => {
    loadTransactions();
  }, []));

  return (
    <Container>
      {
        isLoading ?
          <LoadContainer>
            <ActivityIndicator color={theme.colors.primary} size={'large'}/>
          </LoadContainer> :
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo source={{ uri: user.photo}}/>
                <User>
                  <UserGreeting>Ol??</UserGreeting>
                  <UserName>{user.name}</UserName>
                </User>
              </UserInfo>
              <LogoutButton onPress={signOut}>
                <Icon name={'power'}/>
              </LogoutButton>
            </UserWrapper>
          </Header>

          <HighlightCards>
            <HighlightCard
              type={'up'}
              title={'Entradas'}
              amount={highlightData.entries.amount}
              lastTransaction={highlightData.entries.lastTransaction}
            />
            <HighlightCard
              type={'down'}
              title={'Sa??das'}
              amount={highlightData.expenses.amount}
              lastTransaction={highlightData.expenses.lastTransaction}
            />
            <HighlightCard
              type={'total'}
              title={'Total'}
              amount={highlightData.total.amount}
              lastTransaction={highlightData.total.lastTransaction}
            />

          </HighlightCards>

          <Transactions>
            <Title>Listagem</Title>
            <TransactionList
              data={transactions}
              keyExtractor={item => item.id}
              renderItem={({ item }) => <TransactionCard data={item}/>}
            />
          </Transactions>
        </>
      }
    </Container>
  )
}
