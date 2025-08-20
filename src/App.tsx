import "tailwindcss";

function App() {

  const recordsrecords = [
    { title: "勉強の記録1", time: 1},
    { title: "勉強の記録2", time: 3},
    { title: "勉強の記録3", time: 5}
]

  return (
    <>
<div>
<h1>学習記録一覧</h1>
  <div>
 <p>学習内容<input type="text" /></p>
 <p>学習時間<input type="number" />時間</p>
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
