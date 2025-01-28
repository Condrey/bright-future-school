"use client";

import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../add-asset/barrel-file";
import ComputerLabItemsDetails from "./computer-lab-items-details";
import FoodStoreItemsDetails from "./food-store-items-details";
import GeneralStoreItemsDetails from "./general-store-items-details";
import LaboratoryItemsDetails from "./lab-items-details";
import LibraryItemsDetails from "./library-items-details";

export default function HeaderDetails() {
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
        <CarouselItem className="max-w-fit pl-1">
          <div className="h-full flex-1 p-1">
            <LibraryItemsDetails />
          </div>
        </CarouselItem>
        <CarouselItem className="max-w-fit pl-1">
          <div className="h-full flex-1 p-1">
            <LaboratoryItemsDetails />
          </div>
        </CarouselItem>
        <CarouselItem className="max-w-fit pl-1">
          <div className="h-full flex-1 p-1">
            <ComputerLabItemsDetails />
          </div>
        </CarouselItem>
        <CarouselItem className="max-w-fit pl-1">
          <div className="h-full flex-1 p-1">
            <GeneralStoreItemsDetails />
          </div>
        </CarouselItem>
        <CarouselItem className="max-w-fit pl-1">
          <div className="h-full flex-1 p-1">
            <FoodStoreItemsDetails />
          </div>
        </CarouselItem>
      </CarouselContent>
      {/* <CarouselPrevious />
      <CarouselNext /> */}
    </Carousel>
  );
}
