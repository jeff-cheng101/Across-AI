'use client';

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

type BrandCard = {
  id: 'ailabs' | 'cyberon' | 'eland';
  name: string;
  subtitle: string;
  logoUrl: string;
};

const BRAND_CARDS: BrandCard[] = [
  {
    id: 'ailabs',
    name: 'Taiwan AI Labs',
    subtitle: '台灣人工智慧實驗室',
    logoUrl: '/images/aie-ailabs-logo.png',
  },
  {
    id: 'cyberon',
    name: 'Cyberon',
    subtitle: 'Leading Speech Solution Provider',
    logoUrl: '/images/aie-cyberon-logo.png',
  },
  {
    id: 'eland',
    name: 'eLAND',
    subtitle: 'AI · Data · Cloud',
    logoUrl: '/images/aie-eland-logo.png',
  },
];

export default function AIEEntryPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="relative z-10 p-6 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/')}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <span className="text-xs font-mono tracking-widest text-primary">
            AIE
          </span>
          <h1 className="text-lg font-bold text-foreground">AI Ecosystem</h1>
        </div>
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl w-full">
          {BRAND_CARDS.map((brand, index) => (
            <motion.button
              key={brand.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(`/aie/${brand.id}`)}
              className="group relative bg-card/90 border border-primary/30 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 shadow-[0_0_40px_-10px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_60px_-10px_hsl(var(--primary)/0.5)] hover:border-primary/60 transition-all duration-700 ease-in-out cursor-pointer"
            >
              <div className="relative z-10 w-full h-20 flex items-center justify-center">
                <Image
                  src={brand.logoUrl}
                  alt={brand.name}
                  width={180}
                  height={64}
                  className="max-h-16 max-w-[180px] object-contain opacity-80 group-hover:opacity-100 transition-opacity dark:brightness-0 dark:invert"
                />
              </div>
              <div className="relative z-10 text-center">
                <p className="text-sm font-semibold text-foreground">
                  {brand.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {brand.subtitle}
                </p>
              </div>
              <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
