import React from "react";
import { useMenu } from "../hooks/useMenu";
import ThemeOneHeader from "./ThemeOneHeader";
import ThemeOneBanner from "./ThemeOneBanner";
import ThemeDishes from "./ThemeDishes";
import { Accordion } from "@/components/ui/accordion";

const ThemeOne = () => {
  const {
    customization,
    restos,
    resInfo,
    dishes,
    categories,
    setCategories,
    selectedTab,
    setSelectedTab,
    restoSlug,
  } = useMenu();

  const dishesByCategory = (catId) => {
    const filteredDishes = dishes.filter((dish) => dish.category_id === catId);
    return filteredDishes;
  };

  return (
    <section className="bg-black/60 flex flex-col justify-center min-h-screen">
      <div
        style={{ backgroundColor: customization.selectedBgColor }}
        className="md:max-w-2xl md:shadow md:h-[95vh] w-full mx-auto md:overflow-y-scroll oveflow-x-hidden scrollbar-hide pb-5"
      >
        <ThemeOneHeader />

        <ThemeOneBanner />

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
      </div>

      {/* <p className=""> {}</p> */}
    </section>
  );
};

export default ThemeOne;
