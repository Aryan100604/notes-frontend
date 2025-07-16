import { useEffect, useState } from "react";
import { useAuth } from "./App";

export default function Profile() {
  const { token } = useAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
    } catch {
      setUser(null);
    }
  }, [token]);

  if (!user) return <div className="app-container"><div className="card profile-card">Loading profile...</div></div>;

  return (
    <div className="app-container">
      <div className="card profile-card">
        <div className="profile-avatar">
          {user.fullname?.[0] || user.username?.[0] || user.email?.[0]}
        </div>
        <h2 className="profile-title">{user.fullname || user.username}</h2>
        <div className="profile-info"><b>Username:</b> {user.username}</div>
        <div className="profile-info"><b>Full Name:</b> {user.fullname}</div>
        <div className="profile-info"><b>Email:</b> {user.email}</div>
      </div>
    </div>
  );
} 