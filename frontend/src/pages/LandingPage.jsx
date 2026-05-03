import GallerySection from '../components/landing/GallerySection'
import VerticalTitle from '../components/landing/VerticalTitle'

export default function LandingPage() {
  return (
    <div className="bg-page-gradient h-svh overflow-y-auto flex flex-col justify-start sm:justify-center">
      <VerticalTitle />
      <GallerySection />
    </div>
  )
}
