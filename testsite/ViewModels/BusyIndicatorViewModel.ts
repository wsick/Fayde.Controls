class BusyIndicatorViewModel extends Fayde.MVVM.ViewModelBase {
    private $$interval: number;
    BusyValue = 0.0;
    BusyMessage = "";
    ButtonContent = "Start";

    Download() {
        alert("Download");
        this.BusyValue = 0.0;
        this.clearInterval(); 
        this.$$interval = setInterval(() => {
            this.BusyValue += 10;
            if (this.BusyValue >= 100) {
                clearInterval(this.$$interval);
            }
        }, 700);
    }
    
    private clearInterval(){
        if (this.$$interval)
            clearInterval(this.$$interval);
    }

}
Fayde.MVVM.NotifyProperties(BusyIndicatorViewModel, ["BusyValue","BusyMessage","ButtonContent"]);
export = BusyIndicatorViewModel;