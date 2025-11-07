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
  const { loading, books, error } = useSelector((state) => state.books);

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

  // ✅ FIXED: Calculate dynamic price range with proper number parsing
  useEffect(() => {
    if (books && books.length > 0) {
      const prices = books
        .map((b) => {
          // Handle both string ($9.99) and number prices
          const price = b.discountPrice || b.oldPrice || 0;
          if (typeof price === "string") {
            return parseFloat(price.replace(/[$,]/g, "")) || 0;
          }
          return price;
        })
        .filter((price) => price > 0);

      if (prices.length > 0) {
        const minPrice = Math.floor(Math.min(...prices));
        const maxPrice = Math.ceil(Math.max(...prices));
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

  // ✅ FIXED: Filter books based on all criteria with proper price parsing
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
        (book.category && filters.categories.includes(book.category));

      // Type filter
      const matchesType =
        filters.types.length === 0 ||
        (book.type && filters.types.includes(book.type));

      // ✅ FIXED: Price filter with proper parsing
      const bookPriceValue = book.discountPrice || book.oldPrice || 0;
      const bookPrice =
        typeof bookPriceValue === "string"
          ? parseFloat(bookPriceValue.replace(/[$,]/g, "")) || 0
          : bookPriceValue;

      const minPriceValue = parseFloat(filters.minPrice) || priceRange.min;
      const maxPriceValue = parseFloat(filters.maxPrice) || priceRange.max;

      const matchesPrice =
        bookPrice >= minPriceValue && bookPrice <= maxPriceValue;

      // ✅ FIXED: Ratings filter - handle undefined ratings
      const bookRating = book.ratings || 0;
      const matchesRating =
        filters.ratings.length === 0 ||
        filters.ratings.some((rating) => {
          // Handle both integer and decimal ratings
          const roundedRating = Math.floor(bookRating);
          return roundedRating >= rating;
        });

      return (
        matchesSearch &&
        matchesCategory &&
        matchesType &&
        matchesPrice &&
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
    const numValue = value === "" ? "" : Math.max(0, parseInt(value) || 0);
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

  // ✅ FIXED: Filter sidebar component with better rating display
  // ✅ FIXED: Filter sidebar component with proper scrolling
  const FilterSidebar = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
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

      <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
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
                    Min Price ($)
                  </label>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) =>
                      handlePriceChange("minPrice", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Min"
                    min="0"
                    step="1"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-600 mb-1">
                    Max Price ($)
                  </label>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      handlePriceChange("maxPrice", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Max"
                    min="0"
                    step="1"
                  />
                </div>
              </div>
              <div className="text-xs text-gray-500 text-center">
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
                Categories ({uniqueCategories.length})
              </span>
              {expandedSections.categories ? (
                <FiChevronUp />
              ) : (
                <FiChevronDown />
              )}
            </button>

            {expandedSections.categories && (
              <div className="mt-4 space-y-2">
                {uniqueCategories.map((category) => (
                  <label
                    key={category}
                    className="flex items-center gap-3 text-sm cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category)}
                      onChange={() =>
                        handleFilterChange("categories", category)
                      }
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-gray-700 capitalize">{category}</span>
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
                Book Types ({uniqueTypes.length})
              </span>
              {expandedSections.type ? <FiChevronUp /> : <FiChevronDown />}
            </button>

            {expandedSections.type && (
              <div className="mt-4 space-y-2">
                {uniqueTypes.map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-3 text-sm cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={filters.types.includes(type)}
                      onChange={() => handleFilterChange("types", type)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-gray-700 capitalize">{type}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ✅ FIXED: Ratings with better handling */}
        <div className="border-b border-gray-200 pb-6">
          <button
            className="flex justify-between items-center w-full text-left font-medium text-gray-900"
            onClick={() => toggleSection("ratings")}
          >
            <span className="flex items-center gap-2">
              <FiStar className="w-4 h-4" />
              Customer Ratings
            </span>
            {expandedSections.ratings ? <FiChevronUp /> : <FiChevronDown />}
          </button>

          {expandedSections.ratings && (
            <div className="mt-4 space-y-3">
              {[4, 3, 2, 1].map((rating) => (
                <label
                  key={rating}
                  className="flex items-center gap-3 text-sm cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
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
                    <span className="ml-2 text-gray-600">{rating}.0 & Up</span>
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Show books from database even when no filters match initial load
  const displayBooks = filteredBooks.length > 0 ? filteredBooks : books || [];

  return (
    <section className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-red-700">Error loading books: {error}</p>
              <button
                onClick={() => dispatch(getBook())}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
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
          <div className="hidden lg:block w-80 flex-shrink-0">
            <FilterSidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
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
                      {category}
                      <button
                        onClick={() =>
                          handleFilterChange("categories", category)
                        }
                        className="hover:text-purple-900 ml-1"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {filters.types.map((type) => (
                    <span
                      key={type}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {type}
                      <button
                        onClick={() => handleFilterChange("types", type)}
                        className="hover:text-blue-900 ml-1"
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
                      {rating}+ Stars
                      <button
                        onClick={() => handleFilterChange("ratings", rating)}
                        className="hover:text-yellow-900 ml-1"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {(filters.minPrice !== priceRange.min.toString() ||
                    filters.maxPrice !== priceRange.max.toString()) && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      ${filters.minPrice} - ${filters.maxPrice}
                      <button
                        onClick={() => {
                          setFilters((prev) => ({
                            ...prev,
                            minPrice: priceRange.min.toString(),
                            maxPrice: priceRange.max.toString(),
                          }));
                        }}
                        className="hover:text-green-900 ml-1"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center py-16">
                <Loader />
              </div>
            ) : displayBooks.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
                <div className="max-w-md mx-auto">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm || getActiveFiltersCount() > 0
                      ? "No books found"
                      : "No books available"}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {searchTerm
                      ? `We couldn't find any books matching "${searchTerm}". Try adjusting your search or filters.`
                      : getActiveFiltersCount() > 0
                      ? "No books match your current filters. Try adjusting your filter criteria."
                      : "There are currently no books available in the store."}
                  </p>
                  {(searchTerm || getActiveFiltersCount() > 0) && (
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
                {/* BookSection with books */}
                <div className="mb-8">
                  <BookSection
                    title={
                      searchTerm
                        ? `Search Results for "${searchTerm}"`
                        : getActiveFiltersCount() > 0
                        ? "Filtered Books"
                        : "All Books"
                    }
                    subtitle={`Showing ${displayBooks.length} of ${
                      books?.length || 0
                    } books`}
                    productsPerRow={{
                      mobile: 1,
                      tablet: 2,
                      laptop: 3,
                      desktop: 3,
                    }}
                    books={displayBooks}
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
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-80 max-w-full bg-white overflow-y-auto transform transition-transform">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
