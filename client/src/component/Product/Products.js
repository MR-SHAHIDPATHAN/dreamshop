import React, { useEffect, useState } from 'react';
import '../Product/Products.css';

import { useSelector, useDispatch } from 'react-redux';
import { clearError, getProduct } from '../../actions/productAction'
import Loading from '../layout/Loader/Loading';
import ProductCard from '../Home/ProductCard';
import Typography from '@mui/material/Typography';
import { Slider } from '@mui/material';
import { useAlert } from "react-alert";
import Pagination from 'react-js-pagination';
import MetaData from '../layout/MetaData.js'




//! categoris array list 

const categories = [
  "Laptop",
  "Footwear",
  "Bottom",
  "Tops",
  "Attire",
  "Camera",
  "SmartPhones"
];

const Products = ({ match }) => {

  const dispatch = useDispatch()
  const alert = useAlert();
  const [currentPage, setCurrentPage] = useState(1)
  const [price, setPrice] = useState([0, 25000]);
  const [category, setCategory] = useState("")
  const [ratings, setRatings] = useState(0)
  const { products, loading, error, productsCount, resultPerPage ,  filteredProductsCount } = useSelector(state => state.products)

  // search code here
  const keyword = match.params.keyword;
  // pagination code 
  const setCurrentPageNo = (e) => {
    setCurrentPage(e);
  }

  const priceHandler = (event, newPrice) => {
    setPrice(newPrice)
  }
  let count = filteredProductsCount;
  // use Effect here
  useEffect(() => {
    if(error){
      alert.error(error)
      dispatch(clearError())

    }
    dispatch(getProduct(keyword, currentPage, price, category, ratings))
  }, [dispatch, error, alert,  keyword, currentPage, price, category, ratings])
  // 
  return (
    <>
      {loading ? <Loading /> :




        <>
        <MetaData title="PRODUCTS -- ECOMMERCE"/>
          <h2 className="productsHeading">Products</h2>

          <div className="products">
            {products &&
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>

          <div className="filterBox">
            <Typography >Price</Typography>
            <Slider
              value={price}
              onChange={priceHandler}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              min={0}
              max={25000}
            />

            <Typography className="categoryCaps">CATEGORIES</Typography>
            <ul className="categoryBox">
              {categories.map((category) => (
                <li
                  className="category-link"
                  key={category}
                  onClick={() => setCategory(category)}
                >
                  {category}
                </li>
              ))}
            </ul>

            <fieldset>
              <Typography component="legend">Ratings Above</Typography>

              <Slider
                value={ratings}
                onChange={(e, newRating) => {
                  setRatings(newRating);
                }}
                aria-labelledby="continuous-slider"
                valueLabelDisplay="auto"
                min={0}
                max={5}
              />
            </fieldset>
          </div>

          {
            resultPerPage < productsCount &&
            <div className="paginationBox">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resultPerPage}
                totalItemsCount={productsCount}
                onChange={setCurrentPageNo}
                nextPageText="Next"
                prevPageText="Prev"
                firstPageText="1st"
                lastPageText="Last"
                itemClass="page-item"
                linkClass="page-link"
                activeClass="pageItemActive"
                activeLinkClass="pageLinkActive"
              />
            </div>
          }






        </>}
    </>
  );
};

export default Products
