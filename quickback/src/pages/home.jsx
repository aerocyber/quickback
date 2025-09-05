import { useEffect, useState } from "react";
import { account } from "../lib/appwrite";
import HomeGuest from "./homeguest";


export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    account.get()
      .then((res) => setUser(res))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  return user ? <HomeUser user={user} /> : <HomeGuest />;
}
