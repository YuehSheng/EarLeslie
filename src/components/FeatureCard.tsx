import Link from 'next/link';
import Image from 'next/image';

interface FeatureCardProps {
  title: string;
  description: string;
  href: string;
  icon: string;
}

export default function FeatureCard({ title, description, href, icon }: FeatureCardProps) {
  return (
    <Link href={href} className="block">
      <div className="card group">
        <div className="flex items-center justify-center mb-4">
          <Image
            src={icon}
            alt={title}
            width={48}
            height={48}
            className="dark:invert"
          />
        </div>
        <h3 className="text-xl font-bold text-center mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-center">
          {description}
        </p>
      </div>
    </Link>
  );
}
