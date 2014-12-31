module Fayde.Controls {
    export class ValidationSummary extends Control {
        static ShowErrorsInSummaryProperty = DependencyProperty.RegisterAttached("ShowErrorsInSummary", () => Boolean, ValidationSummary, true);
        static ErrorStyleProperty = DependencyProperty.Register("ErrorStyle", () => Style, ValidationSummary);
        static FilterProperty = DependencyProperty.Register("Filter", () => new Enum(ValidationSummaryFilters), ValidationSummary, ValidationSummaryFilters.All);
        static FocusControlsOnClickProperty = DependencyProperty.Register("FocusControlsOnClick", () => Boolean, ValidationSummary, true);
        static HasErrorsProperty = DependencyProperty.Register("HasErrors", () => Boolean, ValidationSummary, false);
        static HasDisplayedErrorsProperty = DependencyProperty.Register("HasDisplayedErrors", () => Boolean, ValidationSummary, false);
        static HeaderProperty = DependencyProperty.Register("Header", () => Object, ValidationSummary);
        static HeaderTemplateProperty = DependencyProperty.Register("HeaderTemplate", () => DataTemplate, ValidationSummary);
        static SummaryListBoxStyleProperty = DependencyProperty.Register("SummaryListBoxStyle", () => Style, ValidationSummary);
        static TargetProperty = DependencyProperty.Register("Target", () => UIElement, ValidationSummary);

        ShowErrorsInSummary: boolean;
        ErrorStyle: Style;
        Filter: ValidationSummaryFilters;
        FocusControlsOnClick: boolean;
        HasErrors: boolean;
        HasDisplayedErrors: boolean;
        Header: any;
        HeaderTemplate: DataTemplate;
        SummaryListBoxStyle: Style;
        Target: UIElement;


    }
    TemplateVisualStates(ValidationSummary,
        {GroupName: "CommonStates", Name: "Normal"},
        {GroupName: "CommonStates", Name: "Disabled"},
        {GroupName: "ValidationStates", Name: "HasErrors"},
        {GroupName: "ValidationStates", Name: "Empty"});
    TemplateParts(ValidationSummary,
        {Name: "SummaryListBox", Type: ListBox});
}