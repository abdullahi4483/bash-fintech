import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface UserType {
  id: number;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  balance: number;
  status: 'Active' | 'Suspended';
  joined: string;
  accountType: string;
}

export interface TransactionType {
  id: number;
  userId: number;
  date: string;
  time: string;
  amount: number;
  type: 'Deposit' | 'Withdrawal' | 'Transfer' | 'Purchase';
  status: 'Completed' | 'Pending' | 'Failed';
  description: string;
}

export interface WithdrawalType {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  amount: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  requestDate: string;
  reason?: string;
}

export interface MessageType {
  id: number;
  userId: number;
  user: string;
  email: string;
  category: string;
  subject: string;
  message: string;
  status: 'Pending' | 'Replied' | 'Resolved';
  date: string;
  time: string;
}

interface AppContextType {
  users: UserType[];
  transactions: TransactionType[];
  withdrawals: WithdrawalType[];
  messages: MessageType[];
  currentUser: UserType | null;
  addUser: (user: Omit<UserType, 'id' | 'joined'>) => UserType;
  updateUser: (id: number, user: Partial<UserType>) => void;
  deleteUser: (id: number) => void;
  setCurrentUser: (user: UserType | null) => void;
  addTransaction: (transaction: Omit<TransactionType, 'id' | 'date' | 'time'>) => void;
  addWithdrawal: (withdrawal: Omit<WithdrawalType, 'id' | 'requestDate'>) => void;
  updateWithdrawal: (id: number, status: 'Approved' | 'Rejected') => void;
  addMessage: (message: Omit<MessageType, 'id' | 'date' | 'time' | 'status'>) => void;
  updateMessage: (id: number, status: 'Replied' | 'Resolved') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultUsers: UserType[] = [
  { id: 1, name: 'John Anderson', email: 'john@example.com', password: 'password123', balance: 125430, status: 'Active', joined: '2025-01-15', accountType: 'Premium' },
  { id: 2, name: 'Sarah Williams', email: 'sarah@example.com', password: 'password123', balance: 89250, status: 'Active', joined: '2025-02-20', accountType: 'Standard' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', password: 'password123', balance: 45680, status: 'Suspended', joined: '2024-11-10', accountType: 'Standard' },
  { id: 4, name: 'Emily Davis', email: 'emily@example.com', password: 'password123', balance: 156890, status: 'Active', joined: '2024-12-05', accountType: 'Premium' },
  { id: 5, name: 'Tom Brown', email: 'tom@example.com', password: 'password123', balance: 32100, status: 'Active', joined: '2026-01-08', accountType: 'Basic' },
  { id: 6, name: 'Lisa Garcia', email: 'lisa@example.com', password: 'password123', balance: 98450, status: 'Active', joined: '2025-03-12', accountType: 'Premium' },
  { id: 7, name: 'David Martinez', email: 'david@example.com', password: 'password123', balance: 67230, status: 'Suspended', joined: '2025-01-28', accountType: 'Standard' },
  { id: 8, name: 'Jessica Wilson', email: 'jessica@example.com', password: 'password123', balance: 142000, status: 'Active', joined: '2024-10-15', accountType: 'Premium' },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<UserType[]>(() => {
    const savedUsers = localStorage.getItem('users');
    return savedUsers ? JSON.parse(savedUsers) : defaultUsers;
  });

  const [transactions, setTransactions] = useState<TransactionType[]>([
    { id: 1, userId: 1, date: '2026-04-03', time: '10:30 AM', amount: 5000, type: 'Deposit', status: 'Completed', description: 'Salary Payment' },
    { id: 2, userId: 1, date: '2026-04-02', time: '02:15 PM', amount: -120, type: 'Withdrawal', status: 'Completed', description: 'ATM Withdrawal' },
    { id: 3, userId: 1, date: '2026-04-01', time: '09:45 AM', amount: -1200, type: 'Transfer', status: 'Completed', description: 'Rent Payment' },
    { id: 4, userId: 2, date: '2026-04-03', time: '11:20 AM', amount: 3000, type: 'Deposit', status: 'Completed', description: 'Client Payment' },
    { id: 5, userId: 3, date: '2026-04-02', time: '03:30 PM', amount: -500, type: 'Withdrawal', status: 'Pending', description: 'Cash Withdrawal' },
  ]);

  const [withdrawals, setWithdrawals] = useState<WithdrawalType[]>([
    { id: 1, userId: 1, userName: 'John Anderson', userEmail: 'john@example.com', amount: 5000, status: 'Pending', requestDate: '2026-04-03' },
    { id: 2, userId: 3, userName: 'Mike Johnson', userEmail: 'mike@example.com', amount: 10000, status: 'Pending', requestDate: '2026-04-02' },
    { id: 3, userId: 2, userName: 'Sarah Williams', userEmail: 'sarah@example.com', amount: 7500, status: 'Approved', requestDate: '2026-04-01' },
  ]);

  const [messages, setMessages] = useState<MessageType[]>([
    { id: 1, userId: 1, user: 'John Anderson', email: 'john@example.com', category: 'Withdrawal Request', subject: 'Urgent withdrawal verification needed', message: 'I submitted a withdrawal request for $5,000 3 days ago and need it processed urgently.', status: 'Pending', date: '2026-04-03', time: '10:30 AM' },
    { id: 2, userId: 2, user: 'Sarah Williams', email: 'sarah@example.com', category: 'Account Issue', subject: 'Cannot access my account', message: "I've been locked out of my account after multiple failed login attempts.", status: 'Pending', date: '2026-04-03', time: '09:15 AM' },
  ]);

  const [currentUser, setCurrentUser] = useState<UserType | null>(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Persist current user to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  // Update current user when users array changes
  useEffect(() => {
    if (currentUser) {
      const updatedUser = users.find(u => u.id === currentUser.id);
      if (updatedUser) {
        setCurrentUser(updatedUser);
      }
    }
  }, [users]);

  const addUser = (userData: Omit<UserType, 'id' | 'joined'>) => {
    const newUser: UserType = {
      ...userData,
      id: Math.max(...users.map(u => u.id), 0) + 1,
      joined: new Date().toISOString().split('T')[0],
    };
    setUsers([...users, newUser]);
    return newUser;
  };

  const updateUser = (id: number, updates: Partial<UserType>) => {
    setUsers(users.map(user => user.id === id ? { ...user, ...updates } : user));
  };

  const deleteUser = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
    setTransactions(transactions.filter(t => t.userId !== id));
    setWithdrawals(withdrawals.filter(w => w.userId !== id));
    setMessages(messages.filter(m => m.userId !== id));
  };

  const addTransaction = (transactionData: Omit<TransactionType, 'id' | 'date' | 'time'>) => {
    const now = new Date();
    const newTransaction: TransactionType = {
      ...transactionData,
      id: Math.max(...transactions.map(t => t.id), 0) + 1,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
    setTransactions([newTransaction, ...transactions]);

    // Update user balance
    if (transactionData.status === 'Completed') {
      updateUser(transactionData.userId, {
        balance: (users.find(u => u.id === transactionData.userId)?.balance || 0) + transactionData.amount
      });
    }
  };

  const addWithdrawal = (withdrawalData: Omit<WithdrawalType, 'id' | 'requestDate'>) => {
    const newWithdrawal: WithdrawalType = {
      ...withdrawalData,
      id: Math.max(...withdrawals.map(w => w.id), 0) + 1,
      requestDate: new Date().toISOString().split('T')[0],
    };
    setWithdrawals([newWithdrawal, ...withdrawals]);
  };

  const updateWithdrawal = (id: number, status: 'Approved' | 'Rejected') => {
    const withdrawal = withdrawals.find(w => w.id === id);
    if (withdrawal) {
      setWithdrawals(withdrawals.map(w => w.id === id ? { ...w, status } : w));

      // If approved, deduct from user balance and add transaction
      if (status === 'Approved') {
        updateUser(withdrawal.userId, {
          balance: (users.find(u => u.id === withdrawal.userId)?.balance || 0) - withdrawal.amount
        });

        addTransaction({
          userId: withdrawal.userId,
          amount: -withdrawal.amount,
          type: 'Withdrawal',
          status: 'Completed',
          description: 'Approved Withdrawal Request'
        });
      }
    }
  };

  const addMessage = (messageData: Omit<MessageType, 'id' | 'date' | 'time' | 'status'>) => {
    const now = new Date();
    const newMessage: MessageType = {
      ...messageData,
      id: Math.max(...messages.map(m => m.id), 0) + 1,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: 'Pending',
    };
    setMessages([newMessage, ...messages]);
  };

  const updateMessage = (id: number, status: 'Replied' | 'Resolved') => {
    setMessages(messages.map(m => m.id === id ? { ...m, status } : m));
  };

  return (
    <AppContext.Provider
      value={{
        users,
        transactions,
        withdrawals,
        messages,
        currentUser,
        addUser,
        updateUser,
        deleteUser,
        setCurrentUser,
        addTransaction,
        addWithdrawal,
        updateWithdrawal,
        addMessage,
        updateMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
