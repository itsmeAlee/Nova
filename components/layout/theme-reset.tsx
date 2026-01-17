'use client';

import { useTheme } from 'next-themes';
import { useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export function ThemeReset() {
    const { setTheme } = useTheme();
    const supabase = createClient();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setTheme('light'); // Force Light Mode if no user
            }
        };
        checkUser();
    }, [setTheme, supabase]);

    return null; // This component renders nothing visually
}
