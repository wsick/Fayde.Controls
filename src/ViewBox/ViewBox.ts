module Fayde.Controls {
    export class ViewBox extends FrameworkElement {
        CreateLayoutUpdater () {
            return new viewbox.ViewBoxUpdater();
        }

        static ChildProperty = DependencyProperty.Register("Child", () => UIElement, ViewBox);
        static StretchProperty = DependencyProperty.Register("Stretch", () => new Enum(Media.Stretch), ViewBox, undefined, (d: ViewBox, args) => d.InvalidateMeasure());
        static StretchDirectionProperty = DependencyProperty.Register("StretchDirection", () => new Enum(StretchDirection), ViewBox, undefined, (d: ViewBox, args) => d.InvalidateMeasure());
        Child: UIElement;
        Stretch: Media.Stretch;
        StretchDirection: StretchDirection;
    }

    module reactions {
        UIReaction<Media.Stretch>(ViewBox.StretchProperty, (updater, ov, nv) => updater.invalidateMeasure());
        UIReaction<StretchDirection>(ViewBox.StretchDirectionProperty, (updater, ov, nv) => updater.invalidateMeasure());
    }
}