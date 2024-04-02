import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		importPrice: {
			type: Number,
			default: 0,
		},
		retailPrice: {
			type: Number,
			default: 0,
		},
		description: {
			type: String,
			trim: true,
		},
		image: {
			type: String,
			trim: true,
			default: "/images/no-image-available.png",
		},
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Category",
		},
		quantity: {
			type: Number,
			default: 0,
		},
		isDeleted: {
			type: Boolean,
			default: true
		}
	},
	{ timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
