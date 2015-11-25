module Fayde.Controls {
    import Control = Fayde.Controls.Control;     

    // Defines a datepicker in the format of windows phone pickers (Touch friendly)
    export class Star extends Control {
        static StarFillBrushProperty = DependencyProperty.Register("StarFillBrush",() => Fayde.Media.Brush, Star,(new Fayde.Media.SolidColorBrush(Color.FromRgba(0xFF, 0xFF, 0x80, 0xFF))));
        StarFillBrush: Fayde.Media.Brush;

        static HalfFillBrushProperty = DependencyProperty.Register("HalfFillBrush",() => Fayde.Media.Brush, Star, undefined);
        HalfFillBrush: Fayde.Media.Brush;

        static StrokeThicknessProperty = DependencyProperty.Register("StrokeThickness",() => Number, Star, 2.0);
        StrokeThickness: number;

        static StrokeLineJoinProperty = DependencyProperty.Register("StrokeLineJoin",() => Fayde.Shapes.PenLineJoin, Star, Fayde.Shapes.PenLineJoin.Round);
        StrokeLineJoin: Fayde.Shapes.PenLineJoin;

        private scaleTransform: Fayde.Media.ScaleTransform = new Fayde.Media.ScaleTransform();

        /// Instantiates a new datepicker instance
        constructor() {
            super();
            this.DefaultStyleKey = Star;
            this.SizeChanged.on(this.Star_SizeChanged, this);

        }

        Star_SizeChanged(sender: Object, e: Fayde.SizeChangedEventArgs): void {
            var scaleX = e.NewSize.width / 34;
            var scaleY = e.NewSize.height / 34;
            this.scaleTransform.ScaleX = this.scaleTransform.ScaleY = Math.min(scaleX, scaleY);
        }
        OnApplyTemplate() {
            super.OnApplyTemplate();
            this.scaleTransform = <Fayde.Media.ScaleTransform>this.GetTemplateChild("scaleTransform", Fayde.Media.ScaleTransform);
        }
    }
    Fayde.Controls.TemplateParts(Star, { Name: "scaleTransform", Type: Fayde.Media.ScaleTransform });
}