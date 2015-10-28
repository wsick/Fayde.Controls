class BusyIndicatorViewModel extends Fayde.MVVM.ViewModelBase {
    /* BUSY INDICATOR TEST */
    private $$interval: number;
    BusyValue = 0.0;

    LoadSomething() {
        if (this.$$interval)
            clearInterval(this.$$interval);
        this.BusyValue = 0.0;
        this.$$interval = setInterval(() => {
            this.BusyValue += 1.0;
            if (this.BusyValue >= 100) {
                clearInterval(this.$$interval);
            }
        }, 25);
    }

}
Fayde.MVVM.NotifyProperties(BusyIndicatorViewModel, ["BusyValue"]);
export = BusyIndicatorViewModel;