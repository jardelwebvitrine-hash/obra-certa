
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AIConsultant from './components/AIConsultant';
import ServiceCatalog from './components/ServiceCatalog';
import ProMarketplace from './components/ProMarketplace';
import AdminPanel from './components/AdminPanel';
import Auth from './components/Auth';
import PinAuth from './components/PinAuth';
import { ServiceCategory, UserRole, User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isPinAuthenticated, setIsPinAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [balance, setBalance] = useState(0);

  // Carregar usuário do localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('obracerta_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      setBalance(parsed.credits || 0);
      // Sempre exige PIN ao recarregar a página se o PIN já estiver definido
      if (!parsed.pinHash) {
        setIsPinAuthenticated(true);
      }
    }
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    setBalance(u.credits || 0);
    localStorage.setItem('obracerta_user', JSON.stringify(u));
    if (!u.pinHash) {
      // Se não tem PIN, precisa configurar antes de acessar o app
      setIsPinAuthenticated(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsPinAuthenticated(false);
    localStorage.removeItem('obracerta_user');
    setActiveTab('dashboard');
  };

  const handlePinVerified = (newHash?: string) => {
    if (newHash && user) {
      // Caso de configuração de novo PIN
      const updatedUser = { ...user, pinHash: newHash, failedPinAttempts: 0, lockoutUntil: undefined };
      setUser(updatedUser);
      localStorage.setItem('obracerta_user', JSON.stringify(updatedUser));
    } else if (user) {
      // Caso de verificação de sucesso
      const updatedUser = { ...user, failedPinAttempts: 0, lockoutUntil: undefined };
      setUser(updatedUser);
      localStorage.setItem('obracerta_user', JSON.stringify(updatedUser));
    }
    setIsPinAuthenticated(true);
  };

  const handlePinAttemptFailed = (attempts: number, lockoutTime?: number) => {
    if (user) {
      const updatedUser = { ...user, failedPinAttempts: attempts, lockoutUntil: lockoutTime };
      setUser(updatedUser);
      localStorage.setItem('obracerta_user', JSON.stringify(updatedUser));
    }
  };

  const toggleRole = () => {
    if (!user) return;
    const nextRole = user.role === UserRole.CLIENT ? UserRole.PROFESSIONAL : (user.role === UserRole.PROFESSIONAL ? UserRole.ADMIN : UserRole.CLIENT);
    const updated = { ...user, role: nextRole };
    handleLogin(updated);
    setActiveTab('dashboard');
  };

  // Se não estiver logado, mostra tela de Auth
  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  // Se estiver logado mas não autenticado pelo PIN
  if (!isPinAuthenticated) {
    return (
      <PinAuth 
        mode={user.pinHash ? 'verify' : 'setup'}
        savedHash={user.pinHash}
        failedAttempts={user.failedPinAttempts}
        lockoutUntil={user.lockoutUntil}
        onVerified={handlePinVerified}
        onAttemptFailed={handlePinAttemptFailed}
        onForgot={handleLogout}
      />
    );
  }

  const renderContent = () => {
    if (user.role === UserRole.ADMIN) {
      return <AdminPanel />;
    }

    if (user.role === UserRole.CLIENT) {
      switch (activeTab) {
        case 'dashboard':
          return <Dashboard role={user.role} onLogout={handleLogout} />;
        case 'ai-consultant':
          return <AIConsultant />;
        case 'services':
          return <ServiceCatalog />;
        default:
          return <Dashboard role={user.role} onLogout={handleLogout} />;
      }
    } else {
      switch (activeTab) {
        case 'dashboard':
          return <Dashboard role={user.role} onLogout={handleLogout} />;
        case 'marketplace':
          return <ProMarketplace />;
        case 'ai-consultant':
          return <AIConsultant />;
        default:
          return <Dashboard role={user.role} onLogout={handleLogout} />;
      }
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      role={user.role} 
      toggleRole={toggleRole}
      balance={balance}
      onLogout={handleLogout}
      userName={user.name}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
