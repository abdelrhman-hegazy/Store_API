//learning
// console.log(req.body);   // post/put send data , form data , json long data
// console.log(req.query);  // using search, sorting, filtering
// console.log(req.params); // attched to the url exmple named

const Product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({}).sort("price");
  // res.status(404).json({ msg: "not found products" });

  res.status(200).json({ products, nbHits: products.length });
};

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject = {};
  //featured
  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  //company
  if (company) {
    queryObject.company = company;
  }
  //name
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }
  //numericFilters
  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    const regEx = /\b(<|>|=|>=|<=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );

    const options = ["price", "rating"];
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  //sort
  let result = Product.find(queryObject);
  if (sort) {
    sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("createAt");
  }
  if (fields) {
    fieldsList = fields.split(",").join(" ");
    result = result.select(fieldsList);
  }

  // limit & skip & page
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const products = await result;
  res.status(200).json({ products, nbHits: products.length });
};
module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
