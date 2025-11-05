import { FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";
import book_pn from "../assets/books-pn-min.png";
import "./hero.css";

const Hero = () => {
  return (
    <div className="lg:pt-2">
      <div className="relative  container  mt-6 bg-white text-gray-900 rounded-2xl shadow-lg backdrop-blur-lg flex flex-col justify-center items-center overflow-hidden dark:bg-white/10 dark:text-[#ededed] dark:border-gray-900">
        {/* Bloom/Gradient Effects - আগের কোড থেকে */}
        <div
          className="absolute top-[-150px] left-[-200px] opacity-80 blur-lg animate-moveBefore"
          style={{
            height: "550px",
            width: "550px",
            background: `radial-gradient(circle, rgba(12, 187, 40, 0.8), rgba(0,0,0,0) 70%)`,
            borderRadius: "50%",
          }}
        ></div>

        <div
          className="absolute bottom-[-250px] right-[-200px] opacity-80 blur-lg animate-moveBefore"
          style={{
            height: "550px",
            width: "550px",
            background: `radial-gradient(circle, rgba(12, 187, 40, 0.6), rgba(0,0,0,0) 70%)`,
            borderRadius: "50%",
          }}
        ></div>

        {/* Main Content Section - আপনার Hero content */}
        <section className="relative min-h-[500px] flex items-center justify-center py-16 overflow-hidden w-full">
          {/* Background with blur and border */}
          <div className="absolute  bg-white/10 backdrop-blur-lg  rounded-3xl "></div>

          {/* Animated border effects */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-purple-400/20 rounded-full blur-xl animate-pulse-slow"></div>
            <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-purple-300/30 rounded-full blur-lg animate-bounce-slow"></div>
            <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-purple-500/10 rounded-full blur-md animate-spin-slow"></div>
          </div>

          <div className="container relative z-10 mx-auto px-4 flex flex-col-reverse md:flex-row items-center gap-10">
            {/* Left Content */}
            <div className="text-center md:text-left max-w-xl">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-gray-800 mb-4">
                BOOKS HELP YOU <br />
                <span className="text-purple-600 bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                  LEARN AND GROW
                </span>
              </h1>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed bg-white/30 backdrop-blur-sm rounded-lg ">
                Feed your mind. Free your imagination. Books are where endless
                possibilities begin.
              </p>

              <Link
                to="/shop"
                className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-purple-600/80 backdrop-blur-sm hover:bg-purple-700/90 text-white text-sm font-semibold rounded-full shadow-lg transition-all duration-300 border border-purple-400/30 hover:scale-105 hover:shadow-purple-200"
              >
                <FiShoppingCart className="text-lg" />
                Buy Now
              </Link>
            </div>

            {/* Right Image */}
            <div className="flex justify-center md:justify-end w-full relative">
              {/* Floating animation container */}
              <div className="relative animate-float">
                <img
                  src={book_pn}
                  alt="Books"
                  className="w-48 sm:w-56 md:w-64 lg:w-72 relative z-10 drop-shadow-2xl"
                />
                {/* Glow effect behind image */}
                <div className="absolute inset-0 w-48 sm:w-56 md:w-64 lg:w-72 bg-purple-400/20 blur-2xl rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Hero;
