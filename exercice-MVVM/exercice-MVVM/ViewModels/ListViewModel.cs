using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace exercice_MVVM.ViewModels;

public sealed partial class ListViewModel : ObservableObject
{
    [ObservableProperty]
    private ObservableCollection<string> wishes = new() { "oui", "non" };

    [RelayCommand]
    private void AddWish(string wish)
    {
        Wishes.Add(wish);
    }

}