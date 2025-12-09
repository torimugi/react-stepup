import { supabase } from "./supabaseClient";

// study-record テーブルから、すべてのレコードを取得する
export const getAllTodos = async () => {
    const todos = await supabase.from("study-record").select("*");
    return todos.data;
};

// study-record テーブルに、レコードを追加する
export const insertTodo = async (title: string, time: number) => {
await supabase
  .from('study-record')
  .insert({ title, time });
};

// study-record テーブルに、レコードを削除する
export const deleteTodo = async (id: number) => {
await supabase
  .from('study-record')
  .delete()
  .eq('id', id)
  .select();
  };