import GallerySection from '../components/landing/GallerySection'
import VerticalTitle from '../components/landing/VerticalTitle'

export default function LandingPage() {
  return (
    <div className="bg-page-gradient h-svh overflow-hidden flex flex-col justify-center">
      <VerticalTitle />
      <GallerySection />
    </div>
  )
}
