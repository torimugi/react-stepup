import { useState, useEffect } from "react";
import { supabase } from "/home/yu/Projects/react-stepup/src/utils/supabaseClient";
// import { getAllTodos } from "./utils/supabaseData";


interface Record {
  id: number;
  text: string;
  time: number;
}

function App() {
const [records, setRecords] = useState<Record[]>([]);
const [text, setText] = useState<string>("");
const [time, setStudyTime] = useState<number>(0);
const [error, setError] = useState<string>("");
// const [title, setTitle] = useState<string>("");
// const [time, setTime] = useState<number>(0);

const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
  setText(e.target.value);
};

const handleChangeTime = (e: React.ChangeEvent<HTMLInputElement>) => {
  setStudyTime(Number(e.target.value));
};

const onSubmit = () => {
const newStudy = {
  id:Date.now(),
  text:text,
  time:time
}
const newRecord = [...records,newStudy]
setRecords(newRecord);
setText("");
setStudyTime(0);

const error = () => {
  if(text === "" || time === 0) {
    setError("入力されていない項目があります");
    setRecords([]);
    return
  } else if (text !== "" && time > 0) {
    setError("");
    return
  }  
}
error();
};

// // データを追加する
// const onClickAdd = async() => {
// const { error } = await supabase
//   .from('study-record')
//   .insert({ title: title, time: time });
//   if (error) {
//       console.error("データ追加エラー:", error);
//     return;
//   }

// await getAllTodos();
// setTitle("");
// setTime(0);
// }

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
    console.log("data:", data);
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
 <div>学習内容<input type="text" value={text} onChange= {handleChangeText}/></div>
 <div>学習時間<input type="number" value={time} onChange= {handleChangeTime}/>時間</div>
 <div>入力されている学習内容：{text}</div>
 <div>入力されている時間：{time}時間</div>
 {records.map((record) => {
return(
  <div key={record.id}>{record.text}{record.time}時間</div>
)
})}
 <button onClick={() => onSubmit()}>登録</button>
 {/* <button onClick={() => onClickAdd()}>追加</button> */}
 <div>合計時間：{totalStudyTime}/1000(h)</div>
 <div>{error}</div>

 
  </div>
</div>
</>
)
}

export default App;