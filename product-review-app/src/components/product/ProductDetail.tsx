import React from 'react';
import axios from 'axios';
import { Card, Text, Loader, Alert, Button, TextInput, Textarea } from '@mantine/core';
import { useQuery } from 'react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'react-router-dom';

// Fetch a single product by ID
const fetchProductById = async (id: string) => {
    const response = await axios.get(`https://test-api.nova-techs.com/products/${id}`);
    return response.data;
};

// Fetch reviews for a specific product
const fetchReviews = async (productId: string) => {
    const response = await axios.get(`https://test-api.nova-techs.com/reviews/${productId}`);
    return response.data;
};

// Post a review to the API
const postReview = async (reviewData: { productId: string; rating: number; reviewerName: string; comment: string }) => {
    const response = await axios.post('https://test-api.nova-techs.com/reviews', reviewData, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.data;
};

// Define Zod schema for form validation
const reviewSchema = z.object({
    productId: z.string().nonempty("Product ID is required"),
    reviewerName: z.string().min(1, "Name is required"),
    rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
    comment: z.string().min(1, "Comment is required"),
});

const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { data: product, isLoading: loadingProduct, isError: errorProduct } = useQuery(['product', id], () => fetchProductById(id));
    const { data: reviews, isLoading: loadingReviews, isError: errorReviews } = useQuery(['reviews', id], () => fetchReviews(id));

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(reviewSchema),
    });

    if (loadingProduct || loadingReviews) return <Loader />;
    if (errorProduct || errorReviews) return <Alert title="Error" color="red">Error fetching product or reviews.</Alert>;

    // Handle new review submission
    const onSubmit = async (data: any) => {
        try {
            await postReview(data);
            reset(); // Reset the form
        } catch (error) {
            console.error("Error posting review:", error);
        }
    };

    return (
        <div className="product-container mt-20">
            <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">{product.name}</h1>

            <Card className='card' shadow="md" padding="lg" style={{ maxWidth: '600px', margin: '20px auto' }}>
                <img 
                    src={product.imageUrls[0]} 
                    alt={product.name} 
                    style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '8px' }} 
                />
                <div style={{ padding: '16px' }}>
                    <Text weight={600} size="lg" style={{ marginBottom: '8px' }}>Price: <span style={{ fontWeight: 'bold', color: 'green' }}>${parseFloat(product.price).toFixed(2)}</span></Text>
                    <Text size="sm">Category: {product.category}</Text>
                    <Text size="sm">Description: {product.description}</Text>
                    <Text size="sm">Tags: {product.tags.join(', ')}</Text>
                    <Text size="sm">Added By: {product.addedBy}</Text>
                    <Text size="sm">Discount: {product.discount}%</Text>
                    <Text size="sm">Expires At: {new Date(product.expiresAt).toLocaleString()}</Text>
                </div>
            </Card>

            {/* Review Section */}
            <div className="review-section mt-4">
                <h3 className="text-lg font-bold">Reviews</h3>
                {reviews.map((review, index) => (
                    <div key={index} className="border p-2 mt-2 rounded">
                        <Text weight={600}>{review.reviewerName} - Rating: {review.rating}</Text>
                        <Text>{review.comment}</Text>
                    </div>
                ))}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextInput
                        label="Your Name"
                        placeholder="Enter your name"
                        {...register("reviewerName")}
                        error={errors.reviewerName?.message}
                        required
                    />
                    <TextInput
                        label="Rating (1-5)"
                        placeholder="Enter rating"
                        type="number"
                        min={1}
                        max={5}
                        {...register("rating", {
                            required: "Rating is required",
                            setValueAs: value => {
                                const parsedValue = parseFloat(value);
                                return isNaN(parsedValue) ? null : parsedValue; // Convert to number or null
                            },
                        })}
                        error={errors.rating?.message}
                        required
                    />
                    <Textarea
                        label="Your Review"
                        placeholder="Write your review here"
                        {...register("comment")}
                        error={errors.comment?.message}
                        required
                    />
                    <input type="hidden" value={product.id} {...register("productId")} />
                    <Button type="submit" className="mt-4 bg-blue-600 rounded-md hover:bg-blue-700 text-white px-4 py-2 focus:outline-none">Submit Review</Button>
                </form>
            </div>
        </div>
    );
};

export default ProductDetail;