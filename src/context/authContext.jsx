import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

const UserContext = createContext();

const AuthContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check session on mount
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session?.user) {
        fetchUserProfile(data.session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          fetchUserProfile(session.user);
        } else {
          setUser(null);
        }
      }
    );

    // Cleanup
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Helper to fetch profile (role) from profile table
  const fetchUserProfile = async (supabaseUser) => {
    setLoading(true);
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", supabaseUser.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      setUser(supabaseUser); // fallback to user without role
    } else {
      setUser({ ...supabaseUser, role: profile?.role });
    }
    setLoading(false);
  };

  // Signup with email & password
  const signup = async (email, password) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) throw error;
    // Optional: auto fetch profile here if applicable
    return data;
  };

  // Login with email & password
  const login = async (email, password) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      throw error;
    }

    if (data?.user) {
      await fetchUserProfile(data.user);
    } else {
      setUser(null);
      setLoading(false);
    }

    return data;
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setLoading(false);
  };

  return (
    <UserContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(UserContext);
export default AuthContext;
