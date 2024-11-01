import Navigation from '@/components/Navigation';
import FeatureCard from '@/components/FeatureCard';

export default function Home() {
  return (
    <>
      <Navigation />
      <div className="pt-20 pb-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            耳孔無有力 (EarLeslie)
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            提升您的音樂素養，培養專業級的聽力技巧
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            title="單音訓練"
            description="從基本的音高識別開始，逐步提升您的音感能力"
            href="/single"
            icon="/file.svg"
          />
          <FeatureCard
            title="複音訓練"
            description="學習識別多個音符的組合，增強和聲感知能力"
            href="/multiple"
            icon="/window.svg"
          />
          <FeatureCard
            title="和弦訓練"
            description="掌握各種和弦的特性，提升和聲分析能力"
            href="/chord"
            icon="/globe.svg"
          />
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">
            為什麼選擇耳孔無有力？
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-4">
              <h3 className="font-bold mb-2">互動式學習</h3>
              <p className="text-gray-600 dark:text-gray-300">
                通過實時反饋和漸進式難度提升，讓學習更有趣且高效
              </p>
            </div>
            <div className="p-4">
              <h3 className="font-bold mb-2">專業設計</h3>
              <p className="text-gray-600 dark:text-gray-300">
                基於音樂教育理論設計的練習系統，幫助您循序漸進地提升
              </p>
            </div>
            <div className="p-4">
              <h3 className="font-bold mb-2">靈活配置</h3>
              <p className="text-gray-600 dark:text-gray-300">
                可自定義練習參數，適應不同程度學習者的需求
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
