module Fayde.Controls {
    export class FlowLayout extends Fayde.Controls.Panel {
        CreateLayoutUpdater() {            
            return new flowlayout.FlowLayoutUpdater();                            
        }     
               
        static OrientationProperty = DependencyProperty.Register("Orientation", () => new Enum(Orientation), FlowLayout, Orientation.Horizontal);
        static ItemWidthProperty = DependencyProperty.Register("ItemWidth", () => Number, FlowLayout, NaN);
        static ItemHeightProperty = DependencyProperty.Register("ItemHeight",() => Number, FlowLayout, NaN);        

        Orientation: Fayde.Orientation;
        ItemWidth: number;
        ItemHeight: number;                     
    }

    module reactions {
        UIReaction<Orientation>(FlowLayout.OrientationProperty, (upd, ov, nv) => upd.invalidateMeasure(), false);
        UIReaction<number>(FlowLayout.ItemWidthProperty, (upd, ov, nv) => upd.invalidateMeasure(), false);
        UIReaction<number>(FlowLayout.ItemHeightProperty,(upd, ov, nv) => upd.invalidateMeasure(), false);                            
    }
}
