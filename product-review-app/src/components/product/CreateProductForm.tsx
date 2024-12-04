import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Define Zod schema for form validation
const productSchema = z.object({
    productName: z.string().min(1, "Product name is required"),
    description: z.string().min(1, "Description is required"),
    price: z.number().positive("Price must be a positive number"),
    category: z.string().min(1, "Category is required"),
    quantity: z.number().int().positive("Quantity must be a positive integer"),
    tags: z.string().optional(),
    imageUrl: z.string().url("Image URL must be a valid URL").optional(), // Add validation for the image URL
});

const CreateProductForm = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    // Set up form with React Hook Form
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(productSchema),
    });

    const onSubmit = async (data) => {
        // Construct product data object
        const productData = {
            name: data.productName.trim(),
            description: data.description.trim(),
            price: Number(data.price),
            category: data.category.trim(),
            tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
            use: "for_rent",
            minimumQuantity: Math.max(1, Number(data.quantity)),
            sellingPrice: Number(data.price),
            addedBy: "Mame",
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            quantityOnHand: Math.max(1, Number(data.quantity)),
            reservedQuantity: 10,
            discount: 20,
            imageUrls: imageUrl ? [imageUrl] : [], // Use the online image URL
        };

        // Log the product data to see what is being sent
        console.log("Submitting product data:", productData);

        try {
            const response = await axios.post('https://test-api.nova-techs.com/products', productData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log("Product data submitted successfully:", response.data);
            setIsModalOpen(false); // Close the modal after submission
        } catch (error) {
            // Log detailed error information
            if (error.response) {
                console.error("Error response data:", error.response.data);
                console.error("Error status:", error.response.status);
                console.error("Error headers:", error.response.headers);
            } else {
                console.error("Error message:", error.message);
            }
            // Optionally handle error display in the UI
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none"
            >
                Create Product
            </button>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="relative w-full max-w-md p-8 bg-white rounded-lg shadow-md overflow-auto my-4 mx-2" style={{ height: '500px' }}>
                        <button 
                            onClick={() => setIsModalOpen(false)} 
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 z-10"
                        >
                            &times;
                        </button>
                        <h2 className="mb-6 text-2xl font-bold text-center">Create Product</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 overflow-y-auto" style={{ maxHeight: '450px' }}>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Product Name</label>
                                <input 
                                    type="text" 
                                    {...register("productName")} 
                                    className={`w-full px-3 py-2 border ${errors.productName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring focus:ring-blue-200`} 
                                />
                                {errors.productName && <p className="text-red-500 text-xs mt-1">{errors.productName.message}</p>}
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
                                <textarea 
                                    {...register("description")} 
                                    className={`w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring focus:ring-blue-200`} 
                                />
                                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Price</label>
                                <input 
                                    type="number" 
                                    {...register("price", { valueAsNumber: true })} 
                                    className={`w-full px-3 py-2 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring focus:ring-blue-200`} 
                                />
                                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Category</label>
                                <input 
                                    type="text" 
                                    {...register("category")} 
                                    className={`w-full px-3 py-2 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring focus:ring-blue-200`} 
                                />
                                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Quantity</label>
                                <input 
                                    type="number" 
                                    {...register("quantity", { valueAsNumber: true })} 
                                    className={`w-full px-3 py-2 border ${errors.quantity ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring focus:ring-blue-200`} 
                                />
                                {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>}
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Tags (comma-separated)</label>
                                <input 
                                    type="text" 
                                    {...register("tags")} 
                                    className={`w-full px-3 py-2 border ${errors.tags ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring focus:ring-blue-200`} 
                                />
                                {errors.tags && <p className="text-red-500 text-xs mt-1">{errors.tags.message}</p>}
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Image URL</label>
                                <input 
                                    type="text" 
                                    {...register("imageUrl")} 
                                    onChange={(e) => setImageUrl(e.target.value)} // Update imageUrl state
                                    className={`w-full px-3 py-2 border ${errors.imageUrl ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring focus:ring-blue-200`} 
                                />
                                {errors.imageUrl && <p className="text-red-500 text-xs mt-1">{errors.imageUrl.message}</p>}
                            </div>
                            {imageUrl && <img src={imageUrl} alt="Preview" className="mt-2 w-full h-auto max-h-32 object-cover rounded-md" />}
                            <button type="submit" className="w-full px-4 py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none">Create Product</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateProductForm;