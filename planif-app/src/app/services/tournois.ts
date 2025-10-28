// src/app/services/tournois.ts
import { supabase } from '@/app/lib/supabase/supabase'

export async function getTournois() {
    const { data, error } = await supabase
        .from('x_tournois')
        .select('*')

    if (error) {
        console.error('Erreur Supabase :', error.message)
        return []
    }

     return data
}
