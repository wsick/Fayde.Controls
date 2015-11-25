module Fayde.Controls
{
    export class DateSplitConverter implements Fayde.Data.IValueConverter
    {
        Convert(value: any, targetType: IType, parameter: any, culture: any): any
        {
            if (!value) return undefined;
            var items = value.split(':');
            return items[parameter];
        }

        ConvertBack(value: any, targetType: IType, parameter: any, culture: any): any
        {
            return value;
        }
    }
}