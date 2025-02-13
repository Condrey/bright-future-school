"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface CarouselHeaderContainerProps {
  children: React.ReactNode[];
}
export default function CarouselHeaderContainer({
  children,
}: CarouselHeaderContainerProps) {
  return (
    <Carousel
      className="max-w-full"
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 4000,
        }),
      ]}
    >
      <CarouselContent className="-ml-1">
        {children.map((child, index) => (
          <CarouselItem key={index} className="max-w-fit pl-1">
            <div className="h-full flex-1 p-1">{child}</div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4" />
      <CarouselNext className="right-4" />
    </Carousel>
  );
}
