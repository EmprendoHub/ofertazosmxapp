import BonusHero from '@/components/hero/BonusHero';
import HorizontalTextHero from '@/components/hero/HorizontalTextHero';
import MainHeroComponent from '@/components/hero/MainHeroComponent';
import MultiDivHero from '@/components/hero/MultiDivHero';
import UnderConstruction from '@/components/hero/UnderConstruction';
import EditorsPickProducts from '@/components/products/EditorsPickProducts';
import ExploreCategoryComponent from '@/components/products/ExploreCategoryComponent';
import TrendingNewProducts from '@/components/products/TrendingNewProducts';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center ">
      <UnderConstruction />
      {/* <MainHeroComponent />
      <BonusHero />
      <TrendingNewProducts />
      <HorizontalTextHero />
      <ExploreCategoryComponent />
      <MultiDivHero />
      <EditorsPickProducts /> */}
    </main>
  );
}
