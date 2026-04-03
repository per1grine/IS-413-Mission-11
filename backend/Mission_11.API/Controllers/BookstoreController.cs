using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Mission_11.API.Data;

namespace Mission_11.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class BookstoreController : ControllerBase
	{
		private BookstoreDbContext _bookContext;

		public BookstoreController(BookstoreDbContext temp) => _bookContext = temp;

		[HttpGet("AllBooks")]
		public IEnumerable<Book> Get()
			{
				var x = from b in _bookContext.Books
						orderby b.Author
						select b;
				return x.ToArray();
			}

		[HttpPost("AddBook")]
		public IActionResult AddBook([FromBody] Book book)
		{
			_bookContext.Books.Add(book);
			_bookContext.SaveChanges();
			return Ok(book);
		}

		[HttpPut("UpdateBook/{id}")]
		public IActionResult UpdateBook(int id, [FromBody] Book book)
		{
			var existing = _bookContext.Books.Find(id);
			if (existing == null) return NotFound();

			existing.Title = book.Title;
			existing.Author = book.Author;
			existing.Publisher = book.Publisher;
			existing.ISBN = book.ISBN;
			existing.Classification = book.Classification;
			existing.Category = book.Category;
			existing.PageCount = book.PageCount;
			existing.Price = book.Price;

			_bookContext.SaveChanges();
			return Ok(existing);
		}

		[HttpDelete("DeleteBook/{id}")]
		public IActionResult DeleteBook(int id)
		{
			var book = _bookContext.Books.Find(id);
			if (book == null) return NotFound();

			_bookContext.Books.Remove(book);
			_bookContext.SaveChanges();
			return NoContent();
		}
	}
}