module Fayde.Controls.tabpanel.measure.tapins {
    export function doHorizontal (input: IInput, state: IState, output: IOutput, tree: minerva.core.IUpdaterTree, availableSize: minerva.Size): boolean {
        if (input.tabAlignment !== Dock.Top && input.tabAlignment !== Dock.Bottom)
            return true;

        var ds = output.desiredSize;
        ds.width = ds.height = 0;
        output.numRows = 1;
        output.numHeaders = 0;
        output.rowHeight = 0.0;

        var num1 = 0;
        var num2 = 0.0;
        var num3 = 0.0;
        for (var walker = tree.walk(); walker.step();) {
            var child = walker.current;
            if (child.assets.visibility === minerva.Visibility.Collapsed)
                break;
            output.numHeaders++;
            child.measure(state.availableSize);

            var sizeWithoutMargin = helpers.getDesiredSizeWithoutMargin(child);
            if (output.rowHeight < sizeWithoutMargin.height)
                output.rowHeight = sizeWithoutMargin.height;
            if (num2 + sizeWithoutMargin.width > availableSize.width && num1 > 0) {
                if (num3 < num2)
                    num3 = num2;
                num2 = sizeWithoutMargin.width;
                num1 = 1;
                output.numRows++;
            }
            else {
                num2 += sizeWithoutMargin.width;
                num1++;
            }
        }

        if (num3 < num2)
            num3 = num2;
        ds.height = output.rowHeight * output.numRows;
        ds.width = !isFinite(ds.width) || isNaN(ds.width) || num3 < availableSize.width ? num3 : availableSize.width;

        return true;
    }
}