const { errorHandler } = require("../helpers/dbErrorHandler");
const Bid = require("../models/bid");
const User = require("../models/user");
const Product = require("../models/product");

exports.createBid = (req, res) => {

    console.log(req.body);

    const bid = new Bid(req.body);
    bid.save((err, data) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }

        res.json({data});
    });

};

exports.getBidList = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = "amount";
    let limit = 5;
    // let skip = parseInt(req.body.skip);
    let findArgs = {
        "product_id": req.product._id
    };

    console.log(order, sortBy, limit);
    // console.log("findArgs", findArgs);

    // const str = findArgs.str;
    // findArgs.remove(str);
    console.log("findArgs", findArgs);
    Bid.find(findArgs)
        .populate("buyer")
        .select("-buyer.salt")
        .sort([
            [sortBy, order]
        ])
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }

            for(let i = 0; i < data.length; i++){
                data[i].buyer.salt = undefined;
                data[i].buyer.hashed_password = undefined;
                data[i].buyer.phone = undefined;
                data[i].buyer.role = undefined;
                data[i].buyer.history = undefined;
                data[i].buyer.createdAt = undefined;
                data[i].buyer.updatedAt = undefined;
                data[i].buyer.__v = undefined;
                
                
            }

            res.json({
                size: data.length,
                data
            });
        });
};

exports.getBuyerSeller = (req, res, next) => {
    console.log("bid sell");

    console.log(req.body);

    User.findById(req.body.seller).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User not found"
            });
        };

        req.seller = user;

        User.findById(req.body.buyer).exec((err, user) => {
            if (err || !user) {
                return res.status(400).json({
                    error: "User not found"
                });
            };
    
            req.buyer = user;
            next();
            
        });
    });
}

exports.completeBidTransaction = (req, res, next) => {

    req.seller.wallet += req.body.amount;
    req.buyer.wallet -= req.body.amount;

    console.log(req.seller);
    console.log(req.buyer);

    User.findOneAndUpdate({
            _id: req.body.seller
        }, {
            $set: req.seller
        },
        (err, user) => {
            if (err) {
                return res.status(400).json({
                    error: "User could not be updated"
                });
            };

            user.hashed_password = undefined;
            user.salt = undefined;

            User.findOneAndUpdate({
                    _id: req.body.buyer
                }, {
                    $set: req.buyer
                },
                (err, usr) => {
                    if (err) {
                        return res.status(400).json({
                            error: "User could not be updated"
                        });
                    };
        
                    usr.hashed_password = undefined;
                    usr.salt = undefined;
        
                    //res.json([user, usr]);
                    next();
                }
            );
        }
    );
};

exports.getProductById = (req, res, next) => {

    console.log("getpbyID", req.body.product_id);

    Product.findById(req.body.product_id).exec((err, product) => {
        if (err || !product) {
            console.log("error here: ", err);
            return res.status(400).json({
                error: "Product not found"
            });
        };
        req.product = product;
        console.log(req.product);
        next();
    });
}

exports.transferOwnership = (req, res) => {

    req.product.owner = req.body.buyer;
    req.product.user = req.body.buyer;
    req.product.soldStatus = true;

    console.log("heree please");

    console.log(req.product);

    Product.findOneAndUpdate({
        _id: req.body.product_id
    }, {
        $set: req.product
    },
    (err, prod) => {
        if (err) {
            return res.status(400).json({
                error: "User could not be updated"
            });
        };

        console.log("prod");
        console.log(prod);
        res.json(prod);
    });
}