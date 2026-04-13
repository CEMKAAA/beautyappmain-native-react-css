import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../config/supabase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [tenantUser, setTenantUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Kullanıcının tenant_users bilgilerini çek
    const fetchTenantUser = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('tenant_users')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (error) {
                console.error('fetchTenantUser error:', error);
                return;
            }

            if (data) {
                setTenantUser(data);
            }
        } catch (err) {
            console.error('fetchTenantUser catch:', err);
        }
    };

    useEffect(() => {
        // Mevcut oturumu kontrol et
        const getSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();

                if (session?.user) {
                    setUser(session.user);
                    await fetchTenantUser(session.user.id);
                }
            } catch (err) {
                console.error('getSession error:', err);
            } finally {
                setLoading(false);
            }
        };

        getSession();

        // Auth durumu değişikliklerini dinle
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (session?.user) {
                    setUser(session.user);
                    // fetchTenantUser'ı arka planda çalıştır (loading'i bloklamaz)
                    fetchTenantUser(session.user.id);
                } else {
                    setUser(null);
                    setTenantUser(null);
                }
                setLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    // Kayıt
    const signUp = async (email, password, metadata = {}) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: metadata.firstName || '',
                    last_name: metadata.lastName || '',
                    phone: metadata.phone || '',
                    brand_name: metadata.brandName || '',
                },
            },
        });
        return { data, error };
    };

    // Giriş
    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { data, error };
    };

    // Çıkış
    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            setUser(null);
            setTenantUser(null);
        }
        return { error };
    };

    const value = {
        user,
        tenantUser,
        loading,
        signUp,
        signIn,
        signOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
