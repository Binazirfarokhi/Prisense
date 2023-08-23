
const express = require("express");
const {protectedRoute} = require("../middlewares/passport");
const {WatchingController} = require("../controller/watching.controller");
const {GoodsController} = require("../controller/goods.controller");

const router = express.Router();
router.get('/generate-status', protectedRoute, WatchingController.getGenerateProgress);
router.post('/query', protectedRoute, WatchingController.getWatchingList);
router.get('/competitors', protectedRoute, WatchingController.getWatchingCompetitorsCount);
router.get('/diff-index-chart', protectedRoute, WatchingController.getDiffIndexChartData);
router.get('/watching-price-chart', protectedRoute, WatchingController.getWatchingItemPriceChartData)
router.get('/overall', protectedRoute, WatchingController.getWatchingOverallData)
router.get('/:watchingId', protectedRoute, WatchingController.getWatchingItemDetail);
router.delete('/many/:ids', protectedRoute, WatchingController.removeWatchingItems);
router.delete('/:watchingId', protectedRoute, WatchingController.removeWatchingItem);
router.put('', WatchingController.updateWatchingList);
router.post('', protectedRoute, WatchingController.addProductToWatchingList);

module.exports = router;