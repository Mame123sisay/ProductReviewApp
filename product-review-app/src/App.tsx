import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from 'react-query';
import { MantineProvider } from '@mantine/core';
import './App.css'
import './index.css'
import CreateProductForm from './components/product/CreateProductForm';
import Products from './components/product/Products';
import ProductDetail from './components/product/ProductDetail';



const queryClient = new QueryClient();

const App = () => {
    return (
        <MantineProvider >
        
            <QueryClientProvider client={queryClient}>
          {/*      */} 
          <div className="bg-gray-800 fixed top-0 w-full h-20 shadow-lg z-10">
    <div className="flex items-center justify-between h-full px-6 ml-0">
        <div className="text-white text-2xl font-bold">MyWebsite</div>
        <ul className="flex space-x-6 text-white">
            <li className="hover:text-gray-300 cursor-pointer">Home</li>
            <li className="hover:text-gray-300 cursor-pointer">About Us</li>
            <li className="hover:text-gray-300 cursor-pointer" >Contact Us</li>
        </ul>
    </div>
</div>
       
        <Router>
            <Routes>
                <Route path='/' element={<Products/>}/>
                <Route path='/product/:id' element={<ProductDetail/>}/>
                <Route path='/createproduct/' element={<CreateProductForm/>}/>
            </Routes>
        </Router>
        
                
            </QueryClientProvider>
        </MantineProvider>
    );
};

export default App;