/// <reference path="Models/QueryConditionDropDownItem.ts" />
/// <reference path="Models/QueryConditionItem.ts" />

module Fayde.Controls {
    import Control = Fayde.Controls.Control;     

    // Defines a datepicker in the format of windows phone pickers (Touch friendly)
    export class QueryConditionBuilder extends Control {
        private PartTree: string = "PART_Tree";
        private PartSearchButton: string = "PART_SearchButton";
        private TreeView: Fayde.Controls.TreeView;
        private SearchButton: Fayde.Controls.Button;

        Command: Fayde.MVVM.RelayCommand;
        query: string;
        static CommandProperty = DependencyProperty.Register("Command", () => Fayde.Input.ICommand_, QueryConditionBuilder, undefined);

        Conditions: Fayde.Collections.ObservableCollection<Fayde.Controls.QueryConditionItem>;
        static ConditionsProperty = DependencyProperty.Register("Conditions", () => Fayde.Collections.ObservableCollection , QueryConditionBuilder, undefined);

        SearchClick = new nullstone.Event<nullstone.IEventArgs>();

        private _TreeView: Fayde.Controls.TreeView = new Fayde.Controls.TreeView();
        private _SearchButton: Fayde.Controls.Button = new Fayde.Controls.Button();


        constructor()
        {
            super();
            this.DefaultStyleKey = QueryConditionBuilder;
        }

        OnApplyTemplate() {
            super.OnApplyTemplate();
            this._TreeView = <Fayde.Controls.TreeView>this.GetTemplateChild("PART_Tree", Fayde.Controls.TreeView);
            this._SearchButton = <Fayde.Controls.Button>this.GetTemplateChild("PART_SearchButton", Fayde.Controls.Button);            

            if (this._TreeView == null || this._SearchButton == null) return;
            this._TreeView.ItemsSource = this.Conditions;            
            this.Command = new Fayde.MVVM.RelayCommand(parm => this.HandleCommandChanged(parm));
            this._SearchButton.Command = this.Command;
           
        }
        HandleCommandChanged(object: Object): void
        {
            var query = this.BuildQuery();
            this.SearchClick.raise(query, null);
        }

        BuildQuery(): string {
             this.query = "";

            var FirstconditionRecord = this.Conditions.GetValueAt(0);
            this.RecursiveBuildQuery(FirstconditionRecord, this , "");

            return this.query;
        }

        RecursiveBuildQuery(condition: Fayde.Controls.QueryConditionItem, obj: any, func: string, isFirst: boolean = false): void {


            switch (condition.ConditionType) {
                case QueryConditionItemType.Condition:
                    obj.query += isFirst ? "" : func;
                    obj.query += " " + condition.SelectedGroupingValue.Description + " ";
                    obj.query += this.DecodeOption(condition.SelectedOption);
                    //obj.query += condition.SelectedOption == QueryConditionOption.Ends_With || condition.SelectedOption == QueryConditionOption.Contains ? "%" : "";
                    obj.query += condition.SelectedOption.toString() == "Ends_With" || condition.SelectedOption.toString() == "Contains" ? "'%" : "";
                    obj.query += condition.Value;
                    obj.query += condition.SelectedOption.toString() == "Starts_With" || condition.SelectedOption.toString() == "Contains" ? "%'" : "";
                    break;
                case QueryConditionItemType.Group:
                    if (this.IsNullOrWhiteSpace(obj.query))
                        obj.query += "WHERE ";
                    else {
                        var LastChar = obj.query.toString().substr(obj.query.toString().Count - 1, obj.query.toString().Count);
                        if (LastChar != "(")
                            obj.query = obj.query.replace("{0}", func);
                           //obj.query += (condition.SelectedGroupingValue.Description), func);
                    }
                    break;                
            }
            if (condition.Children.Count == 0) return;
            var first = true;
            obj.query += " (";
            for (var i = 0; i < condition.Children.Count; i++)
            {
                var child = condition.Children.GetValueAt(i);
                this.RecursiveBuildQuery(child, this, condition.SelectedConditionType == QueryConditionGroupingValue.Any ? " OR " : " AND ", first);
                first = false;
            }
            obj.query += ")";
        }


        DecodeOption(selectedOption: QueryConditionOption): string {
            return this.DecodeOption1(selectedOption.toString());
        }
        DecodeOption1(selectedOption: string): string {

        
        var res = "";

        switch (selectedOption) {
            case "Contains" :
            case "Starts_With" :
            case "Ends_With" :
                res = "like ";
                break;

            case "Equals" :
                res = "=";
                break;

            case "Greater_Or_Equal" :
                res = ">=";
                break;

            case "Greater_Than" :
                res = ">";
                break;

            case "Less_Than" :
                res = "<";
                break;

            case "Less_Than_Or_Equal" :
                res = "<=";
                break;
        }

        return res;
    }        

        IsNullOrWhiteSpace(chkString: any): boolean {
            if (chkString == undefined) return true;
            if (chkString == null) return true;
            if (chkString.trim() == "") return true;

            return false;
        }

    }

    Fayde.Controls.TemplateParts(QueryConditionBuilder, { Name: "PART_Tree", Type: Fayde.Controls.TreeView });
    Fayde.Controls.TemplateParts(QueryConditionBuilder, { Name: "PART_SearchButton", Type: Fayde.Controls.Button });

    export enum QueryConditionOption {
        Contains,
        Equals,
        Starts_With,
        Ends_With,
        Greater_Than,
        Less_Than,
        Greater_Or_Equal,
        Less_Than_Or_Equal
    }

    export  enum QueryConditionItemType {
        Group,
        Condition
     }

    export enum QueryConditionGroupingValue {
         Any, // or
         All  // and
     }
}