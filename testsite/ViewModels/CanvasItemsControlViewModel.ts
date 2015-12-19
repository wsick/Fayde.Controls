class CanvasItemsControlViewModel extends Fayde.MVVM.ViewModelBase {
    Items = [100, 200, 300];
}
Fayde.MVVM.NotifyProperties(CanvasItemsControlViewModel, ["Items"]);
export = CanvasItemsControlViewModel;