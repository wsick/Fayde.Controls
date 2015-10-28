class BusyIndicatorViewModel extends Fayde.MVVM.ViewModelBase {
    /* BUSY INDICATOR TEST */
    BusyValue = 0.0;

    LoadSomething() {
        this.BusyValue = 0.0;
        var interval = setInterval(()=> {
            this.BusyValue += 1.0;
            if (this.BusyValue >= 100) {
                clearInterval(interval);
            }

        }, 25);
    }

}
Fayde.MVVM.NotifyProperties(BusyIndicatorViewModel, ["BusyValue"]);
export = BusyIndicatorViewModel;