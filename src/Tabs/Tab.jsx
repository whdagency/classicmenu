import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MenuItems from '../MenuItems/MenuItems';
import "./tab.css"
function Tab({
  categories,
  dishes,
  setSelectedTab,
  selectedTab,
  resto,
  infoRes,
  tabel_id,
  customization
}) {
  // Filter categories that have dishes or drinks associated with them
  const [filteredCategories, setFilteredCategories] = useState([]);
  useEffect(() => {
    const filtered = categories.filter(category => {
      return dishes.some(item => {
        const categoryName = item.categorie ? item.categorie.name : item.category;
        console.log("dishesss", dishes);
        return categoryName === category.name && !item.isCustomizable; // Exclude customizable dishes
      });
    });
    setFilteredCategories(filtered);
  }, [categories]);
  // const primaryColor = customization?.selectedPrimaryColor;

  return (
    <div className="">
      <div className="tabs-container overflow-x-auto pl-4">
        <div className="flex md:justify-center gap-4 mb-1">
          <div className="relative shadow-md rounded-xl border-gray-300 border inline-block">
            <div
              className={`tab flex items-center w-[90px] justify-center h-9 pl-1.5 pr-2.5 font-semibold rounded-[8px] cursor-pointer transition-colors 
             `
            }
              style={{backgroundColor: selectedTab === 'All' ? customization?.selectedPrimaryColor : "transparent", color: selectedTab === 'All' ? customization?.selectedBgColor : customization?.selectedTextColor }}
              onClick={() => setSelectedTab('All')}
            >
              <h2 className="text-[14px] mb-0">All</h2>
            </div>
          </div>
          {filteredCategories.map((item) => (
            <div key={item.id} className="relative shadow-md rounded-xl border-gray-300 border inline-block ">
              <div
                onClick={() => setSelectedTab(item.name)}
                className={`tab flex items-center  px-[35px] w-full justify-center h-9  font-semibold rounded-[8px] cursor-pointer transition-colors `
              }
              style={{backgroundColor: selectedTab === item.name ? customization?.selectedPrimaryColor : "transparent" }}
              >
                <h2 className="text-[14px] mb-0 whitespace-nowrap" style={{color: selectedTab === item.name ? customization?.selectedBgColor : customization?.selectedTextColor}}>{item.name}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
      <MenuItems
        dishes={dishes.length > 0 && dishes.filter(dish => selectedTab === 'All' || dish.categorie.name === selectedTab)}
        restoId={resto}
        infoRes={infoRes}
        selectedTab={selectedTab}
        tabel_id={tabel_id}
        customization={customization}
      />
    </div>
  );
}

export default Tab;
