const Product = require('../models/Product')
const multer = require('multer')
const Firm = require('../models/Firm')






const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/'); // folder where images will be stored
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + Path.extname(file.originalname)); // unique name
        }
});

const upload = multer({storage: storage})


const addProduct = async(req,res)=>{
    try {
        const {productName,price,category,bestseller,description} = req.body;
        const image = req.file?req.file.filename:undefined;

        const firmId = req.params.firmId
        const firm  = await Firm.findById(firmId)
        if(!firm){
            console.log("firm not found")
            return res.status(404).json({error:"form not found"})
        }

        const product = new Product({productName,price,category,bestseller,description,image,firm:firm._id})
        const savedProduct = await product.save();
        firm.product.push(savedProduct);
        await firm.save();

        return res.status(200).json(savedProduct)
    } catch (error) {
        console.error(error);
        return res.status(500).json({error:"internal server error"})
        
    }
}

const getProductsByFirm = async(req,res)=>{
    try {
        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId);
        if(!firm){
            console.log("firm not found");
            return res.status(404).json({error:"firm not found"});
        }
        const products = await Product.find({firm:firmId})
        console.log(products);
        return res.status(200).json(products);

    } catch (error) {
        console.error(error);
        res.status(500).json({error:"internal server error"});    
    }
}

const deleteProductById = async(req,res)=>{
    try {
        const productId = req.params.productId;
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if(!deletedProduct){
            return res.status(404).json({error:"product not found"});
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({error:"internal server error"})
    }
}

module.exports = {addProduct:[upload.single('image'),addProduct],getProductsByFirm,deleteProductById};