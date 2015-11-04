module Fayde.Controls {
    export class BusyIndicator extends ContentControl {
        static IsBusyProperty = DependencyProperty.Register("IsBusy", () => Boolean, BusyIndicator, false);
        static OverlayBrushProperty = DependencyProperty.Register("OverlayBrush", () => Media.Brush, BusyIndicator);
        static HasContentProperty = DependencyProperty.RegisterReadOnly("HasContent", () => Boolean, BusyIndicator, false);
        static BusyContentProperty = DependencyProperty.Register("BusyContent", () => Object, BusyIndicator, undefined, (d: BusyIndicator, args) => d.OnBusyContentChanged(args.OldValue, args.NewValue));
        static BusyContentTemplateProperty = DependencyProperty.Register("BusyContentTemplate", () => DataTemplate, BusyIndicator);
        IsBusy: boolean;
        OverlayBrush: Media.Brush;
        HasContent: boolean;
        BusyContent: any;
        BusyContentTemplate: DataTemplate;

        protected OnBusyContentChanged(oldBusyContent: any, newBusyContent: any) {
            this.SetCurrentValue(BusyIndicator.HasContentProperty, !!newBusyContent)
        }

        constructor() {
            super();
            this.DefaultStyleKey = BusyIndicator;
        }
    }
}