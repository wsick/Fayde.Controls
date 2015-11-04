class BusyIndicatorViewModel extends Fayde.MVVM.ViewModelBase {
    private $$interval: number;
    BusyValue = 0.0;
    EmailsDownloaded = 0;
    BusyMessage = "Downloading message 0/10...";

    Download() {
        this.BusyValue = 0.0;
        this.EmailsDownloaded = 0.0;
        this.BusyMessage = "Downloading message 0/10...";
        clearInterval(this.$$interval);
        this.$$interval = setInterval(() => {
            this.BusyValue += 10;
            this.EmailsDownloaded++;
            this.BusyMessage = "Downloading message "+this.EmailsDownloaded+"/10...";
            if (this.BusyValue >= 100) {
                clearInterval(this.$$interval);
            }
        }, 700);
    }

}
Fayde.MVVM.NotifyProperties(BusyIndicatorViewModel, ["BusyValue","BusyMessage","ButtonContent"]);
export = BusyIndicatorViewModel;