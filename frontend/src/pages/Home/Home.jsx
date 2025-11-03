import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBook } from "../../actions/bookAction";
import { getPackages } from "../../actions/packageAction";
import BookSection from "../../component/BookSection";
import Categories from "../../component/Categories";
import Hero from "../../component/Hero";
import PackageSection from "../../component/PackageSection";
import NotificationBanner from "../../component/layout/NotificationBanner";

const Home = () => {
  const { loading, books } = useSelector((state) => state.books);
  const dispatch = useDispatch();
  const { loadingPackage = loading, packages } = useSelector(
    (state) => state.packages
  );

  useEffect(() => {
    dispatch(getBook());
    dispatch(getPackages());
  }, [dispatch]);

  const newBooks = books.slice(0, 10);
  const audioBooks = books
    .filter((book) => book.type === "audiobook")
    .slice(0, 10);

  const eBooks = books.filter((book) => book.type === "ebook").slice(0, 10);
  const finalPackages = packages.slice(0, 10);

  return (
    <>
      <NotificationBanner />
      <Hero />
      <Categories />
      {/* <Authors /> */}
      <BookSection title="New" books={newBooks} loading={loading} />
      {audioBooks && audioBooks.length > 0 && (
        <BookSection title="Audio" books={audioBooks} loading={loading} />
      )}

      {eBooks && eBooks.length > 0 && (
        <BookSection title="E" books={eBooks} loading={loading} />
      )}
      {finalPackages && finalPackages.length > 0 && (
        <PackageSection
          title="Packages"
          packages={finalPackages}
          loading={loadingPackage}
        />
      )}
    </>
  );
};

export default Home;
