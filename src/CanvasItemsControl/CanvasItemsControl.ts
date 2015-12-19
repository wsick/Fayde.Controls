module Fayde.Controls {
    export class CanvasItemsControl extends ItemsControl {
        constructor() {
            super();
            this.DefaultStyleKey = CanvasItemsControl;
        }

        PrepareContainerForItem(container: UIElement, item: any): void {
            super.PrepareContainerForItem(container, item);
            if (container instanceof FrameworkElement)
                container.TemplateApplied.on(this.BindContainerToCanvas, this);
        }

        ClearContainerForItem(container: UIElement, item: any): void {
            super.ClearContainerForItem(container, item);
            if (container instanceof FrameworkElement)
                container.TemplateApplied.off(this.BindContainerToCanvas, this);
            container.ClearValue(Canvas.LeftProperty);
            container.ClearValue(Canvas.TopProperty);
        }

        protected BindContainerToCanvas(sender: FrameworkElement, args: nullstone.IEventArgs) {
            sender.TemplateApplied.off(this.BindContainerToCanvas, this);
            if (VisualTreeHelper.GetChildrenCount(sender) < 1)
                return;
            var root = VisualTreeHelper.GetChild(sender, 0);
            sender.SetBinding(Canvas.LeftProperty, Data.Binding.fromData({
                Source: root,
                Path: "(Canvas.Left)"
            }));
            sender.SetBinding(Canvas.TopProperty, Data.Binding.fromData({
                Source: root,
                Path: "(Canvas.Top)"
            }));
        }
    }
}