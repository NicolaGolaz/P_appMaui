namespace P_AppMobileLecture.Models;

public class Book
{
    public int id { get; set; }
    public string title { get; set; }
    public int numberOfPages { get; set; }
    public string summary { get; set; }
    public string extract { get; set; }
    public string nameEditor { get; set; }
    public string coverImage { get; set; }
    public int yearOfPublication { get; set; }
    public int averageOfReviews { get; set; }
    // Ajoutez d'autres propriétés selon votre API
}