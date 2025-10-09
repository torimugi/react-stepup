import { supabase } from "/home/yu/Projects/react-stepup/src/utils/supabaseClient";

// study-record テーブルから、すべてのレコードを取得する
export const getAllTodos = async () => {
    const todos = await supabase.from("study-record").select("*");
    return todos.data;
};



