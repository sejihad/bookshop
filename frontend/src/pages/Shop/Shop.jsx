// 📁 src/pages/Shop.jsx
import { useCallback, useEffect, useState } from "react";
import {
  FiBook,
  FiChevronDown,
  FiChevronUp,
  FiDollarSign,
  FiFilter,
  FiStar,
  FiType,
  FiX,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getBook } from "../../actions/bookAction";
import BookSection from "../../component/BookSection";
import Loader from "../../component/layout/Loader/Loader";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Shop = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, books } = useSelector((state) => state.books);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    categories: [],
    types: [],
    minPrice: "",
    maxPrice: "",
    ratings: [],
  });

  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    ratings: true,
    type: true,
  });

  const query = useQuery();
  const location = useLocation();

  // Extract unique values for filters
  const uniqueCategories = [
    ...new Set(books?.map((b) => b.category).filter(Boolean)),
  ];
  const uniqueTypes = [...new Set(books?.map((b) => b.type).filter(Boolean))];

  // Calculate dynamic price range
  useEffect(() => {
    if (books && books.length > 0) {
      const prices = books
        .map((b) => b.discountPrice || b.oldPrice || 0)
        .filter((price) => price > 0);

      if (prices.length > 0) {
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        setPriceRange({ min: minPrice, max: maxPrice });
        setFilters((prev) => ({
          ...prev,
          minPrice: minPrice.toString(),
          maxPrice: maxPrice.toString(),
        }));
      }
    }
  }, [books]);

  useEffect(() => {
    dispatch(getBook());
  }, [dispatch]);

  useEffect(() => {
    const querySearch = query.get("search") || "";
    setSearchTerm(querySearch);
  }, [location.search, query]);

  // Filter books based on all criteria
  const applyFilters = useCallback(() => {
    if (!books || books.length === 0) {
      setFilteredBooks([]);
      return;
    }

    let filtered = books.filter((book) => {
      // Search filter
      const matchesSearch =
        !searchTerm ||
        book.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.writer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.type?.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory =
        filters.categories.length === 0 ||
        filters.categories.includes(book.category);

      // Type filter
      const matchesType =
        filters.types.length === 0 ||
        (book.type && filters.types.includes(book.type));

      // Price filter
      const bookPrice = book.discountPrice || book.oldPrice || 0;
      const minPriceValue = parseInt(filters.minPrice) || priceRange.min;
      const maxPriceValue = parseInt(filters.maxPrice) || priceRange.max;

      const matchesMinPrice = bookPrice >= minPriceValue;
      const matchesMaxPrice = bookPrice <= maxPriceValue;

      // Ratings filter
      const matchesRating =
        filters.ratings.length === 0 ||
        filters.ratings.some(
          (rating) => book.ratings >= rating && book.ratings < rating + 1
        );

      return (
        matchesSearch &&
        matchesCategory &&
        matchesType &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesRating
      );
    });

    setFilteredBooks(filtered);
  }, [books, searchTerm, filters, priceRange]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => {
      if (Array.isArray(prev[filterType])) {
        return {
          ...prev,
          [filterType]: prev[filterType].includes(value)
            ? prev[filterType].filter((item) => item !== value)
            : [...prev[filterType], value],
        };
      } else {
        return {
          ...prev,
          [filterType]: value,
        };
      }
    });
  };

  const handlePriceChange = (type, value) => {
    const numValue = value === "" ? "" : parseInt(value) || 0;
    setFilters((prev) => ({
      ...prev,
      [type]: numValue.toString(),
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      types: [],
      minPrice: priceRange.min.toString(),
      maxPrice: priceRange.max.toString(),
      ratings: [],
    });
    setSearchTerm("");
    navigate("/shop");
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Calculate active filters count for mobile button
  const getActiveFiltersCount = () => {
    return Object.entries(filters).filter(([key, value]) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      } else {
        return (
          value !== "all" &&
          value !== "" &&
          (key !== "minPrice" || value !== priceRange.min.toString()) &&
          (key !== "maxPrice" || value !== priceRange.max.toString())
        );
      }
    }).length;
  };

  const showSearchInfo = searchTerm && filteredBooks.length > 0;

  // Filter sidebar component
  const FilterSidebar = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-fit sticky top-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={clearAllFilters}
          className="text-sm text-purple-600 hover:text-purple-700 font-medium"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-6">
        {/* Price Range */}
        <div className="border-b border-gray-200 pb-6">
          <button
            className="flex justify-between items-center w-full text-left font-medium text-gray-900"
            onClick={() => toggleSection("price")}
          >
            <span className="flex items-center gap-2">
              <FiDollarSign className="w-4 h-4" />
              Price Range
            </span>
            {expandedSections.price ? <FiChevronUp /> : <FiChevronDown />}
          </button>

          {expandedSections.price && (
            <div className="mt-4 space-y-4">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm text-gray-600 mb-1">
                    Min Price
                  </label>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) =>
                      handlePriceChange("minPrice", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="Min"
                    min="0"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-600 mb-1">
                    Max Price
                  </label>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      handlePriceChange("maxPrice", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="Max"
                    min="0"
                  />
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Range: ${priceRange.min} - ${priceRange.max}
              </div>
            </div>
          )}
        </div>

        {/* Categories */}
        {uniqueCategories.length > 0 && (
          <div className="border-b border-gray-200 pb-6">
            <button
              className="flex justify-between items-center w-full text-left font-medium text-gray-900"
              onClick={() => toggleSection("categories")}
            >
              <span className="flex items-center gap-2">
                <FiBook className="w-4 h-4" />
                Categories
              </span>
              {expandedSections.categories ? (
                <FiChevronUp />
              ) : (
                <FiChevronDown />
              )}
            </button>

            {expandedSections.categories && (
              <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                {uniqueCategories.map((category) => (
                  <label
                    key={category}
                    className="flex items-center gap-3 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category)}
                      onChange={() =>
                        handleFilterChange("categories", category)
                      }
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Types */}
        {uniqueTypes.length > 0 && (
          <div className="border-b border-gray-200 pb-6">
            <button
              className="flex justify-between items-center w-full text-left font-medium text-gray-900"
              onClick={() => toggleSection("type")}
            >
              <span className="flex items-center gap-2">
                <FiType className="w-4 h-4" />
                Book Types
              </span>
              {expandedSections.type ? <FiChevronUp /> : <FiChevronDown />}
            </button>

            {expandedSections.type && (
              <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                {uniqueTypes.map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-3 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={filters.types.includes(type)}
                      onChange={() => handleFilterChange("types", type)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Ratings */}
        <div className="border-b border-gray-200 pb-6">
          <button
            className="flex justify-between items-center w-full text-left font-medium text-gray-900"
            onClick={() => toggleSection("ratings")}
          >
            <span className="flex items-center gap-2">
              <FiStar className="w-4 h-4" />
              Ratings
            </span>
            {expandedSections.ratings ? <FiChevronUp /> : <FiChevronDown />}
          </button>

          {expandedSections.ratings && (
            <div className="mt-4 space-y-2">
              {[4, 3, 2, 1].map((rating) => (
                <label
                  key={rating}
                  className="flex items-center gap-3 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded"
                >
                  <input
                    type="checkbox"
                    checked={filters.ratings.includes(rating)}
                    onChange={() => handleFilterChange("ratings", rating)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="flex items-center text-gray-700">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`w-4 h-4 ${
                          i < rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-1">& Up</span>
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <section className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <FiFilter className="w-4 h-4" />
            Filters
            {getActiveFiltersCount() > 0 && (
              <span className="bg-purple-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {getActiveFiltersCount()}
              </span>
            )}
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0 h-[calc(100vh-2rem)] overflow-y-auto sticky top-4">
            <FilterSidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search Results Info */}
            {showSearchInfo && (
              <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex justify-between items-center">
                  <p className="text-purple-800">
                    Showing {filteredBooks.length} results for "{searchTerm}"
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      navigate("/shop");
                    }}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                  >
                    Clear Search
                  </button>
                </div>
              </div>
            )}

            {/* Active Filters */}
            {getActiveFiltersCount() > 0 && (
              <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-900">
                    Active Filters:
                  </h4>
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-red-600 hover:text-red-700 font-medium"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {filters.categories.map((category) => (
                    <span
                      key={category}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                    >
                      Category: {category}
                      <button
                        onClick={() =>
                          handleFilterChange("categories", category)
                        }
                        className="hover:text-purple-900"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {filters.types.map((type) => (
                    <span
                      key={type}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                    >
                      Type: {type}
                      <button
                        onClick={() => handleFilterChange("types", type)}
                        className="hover:text-purple-900"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {filters.ratings.map((rating) => (
                    <span
                      key={rating}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
                    >
                      Rating: {rating}+
                      <button
                        onClick={() => handleFilterChange("ratings", rating)}
                        className="hover:text-yellow-900"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {(filters.minPrice !== priceRange.min.toString() ||
                    filters.maxPrice !== priceRange.max.toString()) && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                      Price: ${filters.minPrice} - ${filters.maxPrice}
                      <button
                        onClick={() => {
                          setFilters((prev) => ({
                            ...prev,
                            minPrice: priceRange.min.toString(),
                            maxPrice: priceRange.max.toString(),
                          }));
                        }}
                        className="hover:text-gray-900"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}

            {loading ? (
              <Loader />
            ) : filteredBooks.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
                <div className="max-w-md mx-auto">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm ? "No books found" : "No books available"}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {searchTerm
                      ? `We couldn't find any books matching "${searchTerm}". Try adjusting your search or filters.`
                      : "There are currently no books available in this category."}
                  </p>
                  {searchTerm && (
                    <button
                      onClick={clearAllFilters}
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Clear Search & Filters
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <>
                {/* BookSection with filtered books */}
                <div className="mb-8">
                  <BookSection
                    title={
                      searchTerm ? `Search Results for "${searchTerm}"` : "All"
                    }
                    productsPerRow={{
                      mobile: 1,
                      tablet: 2,
                      laptop: 3,
                      desktop: 3,
                    }}
                    books={filteredBooks}
                    loading={loading}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-80 max-w-full bg-white overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <FilterSidebar />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Shop;
