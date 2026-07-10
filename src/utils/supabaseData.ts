import { supabase } from "./supabaseClient";
import type { StudyRecord } from "../domain/record";

// study-record テーブルから、すべてのレコードを取得する
export const getAllTodos = async (): Promise<StudyRecord[] | null> => {
    const { data, error } = await supabase
      .from("study_record")
      .select("*");
    if (error) {
      console.error("データ取得エラー:", error);
      return null;
    }
    return data;
};

// study-record テーブルに、レコードを追加する
export const insertTodo = async (title: string, time: number) => {
  const { error } = await supabase
    .from("study_record")
    .insert({ title, time });

  if (error) {
    throw error;
  }
};

// study-record テーブルに、レコードを削除する
export const deleteTodo = async (id: string) => {
  const { error } = await supabase
    .from("study_record")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
};