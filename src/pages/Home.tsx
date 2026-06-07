import Hero from '../sections/Hero'
import Intro from '../sections/Intro'
import SectorMarquee from '../sections/SectorMarquee'
import CommercialTeaser from '../sections/CommercialTeaser'
import Mission from '../sections/Mission'
import Decades from '../sections/Decades'
import WhyChooseUs from '../sections/WhyChooseUs'
import Approach from '../sections/Approach'
import FeaturedProjects from '../sections/FeaturedProjects'

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <SectorMarquee />
      <CommercialTeaser />
      <Mission />
      <Decades />
      <WhyChooseUs />
      <Approach />
      <FeaturedProjects />
    </>
  )
}
