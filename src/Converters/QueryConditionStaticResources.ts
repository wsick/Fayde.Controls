
class QueryConditionStaticResources {

    QueryConditionGroupingValues= new Array<Fayde.Controls.QueryConditionGroupingValue>();
    QueryConditionOptions = new Array<Fayde.Controls.QueryConditionOption>();
    SelectedConditionType: Fayde.Controls.QueryConditionGroupingValue;
    constructor() {
        this.QueryConditionGroupingValues.push(Fayde.Controls.QueryConditionGroupingValue.All);
        this.QueryConditionGroupingValues.push(Fayde.Controls.QueryConditionGroupingValue.Any);
        
        this.QueryConditionOptions.push(Fayde.Controls.QueryConditionOption.Contains);
        this.QueryConditionOptions.push(Fayde.Controls.QueryConditionOption.Ends_With);
        this.QueryConditionOptions.push(Fayde.Controls.QueryConditionOption.Equals);
        this.QueryConditionOptions.push(Fayde.Controls.QueryConditionOption.Starts_With);
        this.QueryConditionOptions.push(Fayde.Controls.QueryConditionOption.Greater_Or_Equal);
        this.QueryConditionOptions.push(Fayde.Controls.QueryConditionOption.Greater_Than);
        this.QueryConditionOptions.push(Fayde.Controls.QueryConditionOption.Less_Than);
        this.QueryConditionOptions.push(Fayde.Controls.QueryConditionOption.Less_Than_Or_Equal);
    }

}

//export = QueryConditionStaticResources;