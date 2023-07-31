import React from "react";
import { Container, Col, Card, Row } from "react-bootstrap";
import { categories } from "./data"; // Import the categories

const CategoryMenu = ({ activeCategory, handleCategoryClick }) => {
  return (
    <>
      <Container>
        <Row>
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)} // Pass the entire category object - debug here
              className={`categoryCard ${
                activeCategory === category.id ? "active" : ""
              }`}
            >
              {/* You can use a Card component here, or a custom styled component */}
              <Card>
                <Card.Body>
                  <Card.Title>{category.name}</Card.Title>
                </Card.Body>
              </Card>
            </div>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default CategoryMenu;
