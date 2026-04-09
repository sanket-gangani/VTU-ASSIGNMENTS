const authorForm = document.getElementById('author-form');
const bookForm = document.getElementById('book-form');
const authorsList = document.getElementById('authors-list');
const booksList = document.getElementById('books-list');
const bookAuthorSelect = document.getElementById('book-author');

// Initialize data
fetchAuthors();
fetchBooks();

// Fetch and render Authors
async function fetchAuthors() {
    try {
        const res = await fetch('/api/authors');
        const data = await res.json();
        
        if (data.success) {
            renderAuthors(data.data);
            updateAuthorSelect(data.data);
        }
    } catch (err) {
        console.error('Error fetching authors:', err);
    }
}

// Fetch and render Books
async function fetchBooks() {
    try {
        const res = await fetch('/api/books');
        const data = await res.json();
        
        if (data.success) {
            renderBooks(data.data);
        }
    } catch (err) {
        console.error('Error fetching books:', err);
    }
}

// Render Authors to list
function renderAuthors(authors) {
    authorsList.innerHTML = authors.map(author => `
        <div class="item-card">
            <div class="item-info">
                <h4>${author.name}</h4>
                <p>${author.bio || 'No bio provided'}</p>
            </div>
        </div>
    `).join('');
}

// Update Author dropdown in book form
function updateAuthorSelect(authors) {
    const options = authors.map(author => `
        <option value="${author._id}">${author.name}</option>
    `).join('');
    bookAuthorSelect.innerHTML = `<option value="" disabled selected>Select Author</option>` + options;
}

// Render Books to list
function renderBooks(books) {
    if (books.length === 0) {
        booksList.innerHTML = '<p class="empty-msg">No books added yet.</p>';
        return;
    }
    
    booksList.innerHTML = '';
    books.forEach(book => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-info">
                <h4>${book.title}</h4>
                <p>${book.author ? book.author.name : 'Unknown Author'} • ${book.genre || 'Unknown'} (${book.publishedYear || 'N/A'})</p>
            </div>
            <button class="btn-delete" data-id="${book._id}">Delete</button>
        `;
        
        card.querySelector('.btn-delete').addEventListener('click', () => deleteBook(book._id));
        booksList.appendChild(card);
    });
}

// Handle Author Submission
authorForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('author-name').value;
    const bio = document.getElementById('author-bio').value;

    try {
        const res = await fetch('/api/authors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, bio })
        });
        const data = await res.json();
        if (data.success) {
            authorForm.reset();
            fetchAuthors();
        }
    } catch (err) {
        alert('Failed to add author');
    }
});

// Handle Book Submission
bookForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('book-title').value;
    const author = document.getElementById('book-author').value;
    const genre = document.getElementById('book-genre').value;
    const publishedYear = document.getElementById('book-year').value;

    try {
        const res = await fetch('/api/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, author, genre, publishedYear })
        });
        const data = await res.json();
        if (data.success) {
            bookForm.reset();
            fetchBooks();
        }
    } catch (err) {
        alert('Failed to add book');
    }
});

// Delete Book
async function deleteBook(id) {
    // Removed confirm() for easier testing, but added console log for debugging
    console.log('Attempting to delete book:', id);
    
    try {
        const res = await fetch(`/api/books/${id}`, { 
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        if (data.success) {
            fetchBooks();
        } else {
            alert('Error deleting: ' + data.message);
        }
    } catch (err) {
        console.error('Delete failed:', err);
    }
}
