import Header from "@/components/sections/Header";
import ImageSlider from "@/components/sections/ImageSlider";
import Popular from "@/components/sections/Popular";
import Arrival from "@/components/sections/Arrival";
import Footer from "@/components/sections/Footer";

export default function Home() {
    return (
        <main className="w-full overflow-clip h-full px-8 py-4">
            <Header/>
            <ImageSlider />
            <Popular />
            <Arrival />
            <Footer/>
        </main>
    );
}
