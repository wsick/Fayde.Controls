module Fayde.Controls {
    export class HeaderedItemsControl extends ItemsControl {
        private _HeaderIsItem: boolean = false;
        private _ItemsControlHelper: Internal.ItemsControlHelper;

        static HeaderProperty = DependencyProperty.Register("Header", () => Object, HeaderedItemsControl, undefined, (d, args) => (<HeaderedItemsControl>d).OnHeaderChanged(args.OldValue, args.NewValue));
        Header: any;
        OnHeaderChanged(oldHeader: any, newHeader: any) { }

        static HeaderTemplateProperty = DependencyProperty.Register("HeaderTemplate", () => DataTemplate, HeaderedItemsControl, undefined, (d, args) => (<HeaderedItemsControl>d).OnHeaderTemplateChanged(args.OldValue, args.NewValue));
        HeaderTemplate: DataTemplate;
        OnHeaderTemplateChanged(oldHeaderTemplate: DataTemplate, newHeaderTemplate: DataTemplate) { }

        static ItemContainerStyleProperty = DependencyProperty.Register("ItemContainerStyle", () => Style, HeaderedItemsControl);
        ItemContainerStyle: Style;
        private OnItemContainerStyleChanged(args: IDependencyPropertyChangedEventArgs) {
            this._ItemsControlHelper.UpdateItemContainerStyle(args.NewValue);
        }

        constructor() {
            super();
            this.DefaultStyleKey = HeaderedItemsControl;
            this._ItemsControlHelper = new Internal.ItemsControlHelper(this);
        }

        OnApplyTemplate() {
            super.OnApplyTemplate();
            this._ItemsControlHelper.OnApplyTemplate();
        }

        PrepareContainerForItem(element: UIElement, item: any) {
            var control = <Control>element;
            if (!(control instanceof Control)) control = null;

            var ics = this.ItemContainerStyle;
            if (ics != null && control != null && control.Style == null)
                control.SetValue(FrameworkElement.StyleProperty, ics);

            var hic = <HeaderedItemsControl>element;
            if (hic instanceof HeaderedItemsControl)
                HeaderedItemsControl.PrepareHeaderedItemsControlContainer(hic, item, this, ics);
            super.PrepareContainerForItem(element, item);
        }

        static PrepareHeaderedItemsControlContainer(control: HeaderedItemsControl, item: any, parentItemsControl: ItemsControl, parentItemContainerStyle: Style) {
            if (control === item)
                return;
            var itemTemplate = parentItemsControl.ItemTemplate;
            if (itemTemplate != null)
                control.SetValue(ItemsControl.ItemTemplateProperty, itemTemplate);
            if (parentItemContainerStyle != null && HeaderedItemsControl.HasDefaultValue(control, HeaderedItemsControl.ItemContainerStyleProperty))
                control.SetValue(HeaderedItemsControl.ItemContainerStyleProperty, parentItemContainerStyle);
            if (control._HeaderIsItem || HeaderedItemsControl.HasDefaultValue(control, HeaderedItemsControl.HeaderProperty)) {
                control.Header = item;
                control._HeaderIsItem = true;
            }
            if (itemTemplate != null)
                control.SetValue(HeaderedItemsControl.HeaderTemplateProperty, itemTemplate);
            if (parentItemContainerStyle != null && control.Style == null)
                control.SetValue(FrameworkElement.StyleProperty, parentItemContainerStyle);
            var hdt = <HierarchicalDataTemplate>itemTemplate;
            if (!(hdt instanceof HierarchicalDataTemplate))
                return;
            //TODO: ItemsSource will no longer be a binding
            //      Need to GetBindingExpression, then clone ParentBinding
            if (hdt.ItemsSource != null && HeaderedItemsControl.HasDefaultValue(control, ItemsControl.ItemsSourceProperty)) {
                var itemssourcebinding = hdt.ItemsSource;
                var headeredItemsControl = control;
                var dp = ItemsControl.ItemsSourceProperty;
                var binding1 = new Fayde.Data.Binding();
                binding1.Converter = itemssourcebinding.Converter;
                binding1.ConverterCulture = itemssourcebinding.ConverterCulture;
                binding1.ConverterParameter = itemssourcebinding.ConverterParameter;
                binding1.Mode = itemssourcebinding.Mode;
                binding1.NotifyOnValidationError = itemssourcebinding.NotifyOnValidationError;
                binding1.Source = control.Header;
                binding1.Path = itemssourcebinding.Path;
                binding1.ValidatesOnExceptions = itemssourcebinding.ValidatesOnExceptions;
                headeredItemsControl.SetBinding(dp, binding1);
            }
            if (hdt.IsItemTemplateSet && control.ItemTemplate === itemTemplate) {
                control.ClearValue(ItemsControl.ItemTemplateProperty);
                if (hdt.ItemTemplate != null)
                    control.ItemTemplate = hdt.ItemTemplate;
            }
            if (!hdt.IsItemContainerStyleSet || control.ItemContainerStyle !== parentItemContainerStyle)
                return;
            control.ClearValue(HeaderedItemsControl.ItemContainerStyleProperty);
            if (hdt.ItemContainerStyle == null)
                return;
            control.ItemContainerStyle = hdt.ItemContainerStyle;
        }
        private static HasDefaultValue(control: Control, propd: DependencyProperty): boolean {
            return control.ReadLocalValue(propd) === DependencyProperty.UnsetValue;
        }
    }
}