import { Request, Response } from "express";
import Category,{ ICategory } from "../db/categoryModel";

export const createCategory = async (req : Request, res : Response)=>{

    try {
        const category = req.body.name;

        if(!category){
            console.log("All fields required");
        }

        const newCategory : ICategory  = await Category.create({
            name : category,
        })

        await newCategory.save();
        console.log(newCategory);


        res.status(200).json({message: "Category created successfully", newCategory});

        
    } catch (error) {
        console.log(error);
        res.status(400).json({error :error})
    }

}