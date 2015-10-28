
module Fayde.Controls {
    export class BusyIndicator extends ContentControl {
        static IsBusyProperty = DependencyProperty.Register("IsBusy", () => Boolean, BusyIndicator);
        static OverlayBrushProperty = DependencyProperty.Register("OverlayBrush", () => Media.Brush, BusyIndicator);
        static IsIndeterminateProperty = DependencyProperty.Register("IsIndeterminate", () => Boolean, BusyIndicator);
        static BusyContentProperty = DependencyProperty.Register("BusyContent", () => String, BusyIndicator);
        static ForegroundProperty = DependencyProperty.Register("Foreground", () => Media.Brush, BusyIndicator);
        static BusyContentTemplateProperty = DependencyProperty.Register("BusyContentTemplate", () => DataTemplate, BusyIndicator, undefined, (d, args) => (<BusyIndicator>d).OnBusyContentTemplateChanged(args));
        IsBusy: boolean;
        OverlayBrush: Media.Brush;
        IsIndeterminate: boolean;
        BusyContent: string = "";
        Foreground : Media.Brush;
        BusyContentTemplate: DataTemplate;

        private _ProgressRingElement : Grid = null;
        private _ProgressBarElement : Grid = null;
        private _ProgressBarFillElement : Shapes.Rectangle = null;
        
        
        
        constructor() {
            super();
            this.DefaultStyleKey = BusyIndicator;
        }
        
        OnApplyTemplate() {
            super.OnApplyTemplate();
            //this._ProgressRingElement = <Grid>this.GetTemplateChild("ProgressRingElement", Grid);
            //this._ProgressBarElement = <Grid>this.GetTemplateChild("ProgressBarElement", Grid);
            //this._ProgressBarFillElement = <Shapes.Rectangle>this.GetTemplateChild("ProgressBarFillElement", Shapes.Rectangle);
            this.UpdateUI();
        }
        
        OnBusyContentTemplateChanged (args: IDependencyPropertyChangedEventArgs) {
           alert(JSON.stringify(args));
        }

        private UpdateUI(){
            alert("");
        }

        
    }
    TemplateParts(BusyIndicator,
        { Name: "ProgressRingElement", Type: Grid },
        { Name: "ProgressBarElement", Type: Grid},
        { Name: "ProgressBarFillElement", Type: Shapes.Rectangle});
}