import "tailwindcss";
import { useState } from "react";

function App() {

  const recordsrecords = [
    { title: "勉強の記録1", time: 1},
    { title: "勉強の記録2", time: 3},
    { title: "勉強の記録3", time: 5}
]

const [studyText, setStudyText] = useState<string>("");
const [studyTime, setStudyTime] = useState<number>(0);

const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
  setStudyText(e.target.value);
};

const handleChangeTime = (e: React.ChangeEvent<HTMLInputElement>) => {
  setStudyTime(Number(e.target.value));
};

  return (
    <>
<div>
<h1>学習記録一覧</h1>
  <div>
 <div>学習内容<input type="text" value={studyText} onChange= {handleChangeText}/></div>
 <div>学習時間<input type="number" value={studyTime} onChange= {handleChangeTime}/>時間</div>
 <div>入力されている学習内容：{studyText}</div>
 <div>入力されている時間：{studyTime}時間</div>
 <button>登録</button>
  </div>

{recordsrecords.map((record) => {
return(
  <div>{record.title} {record.time}時間</div>
)
})}
</div>
</>

)
}
export default App; 
