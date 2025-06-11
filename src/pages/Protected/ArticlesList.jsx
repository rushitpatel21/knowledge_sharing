import { useEffect, useState } from 'react';
import { Menu, X, Plus, List, User, Search, Filter, Calendar, Eye, Edit, Trash2, MoreVertical } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { deleteArticle, getArticles } from '../../redux/apis/article';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { canAccess } from '../../common/common';

export default function ArticlesList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auth } = useSelector((state) => state.auth);
  const { articles: AllArticles } = useSelector((state) => state.article);

  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Filter and sort articles
  const filteredArticles = articles
    .filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.author.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'views':
          return b.views - a.views;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const handleDelete = (articleId) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      dispatch(deleteArticle(articleId))
        .unwrap()
        .then((message) => {
          toast.success(message);
        })
        .catch((err) => {
          toast.error(err);
        }).finally(() => {
        });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };


  useEffect(() => {
    dispatch(getArticles());
  }, [])

  useEffect(() => {
    setArticles(AllArticles);
  }, [AllArticles])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">All Articles</h1>
              <p className="text-gray-600 mt-1">Manage and browse all published articles</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">
                {filteredArticles.length} of {articles.length} articles
              </span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Search articles by title or author..."
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Articles List */}
        <div className="space-y-4">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <div key={article?._id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition duration-200">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Article Header */}
                      <div className="flex items-center gap-3 mb-3">
                        <Link to={`/articles/${article?._id}`}>
                          <h3 className="text-xl font-semibold text-gray-900 hover:text-indigo-600 cursor-pointer">
                            {article?.title}
                          </h3>
                        </Link>
                      </div>

                      {/* Article Description */}
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {article?.description}
                      </p>

                      {/* Article Meta */}
                      <div className="flex items-center text-sm text-gray-500 space-x-6">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                            <User className="w-3 h-3 text-gray-600" />
                          </div>
                          <span className="font-medium">Created by {article?.createdBy?.name}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{formatDate(article.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => navigate(`/articles/${article?._id}`)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition duration-200"
                        title="Edit Article"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      {
                        canAccess(article?.createdBy?._id, auth) && <>
                          <button
                            onClick={() => navigate(`/articles/edit/${article?._id}`)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition duration-200"
                            title="Edit Article"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(article?._id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition duration-200"
                            title="Delete Article"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </>
                      }
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Empty State
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <List className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by creating your first article.'
                }
              </p>
              {!searchTerm && (
                <Link to="/articles/new" className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition duration-200">
                  <Plus className="w-5 h-5 mr-2" />
                  Create Article
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}