import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Authentication functions
export const signUp = async (email, password, name) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name }
    }
  })
  
  if (error) throw error
  
  // Create user profile
  if (data?.user) {
    await supabase
      .from('users_assess')
      .insert([{ id: data.user.id, email, name }])
  }
  
  return data
}

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) throw error
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Results handling
export const saveAssessmentResults = async (results) => {
  const { data, error } = await supabase
    .from('assessment_results_assess')
    .insert([{
      user_id: supabase.auth.user()?.id,
      assessment_type: results.surveyTitle,
      score: results.totalScore,
      score_level: results.scoreRange.level,
      score_description: results.scoreRange.description,
      responses: results.answers
    }])
    .select()
  
  if (error) throw error
  return data
}

// Email sending function
export const sendResultsByEmail = async (results, userEmail, subscribedToNewsletter) => {
  const { data, error } = await supabase
    .functions.invoke('send-assessment-results', {
      body: {
        results,
        userEmail,
        therapistEmail: 'jewett@alumni.haas.org',
        subscribedToNewsletter
      }
    })
  
  if (error) throw error
  return data
}