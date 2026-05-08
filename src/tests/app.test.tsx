import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

// Supabaseのクライアントを定義しているファイルを直接モックするのが一番確実です
// もし App.tsx 内で createClient している場合はそのまま library 名でOK
vi.mock('@supabase/supabase-js', () => {
  // 1. まず、どんなメソッドを呼ばれても「自分自身」を返す万能な偽物オブジェクトを作ります
  const mockSupabaseQuery = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    
    // 2. 最後に await (Promise) された時に返す値を設定します
    // これが「通信成功！データはこれだよ！」という返事になります
    then: vi.fn((onFulfilled) => {
      return Promise.resolve(
        onFulfilled({ 
          data: [],
          error: null 
        })
      );
    }),
  };

  return {
    createClient: vi.fn(() => ({
      // どこから始まっても、上の万能オブジェクトにつながるようにします
      from: vi.fn(() => mockSupabaseQuery),
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
    await waitFor(async () => {
      // 合計時間が0であることを確認
      const totalTime = await screen.findByText(/合計時間：/);
      expect(totalTime).toHaveTextContent("0/1000");
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


  // タイトルが表示されている
  it("タイトルが表示されている", async () => {
    render(<App />);
    // 1. Loadingが終わるのを待つ
    await waitFor(() => {
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    // 2. タイトルが表示されている
    const title = screen.getByText("学習記録一覧アプリ");
    expect(title).toBeInTheDocument();
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

  // ✅ 削除ボタンを押すと学習記録が削除される 数が1つ減っていることをテストする
  it("削除ボタンを押すと学習記録が削除される", async () => {
    render(<App />);

        // 1. Loadingが終わるのを待つ
    await waitFor(() => {
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

        // 2. ラベルが表示されるのを待つ
    const titleInput = screen.getByLabelText("学習内容");
    const timeInput = screen.getByLabelText(/学習時間/);
    const registerButton = screen.getByRole("button", { name: "登録" });

        // 3. 入力
    await userEvent.type(titleInput, "Reactの勉強");
    await userEvent.type(timeInput, "3");

        // 3. 登録ボタンをクリック
    await userEvent.click(registerButton);

        // 4. 「削除」ボタンが存在するか
          const deleteButton = await screen.findByRole("button", { name: "削除" });
        expect(screen.queryByText(/Reactの勉強/)).toBeInTheDocument();

          // 5. ボタンをクリック
    await userEvent.click(deleteButton);

    // 6. 記録が削除される
    await waitFor(() => {
        expect(screen.queryByText(/Reactの勉強/)).not.toBeInTheDocument();
  });
});
});

