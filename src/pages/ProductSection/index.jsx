import React, { useState } from 'react';
import Header from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import SearchView from '../../components/ui/SearchView';
import Button from '../../components/ui/Button';
import Switch from '../../components/ui/Switch';
import Pagination from '../../components/ui/Pagination';
import EditProductModal from '../edit-product-modal';
import CreateProductModal from '../create-product-modal';
import DeleteConfirmationModal from '../edit-product-modal/components/DeleteConfirmationModal';
import FilterModal from '../edit-product-modal/components/FilterModalConfirmation'; // New import
import { formatDate } from '../../utils/dateFormatter';

const ProductManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false); // New state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null); // New state
  const [selectedStatus, setSelectedStatus] = useState(false); // New state
  
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Chidiya',
      category: 'Premium',
      description: 'A beautiful premium product with elegant design and superior quality.',
      files: Array(5).fill(null),
      selectedOption: 0,
      createdOn: '6-Jun-25, 20:40',
      lastUpdated: '6-Jun-25, 20:40',
      status: true
    },
    {
      id: 2,
      name: 'Jodha',
      category: 'Luxe',
      description: 'Luxurious item crafted with attention to detail and premium materials.',
      files: Array(5).fill(null),
      selectedOption: 1,
      createdOn: '5-Jun-25, 20:40',
      lastUpdated: '5-Jun-25, 20:40',
      status: true
    },
    {
      id: 3,
      name: 'Pari',
      category: 'Luxe',
      description: 'Exquisite luxury product featuring sophisticated design elements.',
      files: Array(5).fill(null),
      selectedOption: 2,
      createdOn: '4-Jun-25, 20:40',
      lastUpdated: '4-Jun-25, 20:40',
      status: true
    },
    {
      id: 4,
      name: 'Siya-Ram',
      category: 'Premium',
      description: 'Premium quality product with traditional charm and modern appeal.',
      files: Array(5).fill(null),
      selectedOption: 0,
      createdOn: '3-Jun-25, 20:40',
      lastUpdated: '3-Jun-25, 20:40',
      status: false
    },
    {
      id: 5,
      name: 'Parvati',
      category: 'Premium',
      description: 'Elegant premium product showcasing timeless beauty and craftsmanship.',
      files: Array(5).fill(null),
      selectedOption: 0,
      createdOn: '8-Jun-25, 20:40',
      lastUpdated: '10-Jun-25, 20:40',
      status: true
    },
    {
      id: 6,
      name: 'Khwaab',
      category: 'Luxe',
      description: 'Dream-like luxury item with ethereal design and premium finish.',
      files: Array(5).fill(null),
      selectedOption: 1,
      createdOn: '4-Jun-25, 20:40',
      lastUpdated: '14-Jun-25, 20:40',
      status: false
    },
    {
      id: 7,
      name: 'Lily Affair',
      category: 'Premium',
      description: 'Delicate premium product inspired by nature\'s beauty and elegance.',
      files: Array(5).fill(null),
      selectedOption: 0,
      createdOn: '12-Jun-25, 20:40',
      lastUpdated: '15-Jun-25, 20:40',
      status: true
    },
    {
      id: 8,
      name: 'Morbagh',
      category: 'Premium',
      description: 'Premium collection item featuring rich heritage and modern aesthetics.',
      files: Array(5).fill(null),
      selectedOption: 0,
      createdOn: '12-Jun-25, 20:40',
      lastUpdated: '15-Jun-25, 20:40',
      status: true
    },
    {
      id: 9,
      name: 'Malini',
      category: 'Luxe',
      description: 'Luxurious product embodying grace, style, and exceptional quality.',
      files: Array(5).fill(null),
      selectedOption: 1,
      createdOn: '10-Jun-25, 20:40',
      lastUpdated: '18-Jun-25, 20:40',
      status: true
    },
    {
      id: 10,
      name: 'Radha-Krishna',
      category: 'Premium',
      description: 'Divine premium product celebrating eternal love and artistic excellence.',
      files: Array(5).fill(null),
      selectedOption: 0,
      createdOn: '9-Jun-25, 20:40',
      lastUpdated: '17-Jun-25, 20:40',
      status: false
    }
  ]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleNewProduct = () => {
    setCreateModalOpen(true);
  };

  const handleFilter = () => {
    setFilterModalOpen(true); // Updated to open filter modal
  };

  const handleStatusToggle = (productId, newStatus) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId ? { ...product, status: newStatus } : product
      )
    );
  };

  const handleEdit = (productId) => {
    const product = products.find(p => p.id === productId);
    setSelectedProduct({
      ...product,
      files: product.files || Array(5).fill(null),
      selectedOption: product.selectedOption ?? null
    });
    setEditModalOpen(true);
  };

  const handleDelete = (productId) => {
    setProductToDelete(productId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    setProducts(prevProducts =>
      prevProducts.filter(product => product.id !== productToDelete)
    );
    setDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleProductCreate = (newProduct) => {
    setProducts(prevProducts => [newProduct, ...prevProducts]);
  };

  const handleProductUpdate = (updatedProduct) => {
    setProducts(prevProducts => 
      prevProducts.map(p => 
        p.id === updatedProduct.id ? {
          ...updatedProduct,
          lastUpdated: formatDate(new Date())
        } : p
      )
    );
    setEditModalOpen(false);
    setSelectedProduct(null);
  };

  // New filter handlers
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSelectedStatus(false);
  };

  const handleApplyFilters = () => {
    setFilterModalOpen(false);
    setCurrentPage(1);
  };

  // Updated filteredProducts calculation with new filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    const matchesStatus = selectedStatus ? product.status === true : true;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const productsPerPage = 8;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const isPage7WithNoData = currentPage === 7 && currentProducts.length === 0;

  return (
    <div className="flex flex-col min-h-screen w-full bg-global-1">
      <Header />
      
      <div className="flex flex-row flex-1 min-h-0">
        <Sidebar />
        
        <div className="flex flex-col flex-1 p-6 bg-global-1">
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

          <div className="flex flex-col mb-6 flex-1 space-y-2">
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

            <div className="flex flex-col">
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

          <div className="flex justify-center bg-global-1 py-4">
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      <EditProductModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onProductUpdate={handleProductUpdate}
      />
      
      <CreateProductModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onProductCreate={handleProductCreate}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={confirmDelete}
        productName={products.find(p => p.id === productToDelete)?.name || ''}
      />

      {/* New Filter Modal */}
      <FilterModal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default ProductManagement;