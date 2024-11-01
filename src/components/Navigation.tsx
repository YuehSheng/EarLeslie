import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold">
            耳孔無有力
          </Link>
          <div className="flex space-x-4">
            <Link href="/single" className="btn btn-secondary">
              單音訓練
            </Link>
            <Link href="/multiple" className="btn btn-secondary">
              複音訓練
            </Link>
            <Link href="/chord" className="btn btn-secondary">
              和弦訓練
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
