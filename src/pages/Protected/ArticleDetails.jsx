import { useState, useEffect } from 'react';
import { Calendar, User, ArrowLeft, History, ChevronDown, Clock, RotateCcw, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getOneArticle } from '../../redux/apis/article';
import Navbar from '../../components/Navbar';
import { canAccess } from '../../common/common';

export default function ArticleDetails() {

  const {
    auth
  } = useSelector((state) => state.auth);

  const [showHistoryDropdown, setShowHistoryDropdown] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState(null);

  useEffect(() => {
    if (!id) {
      navigate('/articles');
      return;
    }

    dispatch(getOneArticle(id)).unwrap()
      .then((res) => {
        setArticle(res);
      })
      .catch(() => {
        navigate('/articles');
      }).finally(() => {
        setLoading(false);
      });
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleRestoreRevision = (revisionId) => {
    if (window.confirm('Restore this revision? This will create a new current version.')) {
      alert(`Restoring revision: ${revisionId}`);
      setShowHistoryDropdown(false);
    }
  };

  const getRevisionNumber = (index) => {
    return article.revisions.length - index;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4 w-1/4"></div>
            <div className="h-12 bg-gray-200 rounded mb-6"></div>
            <div className="h-4 bg-gray-200 rounded mb-2 w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded mb-8 w-1/4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={handleBack}
          className="flex items-center text-gray-600 hover:text-indigo-600 mb-6 transition duration-200"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Articles
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                  {article.title}
                </h1>

                <div className="flex flex-wrap items-center text-sm text-gray-500 gap-6">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">{article.createdBy.name}</span>
                      <p className="text-xs text-gray-500">{article.createdBy.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Published {selectedVersion ? formatDate(selectedVersion.updatedAt) : formatDate(article.createdAt)}</span>
                    {
                      selectedVersion &&
                      <button onClick={() => setSelectedVersion(null)} className="p-2 rounded-full hover:bg-gray-100 ml-2">
                        <X size={20} color="red" />
                      </button>
                    }
                  </div>
                </div>
              </div>

              {canAccess(article?.createdBy?._id, auth) && (
                <div className="ml-6 relative">
                  <button
                    onClick={() => setShowHistoryDropdown(!showHistoryDropdown)}
                    className="flex items-center px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 hover:text-gray-800 rounded-lg transition duration-200 font-medium"
                  >
                    <History className="w-4 h-4 mr-2" />
                    View History
                    <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-200 ${showHistoryDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {showHistoryDropdown && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
                      <div className="p-3 border-b border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-900">Revision History</h3>
                        <p className="text-xs text-gray-500">{article.revisions.length} revisions</p>
                      </div>

                      <div className="divide-y divide-gray-100">
                        {article.revisions.map((revision, index) => {
                          return (
                            <div key={revision._id} className="p-3 hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedVersion(revision)}>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${revision.isCurrent
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    Rev {getRevisionNumber(index)}
                                  </span>
                                  {revision.isCurrent && (
                                    <span className="text-xs text-green-600 font-medium ml-2">CURRENT</span>
                                  )}
                                </div>
                                {!revision.isCurrent && (
                                  <button
                                    onClick={() => handleRestoreRevision(revision._id)}
                                    className="p-1 text-gray-400 hover:text-indigo-600 transition duration-200"
                                    title="Restore this revision"
                                  >
                                    <RotateCcw className="w-3 h-3" />
                                  </button>
                                )}
                              </div>

                              <div className="flex items-center text-xs text-gray-500 mb-2">
                                <Clock className="w-3 h-3 mr-1" />
                                {formatDate(revision.updatedAt)}
                              </div>

                              <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                                {revision.content.substring(0, 150)}...
                              </p>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="px-8 py-8">
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6 last:mb-0 whitespace-pre-line">
                {
                  selectedVersion ? selectedVersion?.content : article?.content
                }
              </p>
            </div>
          </div>

          <div className="px-8 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Last updated: {formatDate(article.updatedAt)}</span>
              <span>Article ID: {article._id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}