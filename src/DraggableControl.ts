module Fayde.Controls {

    export class DraggableControl extends Fayde.Controls.ContentControl {

        constructor() {
            super();
            this.DefaultStyleKey = DraggableControl;
            this.RenderTransform = this._Transform;
        }

        public static MaxZIndex: number = 1;

        PositionChanged = new nullstone.Event<nullstone.IEventArgs>();
        Resized = new nullstone.Event<nullstone.IEventArgs>();        

        private _Transform: Fayde.Media.TranslateTransform = new Fayde.Media.TranslateTransform();

        private _CurrentPoint: Point = null;

        private _SizingDirection: string = "";

        static CanResizeProperty: DependencyProperty = DependencyProperty.Register("CanResize", () => Boolean, DraggableControl, null);

        get CanResize(): boolean {
            return this.GetValue(DraggableControl.CanResizeProperty);
        }
        set CanResize(value: boolean) {
            this.SetValue(DraggableControl.CanResizeProperty, value);
        }

        static OffsetXProperty: DependencyProperty = DependencyProperty.Register("OffsetX", () => Number, DraggableControl, 0, (d, args) => (<DraggableControl>d).OnOffsetXChanged(args.OldValue, args.NewValue));
        static OffsetYProperty: DependencyProperty = DependencyProperty.Register("OffsetY", () => Number, DraggableControl, 0, (d, args) => (<DraggableControl>d).OnOffsetYChanged(args.OldValue, args.NewValue));

        OffsetX: number = 0;
        OffsetY: number = 0;

        private OnOffsetXChanged(oldValue: number, newValue: number) {
            if (oldValue !== newValue) {
                this._Transform.X= newValue;
            }
        }

        private OnOffsetYChanged(oldValue: number, newValue: number) {
            if (oldValue !== newValue) {
                this._Transform.Y = newValue;
            }
        }        

        //#region Touch Event
        OnTouchDown(e: Fayde.Input.TouchEventArgs) {
            super.OnTouchDown(e);
            if (e.Handled) {
                return;
            }
            this.dragStart(e.GetTouchPoint(null).Position);
        }

        OnTouchMove(e: Fayde.Input.TouchEventArgs) {
            super.OnTouchMove(e);
            if (e.Handled) {
                return;
            }
            this.dragMove(e.GetTouchPoint(null).Position);
        }

        OnTouchUp(e: Fayde.Input.TouchEventArgs) {
            super.OnTouchUp(e);
            this.dragEnd();
        }        
        //#endregion

        //#region Mouse Event
        OnMouseLeftButtonDown(e: Fayde.Input.MouseButtonEventArgs) {
            super.OnMouseLeftButtonDown(e);
            if (e.Handled) {
                return;
            }
            this.CaptureMouse();
            this.dragStart(e.GetPosition(null));
        }

        OnMouseLeftButtonUp(e: Fayde.Input.MouseButtonEventArgs) {
            super.OnMouseLeftButtonUp(e);
            this.dragEnd();
            this.ReleaseMouseCapture();
        }

        OnMouseMove(e: Fayde.Input.MouseButtonEventArgs) {
            super.OnMouseMove(e);
            this.dragMove(e.GetPosition(null));
        }
        //#endregion

        //#region private functions
        private dragStart = (pos: Point) => {
            this._CurrentPoint = pos;
            this.Opacity *= 0.8;
            var zIndex = this.GetValue(Fayde.Controls.Canvas.ZIndexProperty);
            if (zIndex > DraggableControl.MaxZIndex) {
                DraggableControl.MaxZIndex = zIndex + 1;
            } else if (zIndex < DraggableControl.MaxZIndex) {
                DraggableControl.MaxZIndex++;
            }
            this.SetValue(Fayde.Controls.Panel.ZIndexProperty, DraggableControl.MaxZIndex);
        }

        private dragMove = (pos: Point) => {
            var newPoint =pos; // absolute position of the mouse
            if (this._CurrentPoint !== null) {
                var change = new Point(newPoint.x - this._CurrentPoint.x, newPoint.y - this._CurrentPoint.y);
                //Make sure the Point is within Application.Current.RootVisual
                var parent = <FrameworkElement>this.VisualParent;
                var p0 = this.TransformToVisual(parent).Transform(new Point(0, 0));
                if (this._SizingDirection === "") {// Moving the Panel
                    if (p0.x + change.x >= 0 &&
                        p0.y + change.x >= 0 &&
                        p0.x + change.x + this.ActualWidth <= parent.ActualWidth &&
                        p0.y + change.y + this.ActualHeight <= parent.ActualHeight) {

                        this.OffsetX += change.x;
                        this.OffsetY += change.y;
                        this.PositionChanged.raise(this, null);
                    }
                } else { // Resize                 
                    if (p0.x + change.x > 0 &&
                        p0.y + change.y > 0 &&
                        p0.x + change.x + this.ActualWidth <= parent.ActualWidth &&
                        p0.y + change.y + this.ActualHeight <= parent.ActualHeight) {

                        if (this._SizingDirection.indexOf("n") > -1 && this.ActualHeight - change.y > 2 &&
                            (this.MaxHeight !== Number.NaN && this.ActualHeight < this.MaxHeight && change.y < 0 ||
                                this.MinHeight !== Number.NaN && this.ActualHeight > this.MinHeight && change.y > 0)) {//North
                            this.OffsetY += change.y;
                            this.Height = this.ActualHeight - change.y;
                            this.PositionChanged.raise(this, null);
                            this.Resized.raise(this, null);
                        }
                        if (this._SizingDirection.indexOf("s") > -1 && this.ActualHeight + change.y > 2 &&
                            (this.MaxHeight !== Number.NaN && this.ActualHeight < this.MaxHeight && change.y > 0 ||
                                this.MinHeight !== Number.NaN && this.ActualHeight > this.MinHeight && change.y < 0)) {//Sorth
                            this.Height = this.ActualHeight + change.y;
                            this.Resized.raise(this, null);
                        }
                        if (this._SizingDirection.indexOf("w") > -1 && this.ActualWidth - change.x > 2 &&
                            (this.MaxWidth !== Number.NaN && this.ActualWidth < this.MaxWidth && change.x < 0 ||
                                this.MinWidth !== Number.NaN && this.ActualWidth > this.MinWidth && change.x > 0)) {//West
                            this.OffsetX += change.x;
                            this.Width = this.ActualWidth - change.x;
                            this.PositionChanged.raise(this, null);
                            this.Resized.raise(this, null);
                        }
                        if (this._SizingDirection.indexOf("e") > -1 && this.ActualWidth + change.x > 2 &&
                            (this.MaxWidth !== Number.NaN && this.ActualWidth < this.MaxWidth && change.x > 0 ||
                                this.MinWidth !== Number.NaN && this.ActualWidth > this.MinWidth && change.x < 0)) {//East
                            this.Width = this.ActualWidth + change.x;
                            this.Resized.raise(this, null);
                        }
                    }
                }
                this._CurrentPoint = newPoint;
            } else {
                // Check to see if mouse is on a resize area
                if (this.CanResize) {
                    this.ResizeHitTest(newPoint);
                    this.SetCursor();
                }
            }
        }

        private dragEnd = () => {           
            if (this._CurrentPoint !== null) {
                this.Opacity = 1;
                this._CurrentPoint = null;
            }
            this._SizingDirection = "";
        }

        private ResizeHitTest = (pt: Point) => {
            var x0 = pt.x;
            var y0 = pt.y;

            var P = this.TransformToVisual(null).Transform(new Point(0, 0));

            var x1 = P.x;
            var y1 = P.y
            var x2 = x1 + this.ActualWidth;
            var y2 = y1 + this.ActualHeight;

            // Corners
            if (Math.abs(x0 - x1) < 6 && Math.abs(y0 - y1) < 6) {
                this._SizingDirection = "nw";
            } else if (Math.abs(x0 - x1) < 6 && Math.abs(y2 - y0) < 6) {
                this._SizingDirection = "sw";
            } else if (Math.abs(x2 - x0) < 6 && Math.abs(y2 - y0) < 6) {
                this._SizingDirection = "se";
            } else if (Math.abs(x2 - x0) < 6 && Math.abs(y0 - y1) < 6) {
                this._SizingDirection = "ne";
                // Sides
            } else if (Math.abs(y0 - y1) < 4) {
                this._SizingDirection = "n";
            } else if (Math.abs(x2 - x0) < 4) {
                this._SizingDirection = "e";
            } else if (Math.abs(y2 - y0) < 4) {
                this._SizingDirection = "s";
            } else if (Math.abs(x0 - x1) < 4) {
                this._SizingDirection = "w";
            } else {
                this._SizingDirection = "";
            }
        }

        private SetCursor = () => {
            if (this._SizingDirection === "n" || this._SizingDirection === "s") {
                this.Cursor = Fayde.CursorType.SizeNS;
            } else if (this._SizingDirection === "w" || this._SizingDirection === "e") {
                this.Cursor = Fayde.CursorType.SizeWE;
            } else {
                this.Cursor = Fayde.CursorType.Default;
            }
        }
        //#endregion
    }
}