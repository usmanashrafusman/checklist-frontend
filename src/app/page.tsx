'use client'
import { useEffect, useState } from 'react';
import { initDB } from '@/db'
import { useAuth } from '@/hooks';
import { IDatabase } from '@/types';
import { Database } from '@/context';

import CheckList from '@/components/ui/checklist/CheckList';
import Loading from "@/components/ui/common/Loading"
import Login from '@/components/ui/login/Login';

const Home = () => {
  const [db, setDB] = useState<IDatabase>({ database: null, collections: null, collectionSubscription: null, replications: null });
  const { status, user, handleLogin } = useAuth();

  useEffect(() => {
    initDB().then((res) => {
      setDB(res)
    });
  }, [])


  return (
    <main>
      <Database.Provider value={db}>
        {status === "SUCCESS" && user ? <CheckList /> : null}
        {status === "ERROR" && !user ? <Login onLogin={handleLogin} /> : null}
        {status === "PENDING" ? <Loading /> : null}
      </Database.Provider>
    </main>
  )
};

export default Home;
