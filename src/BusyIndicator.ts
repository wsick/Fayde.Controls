
module Fayde.Controls {
    export class BusyIndicator extends Control {
        static IsBusyProperty = DependencyProperty.Register("IsBusy", () => Boolean, BusyIndicator, false, (d, args) => (<BusyIndicator>d).OnIsBusyChanged(args));
        IsBusy: boolean;

        private _Spinner : Canvas = null;

        
        constructor() {
            super();
            this.DefaultStyleKey = BusyIndicator;
        }
        
        OnApplyTemplate() {
            super.OnApplyTemplate();
            this._Spinner = <Canvas>this.GetTemplateChild("IndicatorCanvas", Canvas);
            alert(this._Spinner);
        }
        
        private OnIsBusyChanged(args: IDependencyPropertyChangedEventArgs) {

        }
  

        
    }
    TemplateParts(BusyIndicator,
        { Name: "IndicatorCanvas", Type: Canvas });
}