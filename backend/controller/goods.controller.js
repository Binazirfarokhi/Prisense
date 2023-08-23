const Excel = require('exceljs');
const {MyProductModel, ProductModel} = require("../models/product.model");
const {WatchingProductModel} = require("../models/watching.model");
const mongoose = require("mongoose");
const { Readable } = require('stream');
const computeDiffIndex = (productPrice, highest, lowest) => {
  if (highest === null ) {
    return (productPrice - lowest) / lowest;
  } else if (lowest === null) {
    return (highest - productPrice) / productPrice;
  } else {

    const middlePrice = (highest + lowest) / 2;

    return (productPrice - middlePrice) / middlePrice;
  }
}
class GoodsController {
  constructor() {}

  getAllStores = async (req, res) => {
    try {
      const storeNames = await ProductModel.distinct('store');
      res.status(200).json(storeNames);
    } catch (err) {
      res.status(500).send(err);
    }
  }

  searchMarketGoods = async (req, res) => {
    try {
      let {productName = '', page = 1, pageSize = 10, dateRange = '', priceRange = '', stores = ''} = req.query;
      const watchingProducts = await WatchingProductModel.find().lean();

      if (dateRange.split(',').map(item => item.trim()).filter(item => item.length > 0).length === 0) {
        dateRange = null;
      }



      const andConditions = [
        {
          name: {
            $regex: new RegExp(`.*${productName.trim()}.*`, 'i')
          }
        },
        {
          name: {
            $nin: watchingProducts.map(product => product.name)
          },

        }
      ];

      const rangePrices = priceRange ? priceRange.split(',') : null;
      const rangeDates = dateRange ? dateRange.split(',') : null;
      const storeNames = stores ? stores.trim().split(',').map(item => item.trim()).filter(item => item.length > 0) : null;

      if (rangePrices) {
        andConditions.push({
          price: {
            $gte: Number(rangePrices[0]),
            $lte: Number(rangePrices[1])
          }
        })
      }
      if (rangeDates) {
        andConditions.push({
          update_date: {
            $gte: new Date(rangeDates[0].trim()),
            $lte: new Date(rangeDates[1].trim())
          }
        })
      }

      if (storeNames) {
        andConditions.push({
          store: {
            $in: storeNames
          }
        })
      }

      console.log(andConditions)
      let count = await ProductModel.count({
        $and: andConditions
      })
      let marketProducts = await ProductModel.find({
        $and: andConditions
      })
        .skip((page - 1) * pageSize)
        .limit(Number(pageSize))
        .lean();

      marketProducts = [...marketProducts];

      for (let product of marketProducts) {
        const maxPriceProduct = await ProductModel.find({
          name: product.name,
          package: product.package,
          brand: product.brand,
          unit: product.unit
        }).sort({price: -1}).limit(1);
        const minPriceProduct = await ProductModel.find({
          name: product.name,
          package: product.package,
          brand: product.brand,
          unit: product.unit
        }).sort({price: 1}).limit(1);

        product.highest = maxPriceProduct[0].price;
        product.lowest = minPriceProduct[0].price;
      }


      res.status(200).json({
        total: count,
        data: marketProducts,
        page: page,
        pageSize
      });
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  }

  getGoods = async (req, res) => {
    try {
      const {page = 1, pageSize = 10, query} = req.query;
      const myProducts = await MyProductModel
        .find(query)
        .skip((page - 1) * pageSize)
        .limit(pageSize);
      const total = await MyProductModel.count();
      res.status(200).json({
        data: myProducts,
        total: total,
        page,
        pageSize
      })


    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  }

  generateWatchingList = async (myProducts, user) => {
    let count = 0;
    try {
      for (let myProduct of myProducts) {
        let minPrice = null;
        let maxPrice = null;

        const sameProducts = await ProductModel.find({
          name: myProduct.name,
          package: myProduct.package,
          brand: myProduct.brand,
          unit: myProduct.unit
        });
        const competitors = await ProductModel.distinct('store',{
          name: myProduct.name,
          package: myProduct.package,
          brand: myProduct.brand,
          unit: myProduct.unit
        });
        for (let sameProduct of sameProducts) {
          let sameProductPrice = Number(sameProduct.price);
          if (Number.isNaN(sameProductPrice)) {
            sameProductPrice = parseFloat(sameProduct.price);
          }
          if (minPrice === null || sameProductPrice < minPrice) {
            minPrice = sameProductPrice;
          }
          if (maxPrice === null || sameProductPrice > maxPrice) {
            maxPrice = sameProductPrice;
          }
        }
        if (maxPrice !== null || minPrice !== null) {
          let diffIndex = computeDiffIndex(myProduct.price, maxPrice, minPrice);
          if (Number.isNaN(diffIndex)) {
            diffIndex = 0
          }
          if (diffIndex !== 0) {

            const oldRecord = await WatchingProductModel.findOne({
              brand: myProduct.brand,
              name: myProduct.name,
              package: myProduct.package,
              unit: myProduct.unit,
            });

            if (oldRecord) {
              await WatchingProductModel.findOneAndUpdate({
                brand: myProduct.brand,
                name: myProduct.name,
                package: myProduct.package,
                unit: myProduct.unit,
              }, {
                $set: {
                  currentPrice: Number(myProduct.price),
                  highest: maxPrice || null,
                  lowest: minPrice || null,
                  diffIndex: diffIndex
                }
              })
            } else {
              await WatchingProductModel.create({
                brand: myProduct.brand,
                name: myProduct.name,
                package: myProduct.package,
                unit: myProduct.unit,
                currentPrice: Number(myProduct.price),
                highest: maxPrice || null,
                lowest: minPrice || null,
                diffIndex: diffIndex,
                competitors: competitors.length,
                owner: new mongoose.mongo.ObjectId(user.id)
              });
            }

            count ++;
          }
        }
      }

    } catch (err) {
      console.log(err)
    } finally {
      return count;
    }
  }


  parseFile = async (file, user) => {
    const workbook = new Excel.Workbook();
    const stream = Readable.from(file.data);
    let currentRow = 1;
    const myProducts = [];
    if (file.name.includes('csv')) {
      await workbook.csv.read(stream);
    }
    if (file.name.includes('xls')) {
      await workbook.xlsx.read(stream);
    }
    workbook.eachSheet(function(worksheet, sheetId) {
      worksheet.eachRow(function (row) {
        if (currentRow !== 1) {

          myProducts.push({
            store: row.getCell(1).value,
            branch: row.getCell(2).value,
            brand: row.getCell(3).value,
            name: row.getCell(4).value,
            price: row.getCell(5).value,
            package: row.getCell(6).value,
            unit: row.getCell(7).value,
            price_per_unit: row.getCell(8).value,
            price_compare_quantity: row.getCell(9).value,
            price_compare_unit: row.getCell(10).value,
            update_date: new Date().toString(),
            owner: new mongoose.mongo.ObjectId(user.id)
          });
        }
        currentRow ++;
      })
    });
    return myProducts;
  }

  importMyProductsByUploadFile = async (req, res) => {
    try {
      const user = req.user;
      const myProducts = [];
      let currentRow = 1;
      let productsFiles = [];
      let productsFilesNames = JSON.parse(req.body.uploadFiles);
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
      }
      productsFiles = productsFilesNames.map(name => {
        return req.files[name];
      });
      for (let productFile of productsFiles) {
        if (productFile.name.includes('.json')) {
          const products = JSON.parse(productFile.data.toString()).map(item => {
            const {_id, ...productData} = item;
            return productData;
          })
          myProducts.push(
            ...products
          )
          continue;
        }

        const products = await this.parseFile(productFile, user);
        myProducts.push(...products);

      }
      const count = await this.generateWatchingList(myProducts, req.user);

      res.status(200).send({
        count: count
      });
    } catch (err) {
      console.log(err)
      res.status(500).send(err);
    }
  }

}

module.exports = {
  GoodsController: new GoodsController()
}