// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Intersection Observer for section animations
const sections = document.querySelectorAll('.section');
const observerOptions = {
  root: null,
  threshold: 0.1,
  rootMargin: '0px'
};

const sectionObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

sections.forEach(section => {
  sectionObserver.observe(section);
});

// Image Lightbox functionality
const createLightbox = () => {
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.className = 'lightbox';
  document.body.appendChild(lightbox);

  const lightboxContent = document.createElement('div');
  lightboxContent.className = 'lightbox-content';
  lightbox.appendChild(lightboxContent);

  const closeButton = document.createElement('button');
  closeButton.className = 'lightbox-close';
  closeButton.setAttribute('aria-label', 'Close lightbox');
  closeButton.innerHTML = '×';
  lightboxContent.appendChild(closeButton);

  const lightboxImage = document.createElement('img');
  lightboxContent.appendChild(lightboxImage);

  const lightboxCaption = document.createElement('p');
  lightboxCaption.className = 'lightbox-caption';
  lightboxContent.appendChild(lightboxCaption);

  return { lightbox, lightboxImage, lightboxCaption };
};

const { lightbox, lightboxImage, lightboxCaption } = createLightbox();

// Add click handlers to gallery images
document.querySelectorAll('.gallery-item img').forEach(img => {
  img.addEventListener('click', () => {
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;
    lightboxCaption.textContent = img.alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  // Make images focusable and handle keyboard events
  img.tabIndex = 0;
  img.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      img.click();
    }
  });
});

// Close lightbox on click outside or close button
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox || e.target.className === 'lightbox-close') {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Close lightbox with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.classList.contains('active')) {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Add CSS styles for the lightbox
const style = document.createElement('style');
style.textContent = `
  .lightbox {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.9);
    z-index: 1000;
    padding: 2rem;
  }

  .lightbox.active {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .lightbox-content {
    position: relative;
    max-width: 90%;
    max-height: 90vh;
  }

  .lightbox-content img {
    max-width: 100%;
    max-height: 80vh;
    object-fit: contain;
  }

  .lightbox-close {
    position: absolute;
    top: -2rem;
    right: -2rem;
    background: none;
    border: none;
    color: white;
    font-size: 2rem;
    cursor: pointer;
    padding: 0.5rem;
    line-height: 1;
  }

  .lightbox-caption {
    color: white;
    text-align: center;
    margin-top: 1rem;
  }

  .section {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  }

  .section.visible {
    opacity: 1;
    transform: translateY(0);
  }

  @media (prefers-reduced-motion: reduce) {
    .section {
      transition: none;
    }
  }
`;

document.head.appendChild(style);

// Add keyboard navigation for the main navigation
const navLinks = document.querySelectorAll('nav a');
let currentFocusIndex = -1;

navLinks.forEach((link, index) => {
  link.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        currentFocusIndex = (index + 1) % navLinks.length;
        navLinks[currentFocusIndex].focus();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        currentFocusIndex = (index - 1 + navLinks.length) % navLinks.length;
        navLinks[currentFocusIndex].focus();
        break;
      case 'Home':
        e.preventDefault();
        navLinks[0].focus();
        break;
      case 'End':
        e.preventDefault();
        navLinks[navLinks.length - 1].focus();
        break;
    }
  });
});

// Add scroll-to-top button
const createScrollToTopButton = () => {
  const button = document.createElement('button');
  button.className = 'scroll-to-top';
  button.setAttribute('aria-label', 'Scroll to top');
  button.innerHTML = '↑';
  document.body.appendChild(button);

  const buttonStyle = document.createElement('style');
  buttonStyle.textContent = `
    .scroll-to-top {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background-color: var(--primary-color);
      color: white;
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.3s, transform 0.3s;
      transform: translateY(100px);
      z-index: 99;
    }

    .scroll-to-top.visible {
      opacity: 1;
      transform: translateY(0);
    }

    .scroll-to-top:hover {
      background-color: var(--secondary-color);
    }

    @media (prefers-reduced-motion: reduce) {
      .scroll-to-top {
        transition: none;
      }
    }
  `;
  document.head.appendChild(buttonStyle);

  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    button.classList.toggle('visible', scrolled > 500);
  });

  button.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
};

createScrollToTopButton();

// Dark mode functionality
const initTheme = () => {
  // Check for saved theme preference, default to light
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
};

const updateThemeIcon = (theme) => {
  const icon = document.querySelector('.theme-toggle .icon');
  icon.textContent = theme === 'dark' ? '🌞' : '🌓';
};

const toggleTheme = () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
};

// Add event listener to theme toggle button
document.querySelector('.theme-toggle').addEventListener('click', toggleTheme);

// Initialize theme on page load
initTheme();

// Book list toggle functionality
const bookListToggle = document.querySelector('.book-list-toggle');
const bookList = document.querySelector('#book-list');

bookListToggle.addEventListener('click', () => {
  const isExpanded = bookListToggle.getAttribute('aria-expanded') === 'true';
  bookListToggle.setAttribute('aria-expanded', !isExpanded);
  bookList.hidden = isExpanded;
  
  // Smooth scroll into view if expanding
  if (!isExpanded) {
    setTimeout(() => {
      bookList.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  }
});

// Add keyboard support for book items
const bookItems = document.querySelectorAll('.book-item');
bookItems.forEach(item => {
  item.setAttribute('tabindex', '0');
  item.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      item.click();
    }
  });
});

// Blog post interaction handling
const initializeBlogPosts = () => {
    const readMoreButtons = document.querySelectorAll('.read-more');
    
    readMoreButtons.forEach(button => {
        button.addEventListener('click', () => {
            const article = button.closest('.blog-post');
            const excerpt = article.querySelector('.blog-excerpt');
            const fullContent = article.querySelector('.blog-full-content');
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            
            // Toggle states
            button.setAttribute('aria-expanded', !isExpanded);
            fullContent.hidden = isExpanded;
            excerpt.hidden = !isExpanded;
            
            // Update button text
            button.textContent = isExpanded ? 'Read More' : 'Show Less';
        });
    });
};

// Initialize blog functionality
if (document.querySelector('.blog-post')) {
    initializeBlogPosts();
}

// Resume button functionality
document.getElementById('resume-button').addEventListener('click', function(e) {
  e.preventDefault();
  const resumeUrl = this.getAttribute('href');
  
  const userChoice = confirm('Would you like to:\n\n1. Connect via email\n2. Download the resume\n\nClick OK to connect via email or Cancel to download the resume.');
  
  if (userChoice) {
    window.location.href = 'mailto:akashdeep.kundu@gmail.com';
  } else {
    window.open(resumeUrl, '_blank');
  }
});
