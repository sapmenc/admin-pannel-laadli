import React, { useState, useEffect } from 'react';
import Header from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import SearchView from '../../components/ui/SearchView';
import Button from '../../components/ui/Button';
import Switch from '../../components/ui/Switch';
import Pagination from '../../components/ui/Pagination';
import EditProductModal from '../edit-product-modal';
import CreateProductModal from '../create-product-modal';
import DeleteConfirmationModal from '../edit-product-modal/components/DeleteConfirmationModal';
import FilterModal from '../edit-product-modal/components/FilterModalConfirmation';
import { formatDate } from '../../utils/dateFormatter';
import { useDeleteProduct } from '../../hooks/use-delete-product';
import { useToggleProductStatus } from '../../hooks/use-changestatus';
import { useFilteredProducts } from '../../hooks/use-filterproduct';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';

const ProductManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [tempCategory, setTempCategory] = useState(null);
  const [tempStatus, setTempStatus] = useState(null);

  const { data: fetchedData, isLoading, error, refetch } = useFilteredProducts({
    page: currentPage,
    category: selectedCategory,
    status: selectedStatus,
    search: searchQuery, // ✅ now search is passed to backend
  });

  const deleteProductMutation = useDeleteProduct();
  const toggleStatusMutation = useToggleProductStatus();

  const products = fetchedData?.products?.map(product => ({
    _id: product._id,
    id: product._id,
    name: product.name,
    category: product.category,
    description: product.description,
    media: product.media || [],
    selectedOption: product.primaryImageIndex || 0,
    createdOn: formatDate(new Date(product.createdAt)),
    lastUpdated: formatDate(new Date(product.updatedAt)),
    status: product.status
  })) || [];

  const totalPages = fetchedData?.totalPages || 1;

  useEffect(() => {
    if (error) {
      toast.error(`Error loading products: ${error.message}`);
    }
  }, [error]);

  // ✅ backend search trigger on keystroke
  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleNewProduct = () => setCreateModalOpen(true);

  const handleFilter = () => {
    setTempCategory(selectedCategory);
    setTempStatus(selectedStatus);
    setFilterModalOpen(true);
  };

  const handleStatusToggle = (productId) => toggleStatusMutation.mutate(productId);

  const handleEdit = (productId) => {
    const product = products.find(p => p.id === productId);
    setSelectedProduct({ ...product, files: product.media });
    setEditModalOpen(true);
  };

  const handleDelete = (productId) => {
    setProductToDelete(productId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    deleteProductMutation.mutate(productToDelete, {
      onSuccess: () => {
        toast.success('Product deleted successfully');
        refetch();
        setDeleteModalOpen(false);
      },
      onError: (error) => {
        toast.error(`Delete failed: ${error.message}`);
      }
    });
  };

  const handlePageChange = (page) => setCurrentPage(page);

  const handleProductCreate = (newProduct) => {
    refetch().then(() => {
      toast.success(`${newProduct.name} created successfully!`);
      setCreateModalOpen(false);
    });
  };

  const handleProductUpdate = (updatedProduct) => {
    refetch();
    toast.success(`${updatedProduct.name} updated successfully!`);
    setEditModalOpen(false);
  };

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSelectedStatus(null);
  };

  const handleApplyFilters = ({ category, status }) => {
    setSelectedCategory(category);
    setSelectedStatus(status);
    setFilterModalOpen(false);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-global-1">
      <Header />
      <div className="flex flex-row flex-1 min-h-0">
        <Sidebar />
        <div className="flex flex-col flex-1 p-6 bg-global-1">
          <div className="flex flex-row items-center justify-between mb-6">
            <SearchView placeholder="Search by Product" onSearch={handleSearch} />
            <div className="flex flex-row items-center space-x-4"> 
              <img
                src="/images/img_iconoirfilter.svg"
                alt="Filter"
                className="h-[35px] w-[35px] cursor-pointer hover:opacity-80"
                onClick={handleFilter}
              />
              <Button onClick={handleNewProduct} icon="/images/img_mynauiplus.svg" className="w-[224px]">
                New Product
              </Button>
            </div>
          </div>

          <div className="flex flex-col mb-6 flex-1 space-y-2">
            <div className="flex flex-row items-center h-16 bg-table-1 border border-gray-400 rounded-[10px] px-4">
              {['Product', 'Category', 'Created On', 'Last Updated', 'Status', 'Actions'].map((text, i) => (
                <div key={i} className="flex-1 text-center">
                  <span className="text-global-2 font-bellefair text-2xl leading-8">{text}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col">
              {
                isLoading ? (
                  <div className="flex justify-center items-center h-64 bg-white border border-gray-400 rounded-[10px]">
                    <Loader />
                  </div>
                ) : (
                  products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 bg-white border border-gray-400 rounded-[10px]">
                      <div className="text-gray-500 font-lora text-lg mb-2">No products found</div>
                      <div className="text-gray-400 font-lora text-sm">There are no products to display on this page.</div>
                    </div>
                  ) : (
                    products.map((product) => (
                      <div key={product.id} className="flex flex-row items-center h-16 bg-white border border-gray-400 rounded-[10px] px-4 hover:bg-gray-50 hover:shadow-md transition-all duration-200">
                        <div className="flex-1 text-center"><span className="text-global-2 font-lora text-base">{product.name}</span></div>
                        <div className="flex-1 text-center"><span className="text-global-2 font-lora text-base">{product.category}</span></div>
                        <div className="flex-1 text-center"><span className="text-global-2 font-lora text-base">{product.createdOn}</span></div>
                        <div className="flex-1 text-center"><span className="text-global-2 font-lora text-base">{product.lastUpdated}</span></div>
                        <div className="flex-1 flex justify-center">
                          <Switch checked={product.status} onChange={() => handleStatusToggle(product.id)} />
                        </div>
                        <div className="flex-1 flex justify-center items-center space-x-2">
                          <img src="/images/img_mdipencil.svg" alt="Edit" className="h-[30px] w-[30px] cursor-pointer hover:opacity-80" onClick={() => handleEdit(product.id)} />
                          <img src="/images/img_magetrashfill.svg" alt="Delete" className="h-[35px] w-[35px] cursor-pointer hover:opacity-80" onClick={() => handleDelete(product.id)} />
                        </div>
                      </div>
                    ))
                  )
                )
              }
            </div>
          </div>

          <div className="flex justify-center bg-global-1 py-4">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
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
        isDeleting={deleteProductMutation.isLoading}
      />

      <FilterModal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
        selectedCategory={tempCategory}
        onCategoryChange={setTempCategory}
        selectedStatus={tempStatus}
        onStatusChange={setTempStatus}
      />
    </div>
  );
};

export default ProductManagement;
