import { useState, useEffect } from "react";
import { supabase } from "/home/yu/Projects/react-stepup/src/utils/supabaseClient";

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

const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
  setTitle(e.target.value);
  console.log("値:", e.target.value);
};

const handleChangeTime = (e: React.ChangeEvent<HTMLInputElement>) => {
  setStudyTime(Number(e.target.value));
};

const onSubmit = () => {
const newStudy = {
  id:Date.now(),
  title:title,
  time:time
}
const newRecord = [...records,newStudy]
setRecords(newRecord);
setTitle("");
setStudyTime(0);

const error = () => {
  if(title === "" || time === 0) {
    setError("入力されていない項目があります");
    setRecords([]);
    return
  } else if (title !== "" && time > 0) {
    setError("");
    return
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

const totalStudyTime = records.reduce((total, record) => {
  return total + record.time}, 0);

  return (
    <>
<div>
<h1>学習記録一覧</h1>
  <div>
 <div>学習内容<input type="text" value={title} onChange= {handleChangeTitle}/></div>
 <div>学習時間<input type="number" value={time} onChange= {handleChangeTime}/>時間</div>
 <div>入力されている学習内容：{title}</div>
 <div>入力されている時間：{time}時間</div>
 {records.map((record) => {
return(
  <div key={record.id}>{record.title}{record.time}時間</div>
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