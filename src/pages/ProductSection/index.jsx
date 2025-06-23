import React, { useState } from 'react';
import Header from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import SearchView from '../../components/ui/SearchView';
import Button from '../../components/ui/Button';
import Switch from '../../components/ui/Switch';
import Pagination from '../../components/ui/Pagination';

const ProductManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Sample product data
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Chidiya',
      category: 'Premium',
      createdOn: '6-Jun-25, 20:40',
      lastUpdated: '6-Jun-25, 20:40',
      status: true
    },
    {
      id: 2,
      name: 'Jodha',
      category: 'Luxe',
      createdOn: '5-Jun-25, 20:40',
      lastUpdated: '5-Jun-25, 20:40',
      status: true
    },
    {
      id: 3,
      name: 'Pari',
      category: 'Luxe',
      createdOn: '4-Jun-25, 20:40',
      lastUpdated: '4-Jun-25, 20:40',
      status: true
    },
    {
      id: 4,
      name: 'Siya-Ram',
      category: 'Premium',
      createdOn: '3-Jun-25, 20:40',
      lastUpdated: '3-Jun-25, 20:40',
      status: false
    },
    {
      id: 5,
      name: 'Parvati',
      category: 'Premium',
      createdOn: '8-Jun-25, 20:40',
      lastUpdated: '10-Jun-25, 20:40',
      status: true
    },
    {
      id: 6,
      name: 'Khwaab',
      category: 'Luxe',
      createdOn: '4-Jun-25, 20:40',
      lastUpdated: '14-Jun-25, 20:40',
      status: false
    },
    {
      id: 7,
      name: 'Lily Affair',
      category: 'Premium',
      createdOn: '12-Jun-25, 20:40',
      lastUpdated: '15-Jun-25, 20:40',
      status: true
    },
    {
      id: 8,
      name: 'Morbagh',
      category: 'Premium',
      createdOn: '12-Jun-25, 20:40',
      lastUpdated: '15-Jun-25, 20:40',
      status: true
    },
    {
      id: 9,
      name: 'Malini',
      category: 'Luxe',
      createdOn: '10-Jun-25, 20:40',
      lastUpdated: '18-Jun-25, 20:40',
      status: true
    },
    {
      id: 10,
      name: 'Radha-Krishna',
      category: 'Premium',
      createdOn: '9-Jun-25, 20:40',
      lastUpdated: '17-Jun-25, 20:40',
      status: false
    }
  ]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleNewProduct = () => {
    alert('New Product functionality will be implemented');
  };

  const handleFilter = () => {
    alert('Filter functionality will be implemented');
  };

  const handleStatusToggle = (productId, newStatus) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId ? { ...product, status: newStatus } : product
      )
    );
  };

  const handleEdit = (productId) => {
    alert(`Edit product with ID: ${productId}`);
  };

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(prevProducts =>
        prevProducts.filter(product => product.id !== productId)
      );
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Filter products based on search query
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const productsPerPage = 8;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Check if we're on page 7 and have no data
  const isPage7WithNoData = currentPage === 7 && currentProducts.length === 0;

  return (
    <div className="flex flex-col min-h-screen w-full bg-global-1">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <div className="flex flex-row flex-1 min-h-0">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Content Area */}
        <div className="flex flex-col flex-1 p-6 bg-global-1">
          {/* Search and Actions Row */}
          <div className="flex flex-row items-center justify-between mb-6">
            <SearchView 
              placeholder="Search by Product"
              onSearch={handleSearch}
            />
            
            <div className="flex flex-row items-center space-x-4">
              <img 
                src="/images/img_iconoirfilter.svg" 
                alt="Filter" 
                className="h-[35px] w-[35px] cursor-pointer hover:opacity-80"
                onClick={handleFilter}
              />
              
              <Button
                onClick={handleNewProduct}
                icon="/images/img_mynauiplus.svg"
                className="w-[224px]"
              >
                New Product
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="flex flex-col mb-6 flex-1 space-y-2">
            {/* Table Header - Separate Block */}
            <div className="flex flex-row items-center h-16 bg-table-1 border border-gray-400 rounded-[10px] px-4">
              <div className="flex-1 text-center">
                <span className="text-global-2 font-bellefair text-2xl leading-8">Product</span>
              </div>
              <div className="flex-1 text-center">
                <span className="text-global-2 font-bellefair text-2xl leading-8">Category</span>
              </div>
              <div className="flex-1 text-center">
                <span className="text-global-2 font-bellefair text-2xl leading-8">Created On</span>
              </div>
              <div className="flex-1 text-center">
                <span className="text-global-2 font-bellefair text-2xl leading-8">Last Updated</span>
              </div>
              <div className="flex-1 text-center">
                <span className="text-global-2 font-bellefair text-2xl leading-8">Status</span>
              </div>
              <div className="flex-1 text-center">
                <span className="text-global-2 font-bellefair text-2xl leading-8">Actions</span>
              </div>
            </div>

            {/* Table Rows - Each as Separate Block */}
            <div className="flex flex-col  ">
              {isPage7WithNoData ? (
                <div className="flex flex-col items-center justify-center h-64 bg-white border border-gray-400 rounded-[10px]">
                  <div className="text-gray-500 font-lora text-lg mb-2">No products found</div>
                  <div className="text-gray-400 font-lora text-sm">There are no products to display on this page.</div>
                </div>
              ) : (
                currentProducts.map((product) => (
                  <div key={product.id} className="flex flex-row items-center h-16 bg-white border border-gray-400 rounded-[10px] px-4 hover:bg-gray-50 hover:shadow-md transition-all duration-200">
                    <div className="flex-1 text-center">
                      <span className="text-global-2 font-lora text-base leading-5">{product.name}</span>
                    </div>
                    <div className="flex-1 text-center">
                      <span className="text-global-2 font-lora text-base leading-5">{product.category}</span>
                    </div>
                    <div className="flex-1 text-center">
                      <span className="text-global-2 font-lora text-base leading-5">{product.createdOn}</span>
                    </div>
                    <div className="flex-1 text-center">
                      <span className="text-global-2 font-lora text-base leading-5">{product.lastUpdated}</span>
                    </div>
                    <div className="flex-1 flex justify-center">
                      <Switch 
                        checked={product.status}
                        onChange={(newStatus) => handleStatusToggle(product.id, newStatus)}
                      />
                    </div>
                    <div className="flex-1 flex justify-center items-center space-x-2">
                      <img 
                        src="/images/img_mdipencil.svg" 
                        alt="Edit" 
                        className="h-[30px] w-[30px] cursor-pointer hover:opacity-80"
                        onClick={() => handleEdit(product.id)}
                      />
                      <img 
                        src="/images/img_magetrashfill.svg" 
                        alt="Delete" 
                        className="h-[35px] w-[35px] cursor-pointer hover:opacity-80"
                        onClick={() => handleDelete(product.id)}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-center bg-global-1 py-4">
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;