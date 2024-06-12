import React, { useState } from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import { Button } from "@/components/ui/button";
import { useMenu } from "../hooks/useMenu";
import { APIURL } from "../lib/ApiKey";

const ThemeDishes = ({ category, dishes }) => {
  const { customization, resInfo } = useMenu();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <>
      <AccordionItem value={category.id}>
        <AccordionTrigger className="bg-black/60 hover:bg-black/70 w-full flex flex-row items-center hover:no-underline justify-between px-3 py-2 text-white rounded-[2px] font-[SEGOE-UI]">
          {category.name}
        </AccordionTrigger>

        <AccordionContent className="flex flex-col gap-4 px-1 pt-4">
          {dishes.map((dish) => (
            <div
              key={dish.id}
              onClick={() => {
                setSelectedItem(dish);
                setIsModalOpen(true);
              }}
              className="hover:bg-black/5 flex flex-col gap-2 p-2 cursor-pointer"
            >
              <div className="border-b-black/40 last:border-b-0 flex items-center justify-between border-b">
                <h3 className="font-sans font-medium">{dish.name}</h3>
                <p className="font-sans font-medium">
                  {dish.price} {resInfo.currency || "MAD"}
                </p>
              </div>

              <p className="text-black/60 font-sans text-sm font-light">
                {dish.desc}
              </p>
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>

      <AddDishToCart
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedItem={selectedItem}
      />
    </>
  );
};

export default ThemeDishes;

const AddDishToCart = ({ isModalOpen, setIsModalOpen, selectedItem }) => {
  const { resInfo, customization } = useMenu();
  return (
    <Credenza
      className={"!bg-white !py-0"}
      open={isModalOpen}
      onOpenChange={setIsModalOpen}
    >
      <CredenzaContent className="flex max-h-screen md:w-[50rem]  bg-white md:flex-col md:justify-center ">
        {selectedItem != null && (
          <>
            <CredenzaHeader
              photo={`${APIURL}/storage/${selectedItem.image}`}
              className="hidden p-0"
            />
            <CredenzaBody className="sm:pb-0 mt-5 space-y-4 text-sm text-center">
              <CredenzaTitle>{selectedItem.name}</CredenzaTitle>
              <p className="text-neutral-400 flex items-center justify-center w-full m-0 text-center">
                {selectedItem?.desc?.length > 20
                  ? selectedItem?.desc?.slice(0, 100) + "..."
                  : selectedItem?.desc}
              </p>
              <div className=" flex items-center justify-center">
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="outline">
                    <MinusIcon className="w-4 h-4" />
                  </Button>
                  <span className="dark:text-gray-50 text-base font-medium text-gray-900">
                    1
                  </span>
                  <Button size="icon" variant="outline">
                    <PlusIcon className="w-4 h-4" />
                  </Button>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="currentColor"
                  className="bi bi-dot mx-1"
                  viewBox="0 0 16 16"
                  style={{ color: customization?.selectedPrimaryColor }}
                >
                  <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
                </svg>
                <span>{selectedItem.price + " " + resInfo?.currency}</span>
              </div>
            </CredenzaBody>
            <CredenzaFooter className="md:justify-center grid items-center">
              <button
                type="button"
                className={`rounded-[1rem] p-2 transition-all duration-300 border font-medium text-xs md:text-sm flex items-center justify-center gap-1 md:w-[300px]`}
                style={{
                  backgroundColor: customization?.selectedPrimaryColor,
                }}
              >
                <div className={`text-lg font-semibold text-white`}>Add</div>
              </button>
              <CredenzaClose asChild>
                <Button variant="outline bg-black text-white">Close</Button>
              </CredenzaClose>
            </CredenzaFooter>
          </>
        )}
      </CredenzaContent>
    </Credenza>
  );
};

function MinusIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
    </svg>
  );
}

function PlusIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
