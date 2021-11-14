

class ApiFeatures {
  constructor(query, queryStr){
    this.query = query;
    this.queryStr = queryStr;


  }

  search(){
    const keyword = this.queryStr.keyword ? {
      name:{
        $regex:this.queryStr.keyword,
        $options:"i"  // case Insenstive 
      },
    }
     : {};


    this.query = this.query.find({...keyword});
    return this;
  }

  filter(){
    const queryCopy = {...this.queryStr};

    // Removing some fields for categories filter features 
    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((key)=> delete queryCopy[key]);

    // Filter for price and rating 

    let queryStr = JSON.stringify(queryCopy); // object to string 
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key)=>`$${key}`);

    this.query = this.query.find(JSON.parse(queryStr)); // string to object
    return this;
  }

  pagination(resultPerPage){
    const currentPage =  Number(this.queryStr.page) ||1; // 
    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;



  }

};

module.exports = ApiFeatures;