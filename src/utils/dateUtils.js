/*
 * Преобразует номер месяца в название
*/
export function monthStr(month) {
    if (!month || month < 1 || month > 12 ) return ''
    const months = [

    'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
    'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'
    ]
    return months[month - 1]
}