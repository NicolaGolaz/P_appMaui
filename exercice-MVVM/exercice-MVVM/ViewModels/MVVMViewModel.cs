
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace exercice_MVVM.ViewModels;

public partial class MVVMViewModel : ObservableObject
{
	[ObservableProperty]
	private int counter = 0;

	[RelayCommand]
	private void Increment(int incrementValue)
	{
		Counter += incrementValue;
	}
}