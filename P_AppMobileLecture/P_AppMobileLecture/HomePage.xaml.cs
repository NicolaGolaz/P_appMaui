using System.Collections.ObjectModel;
using System.Net.Http.Json;
using P_AppMobileLecture.Models;

namespace P_AppMobileLecture;
public partial class HomePage : ContentPage
{
    public ObservableCollection<Book> Books { get; set; } = new();

    public HomePage()
    {
        InitializeComponent();
        BindingContext = this;
        LoadBooks();
    }

    private async void LoadBooks()
    {
        try
        {
            var httpClient = new HttpClient();
            var response = await httpClient.GetFromJsonAsync<ApiResponse<List<Book>>>("http://192.168.56.1:3000/api/books");
            Console.WriteLine("oui");
            if (response?.data != null)
            {
                foreach (var book in response.data)
                    Books.Add(book);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error loading books: {ex}");
        }
    }

}
    public class ApiResponse<T>
    {
        public string message { get; set; }
        public T data { get; set; }
    }