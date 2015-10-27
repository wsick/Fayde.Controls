
module Fayde.Controls {
    export class BusyIndicator extends Control {
        static IsBusyProperty = DependencyProperty.Register("IsBusy", () => Boolean, BusyIndicator);
        static OverlayBrushProperty = DependencyProperty.Register("OverlayBrush", () => Media.Brush, BusyIndicator);
        static IsIndeterminateProperty = DependencyProperty.Register("IsIndeterminate", () => Boolean, BusyIndicator,false,(d, args) => (<BusyIndicator>d).OnIsIndeterminateChanged(args));
        static ValueProperty = DependencyProperty.Register("Value", () => Number, BusyIndicator, 0.0, (d, args) => (<BusyIndicator>d).OnValueChanged(args));
        static MaxValueProperty = DependencyProperty.Register("MaxValue", () => Number, BusyIndicator);
        static MinValueProperty = DependencyProperty.Register("MinValue", () => Number, BusyIndicator);
        static BusyContentProperty = DependencyProperty.Register("BusyContent", () => String, BusyIndicator);
        static ForegroundProperty = DependencyProperty.Register("Foreground", () => Media.Brush, BusyIndicator);
        IsBusy: boolean;
        OverlayBrush: Media.Brush;
        IsIndeterminate: boolean;
        Value: number = 0.0;
        MaxValue: number = 100.0;
        MinValue: number = 0.0;
        BusyContent: string = "";
        Foreground : Media.Brush;

        private _ProgressRingElement : Grid = null;
        private _ProgressBarElement : Grid = null;
        private _ProgressBarFillElement : Shapes.Rectangle = null;
        
        constructor() {
            super();
            this.DefaultStyleKey = BusyIndicator;
        }
        
        OnApplyTemplate() {
            super.OnApplyTemplate();
            this._ProgressRingElement = <Grid>this.GetTemplateChild("ProgressRingElement", Grid);
            this._ProgressBarElement = <Grid>this.GetTemplateChild("ProgressBarElement", Grid);
            this._ProgressBarFillElement = <Shapes.Rectangle>this.GetTemplateChild("ProgressBarFillElement", Shapes.Rectangle);
            this.UpdateUI();
        }
        
        private OnIsIndeterminateChanged(args: IDependencyPropertyChangedEventArgs) {
            this.ProcessIsIndeterminateValue();
        }
        
        private OnValueChanged(args: IDependencyPropertyChangedEventArgs) {
            this.Value = args.NewValue;
            this.ProcessValue();
        }
        
        private ProcessIsIndeterminateValue(){
            if(this._ProgressRingElement){
               if(this.IsIndeterminate){
                   this._ProgressRingElement.Visibility = Visibility.Visible;
               }else{
                   this._ProgressRingElement.Visibility = Visibility.Collapsed;
               }
            }
            
            if(this._ProgressBarElement){
                if(this.IsIndeterminate){
                   this._ProgressBarElement.Visibility = Visibility.Collapsed;
               }else{
                   this._ProgressBarElement.Visibility = Visibility.Visible;
               }
            }
            
            
        }
        
        private ProcessValue(){
            if(this._ProgressBarFillElement){
                
                var maxWidth = this._ProgressBarElement.Width;
                var percent = this.Value/this.MaxValue;
                var newWidth = maxWidth * percent;
                this._ProgressBarFillElement.Width = newWidth;
      
            }
        }
 
        private UpdateUI(){
            this.ProcessIsIndeterminateValue();
            this.ProcessValue();
        }

        
    }
    TemplateParts(BusyIndicator,
        { Name: "ProgressRingElement", Type: Grid },
        { Name: "ProgressBarElement", Type: Grid},
        { Name: "ProgressBarFillElement", Type: Shapes.Rectangle});
}