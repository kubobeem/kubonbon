export interface PostMetric {
  label: string;
  value: string;
  note: string;
}

export interface PostSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  insight?: string;
}

export interface PostData {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  author: string;
  readTimeMinutes: number;
  heroGradient: string;
  metrics: PostMetric[];
  sections: PostSection[];
}

const postCatalog: PostData[] = [
  {
    slug: "ai-command-center",
    title: "AI Command Center: 90日で全社実装する運用設計",
    date: "2026-03-08",
    excerpt: "PoCを卒業して、売上と効率の両輪を回すためのAI運用オペレーティングモデル。",
    category: "AI戦略",
    author: "Mina Takeda",
    readTimeMinutes: 8,
    heroGradient: "linear-gradient(130deg, #0f766e 0%, #0284c7 45%, #4f46e5 100%)",
    metrics: [
      { label: "Automation Coverage", value: "68%", note: "定型業務の自動化率" },
      { label: "Cycle Time", value: "-41%", note: "意思決定までの平均時間" },
      { label: "Model Cost", value: "-27%", note: "月間推論コストの削減率" },
    ],
    sections: [
      {
        heading: "01. まず設計するのはモデルではなく責任線",
        paragraphs: [
          "多くの組織はツール選定から入りますが、成果を分けるのは責任設計です。プロンプトを誰が改善し、失敗時に誰が止めるのかを定義しないと、運用はすぐに属人化します。",
          "Command Centerでは、プロダクト、法務、セキュリティ、データ、現場責任者の5者で意思決定レイヤーを固定し、改善サイクルを週次で回します。",
        ],
        bullets: [
          "意思決定を48時間以内に完了する承認SLA",
          "モデル差し替え時の回帰テスト項目を標準化",
          "失敗インシデントの公開テンプレートを全社で統一",
        ],
      },
      {
        heading: "02. コスト最適化はプロンプトよりルーティング",
        paragraphs: [
          "高性能モデルだけで全タスクを処理するのは最短ですが最適ではありません。難易度に応じてモデルを切り替えるだけで、品質を維持しながら大幅にコストを落とせます。",
          "特に問い合わせ分類、FAQ補完、文書要約は軽量モデルの勝ち筋が明確です。",
        ],
        insight: "複雑なタスクを上位20%に限定し、残り80%を軽量モデルへ逃がす設計が最も再現性が高い。",
      },
      {
        heading: "03. 成果計測は売上だけでなく反応速度で見る",
        paragraphs: [
          "導入初期は売上KPIに現れにくいため、サイクルタイムと担当者負荷の推移を先行指標として追います。",
          "3か月目に入ると、先行指標が顧客体験指標へ連動し、LTVの改善が観測されやすくなります。",
        ],
      },
    ],
  },
  {
    slug: "product-velocity-map",
    title: "Product Velocity Map: リリース速度を落とさず品質を上げる",
    date: "2026-03-04",
    excerpt: "機能量ではなく学習速度を最大化する、プロダクト運営の計測フレーム。",
    category: "プロダクト",
    author: "Kei Nishina",
    readTimeMinutes: 7,
    heroGradient: "linear-gradient(135deg, #ef4444 0%, #f59e0b 40%, #facc15 100%)",
    metrics: [
      { label: "Release Frequency", value: "3.2x", note: "週次リリース回数" },
      { label: "Rollback Rate", value: "-58%", note: "リリース巻き戻し率" },
      { label: "A/B Throughput", value: "+112%", note: "同時実験の処理本数" },
    ],
    sections: [
      {
        heading: "01. 開発速度を上げる前に、失敗を小さくする",
        paragraphs: [
          "速度の議論をすると、つい工数削減の話に寄りがちです。実際には、失敗単位を小さく切る方が改善速度に直結します。",
          "1回の変更範囲を狭くし、計測可能な仮説に分割することで、学習の解像度が上がります。",
        ],
      },
      {
        heading: "02. デザインレビューを前倒しで埋め込む",
        paragraphs: [
          "後工程で手戻りが増える主因は、デザイン意図の確認が遅いことです。",
          "仕様前半でレビューし、実装フェーズではユーザー価値検証に集中する流れへ寄せます。",
        ],
        bullets: [
          "仕様合意までの時間を24時間以内に制限",
          "仮説ごとに測定指標を1つだけ決める",
          "デザイン品質はガイドライン違反数でなく体験障害数で測る",
        ],
      },
      {
        heading: "03. 品質はバグ件数より復元速度",
        paragraphs: [
          "ゼロバグは現実的ではありません。重要なのは、障害検知から復旧までの時間です。",
          "ユーザー影響を最小化する運用ができれば、速度と品質は両立できます。",
        ],
        insight: "エラーを隠す文化より、早く直す文化の方が長期品質は高い。",
      },
    ],
  },
  {
    slug: "revenue-design-system",
    title: "Revenue Design System: 成長を再現する意思決定テンプレート",
    date: "2026-02-28",
    excerpt: "属人的な打ち手を減らし、成長施策を組織知に変換する仕組みづくり。",
    category: "成長分析",
    author: "Rin Fujimoto",
    readTimeMinutes: 9,
    heroGradient: "linear-gradient(140deg, #0ea5e9 0%, #2563eb 45%, #7c3aed 100%)",
    metrics: [
      { label: "CAC", value: "-22%", note: "獲得単価の最適化" },
      { label: "Activation", value: "+31%", note: "初回価値到達率" },
      { label: "Retention", value: "+17pt", note: "90日継続率の改善" },
    ],
    sections: [
      {
        heading: "01. 施策を在庫として管理する",
        paragraphs: [
          "施策管理をタスク管理の延長で行うと、勝ちパターンが消えます。",
          "仮説、対象セグメント、実施条件、失敗理由までを在庫化することで、再利用可能な知識資産になります。",
        ],
      },
      {
        heading: "02. ファネルではなく行動連鎖で捉える",
        paragraphs: [
          "同じ離脱率でも、ユーザーの詰まり方は異なります。",
          "行動ログを連鎖単位で可視化すると、改善ポイントが具体化され、施策の精度が上がります。",
        ],
        bullets: [
          "行動連鎖ごとの摩擦コストをスコア化",
          "改善インパクトを期待値で比較",
          "施策の優先度は部門事情ではなく期待値順で固定",
        ],
      },
      {
        heading: "03. 指標は単体で見ず、連動で監視する",
        paragraphs: [
          "CVRだけを追うと、体験悪化を見落としがちです。",
          "先行指標と遅行指標を対にして監視することで、局所最適を回避できます。",
        ],
      },
    ],
  },
  {
    slug: "ops-cockpit",
    title: "Ops Cockpit: 現場の判断を速くするダッシュボード原則",
    date: "2026-02-22",
    excerpt: "見栄えより意思決定速度。実務に効くオペレーション可視化の設計論。",
    category: "組織設計",
    author: "Aoi Morikawa",
    readTimeMinutes: 6,
    heroGradient: "linear-gradient(140deg, #111827 0%, #1d4ed8 50%, #22d3ee 100%)",
    metrics: [
      { label: "Alert Noise", value: "-63%", note: "不要アラートの削減" },
      { label: "Decision Latency", value: "-39%", note: "判断までの遅延" },
      { label: "Escalation Accuracy", value: "+24pt", note: "適切な一次対応率" },
    ],
    sections: [
      {
        heading: "01. 一画面一判断を徹底する",
        paragraphs: [
          "ダッシュボードに情報を詰め込むほど、判断は遅くなります。",
          "画面ごとに『誰が何を決めるのか』を1つに限定すると、運用速度が上がります。",
        ],
      },
      {
        heading: "02. アラートは重要度と行動をセットで表示",
        paragraphs: [
          "重要度だけが示されても、現場は次の行動が分かりません。",
          "優先度、推奨アクション、担当オーナーを同一ブロックに並べると、対応の迷いが減ります。",
        ],
      },
      {
        heading: "03. 週次レビューでダッシュボード自体を改善",
        paragraphs: [
          "ダッシュボードは作って終わりではありません。",
          "実際に使われたか、意思決定に貢献したかを週次で振り返ることで、可視化が本当の武器になります。",
        ],
        insight: "見るための画面ではなく、動くための画面にする。",
      },
    ],
  },
  {
    slug: "trust-by-default",
    title: "Trust by Default: ブランドを強くする透明性オペレーション",
    date: "2026-02-18",
    excerpt: "信頼は広告で作れない。透明性を日常運用へ埋め込む設計パターン。",
    category: "ブランド",
    author: "Sora Hasegawa",
    readTimeMinutes: 7,
    heroGradient: "linear-gradient(125deg, #7c2d12 0%, #b45309 40%, #16a34a 100%)",
    metrics: [
      { label: "NPS", value: "+19pt", note: "四半期での改善幅" },
      { label: "Complaint Recurrence", value: "-46%", note: "再発クレーム率" },
      { label: "Public Response Time", value: "3.4h", note: "外部説明までの平均時間" },
    ],
    sections: [
      {
        heading: "01. 開示の基準を平時に決める",
        paragraphs: [
          "問題が起きたあとに開示方針を決めると、判断がぶれます。",
          "平時のうちに、どの条件で何を開示するかを定義しておくと、説明の一貫性が保てます。",
        ],
      },
      {
        heading: "02. 説明文をテンプレ化しすぎない",
        paragraphs: [
          "テンプレートは速さを生みますが、機械的な印象は信頼を損ねます。",
          "事実、影響、再発防止策を骨組みにしつつ、言葉の温度は状況に合わせて調整します。",
        ],
        bullets: [
          "事実の時系列は5行以内で明確に",
          "影響範囲は曖昧語を使わず定量表現で",
          "再発防止は実施期限まで含めて公開",
        ],
      },
      {
        heading: "03. 信頼指標を売上指標と同列に扱う",
        paragraphs: [
          "短期売上だけで評価すると、説明責任は後回しになります。",
          "経営レビューで信頼指標を同列に置くことで、透明性オペレーションが継続的に回ります。",
        ],
      },
    ],
  },
];

function byDateDesc(a: PostData, b: PostData) {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

export function getSortedPostsData(): PostData[] {
  return [...postCatalog].sort(byDateDesc);
}

export function getAllCategories(): string[] {
  return Array.from(new Set(postCatalog.map((post) => post.category)));
}

export function getPostBySlug(slug: string): PostData | undefined {
  return postCatalog.find((post) => post.slug === slug);
}

export async function getPostData(slug: string): Promise<PostData> {
  const post = getPostBySlug(slug);
  if (!post) {
    throw new Error(`Post not found: ${slug}`);
  }

  return post;
}
