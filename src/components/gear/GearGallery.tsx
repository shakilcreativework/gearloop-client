"use client";

import { useState } from "react";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

const PLACEHOLDER = "/images/placeholder-gear.jpg";

interface GearGalleryProps {
  images: string[];
  title: string;
}

export default function GearGallery({ images, title }: GearGalleryProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const galleryImages = images.length > 0 ? images : [PLACEHOLDER];

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="overflow-hidden rounded-xl border border-border">
        <Swiper
          modules={[Navigation, Thumbs]}
          navigation
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          spaceBetween={0}
          className="aspect-video w-full [&_.swiper-button-next]:!text-card [&_.swiper-button-next]:!bg-primary/80 [&_.swiper-button-next]:!h-8 [&_.swiper-button-next]:!w-8 [&_.swiper-button-next]:!rounded-full [&_.swiper-button-next]:!pr-0.5 [&_.swiper-button-prev]:!text-card [&_.swiper-button-prev]:!bg-primary/80 [&_.swiper-button-prev]:!h-8 [&_.swiper-button-prev]:!w-8 [&_.swiper-button-prev]:!rounded-full [&_.swiper-button-prev]:!pl-0.5"
        >
          {galleryImages.map((src, i) => (
            <SwiperSlide key={i}>
              <div className="relative aspect-video w-full">
                <Image
                  src={src}
                  alt={`${title} — photo ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className="object-cover"
                  priority={i === 0}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Thumbnails */}
      {galleryImages.length > 1 && (
        <Swiper
          modules={[Thumbs]}
          onSwiper={setThumbsSwiper}
          spaceBetween={8}
          slidesPerView={4}
          watchSlidesProgress
          className="thumbs-swiper"
        >
          {galleryImages.map((src, i) => (
            <SwiperSlide key={i}>
              <div className="relative aspect-square cursor-pointer overflow-hidden rounded-lg border-2 border-transparent transition-colors hover:border-primary">
                <Image
                  src={src}
                  alt={`${title} thumbnail ${i + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
