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
	}
}