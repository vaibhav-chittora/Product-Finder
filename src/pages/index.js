import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../features/categoriesSlice';
import { fetchProducts, incrementSkip, resetProducts } from '../features/productsSlice';
import { useRouter } from 'next/router';

export default function Home() {
  const dispatch = useDispatch();
  const { categories, loading: categoryLoading } = useSelector((state) => state.categories);
  const { products, loading: productLoading, skip } = useSelector((state) => state.products);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const router = useRouter(); // Get access to Next.js router

  // Update URL query params based on selectedCategory and searchQuery
  useEffect(() => {
    const query = {};
    if (selectedCategory) query.category = selectedCategory;
    if (searchQuery) query.search = searchQuery;
    router.push({ pathname: '/', query }); // Push query parameters to the URL
  }, [selectedCategory, searchQuery]); // Run effect when selectedCategory or searchQuery changes

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(resetProducts());
    dispatch(fetchProducts({ category: selectedCategory, skip: 0, search: searchQuery }));
  }, [selectedCategory, searchQuery]);

  const handleLoadMore = () => {
    dispatch(incrementSkip());
    dispatch(fetchProducts({ category: selectedCategory, skip: skip + 10, search: searchQuery }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Product Categories</h1>

      {categoryLoading ? (
        <p className="text-lg">Loading categories...</p>
      ) : (
        <select
          className="border border-gray-300 p-2 rounded mb-4"
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      )}

      <h2 className="text-2xl font-semibold mb-2">Products</h2>
      <input
        type="text"
        className="border border-gray-300 p-2 rounded w-full mb-4"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {productLoading ? (
        <p className="text-lg">Loading products...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="border p-4 rounded shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold">{product.title}</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center mt-6">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          onClick={handleLoadMore}
        >
          Load More
        </button>
      </div>
    </div>
  );
}
