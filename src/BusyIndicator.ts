module Fayde.Controls {
    export class BusyIndicator extends ContentControl {
        static IsBusyProperty = DependencyProperty.Register("IsBusy", () => Boolean, BusyIndicator, false);
        static HasContentProperty = DependencyProperty.RegisterReadOnly("HasContent", () => Boolean, BusyIndicator, false);
        static BusyContentProperty = DependencyProperty.Register("BusyContent", () => Object, BusyIndicator, undefined, (d: BusyIndicator, args) => d.OnBusyContentChanged(args.OldValue, args.NewValue));
        static BusyContentTemplateProperty = DependencyProperty.Register("BusyContentTemplate", () => DataTemplate, BusyIndicator);
        static OverlayStyleProperty = DependencyProperty.Register("OverlayStyle",() => Style,BusyIndicator);
        IsBusy: boolean;
        OverlayStyle: Style;
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