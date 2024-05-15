import { Button, Card } from 'react-bootstrap';
import '../css/BlogSection.css'

//TODO: add content

function BlogSection() {
    // Sample articles data
    const articles = [
      { id: 1, title: 'Article 1', content: 'Content of Article 1' },
      { id: 2, title: 'Article 2', content: 'Content of Article 2' },
      { id: 3, title: 'Article 3', content: 'Content of Article 3' },
      { id: 4, title: 'Article 4', content: 'Content of Article 4' }
    ];
  
    return (
      <div className="blog-section">
        {articles.map(article => (
          <div key={article.id} className="article">
            <Card style={{ width: '100%' }}>
              <Card.Img variant="top" src="holder.js/100px180" />
              <Card.Body>
                <Card.Title>{article.title}</Card.Title>
                <Card.Text>
                  {article.content}
                </Card.Text>
                <Button variant="primary">Read more</Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    );
  }
  
  export default BlogSection;
