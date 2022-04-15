const express = require('express');
const router = express.Router();

const { createBid, getBidList, completeBidTransaction, getBuyerSeller, transferOwnership, getProductById } = require('../controllers/bid');
const {userSignupValidator} = require('../validator');
const {productById} = require('../controllers/product')

router.post("/bids/createBid", createBid);
router.get("/bids/list/:productId", getBidList);
router.post("/bids/sellBid", getBuyerSeller, completeBidTransaction, getProductById, transferOwnership);

router.param('productId', productById);




module.exports = router;