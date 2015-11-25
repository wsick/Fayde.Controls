module Fayde.Controls {
    export class QueryConditionItem {
        SelectedGroupingValue: QueryConditionDropDownItem;

        Value: string;
        ConditionType: QueryConditionItemType
        SelectedOption: QueryConditionOption;
        SelectedConditionType: QueryConditionGroupingValue;
        Parent: QueryConditionItem;
        GroupingValue: QueryConditionGroupingValue;
        Children = new Fayde.Collections.ObservableCollection<QueryConditionItem>();
        GroupingFields = new Fayde.Collections.ObservableCollection<QueryConditionDropDownItem>();

        AddCommand: Fayde.MVVM.RelayCommand;
        RemoveCommand: Fayde.MVVM.RelayCommand;

        constructor() {
            this.RemoveCommand = new Fayde.MVVM.RelayCommand(parm => this.HandleRemoveCommand(parm));
            this.AddCommand = new Fayde.MVVM.RelayCommand(parm => this.HandleAddCommand(parm));
        }

        HandleAddCommand(object: any): void {
            var item = object;
            if (item == null) return;

            if (item.ConditionType == QueryConditionItemType.Condition) {
                item.ConditionType = QueryConditionItemType.Group;
                item.SelectedConditionType = QueryConditionGroupingValue.All;
            }
            var newitem = new QueryConditionItem;
            newitem.ConditionType = QueryConditionItemType.Condition,
            newitem.GroupingFields = this.GroupingFields,
            newitem.SelectedOption = QueryConditionOption.Contains,
            newitem.SelectedGroupingValue = this.GroupingFields.GetValueAt(0),
            newitem.SelectedConditionType = QueryConditionGroupingValue.All,
            newitem.Parent = this,
            //     newitem.ConditionItemSelected = ConditionItemSelected;
            item.Children.Add(newitem);
        }

        HandleRemoveCommand(object: any): void {
            if (this.Parent == null) return;
            this.Parent.Children.Remove(this);
        }
    } 
}