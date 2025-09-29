import  supabase  from "./supabase";

const getAllTodos = async () => {
    const todos = await supabase.from("study-record").select("*");
    return todos.data;
};

export default getAllTodos;