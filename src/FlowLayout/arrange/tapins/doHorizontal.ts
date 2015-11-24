module Fayde.Controls.flowlayout.arrange.tapins {
    import Size = minerva.Size;
    import Rect = minerva.Rect;

    export function doHorizontal (input: IInput, state: IState, output: IOutput, tree: minerva.core.IUpdaterTree, finalRect: Rect): boolean {
        if (input.orientation !== Orientation.Horizontal)
            return true;

        var fs = state.finalSize;
        var as = state.arrangedSize;
        var fullHeight = tree.surface.height;
        Size.copyTo(fs, as);

        var cr = state.childRect;
        cr.x = cr.y = cr.width = cr.height = 0;

        var finalWidth = 0;
        var colWidth = 0;
        var rowHeight = 0;
        var multiple = 0;
        for (var walker = tree.walk(); walker.step();) {
            var child = walker.current;
            var childDesired = child.assets.desiredSize;
            var fullcolWidth = 320;     
            //Code added by Deepak
            if (fullcolWidth * (multiple + 1) < (cr.x + childDesired.width)) {  // needs to start another row
                if ((fullHeight - childDesired.height - 100) < (cr.y + childDesired.height)) {
                //if ((state.finalRect.height - 128) < (cr.y + childDesired.height)) {
                    multiple++;
                    cr.y = 0;
                    colWidth = 0;
                }
                else
                    cr.y += rowHeight; 
                
                cr.x = fullcolWidth * multiple;                
                rowHeight = 0;  //reset row spacing
            }
            rowHeight = Math.max(rowHeight, childDesired.height);
            colWidth = Math.max(colWidth, childDesired.width);

            Size.copyTo(childDesired, cr);
            child.arrange(cr);
            cr.x += childDesired.width;
            finalWidth = cr.x;
        }
        as.width = Math.max(as.width, fs.width);        
        as.height = Math.max(as.height, fs.height);   
        //state.arrangedSize.width = finalWidth;

        return true;
    }
}