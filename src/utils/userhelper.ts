import supabase from './supabase'
import service from "../api/request";
export const getUser = async (id?: string) => {
   return service({
    url: `https://iboasdvhlttvdyhleroj.supabase.co/rest/v1/user`,
    method: "get",
    params: {
      id: `eq.${id}`,
      select: '*'
    },
    headers: {
      'apikey':"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlib2FzZHZobHR0dmR5aGxlcm9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5Mzg3ODgsImV4cCI6MjA1MDUxNDc4OH0.srBUiisGvTNytxuGIs8TI3ycgYIxqm_P6ZbEwfVcF-k",
    }
  });
}

export const insertUser = async (user: any) => {
    const { data, error } = await supabase.
    from('user').
    insert([user]).
    select()
    return data
}
