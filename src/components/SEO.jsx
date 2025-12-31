import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = "Ankit Mishra - Full Stack Developer | React, Node.js, Python Expert",
  description = "Professional full stack developer specializing in React, Node.js, Python, and modern web technologies. Get expert consultation and custom web development services.",
  keywords = "full stack developer, React developer, Node.js, Python, web development, portfolio, consultation, custom websites",
  image = "https://iamankit.in/og-image.jpg",
  url = "https://iamankit.in",
  type = "website"
}) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Ankit Mishra",
    "jobTitle": "Full Stack Developer",
    "url": "https://iamankit.in",
    "email": "ankit.mishra9780@gmail.com",
    "knowsAbout": ["React", "Node.js", "Python", "JavaScript", "Web Development", "Full Stack Development"],
    "offers": [
      {
        "@type": "Service",
        "name": "Personal Web Portfolio",
        "description": "Custom responsive web portfolio development",
        "price": "40",
        "priceCurrency": "USD"
      },
      {
        "@type": "Service", 
        "name": "Product Design Sessions",
        "description": "High-level design and architecture planning consultation",
        "price": "50",
        "priceCurrency": "USD"
      },
      {
        "@type": "Service",
        "name": "Idea to Product Consultation", 
        "description": "Complete idea validation and technical roadmap consultation",
        "price": "50",
        "priceCurrency": "USD"
      }
    ],
    "sameAs": [
      "https://github.com/ankitmishra9780",
      "https://linkedin.com/in/ankitmishra9780"
    ]
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Ankit Mishra" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href={url} />

      {/* Open Graph Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Ankit Mishra Portfolio" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;