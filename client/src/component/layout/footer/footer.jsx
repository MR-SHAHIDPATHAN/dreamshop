import React from 'react';
import playStore from '../../../images/playstore.png'
import appStore from '../../../images/Appstore.png'
import './footer.css'

const footer = () => {
  return (
    <>


    <footer id="footer">

      <div className="leftFooter">
      <h4>DOWNLOAD OUR LINK</h4>
      <p>Download App for Android and IOS mobiles phone</p>
      <img src={playStore} alt="playstore-img" />
      <img src={appStore} alt="appStore-img" />
        
      </div>

      <div className="midFooter">
        <h1>DreamShop</h1>
        <p> High Quality is our first priority</p>
        <p> Copyright 2021 &Copy; Mr.ShahidPathan</p>

      </div>

      <div className="rightFooter">
      <h4>Follows us </h4>
      <a href="http://instagram.com/mr.shahidpathan">instagram</a>
      <a href="http://instagram.com/mr.shahidpathan">Facebook</a>
      <a href="http://instagram.com/mr.shahidpathan">YouTube</a>
      

      </div>


      

    </footer>



    
    </>
  )
}

export default footer
