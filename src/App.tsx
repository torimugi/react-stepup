import { useState, useEffect } from "react";
import { supabase } from "./utils/supabaseClient";
import { insertTodo } from "./utils/supabaseData";
import { deleteTodo } from "./utils/supabaseData";


interface Record {
  id: number;
  title: string;
  time: number;
}

function App() {
const [records, setRecords] = useState<Record[]>([]);
const [title, setTitle] = useState<string>("");
const [time, setStudyTime] = useState<number>(0);
const [error, setError] = useState<string>("");
const [isLoading, setLoading] = useState<boolean>(false);

const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
  setTitle(e.target.value);
  console.log("値:", e.target.value);
};

const handleChangeTime = (e: React.ChangeEvent<HTMLInputElement>) => {
  setStudyTime(Number(e.target.value));
};

// TODOの追加処理
const onSubmit = async () => {
  const newStudy = {
    id: Date.now(),
    title: title,
    time: time
  };
  await insertTodo(title, time);
  const newRecord = [...records, newStudy];
  setRecords(newRecord);
  setTitle("");
  setStudyTime(0);

  // 入力値のバリデーション処理
  const error = () => {
    if (title === "" || time === 0) {
      setError("入力されていない項目があります");
      setRecords([]);
      return;
    } else if (title !== "" && time > 0) {
      setError("");
      return;
  }  
}
error();
};

// データを取得する
  const fetchData = async () => {
    const { data, error } = await supabase
      .from('study-record')
      .select('*');
    if (error) {
      console.log("data:", data); 
      return;
    }
    setRecords(data);
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  // 削除処理
  const handleDeleteTodo = async(id: number) => {
    await deleteTodo(id);
    const newDelete = records.filter((record) => record.id !== id);
    setRecords(newDelete);
  };

  // ローディング状態を表示
  useEffect(() => {
    const getIsTodo = async () => { // 非同期処理を定義する関数
      setLoading(true); // データを取得する前にローディング状態にする
      const todoDate = await fetchData(); // データを取得するまで待つ
      setLoading(false);
      return todoDate;
      // データを取得した後にローディング状態を解除する
    };
    getIsTodo(); // 非同期処理を実行する関数
}
, []);
if (isLoading) {
  return <div>Loading...</div>; // ローディング状態であればLoading...を表示
}

const totalStudyTime = records.reduce((total, record) => {
  return total + record.time}, 0);

  return (
    <>
<div>
<h1>学習記録一覧</h1>
  <div>
 <div>学習内容<input type="text" value={title} onChange={handleChangeTitle}/></div>
 <div>学習時間<input type="number" value={time} onChange={handleChangeTime}/>時間</div>
 <div>入力されている学習内容：{title}</div>
 <div>入力されている時間：{time}時間</div>
 {records.map((record) => {
return(
  <div className="flex justify-center" key={record.id}>{record.title}{record.time}時間
  <button onClick={() => handleDeleteTodo(record.id)}>削除</button>
</div>
)
})}
 <button onClick={() => onSubmit()}>登録</button>
 <div>合計時間：{totalStudyTime}/1000(h)</div>
 <div>{error}</div>
  </div>
</div>
</>
)
}

export default App;