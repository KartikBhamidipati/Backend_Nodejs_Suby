const Vendor = require('../models/Vendor')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const dotEnv = require('dotenv')

dotEnv.config();
const secretKey = process.env.WhatIsYourName

const vendorRegister = async (req,res)=>{
    const {username,email,password} = req.body;

    try {
        const vendorEmail = await Vendor.findOne({email})
        if(vendorEmail)
        {
            return res.status(400).json('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(password,10);

        const newVendor = new Vendor({
            username,
            email,
            password: hashedPassword
        })
        await newVendor.save();

        res.status(201).json({message:"Vendor Registered Successfully"})
        console.log("Vendor Registered Successfully")
    } catch (error) {
        res.status(500).json({error:"Internal server error"})
        console.error(error);
        
    }
}

const vendorLogin = async(req,res)=>{
    const {email,password} = req.body;

    try {
        const vendor = await Vendor.findOne({email})
        if(!vendor || !(await bcrypt.compare(password,vendor.password)))
        {
            return res.status(401).json({error:"Invalid email or password"})
        }

        const token = jwt.sign({vendorId:vendor._id},secretKey,{expiresIn:"1h"})

        res.status(200).json({success:"Login successfully!",token})
        console.log(token)
    } catch (error) {
        res.status(500).json({message:"Internal server error"});
        console.error(error);
    }
}

const getAllVendors = async(req,res)=>{
    try{
        const vendors = await Vendor.find().populate('firm');
        res.json({vendors});
    }
    catch(error)
    {
        console.error(error);
        res.status(500).json({error:"internal server error"});
    }
}

const getVendorById = async(req,res)=>{
    const vendorId = req.params.id;
    console.log(vendorId);
    try {
        const vendor = await Vendor.findById(vendorId).populate('firm');
        if(!vendor){
            console.log("user not found");
            return res.status(404).json({error:"user not found"});
            
        }
        return res.status(200).json({vendor});
    } catch (error) {
        console.error(error);
        return res.status(500).json({error:"internal server error"})
    }
}

module.exports = {vendorRegister,vendorLogin,getAllVendors,getVendorById};