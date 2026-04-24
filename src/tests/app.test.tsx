import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

// Supabaseのモック設定
vi.mock('@supabase/supabase-js', () => {
  return {
    createClient: vi.fn(() => ({
      from: vi.fn(() => ({
        // selectの戻り値を空配列でシミュレート
        select: vi.fn().mockResolvedValue({ data: [], error: null }),
        // insert(登録)の成功をシミュレート
        insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      })),
    })),
  };
});

/**
 * ┌─────────────────────────────────────────────────────────┐
 * │  💡 コンポーネントテストの基本 - Appコンポーネント      │
 * └─────────────────────────────────────────────────────────┘
 * 
 * テスト手順:
 * 1. describe()  → テストのグループを作る
 * 2. it()        → 1つのテストケースを書く  
 * 3. render()    → コンポーネントを画面に表示
 * 4. screen.getBy*() → 画面上の要素を探す
 * 5. expect()    → 結果が期待通りかチェック
 */

describe("📚 学習記録一覧アプリ - Appコンポーネント", () => {
  // ============================================
  // ✅ テスト1: ページが正しく読み込まれるか
  // ============================================
  it("ページタイトルが表示されること", async () => {
    render(<App />);

    // ローディングが終わるまで待つ（タイムアウト3秒）
    await waitFor(() => {
      const title = screen.getByText("学習記録一覧アプリ");
      expect(title).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  // ============================================
  // ✅ テスト2: 必要な入力フィールドが表示されるか
  // ============================================
  it("入力フィールドと登録ボタンが表示されること", async () => {
    render(<App />);

    // ローディングが終わるまで待つ
    await waitFor(() => {
      // テキスト入力フィールドが存在するか
      const textInputs = screen.getAllByRole("textbox");
      expect(textInputs.length).toBeGreaterThan(0);

      // 「登録」ボタンが存在するか
      const registerButton = screen.getByRole("button", { name: "登録" });
      expect(registerButton).toBeInTheDocument();
    });
  });

  // ============================================
  // ✅ テスト3: ユーザーが入力すると値が反映されるか
  // ============================================
  it("学習内容を入力すると画面に表示されること", async () => {
    render(<App />);

    // ローディングが終わるまで待つ
    await waitFor(() => {
      const titleInputs = screen.getAllByRole("textbox");
      expect(titleInputs.length).toBeGreaterThan(0);
    });

    // 入力フィールドを取得
    const titleInputs = screen.getAllByRole("textbox");
    const titleInput = titleInputs[0]; // 最初のテキスト入力フィールド

    // 「React」という文字を入力
    await userEvent.type(titleInput, "React");

    // 入力された値が表示されているか確認
    const displayedTitle = screen.getByText(/入力されている学習内容：React/);
    expect(displayedTitle).toBeInTheDocument();
  });

  // ============================================
  // ✅ テスト4: 学習時間の入力
  // ============================================
  it("学習時間を入力すると画面に表示されること", async () => {
    render(<App />);

    // ローディングが終わるまで待つ
    await waitFor(() => {
      const numberInputs = screen.getAllByRole("spinbutton");
      expect(numberInputs.length).toBeGreaterThan(0);
    });

    // 数字入力フィールドを取得
    const numberInputs = screen.getAllByRole("spinbutton");
    const timeInput = numberInputs[0]; // 学習時間の入力フィールド

    // 「3」時間を入力
    await userEvent.type(timeInput, "3");

    // 入力された値が表示されているか確認
    const displayedTime = screen.getByText(/入力されている時間：3時間/);
    expect(displayedTime).toBeInTheDocument();
  });

  // ============================================
  // ✅ テスト5: 初期時間は0時間であることを確認
  // ============================================
  it("初期状態の合計時間は0時間であること", async () => {
    render(<App />);

    // ローディングが終わるまで待つ
    await waitFor(() => {
      // 合計時間が0であることを確認
      const totalTime = screen.getByText(/合計時間：0\/1000/);
      expect(totalTime).toBeInTheDocument();
    });
  });

  // ============================================
  // ✅ テスト6: ローディング状態の確認
  // ============================================
  it("ページ読み込み時にローディング表示があること", () => {
    render(<App />);

    // 最初はローディングが表示されていることを確認
    const loading = screen.getByText("Loading...");
    expect(loading).toBeInTheDocument();
  });

  //タイトルが表示されている
  it ("タイトルが表示されている", async () => {
    render(<App />);
    await waitFor(() => {
      const title = screen.getByText("学習記録一覧アプリ");
      expect(title).toBeInTheDocument();
    });
  });

  
// フォームに学習内容と時間を入力して登録ボタンを押すと新たに記録が追加されている 数が1つ増えていることをテストする
it("フォームに学習内容と時間を入力して登録ボタンを押すと新たに記録が追加されている", async () => {
    render(<App />); 

    // 1. Loadingが終わるのを待つ
    await waitFor(() => {
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    // 2. ラベルが表示されるのを待つ
    const titleInput = screen.getByLabelText("学習内容");
    const timeInput = screen.getByLabelText("学習時間");
    const button = screen.getByRole("button", { name: "登録" });

    // 3. 入力
    await userEvent.type(titleInput, "Reactの勉強");
    await userEvent.type(timeInput, "3");

    // 4. ボタンをクリック
    await userEvent.click(button);

    // 5. 新たに記録が追加されていることを確認
    // ※ 登録後に画面に「Reactの勉強」という文字が出ることを確認するのが一般的です
    const newRecord = await screen.findByText(/Reactの勉強/);
    expect(newRecord).toBeInTheDocument();
  });
});
