import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { Card, Grid, Text, Loader, Alert, Select, RangeSlider, Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import CreateProductForm from './CreateProductForm';

// Fetch products from the API
const fetchProducts = async () => {
    const response = await axios.get('https://test-api.nova-techs.com/products');
    return response.data;
};

// Update product function
const updateProduct = async ({ id, data }) => {
    const response = await axios.patch(`https://test-api.nova-techs.com/products/${id}`, data);
    return response.data;
};

// Delete product function
const deleteProduct = async (id) => {
    await axios.delete(`https://test-api.nova-techs.com/products/${id}`);
};

const Products = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: products, isLoading, isError } = useQuery('products', fetchProducts);

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [opened, setOpened] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [createProductOpen, setCreateProductOpen] = useState(false);
    const updateMutation = useMutation(updateProduct, {
        onSuccess: () => {
            queryClient.invalidateQueries('products');
            setOpened(false);
        },
    });

    const deleteMutation = useMutation(deleteProduct, {
        onSuccess: () => {
            queryClient.invalidateQueries('products');
        },
    });

    if (isLoading) return <Loader />;
    if (isError) return <Alert title="Error" color="red">Error fetching products.</Alert>;

    const filteredProducts = products.data.filter(product => {
        const price = parseFloat(product.price);
        const isWithinPriceRange = price >= priceRange[0] && price <= priceRange[1];
        const isInCategory = selectedCategory ? product.category === selectedCategory : true;
        return isWithinPriceRange && isInCategory;
    });

    const handleUpdateOpen = (product) => {
        setCurrentProduct(product);
        setOpened(true);
    };

    const handleUpdateSubmit = () => {
        if (currentProduct) {
            updateMutation.mutate({ id: currentProduct.id, data: currentProduct });
        }
    };

    const handleDelete = (id) => {
        deleteMutation.mutate(id);
    };

    return (
        <div className="product-container ">
            
              <CreateProductForm />

           
            <h1 className="text-4xl font-bold mb-6  text-center text-gray-800">Products</h1>
           
         <div className="flex justify-between mb-4">
                <Select
                    label="Filter by Category"
                    placeholder="Select a category"
                    data={Array.from(new Set(products.data.map(product => product.category)))}
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                />
                <RangeSlider
                    label={value => `${value[0]} - ${value[1]}`}
                    value={priceRange}
                    onChange={setPriceRange}
                    min={0}
                    max={1000}
                    step={1}
                />
                <Button onClick={() => { setSelectedCategory(null); setPriceRange([0, 1000]); }}>
                    Reset Filters
                </Button>
            </div>

            <Grid gutter="lg" grow>
                {filteredProducts.map((product) => (
                    <Grid.Col xs={12} sm={6} md={4} key={product.id}>
                        <Card className='card'
                            shadow="md"
                            padding="lg"
                            style={{ maxWidth: '300px', margin: '20px auto', cursor: 'pointer' }} 
                        >
                            <img 
                                src={product.imageUrls[0]} 
                                alt={product.name} 
                                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }} 
                            />
                            <div style={{ padding: '16px' }}>
                                <Text weight={600} size="lg" style={{ marginBottom: '8px' }}>{product.name}</Text>
                                <Text size="md">Price: <span style={{ fontWeight: 'bold', color: 'green' }}>${parseFloat(product.price).toFixed(2)}</span></Text>
                                <Text size="sm">Category: {product.category}</Text>
                                <Button onClick={() => navigate(`/product/${product.id}`)} className="w-full mt-4 px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-700">
                                    View Details
                                </Button>
                                <div className='flex'>
                                    <Button onClick={() => handleUpdateOpen(product)} className="w-full mt-4 px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700">
                                        Update
                                    </Button>
                                    <Button onClick={() => handleDelete(product.id)} className="w-full mt-4 rounded-md px-4 py-2 text-white bg-red-600 hover:bg-red-700 ml-2">
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </Grid.Col>
                ))}
            </Grid>

            {/* Tailwind Modal */}
            {opened && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-semibold mb-4">Update Product</h2>
                        {currentProduct && (
                            <div>
                                <input
                                    type="text"
                                    placeholder="Product Name"
                                    value={currentProduct.name}
                                    onChange={(event) => setCurrentProduct({ ...currentProduct, name: event.currentTarget.value })}
                                    className="border border-gray-300 rounded p-2 w-full mb-4"
                                />
                                <input
                                    type="text"
                                    placeholder="Image URL"
                                    value={currentProduct.imageUrls[0]}
                                    onChange={(event) => setCurrentProduct({ ...currentProduct, imageUrls: [event.currentTarget.value] })}
                                    className="border border-gray-300 rounded p-2 w-full mb-4"
                                />
                                <input
                                    type="text"
                                    placeholder="Description"
                                    value={currentProduct.description}
                                    onChange={(event) => setCurrentProduct({ ...currentProduct, description: event.currentTarget.value })}
                                    className="border border-gray-300 rounded p-2 w-full mb-4"
                                />
                                <input
                                    type="number"
                                    placeholder="Price"
                                    value={currentProduct.price}
                                    onChange={(event) => setCurrentProduct({ ...currentProduct, price: event.currentTarget.value })}
                                    className="border border-gray-300 rounded p-2 w-full mb-4"
                                />
                                <input
                                    type="text"
                                    placeholder="Category"
                                    value={currentProduct.category}
                                    onChange={(event) => setCurrentProduct({ ...currentProduct, category: event.currentTarget.value })}
                                    className="border border-gray-300 rounded p-2 w-full mb-4"
                                />
                                <div className="flex justify-end">
                                    <Button onClick={handleUpdateSubmit} className="mr-2">Update</Button>
                                    <Button onClick={() => setOpened(false)}>Cancel</Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;