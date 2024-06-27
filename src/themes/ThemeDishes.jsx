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
} from "@/components/ui/credenza";
import { Button } from "@/components/ui/button";
import { useMenu } from "../hooks/useMenu";
import { APIURL } from "../lib/ApiKey";
import { useDispatch } from "react-redux";
import { addItem } from "../lib/cartSlice";

const ThemeDishes = ({ category, dishes }) => {
  const { resInfo } = useMenu();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <>
      <AccordionItem value={category.id}>
        <AccordionTrigger className="hover:bg-black hover:no-underline  flex flex-row items-center justify-between w-full px-3 py-2 text-white uppercase bg-black rounded">
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
                <h3 className=" font-medium">{dish.name}</h3>
                <p className=" font-medium">
                  {dish.price} {resInfo.currency || "MAD"}
                </p>
              </div>

              <p className="text-black/60  text-sm font-light">{dish.desc}</p>
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
  const { resInfo, customization, resto_id } = useMenu();
  const [quantities, setQuantities] = useState({});
  const [addToCartClicked, setAddToCartClicked] = useState(false);

  const dispatch = useDispatch();

  // Initial quantity
  const getQuantity = (itemId) => quantities[itemId] || 1;

  // Set quantity
  const setQuantity = (itemId, value) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: value > 0 ? value : 1,
    }));
  };

  // Add item to cart
  const handleAddItem = (product, quantity) => {
    dispatch(addItem({ product, quantity: quantity, resto_id: resto_id }));
    setIsModalOpen(false);
  };

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
                  <Button
                    onClick={() =>
                      setQuantity(
                        selectedItem.id,
                        getQuantity(selectedItem.id) - 1
                      )
                    }
                    size="icon"
                    variant="outline"
                  >
                    <MinusIcon className="w-4 h-4" />
                  </Button>
                  <span className="dark:text-gray-50 text-base font-medium text-gray-900">
                    {getQuantity(selectedItem.id)}
                  </span>
                  <Button
                    onClick={() =>
                      setQuantity(
                        selectedItem.id,
                        getQuantity(selectedItem.id) + 1
                      )
                    }
                    size="icon"
                    variant="outline"
                  >
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
                onClick={() => {
                  handleAddItem(selectedItem, getQuantity(selectedItem.id));
                  setAddToCartClicked(true);
                  setTimeout(() => {
                    setAddToCartClicked(false);
                  }, 1000);
                }}
                className={`rounded-lg p-2 transition-all duration-300 border font-medium text-xs md:text-sm flex items-center justify-center gap-1 md:w-[300px]`}
                style={{
                  backgroundColor: customization?.selectedPrimaryColor,
                }}
              >
                <div
                  className={`text-lg font-semibold ${
                    addToCartClicked ? "text-primary-blue" : "text-white"
                  } `}
                >
                  {addToCartClicked
                    ? "Added To Your Cart"
                    : `Add to selected: ${
                        (
                          selectedItem.price * getQuantity(selectedItem.id)
                        ).toFixed(2) +
                        " " +
                        resInfo?.currency
                      }`}
                </div>
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
