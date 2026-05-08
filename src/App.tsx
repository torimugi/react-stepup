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
      setError("入力されていない項目があります。");
      setRecords([]);
      return;
    } else if (title !== "" && time > 0) {
      setError("");
      return;
  }  
}
error();
};

// データ取得する
  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from('study-record')
        .select('*');
      if (error) {
        console.error("データ取得エラー:", error);
        return false;
      }
      setRecords(data || []);
      return true;
    } catch (err) {
      console.error("データ取得に失敗:", err);
      return false;
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);

const handleDeleteTodo = async(id: number) => {
  console.log("削除ボタンが押されました。ID:", id);
  await deleteTodo(id);
  console.log("DBからの削除が終わりました。");
  const newDelete = records.filter((record) => record.id !== id);
  setRecords(newDelete);
  console.log("ステートを更新しました。");
};

  // ローディング状態を表示
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await fetchData();
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);
if (isLoading) {
  return <div>Loading...</div>; // ローディング状態であればLoading...を表示
}

const totalStudyTime = records.reduce((total, record) => {
  return total + record.time}, 0);

  return (
    <>
<div>
<h1>学習記録一覧アプリ</h1>
  <div>
 <div><label>学習内容<input type="text" value={title} onChange={handleChangeTitle}/></label></div>
 <div><label>学習時間<input type="number" value={time} onChange={handleChangeTime}/></label>時間</div>
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