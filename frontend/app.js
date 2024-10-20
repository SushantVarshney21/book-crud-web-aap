document.addEventListener('DOMContentLoaded', () => {
    const bookList = document.getElementById('book-list');
    const bookForm = document.getElementById('book-form');
    let editing = false;
    let editingId = null;

    // Base URL for the API
    const apiBaseUrl = 'http://localhost:5000/api/books';

    // Fetch and render all books
    const fetchBooks = async () => {
        const res = await fetch(`${apiBaseUrl}`);
        const books = await res.json();
        console.log(books)
        renderBooks(books);
    };

    // Render books in the DOM
    const renderBooks = (books) => {
        bookList.innerHTML = '';  // Clear the previous list

        if (books.length === 0) {
            bookList.innerHTML = "<h2>Books Not Found</h2>";
        } else {
            books.forEach(book => {
                const bookItem = document.createElement('div');
                bookItem.classList.add('book-item');

                const bookTitle = document.createElement('h3');
                bookTitle.textContent = book.name;
                bookItem.appendChild(bookTitle);

                const bookContent = document.createElement('p');
                bookContent.textContent = book.content;
                bookItem.appendChild(bookContent);

                const bookAuthor = document.createElement('p');
                bookAuthor.innerHTML = `<strong>Author:</strong> ${book.author}`;
                bookItem.appendChild(bookAuthor);

                const buttonContainer = document.createElement('div');

                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.addEventListener('click', () => editBook(book._id));
                buttonContainer.appendChild(editButton);

                const deleteButton = document.createElement('button');
                deleteButton.classList.add('delete');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', () => deleteBook(book._id));
                buttonContainer.appendChild(deleteButton);

                bookItem.appendChild(buttonContainer);
                bookList.appendChild(bookItem);
            });
        }
    };

    // Add or Update book
    bookForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const content = document.getElementById('content').value;
        const author = document.getElementById('author').value;

        const bookData = { name, content, author };

        if (editing) {
            await fetch(`${apiBaseUrl}/${editingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookData),
            });
            editing = false;
            editingId = null;
        } else {
            await fetch(`${apiBaseUrl}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookData),
            });
        }

        bookForm.reset();
        fetchBooks();
    });

    // Edit book
    window.editBook = async (id) => {
        const res = await fetch(`${apiBaseUrl}/${id}`);
        const book = await res.json();

        document.getElementById('name').value = book.name;
        document.getElementById('content').value = book.content;
        document.getElementById('author').value = book.author;

        editing = true;
        editingId = id;
    };

    // Delete book
    window.deleteBook = async (id) => {
        await fetch(`${apiBaseUrl}/${id}`, { method: 'DELETE' });
        fetchBooks();
    };

    // Initial Fetch
    fetchBooks();
});
