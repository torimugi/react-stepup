import { useState, useEffect, type ChangeEvent } from "react";
import { supabase } from "./utils/supabaseClient";
import { insertTodo, deleteTodo } from "./utils/supabaseData";
import type { StudyRecord } from "./domain/record";

function App() {
  // 学習記録の一覧・入力値・エラー・読み込み状態を管理する
  const [records, setRecords] = useState<StudyRecord[]>([]);
  const [title, setTitle] = useState<string>("");
  const [time, setStudyTime] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);

  // 学習内容の入力値をstateに反映する
  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  // 学習時間の入力値を数値に変換してstateに反映する
  const handleChangeTime = (e: ChangeEvent<HTMLInputElement>) => {
    setStudyTime(Number(e.target.value));
  };

  // Supabaseから学習記録を取得する
  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from("study_record")
        .select("id, title, time");

      if (error) {
        console.error({
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
      }

      setRecords((data ?? []) as StudyRecord[]);
      return true;
    } catch (err) {
      console.error("データ取得に失敗:", err);
      setError("データ取得に失敗しました。");
      return false;
    }
  };

  // 初回表示時に学習記録を読み込む
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

  // 入力内容を検証し、学習記録を登録する
  const onSubmit = async () => {
    if (title.trim() === "" || time <= 0) {
      setError("入力されていない項目があります。");
      return;
    }

    try {
      setLoading(true);

      await insertTodo(title.trim(), time);

      await fetchData();

      setTitle("");
      setStudyTime(0);
      setError("");
    } catch (err) {
      console.error("登録に失敗:", err);
      setError("登録に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  // 指定したIDの学習記録を削除し、画面の一覧も更新する
  const handleDeleteTodo = async (id: string) => {
    try {
      setLoading(true);

      console.log("削除ボタンが押されました。ID:", id);

      await deleteTodo(id);

      const newRecords = records.filter((record) => record.id !== id);
      setRecords(newRecords);

      setError("");
      console.log("ステートを更新しました。");
    } catch (err) {
      console.error("削除に失敗:", err);
      setError("削除に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  // 学習時間の合計を計算する
  const totalStudyTime = records.reduce((total, record) => {
    return total + record.time;
  }, 0);

  // 読み込み中はローディング表示に切り替える
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>
        <div className="flex justify-center">
          <h1>学習記録一覧アプリ</h1>

          <div>
            <div>
              <label>
                学習内容
                <input
                  type="text"
                  value={title}
                  onChange={handleChangeTitle}
                />
              </label>
            </div>

            <div>
              <label>
                学習時間
                <input
                  type="number"
                  value={time}
                  onChange={handleChangeTime}
                />
              </label>
              時間
            </div>

            <div>入力されている学習内容：{title}</div>
            <div>入力されている時間：{time}時間</div>

            {records.map((record) => {
              return (
                <div className="flex justify-center" key={record.id}>
                  {record.title}
                  {record.time}時間
                  <button onClick={() => handleDeleteTodo(record.id)}>
                    削除
                  </button>
                </div>
              );
            })}

            <button onClick={onSubmit}>登録</button>

            <div>合計時間：{totalStudyTime}/1000(h)</div>
            <div>{error}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;