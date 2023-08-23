const {MyProductModel, ProductModel} = require("../models/product.model");
const {WatchingProductModel} = require("../models/watching.model");
const mongoose = require("mongoose");
const {NotificationsService} = require("./notification.controller");

const GenerateCache = {};
const computeDiffIndex = (productPrice, highest, lowest) => {
  if (highest === null ) {
    return (productPrice - lowest) / lowest;
  }
  if (lowest === null) {
    return (highest - productPrice) / productPrice;
  } else {

    const middlePrice = (highest + lowest) / 2;

    return (productPrice - middlePrice) / middlePrice;
  }
}
class WatchingController {
  constructor() {}

  removeWatchingItem = async (req, res) => {
    try {
      const {watchingId} = req.params;
      await WatchingProductModel.findByIdAndDelete(watchingId);
      res.status(200).send();
    } catch (err) {
      res.status(500).send(err);
    }
  }

  getGenerateProgress = async (req, res) => {
    const user = req.user;
    if (GenerateCache[user.id]) {
      res.status(200).json({
        generating: true
      })
    } else {
      res.status(200).json({
        generating: false
      })
    }
  }

  getWatchingItemDetail = async (req, res) => {
    try {
       const {watchingId} = req.params;
       const watchingItem = await WatchingProductModel.findById(watchingId);
       const sameProducts = await ProductModel.find({
         name: watchingItem.name,
         package: watchingItem.package,
         unit: watchingItem.unit,
         brand: watchingItem.brand
       });
       res.status(200).json({
         watchingItem,
         sameProducts
       })
    } catch (err) {
      res.status(500).send(err);
    }
  }

  addProductToWatchingList = async (req, res) => {
    try {
      const user = req.user;
      let minPrice = null;
      let maxPrice = null;
      const {name, package: p, unit, brand, price} = req.body;
      const sameProducts = await ProductModel.find({
        name: name,
        package: p,
        brand: brand,
        unit: unit
      });
      const competitors = await ProductModel.distinct('store', {
        name: name,
        package: p,
        brand: brand,
        unit: unit
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
        let diffIndex = computeDiffIndex(Number(price), maxPrice, minPrice);

        if (Number.isNaN(diffIndex)) {
          diffIndex = 0
        }
        if (diffIndex !== 0) {

          const oldRecord = await WatchingProductModel.findOne({
            brand: brand,
            name: name,
            package: p,
            unit: unit,
          });

          if (oldRecord) {
            await WatchingProductModel.findOneAndUpdate({
              brand: brand,
              name: name,
              package: p,
              unit: unit,
            }, {
              $set: {
                currentPrice: Number(price),
                highest: maxPrice || null,
                lowest: minPrice || null,
                diffIndex: diffIndex,
              }
            })
          } else {
            await WatchingProductModel.create({
              brand: brand,
              name: name,
              package: p,
              unit: unit,
              currentPrice: Number(price),
              highest: maxPrice || null,
              lowest: minPrice || null,
              diffIndex: diffIndex,
              owner: new mongoose.mongo.ObjectId(user.id),
              competitors: competitors.length
            });
          }

        }
      }
      res.status(201).send();
    } catch (err) {
      res.status(500).send(err);
    }
  }

  getWatchingCompetitorsCount = async (req, res) => {
    try {
      const user = req.user;
      const competitorsNumbers = await WatchingProductModel.distinct('competitors', {
        owner: new mongoose.mongo.ObjectId(user.id)
      });
      res.status(200).json({
        competitorsNumbers
      })
    } catch (err) {
      res.status(500).send(err);
    }
  }

  getWatchingList = async (req, res) => {
    try {
      const user = req.user;
      let {page = 1, pageSize = 10, sortBy, query = '', competitors = ''} = req.body;
      let sort = {};
      let competitorsNumbers = competitors.split(',').filter(item => item.length > 0);
      competitorsNumbers = competitorsNumbers.map(Number)
      sortBy = sortBy.split(",");
      sortBy.forEach(item => {
        const [field, method] = item.split('=');
        if (field) {
          sort[field] = Number(method);
        }
      });
      const findConditions = {
        name: {
          $regex: new RegExp(`.*${query}.*`, 'i')
        },
        owner: new mongoose.mongo.ObjectId(user.id)
      };
      if (competitorsNumbers.length > 0) {
        findConditions.competitors = {
          $in: competitorsNumbers
        }
      }
      let total = await WatchingProductModel.count(findConditions);
      let watchingList = await WatchingProductModel
        .find(findConditions)
        .sort(sort)
        .skip((page - 1) * pageSize)
        .limit(10);

      res.status(200).json({
        page,
        data: watchingList,
        pageSize,
        total
      });
    }  catch (err) {
      console.log(err)
      res.status(500).send(err);
    }
  }

  updateProduct = async (myProduct) => {
    let count = 0;
    try {
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

        let diffIndex = computeDiffIndex(myProduct.currentPrice, maxPrice, minPrice);

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
                currentPrice: Number(myProduct.currentPrice),
                highest: maxPrice || null,
                lowest: minPrice || null,
                diffIndex: diffIndex,
                competitors: competitors.length,
              }
            })
          } else {

          }

          count ++;
        }
      }

    } catch (err) {
      console.log(err)
    } finally {
      return count;
    }
  }

  updateWatchingList = async (req, res) => {
    try {
      console.log('start updating watching list...');
      const watchingListProducts = await WatchingProductModel.find();
      res.status(200).send({
        updatingProductsCount: watchingListProducts.length
      });
      for (let product of watchingListProducts) {
        await this.updateProduct(product)
      }

      console.log('update watching list done!');

      console.log('start generate watching list');
      await NotificationsService.updateNotifications();
    } catch (err) {
      console.log(err)
    }
  }

  getDiffIndexChartData = async (req, res) => {
    try {
      const user = req.user;
      const allDiffIndexes = await WatchingProductModel.distinct('diffIndex', {
        owner: new mongoose.mongo.ObjectId(user.id)
      });
      const minDiffIndex = Math.min(...allDiffIndexes);
      const maxDiffIndex = Math.max(...allDiffIndexes);
      const step = (maxDiffIndex - minDiffIndex) / 5;
      const chartData = [];
      for (let i = minDiffIndex; i <= maxDiffIndex; i +=step) {
        const min = i;
        const max = i + step;
        const watchingItems = await WatchingProductModel.find({
          owner: new mongoose.mongo.ObjectId(user.id),
          diffIndex: {
            $gte: min,
            $lte: max
          }
        });
        chartData.push({
          min,
          max,
          label: `${min.toFixed(2)} ~ ${max.toFixed(2)}`,
          itemsCount: watchingItems.length
        })
      }
      res.status(200).json(chartData);

    } catch (err) {
      console.log(err)
    }
  }

  getWatchingItemPriceChartData = async (req, res) => {
    try {
      const user = req.user;
      const allPrices = await WatchingProductModel.distinct('currentPrice', {
        owner: new mongoose.mongo.ObjectId(user.id)
      });
      const minPrice = Math.min(...allPrices);
      const maxPrice = Math.max(...allPrices);
      const step = (maxPrice - minPrice) / 5;
      const chartData = [];
      for (let i = minPrice; i < maxPrice; i += step) {
        const min = i;
        const max = i + step;
        const watchingItems = await WatchingProductModel.find({
          owner: new mongoose.mongo.ObjectId(user.id),
          currentPrice: {
            $gte: min,
            $lte: max
          }
        });
        chartData.push({
          min,
          max,
          label: `$${min.toFixed(2)} ~ $${max.toFixed(2)}`,
          itemsCount: watchingItems.length
        })
      }
      res.status(200).json(chartData);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  }

  getWatchingOverallData = async (req, res) => {
    try {
      const user = req.user;
      const count = await WatchingProductModel.count({
        owner: new mongoose.mongo.ObjectId(user.id),
      });
      const positiveDiffIndexCount = await WatchingProductModel.count({
        owner: new mongoose.mongo.ObjectId(user.id),
        diffIndex: {
          $gte: 0
        }
      });
      const negativeDiffIndexCount = await WatchingProductModel.count({
        owner: new mongoose.mongo.ObjectId(user.id),
        diffIndex: {
          $lte: 0
        }
      });

      res.status(200).json({
        count,
        positiveDiffIndexCount,
        negativeDiffIndexCount
      })

    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  }

  removeWatchingItems = async (req, res) => {
    try {
      const {ids = ''} = req.params;
      const itemIds = ids.split(',');
      for (let id of itemIds) {
        await WatchingProductModel.findByIdAndDelete(id);
      }
      res.status(200).send();
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  }
}

module.exports = {
  WatchingController: new WatchingController()
}