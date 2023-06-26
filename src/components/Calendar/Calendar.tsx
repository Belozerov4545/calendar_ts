import  React from 'react';
import { useCalendar } from './hooks/useCalendar';
import './Calendar.css';
import { checkIsToday } from '../../utils/helpers/date/checkIsToday';
import { checkDateIsEqual } from '../../utils/helpers/date/checkDateIsEqual';

interface CalendarProps {
    locale?: string;
    selectedDate: Date;
    selectDate: (date: Date) => void;
    firstWeekDay?: number;
}
export const Calendar: React.FC<CalendarProps> = ({
    locale = 'default',
    firstWeekDay = 2, 
    selectDate, 
    selectedDate
}) => {
    const {state, functions} = useCalendar({locale, firstWeekDay, selectedDate});
    
    return (
        <div className='calendar'>
            <div className='calendar_header'>
                <div 
                aria-hidden 
                className='calendar_header_arrow_left'
                onClick={() => functions.onClickArrow('left')}
                />
                {state.mode === 'days' && (
                    <div onClick={() => functions.setMode('monthes')}>
                        {state.monthesNames[state.selectedMonth.monthIndex].month} {state.selectedYear}
                    </div>
                )}

                {state.mode === 'monthes' && (
                    <div aria-hidden onClick={() => functions.setMode('years')}>
                        {state.selectedMonth.monthIndex}
                    </div>
                )}

                {state.mode === 'years' && (
                    <div aria-hidden>
                        {state.selectedYearInterval[0]} - {' '}
                        {state.selectedYearInterval[state.selectedYearInterval.length - 1]}
                    </div>
                )}
                <div 
                    aria-hidden 
                    className='calendar_header_arrow_right'
                    onClick={() => functions.onClickArrow('right')}
                />
            </div>
            <div className='calendar_body'>
                    {state.mode === 'days' && (
                        <>
                        <div className='calendar_week_names'>
                            {state.weekDaysNames.map((weekDaysName) => (
                                <div key={weekDaysName.dayShort}>{weekDaysName.dayShort}</div>
                            ))}
                        </div>
                        <div className='calendar_days'>{state.calendarDays.map(day => {
                            const isToday = checkIsToday(day.date);
                            const isSelectedDay = checkDateIsEqual(day.date, state.selectedDate.date);
                            const isAdditionalDay = day.monthIndex !== state.selectedMonth.monthIndex;

                            return (
                            <div
                              aria-hidden
                              key={`${day.dayNumber}-${day.monthIndex}`}
                              onClick={() => {
                                functions.setSelectedDay(day);
                                selectDate(day.date);
                              }}
                              className={['calendar_day',
                                isToday ? 'calendar_today_item' : '',
                                isSelectedDay ? 'calendar_selected_item' : '',
                                isAdditionalDay ? 'calendar_additional_day' : '',
                              ].join(' ')}>
                                {day.dayNumber}
                            </div>
                            )
                        })}
                        </div>
                        </>
                    )} {state.mode === 'monthes' && (
                        <div className='calendar_pick_item_container'>
                            {state.monthesNames.map((monthesName) => {
                                const isCurrentMonth = 
                                new Date().getMonth() === monthesName.monthIndex && 
                                new Date().getFullYear() === state.selectedYear;
                                const isSelectedMonth =  monthesName.monthIndex === state.selectedMonth.monthIndex;

                                return (<div
                                    aria-hidden
                                    onClick={() => {
                                        functions.setSelectedMonthByIndex(monthesName.monthIndex);
                                        functions.setMode('days');
                                    }} 
                                    className={['calendar_pick_item',
                                    isCurrentMonth ? 'calendar_today_item' : '',
                                    isSelectedMonth ? 'calendar_selected_item' : '',
                                ].join(' ')}>
                                {monthesName.monthShort}</div>
                                );
                            })}
                        </div>
                    )}
                    {state.mode === 'years' && (
                        <div className='calendar_pick_item_container'>
                            <div className='calendar_unchoosable_year'>{state.selectedYearInterval[0] - 1}</div>
                            {state.selectedYearInterval.map((year) => {
                                const isCurrentYear = new Date().getFullYear() === year;
                                const isSelectedYear =  year === state.selectedYear;

                                return (<div
                                    aria-hidden
                                    onClick={() => {
                                        functions.setSelectedYear(year);
                                        functions.setMode('monthes');
                                    }} 
                                    className={['calendar_pick_item',
                                    isCurrentYear ? 'calendar_today_item' : '',
                                    isSelectedYear ? 'calendar_selected_item' : '',
                                ].join(' ')}>
                                {year}</div>
                                );
                            })}
                            <div className='calendar_unchoosable_year'>{state.selectedYearInterval[state.selectedYearInterval.length - 1] + 1}</div>
                            </div>
                    )}
            </div>

        </div>
    )
}

export default Calendar;
