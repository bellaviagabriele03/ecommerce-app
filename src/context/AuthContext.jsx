import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { AuthContext } from "./authContext";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(() => Boolean(supabase));

    useEffect(() => {
        if (!supabase) {
            return;
        }

        supabase.auth.getSession().then(({ data }) => {
            setUser(data.session?.user ?? null);
            setLoading(false);
        });

        const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.subscription.unsubscribe();
    }, []);

    async function signUp(email, password, firstName, lastName) {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { first_name: firstName, last_name: lastName } },
        });
        if (error) throw error;
    }

    async function signIn(email, password) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
    }

    async function signOut() {
        await supabase.auth.signOut();
    }

    async function updateProfile(updates) {
        const { data, error } = await supabase.auth.updateUser({ data: updates });
        if (error) throw error;
        setUser(data.user);
    }

    return (
        <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
}
