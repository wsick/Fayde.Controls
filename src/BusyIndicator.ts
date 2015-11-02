
module Fayde.Controls {
    export class BusyIndicator extends ContentControl {
        static IsBusyProperty = DependencyProperty.Register("IsBusy", () => Boolean, BusyIndicator);
        static OverlayBrushProperty = DependencyProperty.Register("OverlayBrush", () => Media.Brush, BusyIndicator);
        static IsIndeterminateProperty = DependencyProperty.Register("IsIndeterminate", () => Boolean, BusyIndicator);
        //static BusyContentProperty = DependencyProperty.Register("BusyContent", () => String, BusyIndicator);
        static ForegroundProperty = DependencyProperty.Register("Foreground", () => Media.Brush, BusyIndicator);
        static BusyContentProperty = DependencyProperty.Register("BusyContent", () => Object, BusyIndicator, null, (d, args) => (<BusyIndicator>d)._OnBusyContentChanged(args));
        static BusyContentTemplateProperty = DependencyProperty.Register("BusyContentTemplate", () => DataTemplate, BusyIndicator);
        IsBusy: boolean;
        OverlayBrush: Media.Brush;
        IsIndeterminate: boolean;
        HasContent: boolean;
        BusyContent: any;
        Foreground : Media.Brush;
        BusyContentTemplate: DataTemplate;

        private _BusyIndicatorContentContainer : Grid = null;        
        private _BusyContentControl : ContentControl = null;
        
        constructor() {
            super();
            this.DefaultStyleKey = BusyIndicator;
        }
        
        OnApplyTemplate() {
            super.OnApplyTemplate();
            this._BusyIndicatorContentContainer = <Grid>this.GetTemplateChild("BusyIndicatorContentContainer", Grid);
            this._BusyContentControl = <ContentControl>this.GetTemplateChild("BusyContentControl",ContentControl);
            this.UpdateUI();
        }
        
        private _OnBusyContentChanged(args: IDependencyPropertyChangedEventArgs) {
            this.HasContent = args.NewValue != null;
            this.OnBusyContentChanged(args.OldValue, args.NewValue);
        }
        
        OnBusyContentChanged(oldValue: any, newValue: any) {
            this._UpdateContentVisuals();
        }
        
        OnBusyContentTemplateChanged (args: IDependencyPropertyChangedEventArgs) {
           if(args.NewValue){
               alert("New Value");
           }else{
               alert("Empty");
           }
           
        }
        
        private _UpdateContentVisuals() {
            
            var contentControl = this._BusyContentControl;
            if (!contentControl)
                return;
                alert("Update");
                
            //contentControl.Content = this.BusyContent;
            contentControl.ContentTemplate = this.BusyContentTemplate;
            
        }


        private UpdateUI(){
            this._UpdateContentVisuals();
        }

        
    }
    TemplateParts(BusyIndicator,
        { Name: "BusyIndicatorContentContainer", Type: Grid },
        { Name: "BusyContentControl", Type: ContentControl });
}