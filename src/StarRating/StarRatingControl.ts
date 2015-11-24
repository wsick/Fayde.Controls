module Fayde.Controls {
    import Control = Fayde.Controls.Control;
    import GridUnitType = minerva.controls.grid.GridUnitType;

    // Defines a datepicker in the format of windows phone pickers (Touch friendly)
    export class StarRatingControl extends Control {
        private stars = new Array<Star>();
        private isHovering: boolean = false;
        private LayoutRootStarList: Fayde.Controls.Grid;

        //NumberOfStarsProperty
        static NumberOfStarsProperty = DependencyProperty.Register("NumberOfStars",() => Number, StarRatingControl, 5,(d, args) => (<StarRatingControl>d).OnNumberOfStarsChanged(args));
        NumberOfStars: number;

        OnNumberOfStarsChanged(e: DependencyPropertyChangedEventArgs) {
            this.CreateStars();
            this.RefreshStarRating();
        }       

        //RatingProperty
        static RatingProperty = DependencyProperty.Register("Rating",() => Number, StarRatingControl, 0,(d, args) => (<StarRatingControl>d).OnRatingChanged(args));
        Rating: number;

        OnRatingChanged(e: DependencyPropertyChangedEventArgs) {
            this.DrawUnhovered();
        }

        //HoverRatingProperty
        static HoverRatingProperty = DependencyProperty.Register("HoverRating",() => Number, StarRatingControl, 0,(d, args) => (<StarRatingControl>d).OnHoverRatingChanged(args));
        HoverRating: number;

        OnHoverRatingChanged(e: DependencyPropertyChangedEventArgs) {
            this.RefreshStarRating();
        }

        //StarFillBrushProperty
        static StarFillBrushProperty = DependencyProperty.Register("StarFillBrush",() => Fayde.Media.Brush, StarRatingControl,(new Fayde.Media.SolidColorBrush(Color.FromRgba(0xFF, 0xFF, 0, 0xFF))),(d, args) => (<StarRatingControl>d).StarFillBrushChanged(args));
        StarFillBrush: Fayde.Media.Brush;

        StarFillBrushChanged(e: DependencyPropertyChangedEventArgs) {
            this.RefreshStarRating();
        }

        //UnselectedStarFillBrushProperty
        static UnselectedStarFillBrushProperty = DependencyProperty.Register("UnselectedStarFillBrush",() => Fayde.Media.Brush, StarRatingControl, null,(d, args) => (<StarRatingControl>d).UnselectedStarFillBrushChanged(args));
        UnselectedStarFillBrush: Fayde.Media.Brush;

        UnselectedStarFillBrushChanged(e: DependencyPropertyChangedEventArgs) {
            this.RefreshStarRating();
        }

        //StarOutlineBrushProperty
        static StarOutlineBrushProperty = DependencyProperty.Register("StarOutlineBrush",() => Fayde.Media.Brush, StarRatingControl,(new Fayde.Media.SolidColorBrush(Color.FromRgba(0xC0, 0xC0, 0, 0xFF))),(d, args) => (<StarRatingControl>d).StarOutlineBrushChanged(args));
        StarOutlineBrush: Fayde.Media.Brush;

        StarOutlineBrushChanged(e: DependencyPropertyChangedEventArgs) {
            this.RefreshStarRating();
        }

        //HoverFillBrushProperty
        static HoverFillBrushProperty = DependencyProperty.Register("HoverFillBrush",() => Fayde.Media.Brush, StarRatingControl,(new Fayde.Media.SolidColorBrush(Color.FromRgba(0xF0, 0xF0, 0x80, 0xFF))),(d, args) => (<StarRatingControl>d).HoverFillBrushChanged(args));
        HoverFillBrush: Fayde.Media.Brush;

        HoverFillBrushChanged(e: DependencyPropertyChangedEventArgs) {
            this.RefreshStarRating();
        }

        //UnselectedHoverFillBrushProperty
        static UnselectedHoverFillBrushProperty = DependencyProperty.Register("UnselectedHoverFillBrush",() => Fayde.Media.Brush, StarRatingControl, null,(d, args) => (<StarRatingControl>d).UnselectedHoverFillBrushChanged(args));
        UnselectedHoverFillBrush: Fayde.Media.Brush;

        UnselectedHoverFillBrushChanged(e: DependencyPropertyChangedEventArgs) {
            this.RefreshStarRating();
        }

        //HoverOutlineBrushProperty
        static HoverOutlineBrushProperty = DependencyProperty.Register("HoverOutlineBrush",() => Fayde.Media.Brush, StarRatingControl,(new Fayde.Media.SolidColorBrush(Color.FromRgba(0xA0, 0xA0, 0x00, 0xFF))),(d, args) => (<StarRatingControl>d).HoverOutlineBrushChanged(args));
        HoverOutlineBrush: Fayde.Media.Brush;

        HoverOutlineBrushChanged(e: DependencyPropertyChangedEventArgs) {
            this.RefreshStarRating();
        }

        //StrokeThicknessProperty
        static StrokeThicknessProperty = DependencyProperty.Register("StrokeThickness",() => Number, StarRatingControl, 2.0);
        StrokeThickness: number;

        //StrokeLineJoinProperty
        static StrokeLineJoinProperty = DependencyProperty.Register("StrokeLineJoin",() => Fayde.Shapes.PenLineJoin, StarRatingControl, Fayde.Shapes.PenLineJoin.Round);
        StrokeLineJoin: Fayde.Shapes.PenLineJoin;

        
        /// Instantiates a new datepicker instance
        constructor() {
            super();
            this.DefaultStyleKey = StarRatingControl;
        }
        OnApplyTemplate() {
            super.OnApplyTemplate();
            this.LayoutRootStarList = <Fayde.Controls.Grid>this.GetTemplateChild("LayoutRootStarList", Fayde.Controls.Grid);
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
                this.Rating = this.GetRatingFromPosition(e.GetPosition(this.LayoutRootStarList));
            }
        }
        private HandleMouseOver(mousePos: Point): void {
            if (this.IsEnabled) // no hover ratings if not enabled
            {
                this.IsHovering = this.IsInBounds(mousePos);
                if (this.IsHovering) {
                    this.HoverRating = this.GetRatingFromPosition(mousePos);
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
            else
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

        private get IsHovering(): boolean { return this.isHovering; }
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
            }
            else {
                this.DrawUnhovered();
            }
        }
        private DrawUnhovered(): void {
            this.DrawStarRating(this.Rating, this.StarFillBrush, this.StarOutlineBrush, this.UnselectedStarFillBrush);
        }
        private DrawStarRating(value: number, fillBrush: Fayde.Media.Brush, outlineBrush: Fayde.Media.Brush, unselectedBrush: Fayde.Media.Brush): void {
            for (var star = 0; star < this.NumberOfStars; star++) {
                if (this.stars[star] != undefined) {
                    if (value >= (star + 1) * 2) {
                        this.stars[star].StarFillBrush = fillBrush;
                        this.stars[star].HalfFillBrush = null;
                    }
                    else if (value >= 1 + star * 2) {
                        this.stars[star].StarFillBrush = unselectedBrush;
                        this.stars[star].HalfFillBrush = fillBrush;
                    }
                    else {
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

    Fayde.Controls.TemplateParts(StarRatingControl,
        { Name: "LayoutRootStarList", Type: Fayde.Controls.Grid }
        );
}