import { useMemo, useState } from "react";
import createDate from "../../../utils/helpers/date/createDate";
import { createMonth } from "../../../utils/helpers/date/createMonth";
import { createYear } from "../../../utils/helpers/date/createYear";
import { getMonthesNames } from "../../../utils/helpers/date/getMonthesNames";
import { getWeekDaysNames } from "../../../utils/helpers/date/getWeekDaysNames";
import { getMonthNumberOfDays } from "../../../utils/helpers/date/getMonthNumberOfDays";

interface UseCalendarParams {
    locale?: string;
    selectedDate?:Date;
    firstWeekDay: number;
}

const getYearsInterval = (year: number) => {
    const startYear = Math.floor(year / 10) * 10;
    return [...Array(10)].map((_, index) => startYear + index);
}

export const useCalendar = ({firstWeekDay = 2, locale = 'default', selectedDate: date}:UseCalendarParams) => {
    const [mode, setMode] = useState<'days' | 'monthes' | 'years'>('days');
    const [selectedDate, setSelectedDay] = useState(createDate({date}));
    const [selectedMonth, setSelectedMonth] = useState(createMonth({date: new Date(selectedDate.year, selectedDate.monthIndex,), locale}));
    const [selectedYear, setSelectedYear] = useState(selectedDate.year);
    const [selectedYearInterval, setSelectedYearsInterval] = useState(getYearsInterval(selectedDate.year));

    const monthesNames = useMemo(() => getMonthesNames(locale), []);
    const weekDaysNames = useMemo(() => getWeekDaysNames(firstWeekDay = 2, locale), []);
    const days = useMemo(() => selectedMonth.createMonthDays(), [selectedMonth, selectedYear]);
    
    const calendarDays = useMemo(() => {
        const monthNumbersOfDays = getMonthNumberOfDays(selectedMonth.monthIndex, selectedYear)
        const prevMonthDays = createMonth({ date: new Date(selectedYear, selectedMonth.monthIndex - 1), locale}).createMonthDays();
        const nextMonthDays = createMonth({ date: new Date(selectedYear, selectedMonth.monthIndex + 1), locale}).createMonthDays();
        
        const firstDay = days[0];
        const lastDay = days[monthNumbersOfDays - 1];
        const shiftIndex = firstWeekDay - 1;

        const numberOfPrevDays = firstDay.dayNumberInWeek - 1 - shiftIndex < 0 
        ? 7 - (firstWeekDay - firstDay.dayNumberInWeek) 
        : firstDay.dayNumberInWeek - 1 - shiftIndex;

        const numberOfNextDays = 7 - lastDay.dayNumberInWeek + shiftIndex > 6 
        ? 7 - lastDay.dayNumberInWeek - (7 - shiftIndex) 
        : 7 - lastDay.dayNumberInWeek + shiftIndex;

        const totalCalendarDays = days.length + numberOfNextDays + numberOfPrevDays;
        
        const result = []

        for (let i = 0; i < numberOfPrevDays; i++) {
            const inverted = numberOfPrevDays - i;
            result[i] = prevMonthDays[prevMonthDays.length - inverted]; 
        }

        for (let i = numberOfPrevDays; i < totalCalendarDays - numberOfNextDays; i++) {
            result[i] = days[i - numberOfPrevDays]; 
        }

        for (let i = totalCalendarDays - numberOfNextDays; i < totalCalendarDays; i++) {
            result[i] = nextMonthDays[i - totalCalendarDays + numberOfNextDays]
        }

        return result;
    }, [selectedMonth.year, selectedMonth.monthIndex, selectedYear]);

    const onClickArrow = (direction: 'right' | 'left') => {
        if (mode === 'years' && direction === 'left') {
          return setSelectedYearsInterval(getYearsInterval(selectedYearInterval[0] - 10));
        }
    
        if (mode === 'years' && direction === 'right') {
          return setSelectedYearsInterval(getYearsInterval(selectedYearInterval[0] + 10));
        }
    
        if (mode === 'monthes' && direction === 'left') {
          const year = selectedYear - 1;
          if (!selectedYearInterval.includes(year)) setSelectedYearsInterval(getYearsInterval(year));
          return setSelectedYear(selectedYear - 1);
        }
    
        if (mode === 'monthes' && direction === 'right') {
          const year = selectedYear + 1;
          if (!selectedYearInterval.includes(year)) setSelectedYearsInterval(getYearsInterval(year));
          return setSelectedYear(selectedYear + 1);
        }
    
        if (mode === 'days') {
          const monthIndex =
            direction === 'left' ? selectedMonth.monthIndex - 1 : selectedMonth.monthIndex + 1;
          if (monthIndex === -1) {
            const year = selectedYear - 1;
            setSelectedYear(year);
            if (!selectedYearInterval.includes(year)) setSelectedYearsInterval(getYearsInterval(year));
            return setSelectedMonth(createMonth({ date: new Date(selectedYear - 1, 11), locale }));
          }
    
          if (monthIndex === 12) {
            const year = selectedYear + 1;
            setSelectedYear(year);
            if (!selectedYearInterval.includes(year)) setSelectedYearsInterval(getYearsInterval(year));
            return setSelectedMonth(createMonth({ date: new Date(year, 0), locale }));
          }
    
          setSelectedMonth(createMonth({ date: new Date(selectedYear, monthIndex), locale }));
        }
      };

      const setSelectedMonthByIndex = (monthIndex: number) => {
        setSelectedMonth(createMonth({ date: new Date(selectedYear, monthIndex), locale }));
      };

    return {
        state: {
            mode,
            calendarDays,
            weekDaysNames,
            monthesNames,
            selectedDate,
            selectedMonth,
            selectedYear,
            selectedYearInterval,
        },
        functions: {
            onClickArrow,
            setMode,
            setSelectedDay,
            setSelectedMonthByIndex,
            setSelectedYear,
            setSelectedYearsInterval
        },
    }
} 