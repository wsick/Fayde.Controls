module Fayde.Controls {
    import Control = Fayde.Controls.Control;
    import Grid = Fayde.Controls.Grid;
    import GridUnitType = minerva.controls.grid.GridUnitType;
    import Brush = Fayde.Media.Brush;

    export class StarRating extends Control {
        static NumberOfStarsProperty = DependencyProperty.Register("NumberOfStars", () => Number, StarRating, 5, (d: StarRating, args) => d.OnNumberOfStarsChanged(args));
        static RatingProperty = DependencyProperty.Register("Rating", () => Number, StarRating, 0, (d: StarRating, args) => d.OnRatingChanged(args));
        static HoverRatingProperty = DependencyProperty.Register("HoverRating", () => Number, StarRating, 0, (d: StarRating, args) => d.RefreshStarRating());
        static StarFillBrushProperty = DependencyProperty.Register("StarFillBrush", () => Brush, StarRating, undefined, (d: StarRating, args) => d.RefreshStarRating());
        static UnselectedStarFillBrushProperty = DependencyProperty.Register("UnselectedStarFillBrush", () => Brush, StarRating, undefined, (d: StarRating, args) => d.RefreshStarRating());
        static StarOutlineBrushProperty = DependencyProperty.Register("StarOutlineBrush", () => Brush, StarRating, undefined, (d: StarRating, args) => d.RefreshStarRating());
        static HoverFillBrushProperty = DependencyProperty.Register("HoverFillBrush", () => Brush, StarRating, undefined, (d: StarRating, args) => d.RefreshStarRating());
        static UnselectedHoverFillBrushProperty = DependencyProperty.Register("UnselectedHoverFillBrush", () => Brush, StarRating, undefined, (d: StarRating, args) => d.RefreshStarRating());
        static HoverOutlineBrushProperty = DependencyProperty.Register("HoverOutlineBrush", () => Brush, StarRating, undefined, (d: StarRating, args) => d.RefreshStarRating());
        static StrokeThicknessProperty = DependencyProperty.Register("StrokeThickness", () => Number, StarRating, 2.0);
        static StrokeLineJoinProperty = DependencyProperty.Register("StrokeLineJoin", () => Fayde.Shapes.PenLineJoin, StarRating, Fayde.Shapes.PenLineJoin.Round);
        NumberOfStars: number;
        Rating: number;
        HoverRating: number;
        StarFillBrush: Brush;
        UnselectedStarFillBrush: Brush;
        StarOutlineBrush: Brush;
        HoverFillBrush: Brush;
        UnselectedHoverFillBrush: Brush;
        HoverOutlineBrush: Brush;
        StrokeThickness: number;
        StrokeLineJoin: Fayde.Shapes.PenLineJoin;

        OnNumberOfStarsChanged(e: DependencyPropertyChangedEventArgs) {
            this.CreateStars();
            this.RefreshStarRating();
        }

        OnRatingChanged(e: DependencyPropertyChangedEventArgs) {
            this.DrawUnhovered();
        }

        private stars: Star[] = [];
        private isHovering: boolean = false;
        private LayoutRootStarList: Grid;

        constructor() {
            super();
            this.DefaultStyleKey = StarRating;
        }

        OnApplyTemplate() {
            super.OnApplyTemplate();
            this.LayoutRootStarList = <Grid>this.GetTemplateChild("LayoutRootStarList", Grid);
            this.CreateStars();
        }

        OnMouseEnter(e: Fayde.Input.MouseEventArgs) {
            super.OnMouseEnter(e);
            var mousePos = e.GetPosition(this.LayoutRootStarList);
            this.HandleMouseOver(mousePos);
        }

        OnMouseMove(e: Fayde.Input.MouseEventArgs) {
            super.OnMouseMove(e);
            var mousePos = e.GetPosition(this.LayoutRootStarList);
            this.HandleMouseOver(mousePos);
        }

        OnMouseLeave(e: Fayde.Input.MouseEventArgs) {
            super.OnMouseLeave(e);
            this.IsHovering = false;
        }

        OnMouseLeftButtonDown(e: Fayde.Input.MouseEventArgs) {
            super.OnMouseLeftButtonDown(e);
            if (this.IsEnabled) {
                this.SetCurrentValue(StarRating.RatingProperty, this.GetRatingFromPosition(e.GetPosition(this.LayoutRootStarList)));
            }
        }

        private HandleMouseOver(mousePos: Point): void {
            if (this.IsEnabled) { // no hover ratings if not enabled
                this.IsHovering = this.IsInBounds(mousePos);
                if (this.IsHovering) {
                    this.SetCurrentValue(StarRating.HoverRatingProperty, this.GetRatingFromPosition(mousePos));
                }
            }
        }

        private IsInBounds(p: Point): boolean {
            if (this.LayoutRootStarList.ColumnDefinitions.Count > 0) {
                var maxX = this.LayoutRootStarList.ColumnDefinitions.GetValueAt(0).ActualWidth * this.NumberOfStars;
                var maxY = this.LayoutRootStarList.ColumnDefinitions.GetValueAt(0).ActualWidth; // actual height of a star doesn't give us the right thing
                return (p.y >= 0) &&
                    (p.y < maxY) &&
                    (p.x >= 0) &&
                    (p.x < maxX);
            }
            return false;
        }

        private GetRatingFromPosition(mousePos: Point): number {
            var maxRating = this.NumberOfStars * 2;

            var starRatingWidth = this.LayoutRootStarList.ColumnDefinitions.GetValueAt(0).ActualWidth * this.NumberOfStars;
            var percent = mousePos.x / starRatingWidth;
            var value = 0.75 + (percent * maxRating);
            var rating = parseInt(value.toString());
            if (rating < 0) rating = 0;
            if (rating > maxRating) rating = maxRating;
            return rating;
        }

        private get IsHovering(): boolean {
            return this.isHovering;
        }

        private set IsHovering(value: boolean) {
            if (this.isHovering != value) {
                this.isHovering = value;
                if (!this.isHovering) {
                    this.DrawUnhovered();
                }
            }
        }

        CreateStars(): void {
            if (this.LayoutRootStarList != undefined) {
                this.stars = new Array<Star>();
                this.LayoutRootStarList.ColumnDefinitions.Clear();
                this.LayoutRootStarList.Children.Clear();

                for (var column = 0; column < this.NumberOfStars; column++) {
                    var cd = new Fayde.Controls.ColumnDefinition();
                    cd.Width = new Fayde.Controls.GridLength(34, GridUnitType.Star); // GridLength.Auto;                
                    this.LayoutRootStarList.ColumnDefinitions.Add(cd);

                    var star = new Star();
                    star.StarFillBrush = this.StarFillBrush;
                    star.Foreground = this.StarOutlineBrush;
                    star.SetValue(Fayde.Controls.Grid.ColumnProperty, column);

                    var strokeThicknessBinding = new Fayde.Data.Binding();
                    strokeThicknessBinding.ElementName = "LayoutRootStarList";
                    strokeThicknessBinding.Path = new Fayde.Data.PropertyPath("Parent.StrokeThickness");
                    star.SetBinding(Star.StrokeThicknessProperty, strokeThicknessBinding);
                    star.StrokeThickness = this.StrokeThickness;

                    var lineJoinBinding = new Fayde.Data.Binding();
                    lineJoinBinding.ElementName = "LayoutRootStarList";
                    lineJoinBinding.Path = new Fayde.Data.PropertyPath("Parent.StrokeLineJoin");
                    star.SetBinding(Star.StrokeLineJoinProperty, lineJoinBinding);
                    star.StrokeLineJoin = this.StrokeLineJoin;

                    this.LayoutRootStarList.Children.Add(star);
                    this.stars.push(star);
                }
                this.RefreshStarRating();
            }
        }

        RefreshStarRating(): void {
            if (this.isHovering) {
                this.DrawStarRating(this.HoverRating, this.HoverFillBrush, this.HoverOutlineBrush, this.UnselectedHoverFillBrush);
            } else {
                this.DrawUnhovered();
            }
        }

        private DrawUnhovered(): void {
            this.DrawStarRating(this.Rating, this.StarFillBrush, this.StarOutlineBrush, this.UnselectedStarFillBrush);
        }

        private DrawStarRating(value: number, fillBrush: Brush, outlineBrush: Brush, unselectedBrush: Brush): void {
            for (var star = 0; star < this.NumberOfStars; star++) {
                if (this.stars[star] != undefined) {
                    if (value >= (star + 1) * 2) {
                        this.stars[star].StarFillBrush = fillBrush;
                        this.stars[star].HalfFillBrush = null;
                    } else if (value >= 1 + star * 2) {
                        this.stars[star].StarFillBrush = unselectedBrush;
                        this.stars[star].HalfFillBrush = fillBrush;
                    } else {
                        this.stars[star].StarFillBrush = unselectedBrush;
                        this.stars[star].HalfFillBrush = null;
                    }
                    this.stars[star].Foreground = outlineBrush;
                    this.stars[star].StrokeThickness = this.StrokeThickness;
                    this.stars[star].StrokeLineJoin = this.StrokeLineJoin;
                }
            }
        }
    }

    Fayde.Controls.TemplateParts(StarRating,
        {Name: "LayoutRootStarList", Type: Fayde.Controls.Grid}
    );
}