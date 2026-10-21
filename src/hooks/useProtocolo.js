import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useProtocolo(userId) {
  const [perfil, setPerfil] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) { setLoading(false); return }
    fetchPerfil()
  }, [userId])

  const fetchPerfil = async () => {
    const { data } = await supabase
      .from('perfis')
      .select('*')
      .eq('user_id', userId)
      .single()
    setPerfil(data)
    setLoading(false)
  }

  const salvarDiagnostico = async (scores, focusAreas) => {
    const { data, error } = await supabase
      .from('diagnosticos')
      .insert({
        user_id: userId,
        scores,
        focus_areas: focusAreas,
        dia: perfil?.dia_atual ?? 1
      })
      .select()
      .single()
    return { data, error }
  }

  const salvarCheckin = async ({ diaNum, habitos, reflexao, apareceu }) => {
    const { data, error } = await supabase
      .from('checkins')
      .upsert({
        user_id: userId,
        dia_num: diaNum,
        habitos_feitos: habitos,
        reflexao,
        apareceu
      })
      .select()
      .single()

    if (!error) {
      await supabase
        .from('perfis')
        .update({ dia_atual: diaNum + 1 })
        .eq('user_id', userId)
      fetchPerfil()
    }

    return { data, error }
  }

  const salvarIdentidade = async (texto) => {
    const { data, error } = await supabase
      .from('identidades')
      .insert({
        user_id: userId,
        texto,
        dia: perfil?.dia_atual ?? 1
      })
      .select()
      .single()
    return { data, error }
  }

  const getCheckins = async () => {
    const { data } = await supabase
      .from('checkins')
      .select('*')
      .eq('user_id', userId)
      .order('dia_num', { ascending: true })
    return data ?? []
  }

  const getIdentidades = async () => {
    const { data } = await supabase
      .from('identidades')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
    return data ?? []
  }

  const getDiagnosticos = async () => {
    const { data } = await supabase
      .from('diagnosticos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
    return data ?? []
  }

  return {
    perfil,
    loading,
    fetchPerfil,
    salvarDiagnostico,
    salvarCheckin,
    salvarIdentidade,
    getCheckins,
    getIdentidades,
    getDiagnosticos
  }
}
