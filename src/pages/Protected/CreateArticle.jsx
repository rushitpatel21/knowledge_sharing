import { useEffect, useState } from 'react';
import { Menu, X, Plus, List, User, Save, Eye, FileText, Brain, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { aIContent, createArticle, getOneArticle, updateArticle } from '../../redux/apis/article';
import { useNavigate, useParams } from 'react-router-dom';

export default function CreateArticle() {

  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [article, setArticle] = useState({
    title: '',
    content: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setArticle(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!article.title.trim()) {
      alert('Please enter a title for your article');
      return;
    }

    if (!article.content.trim()) {
      alert('Please enter a content for your article');
      return;
    }

    setIsLoading(true);

    dispatch(createArticle(article))
      .unwrap()
      .then(() => {
        setArticle({
          title: '',
          content: ''
        })
        toast.success('Article created successfully!');
      })
      .catch((err) => {
        toast.error(err);
      }).finally(() => {
        setIsLoading(false);
      });
  };

  const handleUpdateSubmit = async () => {
    if (!article.title.trim()) {
      alert('Please enter a title for your article');
      return;
    }

    if (!article.content.trim()) {
      alert('Please enter a content for your article');
      return;
    }

    setIsLoading(true);

    dispatch(updateArticle({
      id,
      data: article
    }))
      .unwrap()
      .then(() => {
        toast.success('Article edited successfully!');
      })
      .catch((err) => {
        toast.error(err);
      }).finally(() => {
        setIsLoading(false);
      });
  };

  const handleAIContent = async () => {
    if (!article.title.trim()) {
      alert('Please enter a title for your article');
      return;
    }

    setIsAILoading(true);

    dispatch(aIContent(article?.title))
      .unwrap()
      .then((res) => {
        setArticle((data) => ({
          ...data,
          content: res?.content
        }))
      })
      .catch((err) => {
        toast.error(err);
      }).finally(() => {
        setIsAILoading(false);
      });
  };

  useEffect(() => {
    if (id) {
      dispatch(getOneArticle(id)).unwrap()
        .then((res) => {
          setArticle(res);
        })
        .catch(() => {
          navigate('/articles');
        })
    }
  }, [id])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
              <FileText className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{id ? 'Edit' : 'Create New'} Article</h1>
              <p className="text-gray-600 mt-1">Share your thoughts and ideas with the world</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <div className="mb-6">
              <label htmlFor="title" className="block text-lg font-semibold text-gray-900 mb-3">
                Article Title
              </label>
              <div
                className='flex gap-2'
              >
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={article.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                  placeholder="Enter an engaging title for your article..."
                  maxLength={100}
                />
                <button
                  onClick={handleAIContent}
                  disabled={isAILoading}
                  className="flex items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed sm:flex-1"
                >
                  {isAILoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <div className="flex items-center">
                      <Sparkles className="w-5 h-5" />
                    </div>
                  )}
                </button>
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-gray-500">Make it catchy and descriptive</p>
                <span className="text-sm text-gray-400">{article?.title?.length}/100</span>
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="content" className="block text-lg font-semibold text-gray-900 mb-3">
                Article Content
              </label>
              <textarea
                id="content"
                name="content"
                value={article.content}
                onChange={handleInputChange}
                rows={12}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 resize-none"
                placeholder="Write your article content here... Share your insights, experiences, or expertise with your readers."
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-gray-500">Express your ideas clearly and engagingly</p>
                <span className="text-sm text-gray-400">{article?.content?.length} characters</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
              {/* Primary Submit Button */}
              <button
                onClick={id ? handleUpdateSubmit : handleSubmit}
                disabled={isLoading}
                className="flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed sm:flex-1"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>

                    {id ? 'Updating...' : 'Publishing...'}
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    {id ? 'Update Article' : 'Publish Article'}
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}