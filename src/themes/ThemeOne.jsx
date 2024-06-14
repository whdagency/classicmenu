import React from "react";
import { useMenu } from "../hooks/useMenu";
import ThemeOneHeader from "./ThemeOneHeader";
import ThemeOneBanner from "../Banner/ThemeOneBanner";
import ThemeDishes from "./ThemeDishes";
import { Accordion } from "@/components/ui/accordion";
import ThemeOneFooter from "../Footer/ThemeOneFooter";

const ThemeOne = () => {
  const { customization, dishes, categories } = useMenu();

  // Filter dishes by category
  const dishesByCategory = (catId) => {
    const filteredDishes = dishes.filter((dish) => dish.category_id === catId);
    return filteredDishes;
  };

  return (
    <section className="bg-black/70 flex flex-col items-center justify-center min-h-screen">
      <div
        style={{ backgroundColor: customization.selectedBgColor }}
        className="max-w-2xl md:shadow md:h-[95vh] w-full md:overflow-y-scroll oveflow-x-hidden scrollbar-hide pb-20 relative"
      >
        <ThemeOneHeader />

        <ThemeOneBanner />

        {/* Dishes Sorted By Category */}
        <div className="flex flex-col gap-3 px-5">
          {categories.map((category) => {
            const filteredDishes = dishesByCategory(category.id);

            if (filteredDishes.length === 0) {
              return null;
            }

            return (
              <div
                key={category.id}
                className="flex flex-col justify-center gap-4 pt-5"
              >
                <Accordion
                  type="multiple"
                  defaultValue={[...categories.map((cat) => cat.id)]}
                  collapsible
                  className="flex flex-col gap-3"
                >
                  <ThemeDishes category={category} dishes={filteredDishes} />
                </Accordion>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col items-center w-full">
          <ThemeOneFooter />
        </div>
      </div>
    </section>
  );
};

export default ThemeOne;
