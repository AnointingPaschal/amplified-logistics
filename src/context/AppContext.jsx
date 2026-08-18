import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MOCK_ORDERS, MOCK_RIDERS, MOCK_USERS, generateId } from '../utils/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { const s = localStorage.getItem('al_user'); return s ? JSON.parse(s) : null; } catch { return null; }
  });
  const [orders, setOrders] = useState(() => {
    try { const s = localStorage.getItem('al_orders'); return s ? JSON.parse(s) : MOCK_ORDERS; } catch { return MOCK_ORDERS; }
  });
  const [riders, setRiders] = useState(MOCK_RIDERS);
  const [users, setUsers] = useState(() => {
    try { const s = localStorage.getItem('al_users'); return s ? JSON.parse(s) : MOCK_USERS; } catch { return MOCK_USERS; }
  });
  const [wallet, setWallet] = useState(() => {
    try { const s = localStorage.getItem('al_wallet'); return s ? JSON.parse(s) : { balance: 15000, transactions: [{ id: 't1', type: 'credit', amount: 15000, method: 'bank', description: 'Initial wallet funding', time: new Date().toISOString() }] }; } catch { return { balance: 15000, transactions: [] }; }
  });
  const [notifications, setNotifications] = useState([
    { id: 'n1', text: 'Your order #ALXK92P is in transit', time: '2m ago', read: false, type: 'order' },
    { id: 'n2', text: 'Rider Emeka is 5 mins away', time: '10m ago', read: false, type: 'rider' },
    { id: 'n3', text: 'Order #ALMP71R delivered successfully!', time: '1h ago', read: true, type: 'success' },
    { id: 'n4', text: 'Welcome to Amplified Logistics! 🎉', time: '1d ago', read: true, type: 'info' },
  ]);
  const [chat, setChat] = useState([
    { id: 'c1', text: "I'm on my way to pick up your package", sender: 'rider', time: new Date(Date.now() - 600000).toISOString() },
    { id: 'c2', text: 'Ok, the gate is open. Package is at the reception', sender: 'customer', time: new Date(Date.now() - 540000).toISOString() },
    { id: 'c3', text: 'Got it! Be there in 5 minutes', sender: 'rider', time: new Date(Date.now() - 480000).toISOString() },
  ]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [toast, setToast] = useState(null);
  const [promoApplied, setPromoApplied] = useState(null);

  useEffect(() => { try { if (user) localStorage.setItem('al_user', JSON.stringify(user)); else localStorage.removeItem('al_user'); } catch {} }, [user]);
  useEffect(() => { try { localStorage.setItem('al_orders', JSON.stringify(orders)); } catch {} }, [orders]);
  useEffect(() => { try { localStorage.setItem('al_wallet', JSON.stringify(wallet)); } catch {} }, [wallet]);
  useEffect(() => { try { localStorage.setItem('al_users', JSON.stringify(users)); } catch {} }, [users]);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const login = useCallback((email, password, role) => {
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role === role);
    if (found && (password === 'password' || found.password === password)) {
      setUser(found);
      return { success: true, user: found };
    }
    return { success: false, error: 'Invalid credentials. Use password: "password"' };
  }, [users]);

  const signup = useCallback((data) => {
    const exists = users.find(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (exists) return { success: false, error: 'Email already registered' };
    const newUser = {
      id: generateId(), ...data, avatar: null,
      createdAt: new Date().toISOString(),
      verified: data.role !== 'rider',
      walletBalance: 0,
      referralCode: 'AMP' + generateId().slice(0, 6).toUpperCase(),
      savedAddresses: [],
      rating: null,
      deliveriesCompleted: 0,
    };
    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
    return { success: true, user: newUser };
  }, [users]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('al_user');
  }, []);

  const updateProfile = useCallback((data) => {
    setUser(prev => ({ ...prev, ...data }));
    setUsers(prev => prev.map(u => u.id === user?.id ? { ...u, ...data } : u));
    showToast('Profile updated successfully', 'success');
  }, [user, showToast]);

  const createOrder = useCallback((orderData) => {
    const availableRider = riders.find(r => r.online);
    const newOrder = {
      id: generateId(),
      trackingId: 'AL' + Math.random().toString(36).slice(2, 8).toUpperCase(),
      customerId: user?.id,
      customerName: user?.name,
      riderId: availableRider?.id || 'u2',
      riderName: availableRider?.name || 'Emeka Rider',
      riderPhone: availableRider?.phone || '+234 806 987 6543',
      status: 'pending',
      ...orderData,
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 45 * 60000).toISOString(),
      timeline: [{ status: 'pending', time: new Date().toISOString(), label: 'Order placed' }],
      rating: null,
      proof: null,
    };
    setOrders(prev => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    if (orderData.paymentMethod === 'wallet') {
      setWallet(prev => ({
        balance: prev.balance - orderData.price,
        transactions: [{ id: generateId(), type: 'debit', amount: orderData.price, method: 'wallet', description: `Delivery #${newOrder.trackingId}`, time: new Date().toISOString() }, ...prev.transactions]
      }));
    }
    addNotification(`Order ${newOrder.trackingId} placed! Rider assigned.`, 'order');
    // Simulate order progression
    setTimeout(() => updateOrderStatus(newOrder.id, 'accepted'), 8000);
    setTimeout(() => updateOrderStatus(newOrder.id, 'pickup'), 20000);
    return newOrder;
  }, [user, riders]);

  const updateOrderStatus = useCallback((orderId, status) => {
    const labels = { accepted: 'Rider accepted order', pickup: 'Package picked up', transit: 'In transit to destination', delivered: 'Successfully delivered!', cancelled: 'Order cancelled' };
    setOrders(prev => prev.map(o => o.id === orderId ? {
      ...o, status,
      timeline: [...(o.timeline || []), { status, time: new Date().toISOString(), label: labels[status] || status }]
    } : o));
    setActiveOrder(prev => prev?.id === orderId ? { ...prev, status } : prev);
  }, []);

  const cancelOrder = useCallback((orderId, reason) => {
    updateOrderStatus(orderId, 'cancelled');
    showToast('Order cancelled', 'error');
  }, [updateOrderStatus, showToast]);

  const rateOrder = useCallback((orderId, rating, comment) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, rating, ratingComment: comment } : o));
    setRiders(prev => prev.map(r => {
      const order = orders.find(o => o.id === orderId);
      if (order && r.id === order.riderId) {
        const newRating = ((r.rating * (r.deliveriesCompleted || 1)) + rating) / ((r.deliveriesCompleted || 1) + 1);
        return { ...r, rating: Math.round(newRating * 10) / 10 };
      }
      return r;
    }));
    showToast('Rating submitted. Thank you! 🌟', 'success');
  }, [orders, showToast]);

  const addFunds = useCallback((amount, method) => {
    setWallet(prev => ({
      balance: prev.balance + amount,
      transactions: [{ id: generateId(), type: 'credit', amount, method, description: 'Wallet top-up', time: new Date().toISOString() }, ...prev.transactions]
    }));
    showToast(`₦${amount.toLocaleString()} added to wallet`, 'success');
  }, [showToast]);

  const withdrawFunds = useCallback((amount, bankDetails) => {
    if (wallet.balance < amount) { showToast('Insufficient balance', 'error'); return false; }
    setWallet(prev => ({
      balance: prev.balance - amount,
      transactions: [{ id: generateId(), type: 'debit', amount, method: 'bank', description: `Withdrawal to ${bankDetails.bank}`, time: new Date().toISOString() }, ...prev.transactions]
    }));
    showToast(`₦${amount.toLocaleString()} withdrawal initiated`, 'success');
    return true;
  }, [wallet.balance, showToast]);

  const addNotification = useCallback((text, type = 'info') => {
    setNotifications(prev => [{ id: generateId(), text, time: 'just now', read: false, type }, ...prev]);
  }, []);

  const markNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const sendChatMessage = useCallback((text, sender = 'customer') => {
    const msg = { id: generateId(), text, sender, time: new Date().toISOString() };
    setChat(prev => [...prev, msg]);
    if (sender === 'customer') {
      setTimeout(() => {
        const replies = ['On my way!', 'Got it, be there soon', 'Package is secure, delivering now', 'Almost there!', 'Noted, thank you'];
        setChat(prev => [...prev, { id: generateId(), text: replies[Math.floor(Math.random() * replies.length)], sender: 'rider', time: new Date().toISOString() }]);
      }, 1500 + Math.random() * 1000);
    }
  }, []);

  const toggleRiderOnline = useCallback((riderId, online) => {
    setRiders(prev => prev.map(r => r.id === riderId ? { ...r, online } : r));
    setUsers(prev => prev.map(u => u.id === riderId ? { ...u, online } : u));
  }, []);

  const verifyRider = useCallback((riderId) => {
    setUsers(prev => prev.map(u => u.id === riderId ? { ...u, verified: true } : u));
    showToast('Rider verified successfully', 'success');
  }, [showToast]);

  const saveAddress = useCallback((address) => {
    setUser(prev => ({ ...prev, savedAddresses: [...(prev.savedAddresses || []), { id: generateId(), ...address }] }));
    showToast('Address saved', 'success');
  }, [showToast]);

  const applyPromo = useCallback((code) => {
    const PROMOS = [
      { code: 'FIRST50', discount: 50, type: 'percent', description: '50% off your first order' },
      { code: 'AMP200', discount: 200, type: 'flat', description: '₦200 off any delivery' },
      { code: 'NEWUSER', discount: 30, type: 'percent', description: '30% off for new users' },
    ];
    const found = PROMOS.find(p => p.code === code.toUpperCase());
    if (found) { setPromoApplied(found); showToast(`Promo applied: ${found.description}`, 'success'); return found; }
    showToast('Invalid promo code', 'error');
    return null;
  }, [showToast]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const myOrders = orders.filter(o => o.customerId === user?.id);
  const riderOrders = orders.filter(o => o.riderId === user?.id);
  const allOrders = orders;

  return (
    <AppContext.Provider value={{
      user, login, signup, logout, updateProfile,
      orders: allOrders, myOrders, riderOrders,
      createOrder, updateOrderStatus, cancelOrder, rateOrder,
      riders, toggleRiderOnline, verifyRider,
      users,
      wallet, addFunds, withdrawFunds,
      notifications, unreadCount, markNotificationsRead, addNotification,
      chat, sendChatMessage,
      activeOrder, setActiveOrder,
      toast, showToast,
      promoApplied, applyPromo,
      saveAddress,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
