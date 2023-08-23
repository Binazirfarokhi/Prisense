
const express = require("express");
const {GoodsController} = require("../controller/goods.controller");
const {passportRoute, protectedRoute} = require("../middlewares/passport");
const router = express.Router();

router.get(``, protectedRoute, GoodsController.getGoods);
router.get(`/search`, protectedRoute, GoodsController.searchMarketGoods);
router.get('/store-names', protectedRoute, GoodsController.getAllStores);
router.post('/import-my-products', protectedRoute, GoodsController.importMyProductsByUploadFile);

module.exports = router;