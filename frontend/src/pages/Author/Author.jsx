import { BookOpen, Heart, Mail, PenTool, Sparkles, Star } from "lucide-react";
import { Link } from "react-router-dom";
import authorImg from "../../assets/author.jpg";

const AuthorPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-purple-900 mb-4">
            Jennifer Pangle
          </h1>
          <p className="text-lg text-purple-700 max-w-2xl mx-auto">
            American novelist, poet, and storyteller whose work lives where myth
            meets emotion
          </p>
          <div className="w-24 h-1 bg-purple-600 mx-auto mt-4"></div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Hero Section with Image */}
          <div className="relative p-8 md:p-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/3 mb-8 md:mb-0 flex justify-center">
                <div className="relative">
                  <div className="w-48 h-48 rounded-full bg-gradient-to-r from-white/20 to-white/10 shadow-2xl flex items-center justify-center backdrop-blur-sm">
                    <div className="w-44 h-44 rounded-full bg-gray-200 overflow-hidden border-4 border-white/30">
                      <img
                        src={authorImg}
                        alt="Jennifer Pangle portrait"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-white text-purple-600 rounded-full py-1 px-3 text-xs font-bold shadow-lg">
                    Author
                  </div>
                </div>
              </div>

              <div className="md:w-2/3 md:pl-12 text-center md:text-left">
                <h2 className="text-3xl font-bold mb-4">
                  Where Myth Meets Emotion
                </h2>
                <p className="text-lg text-white/90 leading-relaxed">
                  Jennifer Pangle is an American novelist, poet, and storyteller
                  whose work lives where myth meets emotion. Best known for her
                  debut novel Eshe and Aaru, Jennifer weaves stories that blur
                  the line between reality and the cosmic — exploring love,
                  grief, and creation as threads that connect all living things.
                </p>
              </div>
            </div>
          </div>

          {/* Early Beginnings Section */}
          <div className="px-8 py-12 bg-purple-50 border-t border-b border-purple-100">
            <div className="flex items-start mb-6">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <PenTool className="text-purple-600" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Early Beginnings
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Raised in Georgia, Jennifer began writing at twelve, filling
                  notebooks with worlds born between dream and waking life.
                  Guided by her mother's love of words, she discovered early on
                  that storytelling was more than imagination — it was a way to
                  give voice to the unseen.
                </p>
              </div>
            </div>
          </div>

          {/* Professional Journey Section */}
          <div className="px-8 py-12 border-b border-purple-100">
            <div className="flex items-start mb-6">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <Sparkles className="text-purple-600" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Professional Journey
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Before becoming a full-time author, she earned a degree in
                  special education and spent twelve years as a project manager
                  at Bank of America. Those experiences shaped the balance of
                  creativity and discipline that defines her writing today.
                </p>
              </div>
            </div>
          </div>

          {/* Current Life Section */}
          <div className="px-8 py-12 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <Heart className="mr-3" size={32} />
                <h3 className="text-2xl font-bold">Life in Lafayette</h3>
              </div>
              <p className="text-lg text-center leading-relaxed">
                Now living in Lafayette, Georgia, Jennifer writes surrounded by
                quiet hills, caring for her family and drawing inspiration from
                the beauty of everyday moments. Her work explores spiritual
                connection, cosmic love, and the invisible threads that bind
                souls across lifetimes.
              </p>
            </div>
          </div>

          {/* Writing Philosophy Section */}
          <div className="p-8 md:p-12">
            <div className="flex items-center mb-8 justify-center">
              <BookOpen className="text-purple-600 mr-3" size={28} />
              <h3 className="text-2xl font-bold text-gray-900">
                Her Literary World
              </h3>
            </div>

            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-6 md:mb-0">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
                  <div className="flex items-center mb-4">
                    <Star className="mr-2" size={20} />
                    <h4 className="text-xl font-bold">Eshe and Aaru</h4>
                  </div>
                  <p className="mb-4 leading-relaxed">
                    Through Eshe and Aaru, and the stories yet to come, Jennifer
                    invites readers into worlds that feel both otherworldly and
                    achingly human — reminding us that even across time and
                    distance, love remembers.
                  </p>
                  <p className="italic leading-relaxed">
                    "Where myth meets emotion, and love transcends time"
                  </p>
                </div>
              </div>

              <div className="md:w-1/2 md:pl-8">
                <div className="bg-gray-100 rounded-xl p-6">
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">
                    Storytelling Vision
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    Jennifer weaves stories that blur the line between reality
                    and the cosmic — exploring love, grief, and creation as
                    threads that connect all living things. Her narratives
                    remind us that even across time and distance, love
                    remembers.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action Section */}
          <div className="px-8 py-12 text-center bg-gradient-to-r from-purple-50 to-pink-50">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Discover Her Worlds
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Step into Jennifer's cosmic landscapes where stories become
              portals to other realms and love transcends all boundaries.
            </p>
            <Link
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-8 rounded-full inline-flex items-center transition duration-200 shadow-lg"
              to="/shop"
            >
              <BookOpen className="mr-2" size={20} />
              Explore Books
            </Link>

            <div className="mt-6">
              <Link
                to="/contact"
                className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium transition duration-200"
              >
                <Mail className="mr-2" size={18} />
                Contact Me
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorPage;
