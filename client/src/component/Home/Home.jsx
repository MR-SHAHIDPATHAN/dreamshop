

import React , {useEffect} from 'react'
import { CgMouse } from 'react-icons/cg'
import '../Home/Home.css'
import ProductCard from './ProductCard.jsx'
import MetaData from '../layout/MetaData';

import { getProduct , clearError } from '../../actions/productAction.js';
import { useSelector , useDispatch } from "react-redux";
import Loading from '../layout/Loader/Loading'
import { useAlert } from 'react-alert';




const Home = () => {

  const alert = useAlert();

  const dispatch = useDispatch();
  const {loading , error , products, } = useSelector((state) =>state.products)


  // get product function calling here
  useEffect(() => {

    if (error) {
      alert.error(error);
      dispatch(clearError());
    }

    dispatch( getProduct());
   
  }, [dispatch , error , alert])

  return (
    <>

      {loading ? <Loading/> :
<>
<MetaData title="ECOMMERCE"></MetaData>

<div className="banner">
  <p>Welcome to DreamShop</p>

  <h1>FIND AMAZING PRODUCTS BELOW</h1>

  <a href="#container">
    <button>
      Scroll <CgMouse/>
    </button>
  </a>

</div>

  
<h2 className="homeHeading"> Featured Products</h2>
<div className="container" id="container" >


{
products && products.map(product =>(
  <ProductCard product={product} />

))
}
  
  
</div>

</>
 }



    </>
  )
}

export default Home




