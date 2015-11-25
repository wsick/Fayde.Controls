module Fayde.Controls
{
    import Control = Controls.Control;
    import ComboBox = Controls.ComboBox;
    import ObservableCollection = Collections.ObservableCollection;

    // Defines a datepicker in the format of windows phone pickers (Touch friendly)
    export class WindowsDatePicker extends Control
    {
        static SelectedMonthProperty = DependencyProperty.Register("SelectedMonth", () => Number, WindowsDatePicker, DateTime.Now.Month, (d, args) => (<WindowsDatePicker>d).OnSelectedMonthChanged(args));
        static SelectedDayProperty = DependencyProperty.Register("SelectedDay", () => Number, WindowsDatePicker, DateTime.Now.Day, (d, args) => (<WindowsDatePicker>d).OnSelectedDayChanged(args));
        static SelectedYearProperty = DependencyProperty.Register("SelectedYear", () => Number, WindowsDatePicker, DateTime.Now.Year, (d, args) => (<WindowsDatePicker>d).OnSelectedYearChanged(args));
        static SelectedDateProperty = DependencyProperty.Register("SelectedDate", () => DateTime, WindowsDatePicker, DateTime.Now, (d, args) => (<WindowsDatePicker>d).OnSelectedDateChanged(args));
        static StartDateProperty = DependencyProperty.Register("StartDate", () => DateTime, WindowsDatePicker, new DateTime(1940, 1, 1), (d, args) => (<WindowsDatePicker>d).OnStartDateChanged(args));
        static EndDateProperty = DependencyProperty.Register("EndDate", () => DateTime, WindowsDatePicker, DateTime.Now.AddYears(20), (d, args) => (<WindowsDatePicker>d).OnStartDateChanged(args));

        StartDate: DateTime;
        EndDate: DateTime;
        SelectedMonth: number;
        SelectedDay: number;
        SelectedYear: number;
        SelectedDate: DateTime;

        OnStartDateChanged(args: IDependencyPropertyChangedEventArgs)
        {
            this._Initializing = true;
            this._SetupMonths();
            this._SetupYears();
            this._SetupDays();
            this._Initializing = false;
        }

        OnSelectedMonthChanged(args: IDependencyPropertyChangedEventArgs)
        {
            this._CoerceMonth(args.NewValue);
            this._CoerceDate();
        }

        OnSelectedDayChanged(args: IDependencyPropertyChangedEventArgs)
        {
            this._Updating = true;
            this._CoerceDay(args.NewValue);
            this._CoerceDate();
            this._Updating = false;
        }

        OnSelectedYearChanged(args: IDependencyPropertyChangedEventArgs)
        {
            this._CoerceYear(args.NewValue);
            this._CoerceDate();
        }

        OnSelectedDateChanged(args: IDependencyPropertyChangedEventArgs)
        {
            if (this._Updating) return;

            var dt = <DateTime>args.NewValue;
            if (dt instanceof DateTime) 
            {
                this._CoerceMonth(dt.Month);
                this._CoerceDay(dt.Day);
                this._CoerceYear(dt.Year);
            }
            else
            {
                this._CoerceMonth(NaN);
                this._CoerceDay(NaN);
                this._CoerceYear(NaN);
            }

            this._UpdateSelection();
        }

        private _MonthComboBox: ComboBox = null;
        private _DayComboBox: ComboBox = null;
        private _YearComboBox: ComboBox = null;

        private _MonthGesture = new Controls.Internal.EventGesture<ComboBox>();
        private _DayGesture = new Controls.Internal.EventGesture<ComboBox>();
        private _YearGesture = new Controls.Internal.EventGesture<ComboBox>();

        private _Initializing: boolean = true;
        private _Updating: boolean = false;

        /// Instantiates a new datepicker instance
        constructor() 
        {
            super();
            this.DefaultStyleKey = WindowsDatePicker;
        }

        OnApplyTemplate()
        {
            super.OnApplyTemplate();
            
            this._MonthGesture.Detach();
            this._MonthComboBox = <ComboBox>this.GetTemplateChild("PART_Month", ComboBox);
            if (this._MonthComboBox)
                this._MonthGesture.Attach(this._MonthComboBox.SelectionChanged,(cb) => this._CoerceMonth(this._GetDisplayItem(cb.SelectedItem)));

            this._DayGesture.Detach();
            this._DayComboBox = <ComboBox>this.GetTemplateChild("PART_Day", ComboBox);
            if (this._DayComboBox)
                this._DayGesture.Attach(this._DayComboBox.SelectionChanged,(cb) => this._CoerceDay(this._GetDisplayItem(cb.SelectedItem)));

            this._YearGesture.Detach();
            this._YearComboBox = <ComboBox>this.GetTemplateChild("PART_Year", ComboBox);
            if (this._YearComboBox) 
            {
                this._YearGesture.Attach(this._YearComboBox.SelectionChanged,(cb) => this._CoerceYear(this._GetDisplayItem(cb.SelectedItem)));
            }

            this._Initializing = true;
            this._SetupMonths();
            this._SetupYears();
            this._SetupDays();
            this._Initializing = false;

            this._UpdateSelection();
        }      

        private _CoerceMonth(month: any)
        {
            month = Math.max(1, Math.min(12, month));
            if (isNaN(month)) return;
            this.SetCurrentValue(WindowsDatePicker.SelectedMonthProperty, month);
            if (this._Initializing || this._Updating) return;
            this._SetupDays();
            this._UpdateSelection();
        }

        private _CoerceDay(day: any)
        {
            day = Math.max(1, Math.min(31, parseFloat(day)));
            if (isNaN(day)) return;
            this.SetCurrentValue(WindowsDatePicker.SelectedDayProperty, day);
        }

        private _CoerceYear(year: any)
        {
            var maxYear = DateTime.MaxValue.Year - 1;
            year = Math.min(maxYear, Math.max(0, year));

            if (isNaN(year)) return;
            this.SetCurrentValue(WindowsDatePicker.SelectedYearProperty, year);
            if (this._Initializing || this._Updating) return;
            this._SetupDays();
            this._UpdateSelection();
        }

        private _CoerceDate()
        {
            var m = this.SelectedMonth;
            var d = this.SelectedDay;
            var y = this.SelectedYear;

            if (isNaN(m) || isNaN(d) || isNaN(y))
                return;
            var dte = new DateTime(y, m, d);
            if (DateTime.Compare(dte, this.SelectedDate) === 0)
                return;

            this.SetCurrentValue(WindowsDatePicker.SelectedDateProperty, dte);
        }

        /// Setup the list of days
        private _SetupDays()
        {
            var daysCtr = calculateDaysInMonth(this.SelectedMonth, this.SelectedYear);
            var days = new ObservableCollection<String>();

            for (var d = 1; d <= daysCtr; d++)
            {
                var date = new DateTime(this.SelectedYear, this.SelectedMonth, d);
                days.Add(StringEx.Format("{0}:{1}", Localization.Format("{0:d2}", d), date.toString("dddd")));
            }
            this._DayComboBox.ItemsSource = days;
        }

        private _SetupMonths()
        {
            var months = new ObservableCollection<string>();
            for (var m = 1; m <= 12; m++) 
            {
                var date = new DateTime(this.SelectedYear, m, 1);
                months.Add(StringEx.Format("{0}:{1}", Localization.Format("{0:d2}", m), date.toString("MMMM")));
            }
            this._MonthComboBox.ItemsSource = months;
        }

        private _SetupYears()
        {
            var years = new ObservableCollection<string>();
            for (var y = this.StartDate.Year; y <= this.EndDate.Year; y++)
            {
                years.Add(Localization.Format("{0:d2}", y) + ": ");
            }
            this._YearComboBox.ItemsSource = years;
        }

        private _UpdateSelection()
        {
            if (this._DayComboBox === null ||
                this._MonthComboBox === null ||
                this._YearComboBox === null) return;

            this._Updating = true;
            this._DayComboBox.SelectedIndex = this._GetIndex(this.SelectedDay, this._DayComboBox.ItemsSource.getEnumerator());
            this._MonthComboBox.SelectedIndex = this._GetIndex(this.SelectedMonth, this._MonthComboBox.ItemsSource.getEnumerator());
            this._YearComboBox.SelectedIndex = this._GetIndex(this.SelectedYear, this._YearComboBox.ItemsSource.getEnumerator());
            this._Updating = false;
        }

        private _GetDisplayItem(item: string): any
        {
            if (item === null ||
                item === undefined) return NaN;
            var split = item.split(":");
            if (split === null ||
                split === undefined) return NaN;
            return split[0];
        }

        private _GetIndex(value: number, num: nullstone.IEnumerator<string>): number
        {
            var ctr = 0;
            while (num.moveNext())
            {
                var val = parseInt(this._GetDisplayItem(num.current.toString()));
                if (!isNaN(val))
                {
                    if (val === value)
                        return ctr;
                }
                ctr++;
            }

            return -1;
        }
    }

    Fayde.Controls.TemplateParts(WindowsDatePicker,
        { Name: "PART_Day", Type: ComboBox },
        { Name: "PART_Month", Type: ComboBox },
        { Name: "PART_Year", Type: ComboBox });

    function calculateDaysInMonth(month: number, year: number): number
    {
        return new Date(year, month, 0).getDate();
    }
}