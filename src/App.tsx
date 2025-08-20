import './App.css'

function App() {

  const recordsrecords = [
    { title: "勉強の記録1", time: 1},
    { title: "勉強の記録2", time: 3},
    { title: "勉強の記録3", time: 5}
]

  return (
    <>
<h1>学習記録一覧</h1>
{recordsrecords.map((record) => {
return(
  <p>{record.title}</p>
)
})}
</>

)
}
export default App;
