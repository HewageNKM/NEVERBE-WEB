"use client";
import ImagesSlider from "@/app/(site)/components/ImagesSlider";
import { Slide } from "@/interfaces/Slide";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useRef, useState } from "react";
import type { CarouselRef } from "antd/es/carousel";

const Hero = ({ slides }: { slides: Slide[] }) => {
  const sliderRef = useRef<CarouselRef>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const totalSlides = slides.length || 1;

  const goTo = (index: number) => {
    sliderRef.current?.goTo?.(index);
    setActiveSlide(index);
  };

  return (
    <section className="w-full relative overflow-hidden">
      <div className="w-full h-[60vh] md:h-[88vh] relative">
        <ImagesSlider
          images={slides}
          ref={sliderRef}
          afterChange={(current: number) => setActiveSlide(current)}
        />

        {/* Bottom gradient vignette — makes every slide cinematic */}
        <div
          className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
          style={{
            height: "45%",
            background:
              "linear-gradient(to top, rgba(10,10,10,0.75) 0%, rgba(10,10,10,0.35) 55%, transparent 100%)",
          }}
        />

        {/* Dot indicators — centered bottom, desktop & mobile */}
        {totalSlides > 1 && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2 items-center">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                style={{
                  width: activeSlide === i ? 28 : 8,
                  height: 8,
                  borderRadius: 99,
                  background:
                    activeSlide === i ? "var(--color-accent)" : "rgba(255,255,255,0.35)",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
            ))}
          </div>
        )}

        <div className="hidden md:flex absolute bottom-6 right-8 z-20 gap-3">
          <Button
            shape="circle"
            size="middle"
            icon={<LeftOutlined />}
            onClick={() => sliderRef.current?.prev?.()}
            className="hover:border-accent! hover:text-accent!"
          />
          <Button
            shape="circle"
            size="middle"
            icon={<RightOutlined />}
            onClick={() => sliderRef.current?.next?.()}
            className="hover:border-accent! hover:text-accent!"
          />
        </div>
      </div>

      {/* Section-to-section fade transition */}
      <div
        className="absolute inset-x-0 bottom-0 h-10 pointer-events-none z-20"
        style={{
          background: "linear-gradient(to bottom, transparent, #fcfdfa 100%)",
        }}
      />
    </section>
  );
};

export default Hero;
