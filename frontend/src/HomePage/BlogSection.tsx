import { Button, Card } from 'react-bootstrap';
import '../css/BlogSection.css';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaArrowDown } from 'react-icons/fa'; // Import the arrow icon
import { Spinner } from 'react-bootstrap';

type Article = {  
  title: string;  
  description: string;  
  url: string;  
  urlToImage: string;  
};

function BlogSection() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [displayedArticles, setDisplayedArticles] = useState<Article[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

 useEffect(() => {
  fetch('https://newsapi.org/v2/top-headlines?country=us&category=health&apiKey=714e1b2241d04060a77d54fca596b8b7')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      const filteredArticles = data.articles.filter((article: Article) => !isRemoved(article));
      setArticles(filteredArticles);
      setDisplayedArticles(filteredArticles.slice(0, 4)); // Initial load of first 4 articles
    })
    .catch(error => {
      console.error('Error fetching articles:', error);
    });
}, []);

  const isRemoved = (article: Article) => {
    // condition here to identify removed articles
    return article.title === '[Removed]';
  };

  const handleLoadMore = () => {
    const nextIndex = currentIndex + 4;
    if (nextIndex < articles.length) {
      setDisplayedArticles(articles.slice(nextIndex, nextIndex + 4));
      setCurrentIndex(nextIndex);
    } else {
      // Reset to the first set of articles if there are no more articles left
      setDisplayedArticles(articles.slice(0, 4));
      setCurrentIndex(0);
    }
  };

  return (
    <>
      <div className="blog-section">
        {displayedArticles.map(article => (
          <Card key={article.url} className="custom-card">
            <Card.Img className="card-image" variant="top" src={article.urlToImage || 'placeholder_image_url'} alt={article.title} />
            <Card.Body>
              <Card.Title>{article.title}</Card.Title>
              <Button variant="primary" href={article.url} target="_blank" rel="noopener noreferrer">
                Read more
              </Button>
            </Card.Body>
          </Card>
        ))}
        <div className="load-more-container">
          <FaArrowDown className="load-more-icon" onClick={handleLoadMore} />
        </div>
      </div>
    </>
  );
}

export default BlogSection;
