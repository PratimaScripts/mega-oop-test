import React, { useState, useEffect } from "react";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import chunk from "lodash/chunk";
import "../styles.scss";

const CategorySelection = props => {
  let allCategories = get(props, "categories.getTaskCategories.data", []);
  const [categoryData, setData] = useState(get(props, "categoryData"));

  useEffect(() => {
    setData(get(props, "categoryData"));

    //eslint-disable-next-line
  }, [props.categoryData]);

  const [selectedCategory, setSelectedCategory] = useState(
    get(categoryData, "selected", {})
  );

  const [selectedSubcategory, setSelectedSubCategory] = useState(
    get(categoryData, "subCategory", "")
  );

  let chunks = !isEmpty(allCategories) && chunk(allCategories, 4);
  let categoryAr = chunks.map((cat, i) => {
    return (
      <ul key={i}>
        {cat.map((meow, j) => {
          return (
            <li key={j} onClick={() => setSelectedCategory(meow)}>
              <div
                className={
                  selectedCategory["name"] === meow["name"]
                    ? "card--task active"
                    : "card--task"
                }
              >
                <img src={meow.avatar} alt={meow.name} />
              </div>
              <label>{meow.name}</label>
            </li>
          );
        })}
      </ul>
    );
  });

  const saveCategoryData = () => {
    if (!isEmpty(selectedCategory) && !isEmpty(selectedSubcategory)) {
      props.setCategoryData({
        category: get(selectedCategory, "name"),
        subCategory: selectedSubcategory,
        selected: selectedCategory
      });
      props.setActiveClass(2);
    }
  };

  let subCatContent =
    !isEmpty(get(selectedCategory, "subCategory")) &&
    get(selectedCategory, "subCategory").map((sub, i) => {
      return (
        <option
          value={sub}
          key={i}
          selected={selectedSubcategory === sub ? "selected" : ""}
        >
          {sub}
        </option>
      );
    });
  return (
    <>
      <p className="head--task">
        <b>New Task:</b> Select Main Category *
      </p>
      <div className="category--task">{categoryAr}</div>
      <div className="form-group">
        <label>Select Sub Category:</label>
        <div className="input-group">
          <div className="input-group-prepend">
            <div className="input-group-text">
              <i className="fas fa-sitemap"></i>
            </div>
          </div>
          <select
            name="subCategories"
            id="taskSubCategories"
            className="form-control"
            onChange={e => setSelectedSubCategory(e.target.value)}
            placeholder="Choose Sub Category Or Issue"
          >
            <option value disabled selected>
              Select {get(selectedCategory, "name")}'s Subcategories
            </option>
            {subCatContent}
          </select>
          {/* <input
            className="form-control"
            type="text"
            placeholder="Choose Sub Category Or Issue"
          /> */}
        </div>
      </div>
      <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <button
          className="btn btn-warning  pull-right"
          onClick={saveCategoryData}
        >
          Next &nbsp;
          <i className="fa fa-angle-double-right" aria-hidden="true"></i>
        </button>
      </div>
    </>
  );
};

export default CategorySelection;
