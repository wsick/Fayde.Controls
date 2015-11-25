module Fayde.Controls.flowlayout.measure.tapins {
    import Size = minerva.Size;

    export function doHorizontal(input: IInput, state: IState, output: IOutput, tree: minerva.core.IUpdaterTree, availableSize: Size): boolean {
        if (input.orientation !== Orientation.Horizontal)
            return true;

        var as = state.availableSize;
        var fullHeight = tree.surface.height;
        var fullcolWidth = 320;

        if (!isNaN(input.height))
            as.height = input.height;
        as.height = Math.min(as.height, input.maxHeight);
        
        //if (as.height != Infinity)
        //    fullHeight = as.height;

        var ds = output.desiredSize;
        ds.width = ds.height = 0;
        var colWidth = 0;
        var rowHeight = 0;
        var offsetX = 0;
        var offsetY = 0;
        var multiple = 0;
        for (var walker = tree.walk(); walker.step();) {
            var child = walker.current;
            //TODO: We should coerce width/height before measure
            helpers.coerceChildSize(child, input.itemWidth, input.itemHeight);
            child.measure(as);

            var childDesired = child.assets.desiredSize;
            /*if (as.width < (offsetX + childDesired.width)) {  // needs to start another row                
                offsetY += rowHeight;
                rowHeight = 0;  //reset row height
            }
            rowHeight = Math.max(rowHeight, childDesired.height);

            if (as.height < (offsetY + childDesired.height)) {  // needs to start another col
                offsetX += colWidth;
                colWidth = 0; //reset col spacing
            }
            colWidth = Math.max(colWidth, childDesired.width);*/

            if (fullcolWidth * (multiple + 1) < (offsetX + childDesired.width)) {  // needs to start another row
                if ((fullHeight - childDesired.height - 100) < (offsetY + childDesired.height)) { // needs to start another col
                    multiple++;
                    offsetY = 0;
                    colWidth = 0;
                }
                else
                    offsetY += rowHeight;

                offsetX = fullcolWidth * multiple;
                rowHeight = 0;  //reset row spacing
            }
            rowHeight = Math.max(rowHeight, childDesired.height);
            colWidth = Math.max(colWidth, childDesired.width);

            ds.height = Math.max(ds.height, offsetY + childDesired.height);
            ds.width = Math.max(ds.width, offsetX + childDesired.width);
            offsetX += childDesired.width;
        }

        return true;
    }
}