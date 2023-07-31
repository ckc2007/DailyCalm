import React, { useState } from "react";
import CategoryMenu from "./CategoryMenu";
import RelatedCards from "./RelatedCards";
import { categories } from "./data"; // Import the data

const SaveCards = () => {

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  return (
    <>
      <CategoryMenu
        categories={categories}
        handleCategoryClick={handleCategoryClick}
      />

      {/* Render the RelatedCards for the selected category */}
      {selectedCategoryId && (
        <RelatedCards
          category={categories.find(
            (category) => category.id === selectedCategoryId
          )}
        />
      )}
    </>
  );
};

export default SaveCards;
