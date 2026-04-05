import GallerySection from '../components/landing/GallerySection'
import VerticalTitle from '../components/landing/VerticalTitle'

export default function LandingPage() {
  return (
    <div className="h-svh overflow-hidden flex flex-col justify-center" style={{ background: 'linear-gradient(180deg, rgba(15, 32, 39, 1) 40%, rgba(44, 83, 100, 1) 100%)' }}>
      <VerticalTitle />
      <GallerySection />
    </div>
  )
}
